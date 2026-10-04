/**
 * Utility helper functions
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}
