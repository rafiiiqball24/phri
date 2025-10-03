export const useCurrency = () => {
  const formatIDR = (n: number) => n.toLocaleString('id-ID', { maximumFractionDigits: 0 })
  return { formatIDR }
}
