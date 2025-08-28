import { defineComponent, ref, onMounted } from "vue";
import { WidgetDef } from "./widgets/base";

export interface FieldDisplayOptions {
  focusOnMount?: boolean;
  hideRequiredAsterisk?: boolean;
}

export class FieldDef {
  name: string;
  label: string;
  required: boolean;
  disabled: boolean;
  widget: WidgetDef;
  helpText: string;
  value: string;

  constructor(
    name: string,
    label: string,
    required: boolean,
    disabled: boolean,
    widget: WidgetDef,
    helpText: string,
    value: string
  ) {
    this.name = name;
    this.label = label;
    this.required = required;
    this.disabled = disabled;
    this.widget = widget;
    this.helpText = helpText;
    this.value = value;
  }

  render(errors: string[], displayOptions: FieldDisplayOptions = {}) {
    const widgetComponent = this.widget.render(
      this.name,
      this.name,
      this.disabled,
      this.value
    );

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
      setup: () => {
        const wrapperRef = ref<HTMLDivElement | null>(null);

        onMounted(() => {
          if (displayOptions?.focusOnMount && wrapperRef.value) {
            const inputElement = wrapperRef.value.querySelector("input");
            if (inputElement) {
              inputElement.focus();
            }
          }
        });

        return {
          wrapperRef,
          label: this.label,
          required: this.required,
          widget: widgetComponent,
          helpText: this.helpText,
          displayOptions,
          errors,
        };
      },
    });
  }
}
