import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  isValid?: boolean;
  helpText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, isValid, helpText, id, required, ...props }, ref) => {
    return (
      <div className="w-100">
        {label && (
          <label
            htmlFor={id}
            className="form-label d-flex align-items-center gap-1"
          >
            {label}
            {required && <span className="text-danger">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          required={required}
          className={cn(
            'form-control',
            error && 'is-invalid',
            isValid && !error && 'is-valid',
            className
          )}
          {...props}
        />
        {error && <div className="invalid-feedback d-block">{error}</div>}
        {isValid && !error && <div className="valid-feedback d-block">Campo válido</div>}
        {helpText && !error && !isValid && <div className="form-text small">{helpText}</div>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
