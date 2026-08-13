import { forwardRef } from 'react'

interface FormInputProps {
  id?: string
  value?: string
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void
  label?: string
  type?: string
  placeholder?: string
  error?: string
  multiline?: boolean
}

const FormInput = forwardRef<
  HTMLInputElement,
  FormInputProps
>(function FormInput(
  {
    id,
    value = '',
    onChange,
    label,
    type = 'text',
    placeholder = '',
    error,
  },
  ref
) {
  return (
    <div>
      {label && (
        <label htmlFor={id}>
          {label}
        </label>
      )}

      <input
        ref={ref}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {error && <p>{error}</p>}
    </div>
  )
})

export default FormInput