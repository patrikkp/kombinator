import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onAddClick: () => void
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-24 px-4 text-center"
    >
      <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
        <FileText className="w-12 h-12 text-gray-600" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Nema još garancija</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        Počnite pratiti vaše garancije dodavanjem prvog računa.
      </p>
      <Button onClick={onAddClick} className="bg-[#ff3131] hover:bg-[#ff3131]/90 shadow-lg shadow-[#ff3131]/30">
        Dodaj prvu garanciju
      </Button>
    </motion.div>
  )
}