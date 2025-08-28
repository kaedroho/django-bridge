import { defineComponent } from "vue";
import { WidgetDef } from "./base";

export class TextInputDef implements WidgetDef {
  type: "text" | "email" | "url" | "password";
  className: string;

  constructor(type: TextInputDef["type"], className: string) {
    this.type = type;
    this.className = className;
  }

  render(id: string, name: string, disabled: boolean, value: string) {
    return defineComponent({
      template: `
        <input
          :id="id"
          :type="type"
          :name="name"
          :value="value"
          :disabled="disabled"
          :class="className"
        />
      `,
      setup: () => ({
        id,
        name,
        disabled,
        value,
        type: this.type,
        className: this.className,
      }),
    });
  }
}
