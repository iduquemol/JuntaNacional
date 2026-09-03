import { FacturasForm } from "@/forms/facturas/FacturasForm"

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-6 py-10">
      <h1 className="text-2xl font-bold">Facturas a Procesar</h1>
      <FacturasForm />
    </div>
  )
}

export default App
