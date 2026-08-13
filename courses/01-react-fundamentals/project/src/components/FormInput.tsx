import {
  forwardRef,
  type ChangeEvent,
} from 'react'

interface FormInputProps {
  id?: string
  value?: string
  onChange?: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  label?: string
  type?: string
  placeholder?: string
  error?: string
  multiline?: boolean
}

const FormInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormInputProps
>(
  (
    {
      id,
      value = '',
      onChange,
      label,
      type = 'text',
      placeholder = '',
      error,
      multiline = false,
    },
    ref
  ) => {
    return (
      <div>
        {label && (
          <label htmlFor={id}>
            {label}
          </label>
        )}

        {multiline ? (
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            ref={ref as React.Ref<HTMLTextAreaElement>}
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            ref={ref as React.Ref<HTMLInputElement>}
          />
        )}

        {error && <p>{error}</p>}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

export default FormInput