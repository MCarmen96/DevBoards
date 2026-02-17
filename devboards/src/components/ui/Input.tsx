import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isValid?: boolean;
  helpText?: string;
  hideLabel?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, isValid, helpText, hideLabel, id, required, ...props }, ref) => {
    return (
      <div className="w-100">
        {label && !hideLabel && (
          <label
            htmlFor={id}
            className="form-label d-flex align-items-center gap-1"
          >
            {label}
            {required && <span className="text-danger">*</span>}
          </label>
        )}
        <div className="position-relative">
          <input
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
          {isValid && !error && (
            <i className="bi bi-check-circle-fill text-success position-absolute" style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }}></i>
          )}
        </div>
        {error && <div className="invalid-feedback d-block">{error}</div>}
        {isValid && !error && <div className="valid-feedback d-block">Campo válido</div>}
        {helpText && !error && !isValid && <div className="form-text small">{helpText}</div>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
