import React, { ReactElement } from "react";
import { Frame } from "@common";

import Config from "../config";

export interface RenderFrameProps {
  config: Config;
  frame: Frame;
}

function RenderFrame({ config, frame }: RenderFrameProps): ReactElement {
  // Get the view component
  const View = config.views.get(frame.view);
  if (!View) {
    return <p>Unknown view &apos;{frame.view}&apos;</p>;
  }

  // Render the view and wrap it with each configured global context provider
  let view = <View {...frame.props} />;
  config.contextProviders.forEach((provider, name) => {
    view = (
      <provider.Provider value={frame.context[name]}>{view}</provider.Provider>
    );
  });

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <div key={frame.id}>{view}</div>;
}

export default RenderFrame;
