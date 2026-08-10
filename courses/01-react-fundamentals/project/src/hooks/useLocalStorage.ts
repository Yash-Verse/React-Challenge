import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'

export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const savedValue =
        localStorage.getItem(key)

      if (savedValue === null) {
        return initialValue
      }

      return JSON.parse(savedValue) as T
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(
        key,
        JSON.stringify(value)
      )
    } catch {
      // Ignore localStorage write errors
    }
  }, [key, value])

  return [value, setValue]
}