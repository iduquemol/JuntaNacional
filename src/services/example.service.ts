import { apiRequest } from "@/api/client"

export interface ExampleRecord {
  id: number
  nombre: string
}

export interface CreateExampleInput {
  nombre: string
}

/**
 * Template for a real service. Each backend resource (e.g. "facturacion")
 * should get its own `<resource>.service.ts` file that:
 *  - only talks to the backend through `apiRequest`, never `fetch` directly
 *  - exposes typed functions (not raw request options) to forms/components
 *  - translates between the form's data shape and whatever shape the
 *    corresponding ApiAstil endpoint actually expects/returns
 */
export function createExample(input: CreateExampleInput): Promise<ExampleRecord> {
  return apiRequest<ExampleRecord>("/example", {
    method: "POST",
    body: input,
  })
}
