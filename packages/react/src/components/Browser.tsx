import React, { ReactElement, ReactNode } from "react";
import { DirtyFormContext } from "../dirtyform";

import { NavigationController } from "../navigation";
import {
  NavigateOptions,
  OpenOverlayOptions,
  NavigationContext,
} from "../contexts";
import Config from "../config";
import RenderFrame from "./RenderFrame";

export interface BrowserProps {
  config: Config;
  navigationController: NavigationController;
  openOverlay(
    path: string,
    render: (content: ReactNode) => ReactNode,
    options?: OpenOverlayOptions
  ): void;
}

function Browser({
  config,
  navigationController,
  openOverlay,
}: BrowserProps): ReactElement {
  const {
    currentFrame,
    navigate,
    replacePath,
    submitForm,
    refreshProps,
    isNavigating,
  } = navigationController;

  const { isDirty, requestUnload, cancelUnload } =
    React.useContext(DirtyFormContext);

  const NavigationUtils = React.useMemo(
    () => ({
      frameId: currentFrame.id,
      path: currentFrame.path,
      props: currentFrame.props,
      context: currentFrame.context,
      navigate: (url: string, options: NavigateOptions = {}) => {
        // If there is a dirty form, block navigation until unload has been confirmed
        if (!isDirty || options.skipDirtyFormCheck === true) {
          if (options.skipDirtyFormCheck === true) {
            cancelUnload();
          }

          return navigate(url, options.pushState);
        }

        return requestUnload().then(() => navigate(url, options.pushState));
      },
      replacePath,
      submitForm,
      openOverlay,
      refreshProps,
      isNavigating,
    }),
    [
      currentFrame,
      replacePath,
      submitForm,
      openOverlay,
      isDirty,
      requestUnload,
      cancelUnload,
      navigate,
      refreshProps,
      isNavigating,
    ]
  );

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return (
    <NavigationContext.Provider value={NavigationUtils}>
      <div key={currentFrame.id}>
        <RenderFrame config={config} frame={currentFrame} />
      </div>
    </NavigationContext.Provider>
  );
}

export default Browser;
