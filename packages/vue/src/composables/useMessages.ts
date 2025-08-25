import { inject } from "vue";
import { MessagesKey, Messages } from "../contexts";

/**
 * Vue composable for accessing messages functionality
 * Similar to React's useContext(MessagesContext)
 */
export function useMessages(): Messages {
  const messages = inject(MessagesKey);

  if (!messages) {
    throw new Error(
      "useMessages must be used within a django-bridge App component. " +
        "Make sure your component is rendered inside <App> from @django-bridge/vue."
    );
  }

  return messages;
}
