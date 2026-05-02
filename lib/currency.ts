export const CURRENCIES = [
  { code: 'KES', symbol: 'KES', rate: 1, name: 'Kenyan Shilling' },
  { code: 'NGN', symbol: '₦', rate: 11, name: 'Nigerian Naira' },
  { code: 'GHS', symbol: 'GH₵', rate: 0.1, name: 'Ghanaian Cedi' },
  { code: 'ZAR', symbol: 'R', rate: 0.14, name: 'South African Rand' },
  { code: 'USD', symbol: '$', rate: 0.0075, name: 'US Dollar' },
]

export type Currency = typeof CURRENCIES[number]

export function convertPrice(basePriceKES: number, currencyCode: string): string {
  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0]
  const converted = basePriceKES * currency.rate
  
  if (['USD', 'GHS', 'ZAR'].includes(currencyCode)) {
    return `${currency.symbol}${converted.toFixed(2)}`
  }
  return `${currency.symbol} ${Math.round(converted)}`
}

export function getPaystackAmount(basePriceKES: number, currencyCode: string): number {
  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0]
  const converted = basePriceKES * currency.rate
  // Paystack expects lowest denomination (cents/kobo/pesewas)
  return Math.round(converted * 100)
}
