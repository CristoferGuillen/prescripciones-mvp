import type { InputHTMLAttributes, ReactNode } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
};

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={inputId}
        className="block text-sm font-semibold text-slate-800"
      >
        {label}
      </label>

      <div className="relative">
        {leftIcon ? (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            {leftIcon}
          </div>
        ) : null}

        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          className={[
            'min-h-11 w-full rounded-xl border bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm outline-none transition',
            'placeholder:text-slate-400',
            'focus:border-blue-700 focus:ring-4 focus:ring-blue-100',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
              : 'border-slate-200',
            leftIcon ? 'pl-10' : '',
            className,
          ].join(' ')}
          {...props}
        />
      </div>

      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}

      {!error && helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}