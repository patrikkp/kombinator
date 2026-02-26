export type WarrantyStatus = 'expired' | 'expiring' | 'active'

export function getWarrantyStatus(expirationDate: string): WarrantyStatus {
  const now = new Date()
  const expiry = new Date(expirationDate)
  const diffMs = expiry.getTime() - now.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  if (diffDays < 0) return 'expired'
  if (diffDays <= 30) return 'expiring'
  return 'active'
}

export function getWarrantyDaysLabel(expirationDate: string): string {
  const now = new Date()
  const expiry = new Date(expirationDate)
  const diffMs = expiry.getTime() - now.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Ističe danas'
  if (diffDays < 0) return `Isteklo prije ${Math.abs(diffDays)} dana`
  return `Ističe za ${diffDays} dana`
}