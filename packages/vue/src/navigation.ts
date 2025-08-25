/* eslint-disable @typescript-eslint/no-explicit-any */

import { ref, reactive, watch } from "vue";
import {
  djangoGet,
  djangoPost,
  DjangoBridgeResponse,
  Message,
  Frame,
  Metadata,
} from "@common";

let nextFrameId = 1;

interface HistoryState {
  prevPath?: string;
  prevScrollPosition?: number;
}

export interface NavigationController {
  parent: NavigationController | null;
  currentFrame: Frame;
  isLoading: boolean;
  handleResponse: (
    response: DjangoBridgeResponse,
    path: string,
    pushState?: boolean,
    neverReload?: boolean
  ) => Promise<void>;
  navigate: (url: string, pushState?: boolean) => Promise<void>;
  replacePath: (frameId: number, path: string) => void;
  submitForm: (url: string, data: FormData) => Promise<void>;
  refreshProps: () => Promise<void>;
  isNavigating: boolean;
  setIsNavigating: (isNavigating: boolean) => void;
}

export function useNavigationController(
  parent: NavigationController | null,
  unpack: (data: Record<string, unknown>) => Record<string, unknown>,
  initialResponse: DjangoBridgeResponse,
  initialPath: string,
  callbacks: {
    onNavigation?: (
      frame: Frame | null,
      newFrame: boolean,
      messages: Message[]
    ) => void;
    onEscalate?: () => void;
    onOverlayClose?: (messages: Message[]) => void;
    onServerError?: (kind: "server" | "network") => void;
  } = {}
): NavigationController {
  nextFrameId += 1;

  const currentFrame = reactive<Frame>({
    id: nextFrameId,
    path: initialPath,
    metadata: {
      title: "Loading",
    },
    view: "loading",
    props: {},
    context: {},
  });

  const isNavigating = ref<boolean>(false);
  const redirectTo = ref<string | null>(null);
  const nextFetchId = ref(1);
  const lastReceivedFetchId = ref(1);
  const isFetchInProgress = ref(false);

  const pushFrame = (
    path: string,
    metadata: Metadata,
    view: string,
    props: Record<string, unknown>,
    context: Record<string, unknown>,
    messages: Message[],
    pushState = true,
    reload = true
  ) => {
    let frameId = currentFrame.id;

    const newFrame = view !== currentFrame.view || reload;
    if (newFrame) {
      nextFrameId += 1;
      frameId = nextFrameId;
    }

    if (!parent) {
      document.title = metadata.title;

      if (pushState) {
        let scollPositionY = 0;
        const scrollPosition = window.scrollY;
        const historyState = window.history?.state as HistoryState;
        // if we're going back to previous path, return to the the previous scroll position
        if (historyState?.prevPath === path) {
          scollPositionY = historyState.prevScrollPosition ?? 0;
        }

        // set the previous path and scroll position in the state before pushing the new url
        window.history.pushState(
          {
            prevPath: window.location.pathname,
            prevScrollPosition: scrollPosition,
          },
          "",
          path
        );

        // set the scroll position
        window.scrollTo(0, scollPositionY);
      }
    }

    // Update reactive frame
    Object.assign(currentFrame, {
      id: frameId,
      path,
      metadata,
      view,
      props,
      context,
    });

    if (callbacks.onNavigation) {
      callbacks.onNavigation(currentFrame, newFrame, messages);
    }
  };

  const handleResponse = async (
    response: DjangoBridgeResponse,
    path: string,
    pushState = true,
    neverReload = false,
    initial = false
  ): Promise<void> => {
    if (response.action === "reload") {
      if (!parent) {
        window.location.href = path;
      } else {
        // reload responses require reloading the entire page, but this is an overlay
        // Escalate this response to the page's navigation controller instead
        return parent.handleResponse(response, path);
      }
    } else if (response.action === "redirect") {
      // HACK: Needed to do this because we can't call navigate directly from here
      redirectTo.value = response.path;
      return Promise.resolve();
    } else if (response.action === "render") {
      // If this navigation controller is handling an overlay, make sure the response can be
      // loaded in a overlay. Otherwise, escalate it to parent
      if (parent && !response.overlay) {
        if (initial) {
          console.warn(
            `openOverlay('${path}') returned a response that couldn't be rendered in an overlay.`
          );
        }
        const r = parent.handleResponse(response, path);
        // Call escalate callback, this will instantly close the overlay so the response can be rendered
        // by the main window.
        if (callbacks.onEscalate) {
          callbacks.onEscalate();
        }
        return r;
      }

      // Unpack props and context
      const props = unpack(response.props);
      const context = unpack(response.context);

      // If the view is the same as the current frame, check if the frame has a shouldReloadCallback registered.
      // If it does, call it to see if we should reload the view or just update its props
      let reload = !neverReload;
      if (
        reload &&
        response.view === currentFrame.view &&
        currentFrame.shouldReloadCallback
      ) {
        reload = currentFrame.shouldReloadCallback(path, props);
      }

      pushFrame(
        path,
        response.metadata,
        response.view,
        props,
        context,
        response.messages,
        pushState,
        reload
      );
    } else if (response.action === "close-overlay") {
      // Call overlay close callback
      if (callbacks.onOverlayClose) {
        callbacks.onOverlayClose(response.messages);
      }
    } else if (response.action === "server-error") {
      if (callbacks.onServerError) {
        callbacks.onServerError("server");
      }
      return Promise.reject();
    } else if (response.action === "network-error") {
      if (callbacks.onServerError) {
        callbacks.onServerError("network");
      }
      return Promise.reject();
    }

    return Promise.resolve();
  };

  const fetch = async (
    fetcher: () => Promise<DjangoBridgeResponse>,
    url: string,
    pushState: boolean,
    neverReload = false
  ) => {
    // Get a fetch ID
    // We do this so that if responses come back in a different order to
    // when the requests were sent, the older requests don't replace newer ones
    nextFetchId.value += 1;
    const thisFetchId = nextFetchId.value;
    isFetchInProgress.value = true;

    const response = await fetcher();

    if (thisFetchId < lastReceivedFetchId.value) {
      // A subsequent fetch was made but its response came in before this one
      // So ignore this response
      return;
    }

    lastReceivedFetchId.value = thisFetchId;

    if (response === null) {
      return;
    }

    await handleResponse(response, url, pushState, neverReload);

    isFetchInProgress.value = false;
  };

  const navigate = async (url: string, pushState = true): Promise<void> => {
    let path = url;

    if (!url.startsWith("/")) {
      const urlObj = new URL(url);

      if (urlObj.origin !== window.location.origin) {
        window.location.href = url;
        return Promise.resolve();
      }

      path = urlObj.pathname + urlObj.search;
    }

    isNavigating.value = true;

    return fetch(() => djangoGet(path, !!parent), path, pushState).finally(
      () => {
        isNavigating.value = false;
      }
    );
  };

  const replacePath = (frameId: number, path: string) => {
    if (frameId === currentFrame.id) {
      // replace-path called on current frame
      // Change the path using replaceState
      currentFrame.path = path;

      if (!parent) {
        // eslint-disable-next-line no-restricted-globals
        history.replaceState({}, "", currentFrame.path);
      }
    }
  };

  const submitForm = (url: string, data: FormData): Promise<void> =>
    fetch(() => djangoPost(url, data, !!parent), url, true);

  const refreshProps = (): Promise<void> => {
    // Only make a new fetch request if there is not a fetch request currently in progress
    if (isFetchInProgress.value) {
      return Promise.resolve();
    }

    return fetch(
      () => djangoGet(currentFrame.path, !!parent),
      currentFrame.path,
      false,
      true
    );
  };

  const setIsNavigating = (navigating: boolean) => {
    isNavigating.value = navigating;
  };

  // Watch for redirects
  watch(redirectTo, (newRedirectTo) => {
    if (newRedirectTo) {
      redirectTo.value = null;
      navigate(newRedirectTo);
    }
  });

  // Load initial response immediately (like React useEffect with [])
  handleResponse(initialResponse, initialPath, false, false, true);

  return {
    parent,
    currentFrame,
    isLoading: currentFrame.view === "loading",
    handleResponse,
    navigate,
    replacePath,
    submitForm,
    refreshProps,
    isNavigating: isNavigating.value,
    setIsNavigating,
  };
}
