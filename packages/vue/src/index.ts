// Export App component as named export only
export { default as App } from "./App.vue";

// Export Config class - matches React pattern exactly
export { default as Config } from "./config";

// Export Form component - matches React pattern
export { default as Form } from "./components/Form.vue";

// Export Link component - matches React pattern
export { default as Link } from "./components/Link.vue";

// Export RenderFrame component - matches React pattern
export { default as RenderFrame } from "./components/RenderFrame.vue";

// Export contexts/injection keys
export {
  NavigationKey,
  OverlayKey,
  FormWidgetChangeNotificationKey,
  FormSubmissionStatusKey,
  MessagesKey,
} from "./contexts";
export type { Navigation, Messages } from "./contexts";

// Export dirty form utilities
export { DirtyFormKey, useDirtyForm, useDirtyFormMarker } from "./dirtyform";
export type { DirtyForm } from "./dirtyform";

// Export composables (equivalent to React hooks)
export { useAutoRefresh, useNavigation, useMessages } from "./composables";
export type { Timer, Navigation, Messages } from "./composables";

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
