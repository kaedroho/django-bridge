import { inject } from "vue";
import { NavigationKey, Navigation } from "../contexts";

/**
 * Vue composable for accessing navigation functionality
 * Similar to React's useContext(NavigationContext)
 */
export function useNavigation(): Navigation {
  const navigation = inject(NavigationKey);

  if (!navigation) {
    throw new Error(
      "useNavigation must be used within a django-bridge App component. " +
        "Make sure your component is rendered inside <App> from @django-bridge/vue."
    );
  }

  return navigation;
}
