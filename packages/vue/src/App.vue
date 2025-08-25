<template>
  <DirtyFormScope :handle-browser-unload="true">
    <div>
      <!-- Messages provider context -->
      <Overlay
        v-if="overlay"
        :config="config"
        :initial-response="overlay.initialResponse"
        :initial-path="overlay.initialPath"
        :parent-navigation-controller="navigationController"
        :render="overlay.render"
        :request-close="() => setOverlayCloseRequested(true)"
        :close-requested="overlayCloseRequested"
        :on-close-completed="onOverlayCloseCompleted"
        :on-server-error="onServerError"
      />
      <Browser
        v-if="!navigationController.isLoading"
        :config="config"
        :navigation-controller="navigationController"
        :open-overlay="openOverlay"
      />
    </div>
  </DirtyFormScope>
</template>

<script setup lang="ts">
import { ref, reactive, provide, onMounted } from "vue";
import { Message, DjangoBridgeResponse, djangoGet, Frame } from "./common";
import { useNavigationController } from "./navigation";
import DirtyFormScope from "./components/DirtyFormScope.vue";
import Browser from "./components/Browser.vue";
import Config from "./config";
import { MessagesKey } from "./contexts";
import Overlay from "./components/Overlay.vue";

export interface AppProps {
  config: Config;
  initialResponse: DjangoBridgeResponse | JSON;
}

const props = defineProps<AppProps>();

// Toast messages state
const messages = ref<Message[]>([]);

const pushMessage = (message: Message) => {
  messages.value.push(message);
};

const clearMessages = () => {
  messages.value = [];
};

const onServerError = (kind: "server" | "network") => {
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
};

// Overlay state
const overlay = ref<{
  render(content: any): any;
  initialResponse: DjangoBridgeResponse;
  initialPath: string;
} | null>(null);

const overlayCloseRequested = ref(false);
const overlayCloseListener = ref<(() => void) | null>(null);

const setOverlayCloseRequested = (requested: boolean) => {
  overlayCloseRequested.value = requested;
};

// Close overlay when we navigate the main window
const onNavigation = (
  frame: Frame | null,
  newFrame: boolean,
  newMessages: Message[]
) => {
  // Close overlay when we navigate the main window
  // Only close overlay if a new frame is being pushed
  if (newFrame) {
    setOverlayCloseRequested(true);
    // As the main window has navigated away, we should ignore the close listener it provided
    overlayCloseListener.value = null;
  }

  // Clear messages if moving to new frame
  if (newFrame) {
    clearMessages();
  }

  // Push any new messages from server
  newMessages.forEach(pushMessage);
};

const initialPath =
  window.location.pathname + window.location.search + window.location.hash;

const navigationController = useNavigationController(
  null,
  props.config.unpack,
  props.initialResponse as DjangoBridgeResponse,
  initialPath,
  {
    onNavigation,
    onServerError,
  }
);

const openOverlay = async (
  path: string,
  renderOverlay: (content: any) => any,
  { onClose }: { onClose?: () => void } = {}
) => {
  if (overlay.value) {
    console.error("Unable to open overlay as an overlay is already open.");
    return;
  }

  navigationController.setIsNavigating(true);

  const initialOverlayResponse = await djangoGet(path, true);

  if (onClose) {
    overlayCloseListener.value = onClose;
  }

  setOverlayCloseRequested(false);
  overlay.value = {
    render: renderOverlay,
    initialResponse: initialOverlayResponse,
    initialPath: path,
  };

  navigationController.setIsNavigating(false);
};

const onOverlayCloseCompleted = () => {
  overlay.value = null;
  setOverlayCloseRequested(false);

  // Call overlay close listener
  if (overlayCloseListener.value) {
    overlayCloseListener.value();
    overlayCloseListener.value = null;
  }
};

// Provide messages context
const messagesContext = reactive({
  get messages() {
    return messages.value;
  },
  pushMessage,
});

provide(MessagesKey, messagesContext);

onMounted(() => {
  // Remove the loading screen
  const loadingScreen = document.querySelector(".django-bridge-load");
  if (loadingScreen instanceof HTMLElement) {
    loadingScreen.classList.add("django-bridge-load--hidden");
    setTimeout(() => {
      loadingScreen.remove();
    }, 200);
  }

  // Add listener for popState
  const navigate = () => {
    navigationController.navigate(document.location.pathname, false);
  };

  window.addEventListener("popstate", navigate);

  // Cleanup
  return () => {
    window.removeEventListener("popstate", navigate);
  };
});
</script>
