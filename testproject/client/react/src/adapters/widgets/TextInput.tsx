import { ReactElement } from "react";
import { WidgetDef } from "./base";

export default class TextInputDef implements WidgetDef {
  type: "text" | "email" | "url" | "password";

  className: string;

  constructor(type: TextInputDef["type"], className: string) {
    this.type = type;
    this.className = className;
  }

  render(
    id: string,
    name: string,
    disabled: boolean,
    value: string
  ): ReactElement {
    return (
      <input
        id={id}
        type={this.type}
        name={name}
        defaultValue={value}
        disabled={disabled}
        className={this.className}
      />
    );
  }
}
