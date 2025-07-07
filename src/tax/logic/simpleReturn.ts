import { SimpleReturnInputs, TaxCalculationResults, FilingStatus } from '../types';
import { calculateStandardDeduction } from './standardDeduction';
import { calculateIncomeTax, getMarginalTaxRate, getEffectiveTaxRate } from './taxBrackets';
import { calculateChildTaxCredit } from './credits';

/**
 * Calculates a simple tax return (standard deduction, no itemizing)
 * @param inputs - All the input data for the tax return
 * @returns Complete tax calculation results
 */
export function calculateSimpleReturn(inputs: SimpleReturnInputs): TaxCalculationResults {
  // Step 1: Calculate Adjusted Gross Income (AGI)
  const adjustedGrossIncome = calculateAGI(inputs);
  
  // Step 2: Calculate Standard Deduction
  const standardDeduction = calculateStandardDeduction(inputs.taxpayerInfo);
  
  // Step 3: Calculate Taxable Income
  const taxableIncome = Math.max(0, adjustedGrossIncome - standardDeduction);
  
  // Step 4: Calculate Income Tax
  const incomeTax = calculateIncomeTax(taxableIncome, inputs.taxpayerInfo.filingStatus);
  
  // Step 5: Calculate Credits
  const childTaxCredit = calculateChildTaxCredit(inputs.dependents, adjustedGrossIncome, inputs.taxpayerInfo.filingStatus);
  const earnedIncomeCredit = calculateEarnedIncomeCredit(inputs);
  
  // Step 6: Calculate Tax After Credits
  const taxAfterCredits = Math.max(0, incomeTax - childTaxCredit - earnedIncomeCredit);
  
  // Step 7: Calculate Total Tax Withheld
  const totalTaxWithheld = calculateTotalWithholding(inputs);
  
  // Step 8: Calculate Refund or Amount Due
  const refundOrAmountDue = totalTaxWithheld - taxAfterCredits;
  
  // Step 9: Calculate Tax Rates
  const effectiveTaxRate = getEffectiveTaxRate(incomeTax, taxableIncome);
  const marginalTaxRate = getMarginalTaxRate(taxableIncome, inputs.taxpayerInfo.filingStatus);
  
  return {
    adjustedGrossIncome,
    standardDeduction,
    taxableIncome,
    incomeTax: taxAfterCredits, // Tax after credits
    totalTaxWithheld,
    refundOrAmountDue,
    childTaxCredit,
    earnedIncomeCredit,
    effectiveTaxRate,
    marginalTaxRate
  };
}

/**
 * Calculates Adjusted Gross Income (AGI)
 * @param inputs - Tax return inputs
 * @returns The calculated AGI
 */
function calculateAGI(inputs: SimpleReturnInputs): number {
  let agi = 0;
  
  // Add wages from all W-2 forms
  agi += inputs.w2Forms.reduce((total, w2) => total + w2.wages, 0);
  
  // Add interest income
  if (inputs.interestIncome) {
    agi += inputs.interestIncome;
  }
  
  // Add unemployment compensation
  if (inputs.unemploymentCompensation) {
    agi += inputs.unemploymentCompensation;
  }
  
  // Subtract student loan interest deduction (above-the-line deduction)
  if (inputs.studentLoanInterestPaid) {
    // Student loan interest deduction is limited to $2,500 for 2024
    const maxStudentLoanDeduction = 2500;
    const studentLoanDeduction = Math.min(inputs.studentLoanInterestPaid, maxStudentLoanDeduction);
    agi -= studentLoanDeduction;
  }
  
  return Math.max(0, agi);
}

/**
 * Calculates total tax withheld from all sources
 * @param inputs - Tax return inputs
 * @returns The total tax withheld
 */
function calculateTotalWithholding(inputs: SimpleReturnInputs): number {
  let totalWithheld = 0;
  
  // Add federal tax withheld from all W-2 forms
  totalWithheld += inputs.w2Forms.reduce((total, w2) => total + w2.federalTaxWithheld, 0);
  
  // Add estimated tax payments
  if (inputs.estimatedTaxPayments) {
    totalWithheld += inputs.estimatedTaxPayments;
  }
  
  return totalWithheld;
}

/**
 * Basic Earned Income Credit calculation (simplified for MVP)
 * @param inputs - Tax return inputs
 * @returns The calculated EIC amount
 */
function calculateEarnedIncomeCredit(inputs: SimpleReturnInputs): number {
  // For MVP, return 0 - full EIC calculation is complex
  // In production, this would include income limits, number of children, etc.
  return 0;
}

/**
 * Validates tax return inputs for common errors
 * @param inputs - Tax return inputs to validate
 * @returns Array of validation error messages
 */
export function validateReturnInputs(inputs: SimpleReturnInputs): string[] {
  const errors: string[] = [];
  
  // Check required fields
  if (!inputs.taxpayerInfo) {
    errors.push('Taxpayer information is required');
  }
  
  if (!inputs.w2Forms || inputs.w2Forms.length === 0) {
    errors.push('At least one W-2 form is required');
  }
  
  // Validate W-2 forms
  inputs.w2Forms.forEach((w2, index) => {
    if (!w2.employerName) {
      errors.push(`W-2 #${index + 1}: Employer name is required`);
    }
    if (!w2.employerEIN) {
      errors.push(`W-2 #${index + 1}: Employer EIN is required`);
    }
    if (w2.wages < 0) {
      errors.push(`W-2 #${index + 1}: Wages cannot be negative`);
    }
    if (w2.federalTaxWithheld < 0) {
      errors.push(`W-2 #${index + 1}: Federal tax withheld cannot be negative`);
    }
  });
  
  // Validate dependent information
  inputs.dependents.forEach((dependent, index) => {
    if (!dependent.name) {
      errors.push(`Dependent #${index + 1}: Name is required`);
    }
    if (!dependent.ssn) {
      errors.push(`Dependent #${index + 1}: SSN is required`);
    }
    if (!dependent.birthDate) {
      errors.push(`Dependent #${index + 1}: Birth date is required`);
    }
  });
  
  // Validate income amounts
  if (inputs.interestIncome && inputs.interestIncome < 0) {
    errors.push('Interest income cannot be negative');
  }
  
  if (inputs.unemploymentCompensation && inputs.unemploymentCompensation < 0) {
    errors.push('Unemployment compensation cannot be negative');
  }
  
  if (inputs.studentLoanInterestPaid && inputs.studentLoanInterestPaid < 0) {
    errors.push('Student loan interest paid cannot be negative');
  }
  
  if (inputs.estimatedTaxPayments && inputs.estimatedTaxPayments < 0) {
    errors.push('Estimated tax payments cannot be negative');
  }
  
  return errors;
}

/**
 * Calculates the total earned income for EIC purposes
 * @param inputs - Tax return inputs
 * @returns The total earned income
 */
export function calculateEarnedIncome(inputs: SimpleReturnInputs): number {
  // Earned income includes wages, salaries, tips, and other employee compensation
  return inputs.w2Forms.reduce((total, w2) => total + w2.wages, 0);
}

/**
 * Determines if the taxpayer is eligible for certain credits based on AGI
 * @param agi - Adjusted Gross Income
 * @param filingStatus - Filing status
 * @returns Object indicating eligibility for various credits
 */
export function getCreditEligibility(agi: number, filingStatus: FilingStatus): {
  childTaxCreditEligible: boolean;
  earnedIncomeCreditEligible: boolean;
  studentLoanInterestEligible: boolean;
} {
  // 2024 AGI limits for various credits/deductions
  const childTaxCreditPhaseOut = filingStatus === FilingStatus.MARRIED_FILING_JOINTLY ? 400000 : 200000;
  const earnedIncomeCreditLimit = 63000; // Approximate limit for families with children
  const studentLoanInterestPhaseOut = filingStatus === FilingStatus.MARRIED_FILING_JOINTLY ? 185000 : 90000;
  
  return {
    childTaxCreditEligible: agi < childTaxCreditPhaseOut,
    earnedIncomeCreditEligible: agi < earnedIncomeCreditLimit,
    studentLoanInterestEligible: agi < studentLoanInterestPhaseOut
  };
} 