import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { getWarrantyStatus } from '@/lib/warranty'
import { motion } from 'framer-motion'

interface ReceiptViewerProps {
  open: boolean
  onClose: () => void
  receipt: { id: string; product_name: string; category: string; warranty_expiration_date: string; imageUrl?: string } | null
  onDelete: (id: string) => void
}

const statusLabels = { expired: 'Isteklo', expiring: 'Ističe uskoro', active: 'Aktivno' }
const statusClasses = { expired: 'bg-[#ff3131] text-white', expiring: 'bg-orange-500 text-white', active: 'bg-green-500 text-white' }

export function ReceiptViewer({ open, onClose, receipt, onDelete }: ReceiptViewerProps) {
  if (!receipt) return null

  const status = getWarrantyStatus(receipt.warranty_expiration_date)
  const formattedDate = new Date(receipt.warranty_expiration_date).toLocaleDateString('hr-HR')

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl border-white/10 glass-card">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="relative bg-black/40">
          {receipt.imageUrl ? (
            <img src={receipt.imageUrl} alt={receipt.product_name} className="w-full max-h-[60vh] object-contain" />
          ) : (
            <div className="flex h-64 items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
              <svg viewBox="0 0 48 64" className="h-16 w-12 text-white/10">
                <path d="M0 4 L4 0 L8 4 L12 0 L16 4 L20 0 L24 4 L28 0 L32 4 L36 0 L40 4 L44 0 L48 4 L48 60 L44 64 L40 60 L36 64 L32 60 L28 64 L24 60 L20 64 L16 60 L12 64 L8 60 L4 64 L0 60 Z" fill="currentColor"/>
              </svg>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.3 }} className="p-6 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white">{receipt.product_name}</h2>
              <p className="text-sm text-gray-400">{receipt.category}</p>
            </div>
            <Badge className={`border-0 shadow-lg ${statusClasses[status]}`}>{statusLabels[status]}</Badge>
          </div>
          <p className="text-sm text-gray-400">
            Garancija ističe: <span className="font-medium text-white">{formattedDate}</span>
          </p>
          <Button variant="outline" size="sm" onClick={() => onDelete(receipt.id)} className="text-[#ff3131] hover:text-[#ff3131] hover:bg-[#ff3131]/10 rounded-xl border-white/10 bg-white/5 transition-colors">
            <Trash2 className="mr-1.5 h-4 w-4" /> Obriši
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}