import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FormField } from "@/forms/components/FormField"
import { FormStatusBanner } from "@/forms/components/FormStatusBanner"
import { useFormState } from "@/forms/hooks/useFormState"
import { getFacturas, type FacturaRecord } from "@/services/facturas.service"

interface FacturasQuery {
  fechaIni: string
  fechaFin: string
}

function facturaKey(factura: FacturaRecord): string {
  return `${factura.tipo}-${factura.numero}`
}

export function FacturasForm() {
  const [facturas, setFacturas] = useState<FacturaRecord[]>([])
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [hasQueried, setHasQueried] = useState(false)

  const { values, errors, status, submitError, handleChange, setFieldValue, handleSubmit } =
    useFormState<FacturasQuery>({
      initialValues: { fechaIni: "", fechaFin: "" },
      validate: (v) => {
        const fieldErrors: Partial<Record<keyof FacturasQuery, string>> = {}
        if (!v.fechaIni) fieldErrors.fechaIni = "Fecha inicial es requerida."
        if (!v.fechaFin) fieldErrors.fechaFin = "Fecha final es requerida."
        if (v.fechaIni && v.fechaFin && v.fechaIni > v.fechaFin) {
          fieldErrors.fechaFin = "Fecha final no puede ser anterior a fecha inicial."
        }
        return fieldErrors
      },
      onSubmit: async (v) => {
        const result = await getFacturas(v.fechaIni, v.fechaFin)
        setFacturas(result)
        setSelectedKeys(new Set())
        setHasQueried(true)
      },
    })

  const allSelected = facturas.length > 0 && selectedKeys.size === facturas.length
  const someSelected = selectedKeys.size > 0 && !allSelected

  function toggleAll(checked: boolean) {
    setSelectedKeys(checked ? new Set(facturas.map(facturaKey)) : new Set())
  }

  function toggleRow(key: string, checked: boolean) {
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(key)
      } else {
        next.delete(key)
      }
      return next
    })
  }

  function handleProcesar() {
    const seleccionadas = facturas.filter((f) => selectedKeys.has(facturaKey(f)))
    // TODO: call the real "procesar" backend endpoint once ApiAstil exposes one.
    console.info("Facturas seleccionadas para procesar:", seleccionadas)
  }

  function handleCancelar() {
    setFieldValue("fechaIni", "")
    setFieldValue("fechaFin", "")
    setFacturas([])
    setSelectedKeys(new Set())
    setHasQueried(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-7xl flex-col gap-4 px-4">
      <div className="flex flex-wrap items-end gap-3">
        <FormField label="Fecha inicial" htmlFor="fechaIni" error={errors.fechaIni}>
          <Input
            id="fechaIni"
            name="fechaIni"
            type="date"
            value={values.fechaIni}
            onChange={handleChange}
            aria-invalid={Boolean(errors.fechaIni)}
          />
        </FormField>

        <FormField label="Fecha final" htmlFor="fechaFin" error={errors.fechaFin}>
          <Input
            id="fechaFin"
            name="fechaFin"
            type="date"
            value={values.fechaFin}
            onChange={handleChange}
            aria-invalid={Boolean(errors.fechaFin)}
          />
        </FormField>

        <Button type="submit" disabled={status === "submitting"}>
          Consultar
        </Button>
      </div>

      <FormStatusBanner status={status} submitError={submitError} successMessage="Consulta exitosa." />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={toggleAll}
                disabled={facturas.length === 0}
                aria-label="Seleccionar todas las facturas"
              />
            </TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Numero</TableHead>
            <TableHead>Nit Cliente</TableHead>
            <TableHead>Nombre Cliente</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facturas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                {hasQueried ? "No se encontraron facturas para el rango seleccionado." : "Realiza una consulta para ver facturas."}
              </TableCell>
            </TableRow>
          ) : (
            facturas.map((factura) => {
              const key = facturaKey(factura)
              return (
                <TableRow key={key}>
                  <TableCell>
                    <Checkbox
                      checked={selectedKeys.has(key)}
                      onCheckedChange={(checked) => toggleRow(key, checked)}
                      aria-label={`Seleccionar factura ${key}`}
                    />
                  </TableCell>
                  <TableCell>{factura.fecha}</TableCell>
                  <TableCell>{factura.tipo}</TableCell>
                  <TableCell>{factura.numero}</TableCell>
                  <TableCell>{factura.nitCliente}</TableCell>
                  <TableCell>{factura.nombreCliente}</TableCell>
                  <TableCell>{factura.valor}</TableCell>
                  <TableCell>{factura.estado}</TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      <div className="flex gap-2">
        <Button type="button" onClick={handleProcesar} disabled={selectedKeys.size === 0}>
          Procesar
        </Button>
        <Button type="button" variant="outline" onClick={handleCancelar}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
