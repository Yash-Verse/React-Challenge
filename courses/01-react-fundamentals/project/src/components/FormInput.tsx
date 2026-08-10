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
}

export default function FormInput({
  id,
  value = '',
  onChange,
  label,
  type = 'text',
  placeholder = '',
  error,
}: FormInputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id}>
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

      {error && (
        <p>{error}</p>
      )}
    </div>
  )
}