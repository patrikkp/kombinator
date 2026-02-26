import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Camera, Upload } from 'lucide-react'
import { motion } from 'framer-motion'

const CATEGORIES = ['Elektronika', 'Namještaj', 'Auto Dijelovi', 'Sport', 'Ostalo']

interface AddReceiptModalProps {
  open: boolean
  onClose: () => void
  onAdded: () => void
}

export function AddReceiptModal({ open, onClose, onAdded }: AddReceiptModalProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)

    try {
      let imagePath: string | null = null

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('receipts').upload(fileName, imageFile)
        if (uploadError) throw uploadError
        imagePath = fileName
      }

      const { error } = await supabase.from('receipts').insert({
        user_id: user.id,
        product_name: productName,
        category,
        warranty_expiration_date: expirationDate,
        image_path: imagePath,
      })

      if (error) throw error

      toast({ title: 'Uspjeh', description: 'Račun je uspješno dodan.' })
      resetForm()
      onAdded()
      onClose()
    } catch (error: any) {
      toast({ title: 'Greška', description: error.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setProductName('')
    setCategory('')
    setExpirationDate('')
    setImageFile(null)
    setImagePreview(null)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl border-white/10 glass-card p-0 overflow-hidden">
        <div className="p-6 space-y-5">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold tracking-tight text-white">Dodaj novi račun</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName" className="text-gray-300">Naziv proizvoda</Label>
              <Input id="productName" placeholder="npr. Samsung Galaxy S24" value={productName} onChange={(e) => setProductName(e.target.value)} required className="h-11 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-gray-500" />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Kategorija</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="h-11 rounded-xl border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Odaberite kategoriju" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-black border-white/10">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-white focus:bg-white/10">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expirationDate" className="text-gray-300">Datum isteka garancije</Label>
              <Input id="expirationDate" type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} required className="h-11 rounded-xl border-white/10 bg-white/5 text-white" />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Slika računa</Label>
              {imagePreview ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative overflow-hidden rounded-xl">
                  <img src={imagePreview} alt="Preview" className="h-40 w-full object-cover rounded-xl" />
                  <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute right-2 top-2 rounded-full bg-[#ff3131] p-1.5 text-white text-xs backdrop-blur-sm transition-transform hover:scale-110">✕</button>
                </motion.div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/10 p-6 transition-all hover:border-[#ff3131]/40 hover:bg-[#ff3131]/5 active:scale-[0.98]">
                  <div className="flex gap-3 text-gray-400">
                    <Camera className="h-6 w-6" />
                    <Upload className="h-6 w-6" />
                  </div>
                  <span className="text-sm text-gray-400">Slikajte ili učitajte račun</span>
                  <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>

            <Button type="submit" disabled={loading || !category} className="h-12 w-full rounded-xl bg-[#ff3131] font-semibold shadow-lg shadow-[#ff3131]/30 hover:bg-[#ff3131]/90 transition-all active:scale-[0.98]">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Spremanje...
                </span>
              ) : 'Spremi račun'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}