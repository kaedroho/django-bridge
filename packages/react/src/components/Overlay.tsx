import React, { ReactElement, ReactNode } from "react";
import { DjangoBridgeResponse, Frame, Message } from "@common";
import Config from "../config";
import {
  MessagesContext,
  OverlayContext,
  OverlayContextType,
} from "../contexts";
import { DirtyFormContext } from "../dirtyform";
import { NavigationController, useNavigationController } from "../navigation";
import Browser from "./Browser";

export interface OverlayProps {
  config: Config;
  initialResponse: DjangoBridgeResponse;
  initialPath: string;
  parentNavigationContoller: NavigationController;
  render: (content: ReactNode) => ReactNode;
  requestClose: () => void;
  closeRequested: boolean;
  onCloseCompleted: () => void;
  onServerError: (kind: "server" | "network") => void;
}

export default function Overlay({
  config,
  initialResponse,
  initialPath,
  parentNavigationContoller,
  render,
  requestClose,
  closeRequested,
  onCloseCompleted,
  onServerError,
}: OverlayProps): ReactElement {
  const { pushMessage } = React.useContext(MessagesContext);

  const navigationController = useNavigationController(
    parentNavigationContoller,
    config.unpack,
    initialResponse,
    initialPath,
    {
      onNavigation: (
        frame: Frame | null,
        newFrame: boolean,
        messages: Message[]
      ) => {
        // Push any new messages from server
        messages.forEach(pushMessage);
      },
      onOverlayClose: (messages: Message[]) => {
        // Push any new messages from server
        messages.forEach(pushMessage);

        // Request close
        requestClose();
      },
      onServerError,
    }
  );

  // If close is requested, but there is a dirty form (form without saved changes) in the overlay, block the close
  const dirtyFormContext = React.useContext(DirtyFormContext);
  const requestCloseCallback = React.useCallback(
    ({ skipDirtyFormCheck = false }: { skipDirtyFormCheck?: boolean } = {}) => {
      if (!skipDirtyFormCheck && dirtyFormContext.isDirty) {
        // eslint-disable-next-line no-void
        void dirtyFormContext.requestUnload().then(() => requestClose());
      } else {
        requestClose();
      }
    },
    [dirtyFormContext, requestClose]
  );

  const overlayContext: OverlayContextType = React.useMemo(
    () => ({
      overlay: true,
      closeRequested,
      requestClose: requestCloseCallback,
      onCloseCompleted,
    }),
    [closeRequested, onCloseCompleted, requestCloseCallback]
  );

  if (navigationController.isLoading) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  return (
    <OverlayContext.Provider value={overlayContext}>
      {render(
        <Browser
          config={config}
          navigationController={navigationController}
          openOverlay={() => {}}
        />
      )}
    </OverlayContext.Provider>
  );
}
