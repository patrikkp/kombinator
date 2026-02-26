import { useState, useEffect, useCallback } from 'react'
import { ReceiptCard } from '@/components/ReceiptCard'
import { AddReceiptModal } from '@/components/AddReceiptModal'
import { ReceiptViewer } from '@/components/ReceiptViewer'
import { EmptyState } from '@/components/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Plus, LogOut } from 'lucide-react'
import { getWarrantyStatus } from '@/lib/warranty'
import { motion } from 'framer-motion'

interface Receipt {
  id: string
  product_name: string
  category: string
  warranty_expiration_date: string
  image_path: string | null
  imageUrl?: string
}

const cardStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const cardItem = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [viewerReceipt, setViewerReceipt] = useState<Receipt | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchReceipts = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      const withUrls = await Promise.all(
        data.map(async (r) => {
          let imageUrl: string | undefined
          if (r.image_path) {
            const { data: urlData } = await supabase.storage
              .from('receipts')
              .createSignedUrl(r.image_path, 3600)
            imageUrl = urlData?.signedUrl
          }
          return { ...r, imageUrl }
        })
      )
      setReceipts(withUrls)
    }
    setLoading(false)
  }, [user])

  useEffect(() => { fetchReceipts() }, [fetchReceipts])

  const handleDelete = async (id: string) => {
    const receipt = receipts.find((r) => r.id === id)
    if (receipt?.image_path) {
      await supabase.storage.from('receipts').remove([receipt.image_path])
    }
    await supabase.from('receipts').delete().eq('id', id)
    setViewerReceipt(null)
    fetchReceipts()
  }

  const expired = receipts.filter((r) => getWarrantyStatus(r.warranty_expiration_date) === 'expired')
  const expiring = receipts.filter((r) => getWarrantyStatus(r.warranty_expiration_date) === 'expiring')
  const active = receipts.filter((r) => getWarrantyStatus(r.warranty_expiration_date) === 'active')

  const ReceiptSection = ({ title, items }: { title: string; items: Receipt[] }) => {
    if (items.length === 0) return null
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">{title}</h2>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <motion.div variants={cardStagger} initial="hidden" animate="show" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((r) => (
            <motion.div key={r.id} variants={cardItem}>
              <ReceiptCard
                id={r.id}
                productName={r.product_name}
                category={r.category}
                warrantyExpiration={r.warranty_expiration_date}
                imageUrl={r.imageUrl}
                onClick={() => setViewerReceipt(r)}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen">
      <header className="glass sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/10 px-4 md:px-6">
        <h1 className="text-2xl font-black tracking-tighter text-white">KOMBINATOR</h1>
        <div className="flex items-center gap-2">
          <Button onClick={() => setAddModalOpen(true)} size="sm" className="rounded-full bg-[#ff3131] hover:bg-[#ff3131]/90 gap-1.5 shadow-lg shadow-[#ff3131]/30 transition-all active:scale-95">
            <Plus className="h-4 w-4" /> Dodaj novo
          </Button>
          <Button variant="ghost" size="icon" onClick={signOut} title="Odjava" className="rounded-full text-gray-400 hover:text-[#ff3131] hover:bg-white/5 transition-colors">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="p-4 md:p-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="h-8 w-8 rounded-full border-2 border-[#ff3131] border-t-transparent" />
          </div>
        ) : receipts.length === 0 ? (
          <EmptyState onAddClick={() => setAddModalOpen(true)} />
        ) : (
          <>
            <ReceiptSection title="Istekle garancije" items={expired} />
            <ReceiptSection title="Garancije koje uskoro ističu" items={expiring} />
            <ReceiptSection title="Aktivne garancije" items={active} />
          </>
        )}
      </div>

      <AddReceiptModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onAdded={fetchReceipts} />
      <ReceiptViewer open={!!viewerReceipt} onClose={() => setViewerReceipt(null)} receipt={viewerReceipt} onDelete={handleDelete} />
    </div>
  )
}