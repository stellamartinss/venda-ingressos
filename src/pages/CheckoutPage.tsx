import { useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { api, PurchaseRequest, Order } from '../services/api'

function CheckoutPage() {
  const [order, setOrder] = useState<PurchaseRequest | null>(null)
  const [purchaseResult, setPurchaseResult] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const o = JSON.parse(localStorage.getItem('checkout') || 'null')
    setOrder(o)
  }, [])

  if (!order) {
    return <p className="text-sm">Nenhum item no checkout.</p>
  }

  const code = JSON.stringify({
    orderId: purchaseResult?.id,
    eventId: order.eventId,
    items: order.items,
    ts: Date.now(),
  })

  async function simulatePay() {
    if (!order) return
    try {
      setLoading(true)
      setError('')
      const result = await api.purchaseTickets(order)
      setPurchaseResult(result)
      localStorage.removeItem('checkout')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na compra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <div className="rounded-xl border p-4 bg-white dark:bg-gray-800">
          <h2 className="font-medium mb-2">Resumo</h2>
          <p className="text-sm">Evento ID: {order.eventId}</p>
          <p className="text-sm opacity-70">Ingressos: {order.items.length} tipo(s)</p>
          <div className="mt-3 text-sm">
            {order.items.map((item, idx) => (
              <div key={idx}>
                Tipo: {item.ticketTypeId} x {item.quantity}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border p-4 bg-white dark:bg-gray-800">
          <h2 className="font-medium mb-2">Pagamento (simulado)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Número do cartão" className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
            <input placeholder="Nome impresso" className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
            <input placeholder="Validade" className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
            <input placeholder="CVV" className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" />
          </div>
          {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
          <button 
            onClick={simulatePay} 
            disabled={loading || !!purchaseResult}
            className="mt-3 px-4 py-2 rounded-md bg-green-600 text-white disabled:opacity-50"
          >
            {loading ? 'Processando...' : purchaseResult ? 'Compra realizada!' : 'Confirmar pagamento'}
          </button>
        </div>
      </div>
      <div>
        <div className="rounded-xl border p-4 bg-white dark:bg-gray-800 text-center">
          <h2 className="font-medium mb-2">Ingresso digital</h2>
          {!purchaseResult ? (
            <p className="text-sm opacity-70">O QR Code será gerado após a confirmação do pagamento.</p>
          ) : (
            <div className="space-y-3">
              <QRCodeCanvas value={code} size={220} includeMargin className="mx-auto" />
              <p className="text-sm">Apresente este QR Code na entrada do evento.</p>
              <p className="text-xs opacity-70">Pedido: {purchaseResult.id}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage


