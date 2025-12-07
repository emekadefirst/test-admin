import { forwardRef } from 'react'

interface BaseInputProps {
  label?: string
  error?: string
  className?: string
  disabled?: boolean
}

interface TextInputProps extends BaseInputProps {
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'date'
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

interface TextareaProps extends BaseInputProps {
  placeholder?: string
  value?: string
  rows?: number
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

interface SelectProps extends BaseInputProps {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  children: React.ReactNode
}

interface CheckboxProps extends BaseInputProps {
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  children: React.ReactNode
}

const inputClasses = `
  w-full px-3 py-2 border border-gray-300 rounded-full
  focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent
  disabled:bg-gray-100 disabled:cursor-not-allowed
  transition-colors
`
  .trim()
  .replace(/\s+/g, ' ')

const labelClasses = 'block text-sm font-medium text-gray-700 mb-1'
const errorClasses = 'text-sm text-red-600 mt-1'

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    { label, error, className = '', type = 'text', disabled = false, ...props },
    ref,
  ) => (
    <div className={className}>
      {label && <label className={labelClasses}>{label}</label>}
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={`${inputClasses} ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <p className={errorClasses}>{error}</p>}
    </div>
  ),
)

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, className = '', disabled = false, rows = 4, ...props },
    ref,
  ) => (
    <div className={className}>
      {label && <label className={labelClasses}>{label}</label>}
      <textarea
        ref={ref}
        rows={rows}
        disabled={disabled}
        className={`${inputClasses} ${error ? 'border-red-500' : ''} resize-vertical`}
        {...props}
      />
      {error && <p className={errorClasses}>{error}</p>}
    </div>
  ),
)

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, className = '', disabled = false, children, ...props },
    ref,
  ) => (
    <div className={className}>
      {label && <label className={labelClasses}>{label}</label>}
      <select
        ref={ref}
        disabled={disabled}
        className={`${inputClasses} ${error ? 'border-red-500' : ''}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className={errorClasses}>{error}</p>}
    </div>
  ),
)

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, error, className = '', disabled = false, children, ...props },
    ref,
  ) => (
    <div className={className}>
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          disabled={disabled}
          className="w-4 h-4 text-accent-500 border-gray-300 rounded focus:ring-accent-500"
          {...props}
        />
        <span className="text-sm text-gray-700">{children}</span>
      </label>
      {error && <p className={errorClasses}>{error}</p>}
    </div>
  ),
)

TextInput.displayName = 'TextInput'
Textarea.displayName = 'Textarea'
Select.displayName = 'Select'
Checkbox.displayName = 'Checkbox'