import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'



export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key)

      if (storedValue === null) {
        return initialValue
      }

      return JSON.parse(storedValue) as T
    } catch {
      return initialValue
    }
  })

  const updateValue = (
    newValue: T | ((prev: T) => T)
  ) => {
    setValue((previousValue) => {
      const nextValue =
        typeof newValue === 'function'
          ? (newValue as (prev: T) => T)(
              previousValue
            )
          : newValue

      try {
        localStorage.setItem(
          key,
          JSON.stringify(nextValue)
        )
      } catch {
        // Ignore localStorage write errors.
      }

      return nextValue
    })
  }

  return [value, updateValue]
}