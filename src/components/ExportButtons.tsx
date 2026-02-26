import { Download, FileImage } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { exportToPDF, exportToPNG } from '@/lib/export-utils'
import { toast } from 'sonner'

interface ExportButtonsProps {
  elementId: string
  filename: string
}

export function ExportButtons({ elementId, filename }: ExportButtonsProps) {
  const handleExportPDF = async () => {
    try {
      await exportToPDF(elementId, filename)
      toast.success('PDF uspješno preuzet!')
    } catch (error) {
      toast.error('Greška pri preuzimanju PDF-a')
    }
  }

  const handleExportPNG = async () => {
    try {
      await exportToPNG(elementId, filename)
      toast.success('Slika uspješno preuzeta!')
    } catch (error) {
      toast.error('Greška pri preuzimanju slike')
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleExportPDF}
        variant="outline"
        size="sm"
        className="bg-black/40 border-white/10 text-white hover:bg-white/10"
      >
        <Download className="h-4 w-4 mr-2" />
        PDF
      </Button>
      <Button
        onClick={handleExportPNG}
        variant="outline"
        size="sm"
        className="bg-black/40 border-white/10 text-white hover:bg-white/10"
      >
        <FileImage className="h-4 w-4 mr-2" />
        PNG
      </Button>
    </div>
  )
}
