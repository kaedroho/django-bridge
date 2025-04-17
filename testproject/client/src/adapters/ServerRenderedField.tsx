import { ReactElement } from "react";
import Field, { FieldProps } from "../components/Field";

export default class ServerRenderedFieldDef {
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

  render(
    errors: string[],
    displayOptions: FieldProps["displayOptions"] = {}
  ): ReactElement {
    return (
      <Field
        label={this.label}
        required={this.required}
        widget={
          <div
            dangerouslySetInnerHTML={{
              __html: this.html,
            }}
          />
        }
        helpText={this.helpText}
        displayOptions={displayOptions}
        errors={errors}
      />
    );
  }
}
