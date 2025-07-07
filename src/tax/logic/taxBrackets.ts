import { FilingStatus, TaxBracket } from '../types';

// 2024 Tax Brackets
export const TAX_BRACKETS_2024: Record<FilingStatus, TaxBracket[]> = {
  [FilingStatus.SINGLE]: [
    { min: 0, max: 11000, rate: 0.10 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 197050, rate: 0.24 },
    { min: 197050, max: 250525, rate: 0.32 },
    { min: 250525, max: 626350, rate: 0.35 },
    { min: 626350, max: Infinity, rate: 0.37 }
  ],
  [FilingStatus.MARRIED_FILING_JOINTLY]: [
    { min: 0, max: 22000, rate: 0.10 },
    { min: 22000, max: 89450, rate: 0.12 },
    { min: 89450, max: 190750, rate: 0.22 },
    { min: 190750, max: 364200, rate: 0.24 },
    { min: 364200, max: 462500, rate: 0.32 },
    { min: 462500, max: 693750, rate: 0.35 },
    { min: 693750, max: Infinity, rate: 0.37 }
  ],
  [FilingStatus.MARRIED_FILING_SEPARATELY]: [
    { min: 0, max: 11000, rate: 0.10 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 346875, rate: 0.35 },
    { min: 346875, max: Infinity, rate: 0.37 }
  ],
  [FilingStatus.HEAD_OF_HOUSEHOLD]: [
    { min: 0, max: 15700, rate: 0.10 },
    { min: 15700, max: 59850, rate: 0.12 },
    { min: 59850, max: 95350, rate: 0.22 },
    { min: 95350, max: 197050, rate: 0.24 },
    { min: 197050, max: 250500, rate: 0.32 },
    { min: 250500, max: 626350, rate: 0.35 },
    { min: 626350, max: Infinity, rate: 0.37 }
  ],
  [FilingStatus.QUALIFYING_WIDOW]: [
    { min: 0, max: 22000, rate: 0.10 },
    { min: 22000, max: 89450, rate: 0.12 },
    { min: 89450, max: 190750, rate: 0.22 },
    { min: 190750, max: 364200, rate: 0.24 },
    { min: 364200, max: 462500, rate: 0.32 },
    { min: 462500, max: 693750, rate: 0.35 },
    { min: 693750, max: Infinity, rate: 0.37 }
  ]
};

/**
 * Calculates income tax based on taxable income and filing status
 * @param taxableIncome - The taxable income amount
 * @param filingStatus - The filing status
 * @returns The calculated income tax
 */
export function calculateIncomeTax(taxableIncome: number, filingStatus: FilingStatus): number {
  if (taxableIncome <= 0) {
    return 0;
  }

  const brackets = TAX_BRACKETS_2024[filingStatus];
  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) {
      break;
    }

    const taxableAtThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableAtThisBracket * bracket.rate;
    remainingIncome -= taxableAtThisBracket;
  }

  return Math.round(tax); // Round to nearest dollar
}

/**
 * Calculates the marginal tax rate for a given income and filing status
 * @param taxableIncome - The taxable income amount
 * @param filingStatus - The filing status
 * @returns The marginal tax rate as a decimal (e.g., 0.22 for 22%)
 */
export function getMarginalTaxRate(taxableIncome: number, filingStatus: FilingStatus): number {
  if (taxableIncome <= 0) {
    return 0;
  }

  const brackets = TAX_BRACKETS_2024[filingStatus];
  
  for (const bracket of brackets) {
    if (taxableIncome > bracket.min && taxableIncome <= bracket.max) {
      return bracket.rate;
    }
  }

  // If we get here, income is in the highest bracket
  return brackets[brackets.length - 1].rate;
}

/**
 * Calculates the effective tax rate
 * @param incomeTax - The calculated income tax
 * @param taxableIncome - The taxable income amount
 * @returns The effective tax rate as a decimal (e.g., 0.15 for 15%)
 */
export function getEffectiveTaxRate(incomeTax: number, taxableIncome: number): number {
  if (taxableIncome <= 0) {
    return 0;
  }
  
  return incomeTax / taxableIncome;
}

/**
 * Gets the tax bracket information for a specific income and filing status
 * @param taxableIncome - The taxable income amount
 * @param filingStatus - The filing status
 * @returns The tax bracket that applies to the income
 */
export function getTaxBracket(taxableIncome: number, filingStatus: FilingStatus): TaxBracket | null {
  if (taxableIncome <= 0) {
    return null;
  }

  const brackets = TAX_BRACKETS_2024[filingStatus];
  
  for (const bracket of brackets) {
    if (taxableIncome > bracket.min && taxableIncome <= bracket.max) {
      return bracket;
    }
  }

  return null;
} 