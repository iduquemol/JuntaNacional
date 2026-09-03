import { cn } from "@/lib/utils"
import type { FormStatus } from "@/forms/hooks/useFormState"

export interface FormStatusBannerProps {
  status: FormStatus
  submitError?: string | null
  successMessage?: string
  submittingMessage?: string
}

/**
 * Shared success/error/loading feedback for a form driven by useFormState.
 * Renders nothing while idle.
 */
export function FormStatusBanner({
  status,
  submitError,
  successMessage = "Saved successfully.",
  submittingMessage = "Submitting...",
}: FormStatusBannerProps) {
  if (status === "idle") {
    return null
  }

  const text =
    status === "submitting"
      ? submittingMessage
      : status === "success"
        ? successMessage
        : (submitError ?? "Something went wrong.")

  return (
    <p
      role="status"
      className={cn(
        "rounded-lg px-2.5 py-1.5 text-sm",
        status === "submitting" && "bg-muted text-muted-foreground",
        status === "success" && "bg-primary/10 text-primary",
        status === "error" && "bg-destructive/10 text-destructive"
      )}
    >
      {text}
    </p>
  )
}
