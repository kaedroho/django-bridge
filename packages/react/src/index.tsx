import React, { ReactElement, ReactNode } from "react";

import {
  Message,
  DjangoBridgeResponse,
  djangoGet,
  Metadata,
  Frame,
} from "@common";
import { useNavigationController } from "./navigation";
import { DirtyFormScope } from "./dirtyform";
import Browser from "./components/Browser";
import Link, { BuildLinkElement, buildLinkElement } from "./components/Link";
import Config from "./config";
import Form from "./components/Form";
import { MessagesContext } from "./contexts";
import Overlay from "./components/Overlay";
import RenderFrame from "./components/RenderFrame";

export interface AppProps {
  config: Config;
  initialResponse: DjangoBridgeResponse | JSON;
}

export function App({ config, initialResponse }: AppProps): ReactElement {
  // Toast messages state
  const [messages, dispatchMessages] = React.useReducer(
    (
      state: Message[],
      action: { action: "push"; message: Message } | { action: "clear" }
    ) => {
      switch (action.action) {
        case "push":
          return state.concat([action.message]);
        case "clear":
          return [];
        default:
          return state;
      }
    },
    []
  );
  const pushMessage = React.useCallback(
    (message: Message) => {
      dispatchMessages({ action: "push", message });
    },
    [dispatchMessages]
  );

  const onServerError = React.useCallback(
    (kind: "server" | "network") => {
      if (kind === "server") {
        pushMessage({
          level: "error",
          text: "A server error occurred. Please try again later.",
        });
      } else if (kind === "network") {
        pushMessage({
          level: "error",
          text: "A network error occurred. Please check your internet connection or try again later.",
        });
      }
    },
    [pushMessage]
  );

  // Overlay state
  const [overlay, setOverlay] = React.useState<{
    render(content: ReactNode): ReactNode;
    initialResponse: DjangoBridgeResponse;
    initialPath: string;
  } | null>(null);
  const [overlayCloseRequested, setOverlayCloseRequested] =
    React.useState(false);
  const overlayCloseListener = React.useRef<(() => void) | null>(null);

  // Close overlay when we navigate the main window
  // We can force close in this situation, since we've already checked if there are any dirty forms
  const onNavigation = (
    frame: Frame | null,
    newFrame: boolean,
    newMessages: Message[]
  ) => {
    // Close overlay when we navigate the main window
    // We can force close in this situation, since we've already checked if there are any dirty forms
    // Only close overlay if a new frame is being pushed
    // This prevents the overlay from closing when refreshProps is called
    if (newFrame) {
      setOverlayCloseRequested(true);

      // As the main window has navigated away, we should ignore the close listener it provided
      overlayCloseListener.current = null;
    }

    // Clear messages if moving to new frame (instead of updating existing frame)
    // For example, navigate() and submitForm() will create a new frame but
    // replacePath() and refreshProps() will update the existing one.
    // We don't want to delete messages for the latter two.
    if (newFrame) {
      dispatchMessages({ action: "clear" });
    }

    // Push any new messages from server
    newMessages.forEach(pushMessage);
  };

  const initialPath =
    window.location.pathname + window.location.search + window.location.hash;
  const navigationController = useNavigationController(
    null,
    config.unpack,
    initialResponse as DjangoBridgeResponse,
    initialPath,
    {
      onNavigation,
      onServerError,
    }
  );

  React.useEffect(() => {
    // Remove the loading screen
    const loadingScreen = document.querySelector(".django-bridge-load");
    if (loadingScreen instanceof HTMLElement) {
      loadingScreen.classList.add("django-bridge-load--hidden");
      setTimeout(() => {
        loadingScreen.remove();
      }, 200);
    }

    // Add listener for popState
    // This event is fired when the user hits the back/forward links in their browser
    const navigate = () => {
      // eslint-disable-next-line no-void
      void navigationController.navigate(document.location.pathname, false);
    };

    window.addEventListener("popstate", navigate);
    return () => {
      window.removeEventListener("popstate", navigate);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openOverlay = async (
    path: string,
    renderOverlay: (content: ReactNode) => ReactNode,
    { onClose }: { onClose?: () => void } = {}
  ) => {
    navigationController.setIsNavigating(true);

    const initialOverlayResponse = await djangoGet(path, true);

    if (onClose) {
      overlayCloseListener.current = onClose;
    }

    setOverlayCloseRequested(false);
    setOverlay({
      render: renderOverlay,
      initialResponse: initialOverlayResponse,
      initialPath: path,
    });

    navigationController.setIsNavigating(false);
  };

  const messagesContext = React.useMemo(
    () => ({ messages, pushMessage }),
    [messages, pushMessage]
  );

  return (
    <DirtyFormScope handleBrowserUnload>
      <MessagesContext.Provider value={messagesContext}>
        {overlay && (
          <DirtyFormScope>
            <Overlay
              config={config}
              initialResponse={overlay.initialResponse}
              initialPath={overlay.initialPath}
              parentNavigationContoller={navigationController}
              render={(content) => overlay.render(content)}
              requestClose={() => setOverlayCloseRequested(true)}
              closeRequested={overlayCloseRequested}
              onCloseCompleted={() => {
                setOverlay(null);
                setOverlayCloseRequested(false);

                // Call overlay close listener
                if (overlayCloseListener.current) {
                  overlayCloseListener.current();
                  overlayCloseListener.current = null;
                }
              }}
              onServerError={onServerError}
            />
          </DirtyFormScope>
        )}
        {!navigationController.isLoading && (
          <Browser
            config={config}
            navigationController={navigationController}
            openOverlay={(url, renderOverlay, options) =>
              // eslint-disable-next-line no-void
              void openOverlay(url, renderOverlay, options)
            }
          />
        )}
      </MessagesContext.Provider>
    </DirtyFormScope>
  );
}

export {
  NavigationContext,
  OverlayContext,
  FormWidgetChangeNotificationContext,
  FormSubmissionStatus,
  MessagesContext,
} from "./contexts";
export type { Navigation } from "./contexts";
export { DirtyFormContext, DirtyFormMarker } from "./dirtyform";
export type { DirtyForm } from "./dirtyform";
export { type NavigationController } from "./navigation";
export type { Frame, Message, DjangoBridgeResponse as Response, Metadata };
export { Link, BuildLinkElement, buildLinkElement };
export { Config };
export { Form };
export { RenderFrame };
