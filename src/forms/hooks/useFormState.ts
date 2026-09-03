import { useCallback, useState } from "react"
import type { ChangeEvent, SubmitEvent } from "react"

export type FormStatus = "idle" | "submitting" | "success" | "error"

export type FormErrors<T> = Partial<Record<keyof T, string>>

export interface UseFormStateOptions<T> {
  initialValues: T
  onSubmit: (values: T) => Promise<void> | void
  validate?: (values: T) => FormErrors<T>
}

export interface UseFormStateResult<T> {
  values: T
  errors: FormErrors<T>
  status: FormStatus
  submitError: string | null
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void
  handleChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void
  handleSubmit: (event?: SubmitEvent) => void
}

/**
 * Generic controlled-form state hook. No external form library: every form
 * in this project is expected to be built on top of this hook instead of
 * hand-rolling its own useState calls for values/errors/status.
 */
export function useFormState<T extends object>({
  initialValues,
  onSubmit,
  validate,
}: UseFormStateOptions<T>): UseFormStateResult<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors<T>>({})
  const [status, setStatus] = useState<FormStatus>("idle")
  const [submitError, setSubmitError] = useState<string | null>(null)

  const setFieldValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = event.target
      setValues((prev) => ({ ...prev, [name]: value }))
    },
    []
  )

  const handleSubmit = useCallback(
    (event?: SubmitEvent) => {
      event?.preventDefault()

      const validationErrors = validate?.(values) ?? {}
      setErrors(validationErrors)
      if (Object.keys(validationErrors).length > 0) {
        return
      }

      setStatus("submitting")
      setSubmitError(null)

      Promise.resolve(onSubmit(values))
        .then(() => setStatus("success"))
        .catch((error: unknown) => {
          setStatus("error")
          setSubmitError(error instanceof Error ? error.message : "Something went wrong.")
        })
    },
    [onSubmit, validate, values]
  )

  return { values, errors, status, submitError, setFieldValue, handleChange, handleSubmit }
}
