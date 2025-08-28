import { defineComponent } from "vue";
import { FieldDisplayOptions } from "./Field";

export class ServerRenderedFieldDef {
  name: string;
  label: string;
  required: boolean;
  disabled: boolean;
  helpText: string;
  html: string;

  constructor(
    name: string,
    label: string,
    required: boolean,
    disabled: boolean,
    helpText: string,
    html: string
  ) {
    this.name = name;
    this.label = label;
    this.required = required;
    this.disabled = disabled;
    this.helpText = helpText;
    this.html = html;
  }

  render(errors: string[], displayOptions: FieldDisplayOptions = {}) {
    const htmlWidget = defineComponent({
      template: '<div v-html="html" />',
      setup: () => ({
        html: this.html,
      }),
    });

    return defineComponent({
      template: `
        <div ref="wrapperRef">
          <label>
            {{ label }}
            <span v-if="required && !displayOptions?.hideRequiredAsterisk">*</span>
          </label>
          <component :is="widget" />
          <div v-if="helpText" v-html="helpText" />
          <div>
            <ul v-if="errors.length">
              <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
          </div>
        </div>
      `,
      setup: () => ({
        label: this.label,
        required: this.required,
        widget: htmlWidget,
        helpText: this.helpText,
        displayOptions,
        errors,
      }),
    });
  }
}
