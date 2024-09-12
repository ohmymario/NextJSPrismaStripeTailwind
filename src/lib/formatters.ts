import { DiscountCodeType } from "@prisma/client";

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');
const PERCENT_FORMATTER = new Intl.NumberFormat('en-US', { style: 'percent' });
const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 0,
});

export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount);
}

export function formatNumber(amount: number) {
  return NUMBER_FORMATTER.format(amount);
}

export function formatPercentage(amount: number) {
  return PERCENT_FORMATTER.format(amount / 100);
}

export function formatDiscountType({ discountAmount, discountType }: { discountAmount: number, discountType: DiscountCodeType }) {
  if (discountType === 'PERCENTAGE') {
    return formatPercentage(discountAmount);
  }

  if (discountType === 'FIXED') {
    return formatCurrency(discountAmount);
  }

  return new Error(`Unknown discount type: ${discountType satisfies never}`);
} 