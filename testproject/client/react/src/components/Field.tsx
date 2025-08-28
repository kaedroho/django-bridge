import React, { ReactElement } from "react";

export interface FieldProps {
  label: string;
  required: boolean;
  widget: ReactElement;
  helpText?: string;
  displayOptions?: {
    focusOnMount?: boolean;
    hideRequiredAsterisk?: boolean;
  };
  errors: string[];
}

function Field({
  label,
  required,
  widget,
  helpText,
  displayOptions,
  errors,
}: FieldProps): ReactElement {
  // Focus on mount
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (displayOptions?.focusOnMount && wrapperRef.current) {
      const inputElement = wrapperRef.current.querySelector("input");
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [displayOptions?.focusOnMount]);

  return (
    <div>
      <label>
        {label}
        {required && !displayOptions?.hideRequiredAsterisk && <span>*</span>}
      </label>
      {widget}
      {helpText && <div dangerouslySetInnerHTML={{ __html: helpText }} />}
      <div>
        {!!errors.length && (
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Field;
