import { apiRequest } from "@/api/client"

export interface FacturaRecord {
  marca: boolean
  fecha: string
  tipo: string
  numero: number
  nitCliente: string
  nombreCliente: string
  valor: number
  estado: number
}

export function getFacturas(fechaIni: string, fechaFin: string): Promise<FacturaRecord[]> {
  const params = new URLSearchParams({ fechaIni, fechaFin })
  return apiRequest<FacturaRecord[]>(`/facturas?${params.toString()}`)
}
