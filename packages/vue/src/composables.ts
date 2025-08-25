import { inject, onUnmounted, ref } from "vue";
import { NavigationKey } from "./contexts";

export type Timer = ReturnType<typeof setTimeout>;

export function useAutoRefresh(enabled: boolean, interval: number) {
  const navigation = inject(NavigationKey);

  if (!navigation) {
    throw new Error("useAutoRefresh must be used within a NavigationProvider");
  }

  const { refreshProps } = navigation;
  let timeout: Timer | null = null;

  const scheduleRefreshProps = () => {
    timeout = setTimeout(() => {
      refreshProps();
      scheduleRefreshProps();
    }, interval);
  };

  if (enabled) {
    scheduleRefreshProps();
  }

  onUnmounted(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
  });
}
