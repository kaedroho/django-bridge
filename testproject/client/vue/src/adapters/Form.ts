import { defineComponent } from "vue";
import { FieldDef } from "./Field";

export interface Tab {
  label: string;
  fields: string[];
  errorCount: number;
}

export function getInitialTab(tabs: Tab[]): Tab {
  return tabs.find((tab) => tab.errorCount > 0) || tabs[0];
}

interface FormRenderOptions {
  hideRequiredAsterisks?: boolean;
}

export class FormDef {
  fields: FieldDef[];
  errors: { [field: string]: string[] };

  constructor(fields: FieldDef[], errors: FormDef["errors"]) {
    this.fields = fields;
    this.errors = errors;
  }

  render(renderOptions: FormRenderOptions = {}) {
    const formErrors = this.errors.__all__;
    const fieldComponents = this.fields.map((field, fieldIndex) =>
      field.render(this.errors[field.name] || [], {
        focusOnMount: fieldIndex === 0,
        hideRequiredAsterisk: renderOptions.hideRequiredAsterisks,
      })
    );

    return defineComponent({
      template: `
        <div>
          <ul v-if="formErrors && formErrors.length">
            <li v-for="error in formErrors" :key="error">{{ error }}</li>
          </ul>
          <div v-for="(field, fieldIndex) in fields" :key="fieldIndex">
            <component :is="field" />
          </div>
        </div>
      `,
      setup: () => {
        return {
          formErrors,
          fields: fieldComponents,
        };
      },
    });
  }
}
