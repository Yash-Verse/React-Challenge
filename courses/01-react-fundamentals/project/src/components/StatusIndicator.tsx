interface StatusIndicatorProps {
  status?: string
}

export default function StatusIndicator({
  status = '',
}: StatusIndicatorProps) {
  if (!status) {
    return null
  }

  return (
    <span
      data-status={status}
    >
      {status}
    </span>
  )
}