// Export App component as named export only
export { default as App } from "./App.vue";

// Export Config class - matches React pattern exactly
export { default as Config } from "./config";

// Export contexts/injection keys
export {
  NavigationKey,
  OverlayKey,
  FormWidgetChangeNotificationKey,
  FormSubmissionStatusKey,
  MessagesKey,
} from "./contexts";
export type { Navigation } from "./contexts";

// Export dirty form utilities
export { DirtyFormKey, useDirtyForm, useDirtyFormMarker } from "./dirtyform";
export type { DirtyForm } from "./dirtyform";

// Export composables (equivalent to React hooks)
export { useAutoRefresh } from "./composables";

// Export navigation controller
export type { NavigationController } from "./navigation";
export { useNavigationController } from "./navigation";

// Export common types
export type {
  Frame,
  Message,
  DjangoBridgeResponse as Response,
  Metadata,
} from "./common";

// Vue components are now exported directly from index
// Users can import like: import App from '@django-bridge/vue' or import { App } from '@django-bridge/vue'
