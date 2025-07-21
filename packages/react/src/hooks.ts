import React from "react";
import { NavigationContext } from "./contexts";

export type Timer = ReturnType<typeof setTimeout>;

export function useAutoRefresh(enabled: boolean, interval: number) {
  const { refreshProps } = React.useContext(NavigationContext);

  React.useEffect(() => {
    if (!enabled) {
      return () => {};
    }

    let timeout: Timer | null = null;

    const scheduleRefreshProps = () => {
      timeout = setTimeout(() => {
        // eslint-disable-next-line no-void
        void refreshProps();

        scheduleRefreshProps();
      }, interval);
    };

    scheduleRefreshProps();

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [enabled, interval, refreshProps]);
}
