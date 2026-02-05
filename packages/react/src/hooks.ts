import React, { useCallback, useContext, useEffect } from "react";
import { ShouldReloadCallback } from "@common";
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

export function useShouldReloadCallback(
  callback: ShouldReloadCallback,
  deps: React.DependencyList
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoisedCallback = useCallback(callback, deps);
  const { setShouldReloadCallback } = useContext(NavigationContext);
  useEffect(
    () => setShouldReloadCallback(memoisedCallback),
    [memoisedCallback, setShouldReloadCallback]
  );
}
