<template>
  <div v-if="!navigationController.isLoading">
    <slot :content="browserContent" />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, inject, h } from 'vue';
import { DjangoBridgeResponse, Frame, Message } from '../common';
import Config from '../config';
import { MessagesKey, OverlayKey, OverlayContextType } from '../contexts';
import { DirtyFormKey } from '../dirtyform';
import { NavigationController, useNavigationController } from '../navigation';
import Browser from './Browser.vue';

interface Props {
  config: Config;
  initialResponse: DjangoBridgeResponse;
  initialPath: string;
  parentNavigationController: NavigationController;
  render: (content: any) => any;
  requestClose: () => void;
  closeRequested: boolean;
  onCloseCompleted: () => void;
  onServerError: (kind: "server" | "network") => void;
}

const props = defineProps<Props>();

const messages = inject(MessagesKey);
if (!messages) {
  throw new Error("Overlay must be used within a MessagesProvider");
}

const { pushMessage } = messages;

const navigationController = useNavigationController(
  props.parentNavigationController,
  props.config.unpack,
  props.initialResponse,
  props.initialPath,
  {
    onNavigation: (
      frame: Frame | null,
      newFrame: boolean,
      messages: Message[]
    ) => {
      // Push any new messages from server
      messages.forEach(pushMessage);
    },
    onEscalate: () => {
      props.onCloseCompleted();
    },
    onOverlayClose: (messages: Message[]) => {
      // Push any new messages from server
      messages.forEach(pushMessage);

      // Request close
      props.requestClose();
    },
    onServerError: props.onServerError,
  }
);

// If close is requested, but there is a dirty form (form without saved changes) in the overlay, block the close
const dirtyForm = inject(DirtyFormKey);
if (!dirtyForm) {
  throw new Error("Overlay must be used within a DirtyFormScope");
}

const requestCloseCallback = (
  { skipDirtyFormCheck = false }: { skipDirtyFormCheck?: boolean } = {}
) => {
  if (!skipDirtyFormCheck && dirtyForm.isDirty) {
    dirtyForm.requestUnload().then(() => props.requestClose());
  } else {
    props.requestClose();
  }
};

const overlayContext: OverlayContextType = computed(() => ({
  overlay: true,
  closeRequested: props.closeRequested,
  requestClose: requestCloseCallback,
  onCloseCompleted: props.onCloseCompleted,
}));

provide(OverlayKey, overlayContext.value);

const browserContent = computed(() => {
  return h(Browser, {
    config: props.config,
    navigationController,
    openOverlay: () => {}, // Nested overlays not supported
  });
});
</script>
