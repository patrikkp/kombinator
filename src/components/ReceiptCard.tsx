import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { getWarrantyStatus, getWarrantyDaysLabel, type WarrantyStatus } from '@/lib/warranty'
import { useTilt } from '@/hooks/useTilt'

interface ReceiptCardProps {
  id: string
  productName: string
  category: string
  warrantyExpiration: string
  imageUrl?: string
  onClick: () => void
}

const statusConfig: Record<WarrantyStatus, { label: string; className: string }> = {
  expired: { label: 'Isteklo', className: 'bg-[#ff3131] text-white' },
  expiring: { label: 'Ističe uskoro', className: 'bg-orange-500 text-white' },
  active: { label: 'Aktivno', className: 'bg-green-500 text-white' },
}

const TOOTH = 14
const TOOTH_H = 8

function ZigzagBottom({ className = '' }: { className?: string }) {
  const count = 60
  const points = Array.from({ length: count }, (_, i) => {
    const x = i * TOOTH
    return i === 0 ? `M${x} 0 L${x + TOOTH / 2} ${TOOTH_H} L${x + TOOTH} 0` : `L${x + TOOTH / 2} ${TOOTH_H} L${x + TOOTH} 0`
  }).join(' ')

  return (
    <svg viewBox={`0 0 ${count * TOOTH} ${TOOTH_H}`} preserveAspectRatio="none" className={`block w-full ${className}`} style={{ height: TOOTH_H }}>
      <path d={`${points} L${count * TOOTH} 0 L0 0 Z`} className="fill-[#0a0a0a]" />
    </svg>
  )
}

export function ReceiptCard({ productName, category, warrantyExpiration, imageUrl, onClick }: ReceiptCardProps) {
  const status = getWarrantyStatus(warrantyExpiration)
  const config = statusConfig[status]
  const daysLabel = getWarrantyDaysLabel(warrantyExpiration)
  const formattedDate = new Date(warrantyExpiration).toLocaleDateString('hr-HR')
  const { ref, style, handleMove, handleLeave } = useTilt(4)

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={{ rotateX: style.rotateX, rotateY: style.rotateY }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', mass: 1, stiffness: 180, damping: 18 }}
      onClick={onClick}
      className="cursor-pointer overflow-visible"
      style={{ perspective: 800, transformStyle: 'preserve-3d' }}
    >
      <div className="relative rounded-t-2xl bg-[#0a0a0a] shadow-lg shadow-black/50 transition-shadow duration-300 hover:shadow-2xl hover:shadow-[#ff3131]/20 border border-white/10" style={{ marginBottom: -1 }}>
        <div className="relative aspect-[4/3] bg-black/40 overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={productName} className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105" loading="lazy" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/5 to-white/10">
              <svg viewBox="0 0 48 64" className="h-12 w-9 text-white/10">
                <path d="M0 4 L4 0 L8 4 L12 0 L16 4 L20 0 L24 4 L28 0 L32 4 L36 0 L40 4 L44 0 L48 4 L48 60 L44 64 L40 60 L36 64 L32 60 L28 64 L24 60 L20 64 L16 60 L12 64 L8 60 L4 64 L0 60 Z" fill="currentColor" />
              </svg>
            </div>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className={`absolute right-2 top-2 border-0 text-xs font-medium shadow-lg ${config.className} ${status === 'expiring' ? 'animate-pulse' : ''}`}>
                {config.label}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs bg-black/90 border-white/20">
              {daysLabel}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="p-3.5">
          <h3 className="truncate text-sm font-semibold tracking-tight text-white">{productName}</h3>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-xs text-gray-400">{category}</span>
            <span className="text-xs text-gray-400">{formattedDate}</span>
          </div>
        </div>
      </div>

      <ZigzagBottom className="relative z-10" />
    </motion.div>
  )
}