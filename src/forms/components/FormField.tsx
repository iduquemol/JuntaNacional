import type { ReactNode } from "react"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface FormFieldProps {
  label: string
  htmlFor: string
  error?: string
  className?: string
  children: ReactNode
}

/**
 * One labeled row of a form: a label, the field control (an Input, Select,
 * etc. from src/components/ui), and its inline validation error, if any.
 * Every form should use this instead of hand-writing label/error markup.
 */
export function FormField({ label, htmlFor, error, className, children }: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
