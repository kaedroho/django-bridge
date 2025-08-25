import { Metadata } from "./metadata";

export interface Frame<Props = Record<string, unknown>> {
  id: number;
  path: string;
  metadata: Metadata;
  view: string;
  props: Props;
  context: Record<string, unknown>;
  shouldReloadCallback?: (newPath: string, newProps: Props) => boolean;
}
