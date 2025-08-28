import { ReactElement } from "react";

export interface WidgetDef {
  render(
    id: string,
    name: string,
    disabled: boolean,
    value: string
  ): ReactElement;
}
