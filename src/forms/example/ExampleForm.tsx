import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormField } from "@/forms/components/FormField"
import { FormStatusBanner } from "@/forms/components/FormStatusBanner"
import { useFormState } from "@/forms/hooks/useFormState"
import { createExample } from "@/services/example.service"

interface ExampleFormValues {
  nombre: string
}

/**
 * Reference implementation of the forms architecture: a form component
 * (this file) reads/writes state through useFormState, renders shared
 * FormField/FormStatusBanner components, and calls the backend only
 * through a service function (createExample) built on apiRequest.
 *
 * Model new forms on this structure rather than inventing a new one.
 */
export function ExampleForm() {
  const { values, errors, status, submitError, handleChange, handleSubmit } =
    useFormState<ExampleFormValues>({
      initialValues: { nombre: "" },
      validate: (v) => (v.nombre.trim() ? {} : { nombre: "Nombre is required." }),
      onSubmit: async (v) => {
        await createExample({ nombre: v.nombre })
      },
    })

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-3">
      <FormField label="Nombre" htmlFor="nombre" error={errors.nombre}>
        <Input
          id="nombre"
          name="nombre"
          value={values.nombre}
          onChange={handleChange}
          aria-invalid={Boolean(errors.nombre)}
        />
      </FormField>

      <FormStatusBanner status={status} submitError={submitError} />

      <Button type="submit" disabled={status === "submitting"}>
        Submit
      </Button>
    </form>
  )
}
