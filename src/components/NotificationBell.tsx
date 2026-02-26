import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { differenceInDays, parseISO } from 'date-fns'
import { Badge } from '@/components/ui/badge'

export function NotificationBell() {
  const { data: receipts } = useQuery({
    queryKey: ['receipts-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('receipts')
        .select('*')
        .order('warranty_end_date', { ascending: true })

      if (error) throw error
      return data
    },
  })

  const getExpiringReceipts = () => {
    if (!receipts) return []
    
    const now = new Date()
    return receipts.filter((receipt) => {
      if (!receipt.warranty_end_date) return false
      const endDate = parseISO(receipt.warranty_end_date)
      const daysLeft = differenceInDays(endDate, now)
      return daysLeft > 0 && daysLeft <= 30
    })
  }

  const expiringReceipts = getExpiringReceipts()
  const hasNotifications = expiringReceipts.length > 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasNotifications && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {expiringReceipts.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-black/95 border-white/10">
        <DropdownMenuLabel className="text-white">Notifikacije</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        {!hasNotifications ? (
          <div className="p-4 text-center text-sm text-gray-400">
            Nema novih notifikacija
          </div>
        ) : (
          expiringReceipts.map((receipt) => {
            const daysLeft = differenceInDays(
              parseISO(receipt.warranty_end_date!),
              new Date()
            )
            return (
              <DropdownMenuItem key={receipt.id} className="text-white hover:bg-white/10">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{receipt.item_name}</span>
                  <span className="text-xs text-gray-400">
                    Ističe za {daysLeft} {daysLeft === 1 ? 'dan' : 'dana'}
                  </span>
                </div>
              </DropdownMenuItem>
            )
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
