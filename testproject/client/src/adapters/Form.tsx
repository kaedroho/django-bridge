import { ReactElement } from "react";
import FieldDef from "./Field";

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
export default class FormDef {
  fields: FieldDef[];

  errors: { [field: string]: string[] };

  constructor(fields: FieldDef[], errors: FormDef["errors"]) {
    this.fields = fields;
    this.errors = errors;
  }

  render(renderOptions: FormRenderOptions = {}): ReactElement {
    // eslint-disable-next-line no-underscore-dangle
    const formErrors = this.errors.__all__;

    return (
      <>
        {!!formErrors && (
          <ul>
            {formErrors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
        {this.fields.map((field, fieldIndex) => (
          <div key={field.name}>
            {field.render(this.errors[field.name] || [], {
              focusOnMount: fieldIndex === 0,
              hideRequiredAsterisk: renderOptions.hideRequiredAsterisks,
            })}
          </div>
        ))}
      </>
    );
  }
}
