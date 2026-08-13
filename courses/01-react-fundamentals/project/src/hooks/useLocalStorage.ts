import {
  useCallback,
  useEffect,
  useState,
} from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [
  T,
  (value: T | ((previous: T) => T)) => void
] {
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue =
        window.localStorage.getItem(key)

      if (storedValue === null) {
        return initialValue
      }

      try {
        return JSON.parse(storedValue) as T
      } catch {
        return initialValue
      }
    } catch {
      return initialValue
    }
  })

  const updateValue = useCallback(
    (newValue: T | ((previous: T) => T)) => {
      setValue((previous) => {
        const nextValue =
          typeof newValue === 'function'
            ? (
                newValue as (
                  previous: T
                ) => T
              )(previous)
            : newValue

        try {
          window.localStorage.setItem(
            key,
            JSON.stringify(nextValue)
          )
        } catch {
          // Storage failures should not crash the app.
        }

        return nextValue
      })
    },
    [key]
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(
        key,
        JSON.stringify(value)
      )
    } catch {
      // Storage failures are safely ignored.
    }
  }, [key, value])

  return [value, updateValue]
}

export default useLocalStorage