import { defineComponent } from "vue";
import { WidgetDef } from "./base";

export class SelectDef implements WidgetDef {
  choices: { label: string; value: string }[];
  className: string;

  constructor(choices: { label: string; value: string }[], className: string) {
    this.choices = choices;
    this.className = className;
  }

  render(id: string, name: string, disabled: boolean, value: string) {
    // Find the default value
    let defaultValue = "";
    this.choices.forEach((choice) => {
      // Cast null value to and empty string as that's that value Django uses for the empty value of a ModelChoiceField
      // Also cast ints to string as Django may use both interchangably for model primary keys
      if (`${choice.value}` === `${value || ""}`) {
        defaultValue = choice.value;
      }
    });

    return defineComponent({
      template: `
        <select
          :id="id"
          :name="name"
          :value="defaultValue"
          :disabled="disabled"
          :class="className"
        >
          <option v-for="choice in choices" :key="choice.value" :value="choice.value">
            {{ choice.label }}
          </option>
        </select>
      `,
      setup: () => ({
        id,
        name,
        disabled,
        defaultValue,
        className: this.className,
        choices: this.choices,
      }),
    });
  }
}
