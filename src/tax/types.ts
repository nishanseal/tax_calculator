// Core tax-related types for the Federal Tax Calculator

export enum FilingStatus {
  SINGLE = 'single',
  MARRIED_FILING_JOINTLY = 'married_filing_jointly',
  MARRIED_FILING_SEPARATELY = 'married_filing_separately',
  HEAD_OF_HOUSEHOLD = 'head_of_household',
  QUALIFYING_WIDOW = 'qualifying_widow'
}

export interface TaxpayerInfo {
  filingStatus: FilingStatus;
  age: number;
  spouseAge?: number; // For married filing jointly
  isBlind: boolean;
  isSpouseBlind?: boolean; // For married filing jointly
  canBeClaimedAsDependent: boolean;
}

export interface Dependent {
  name: string;
  ssn: string;
  relationship: string;
  birthDate: Date;
  isQualifyingChild: boolean;
  isDisabled: boolean;
}

export interface W2Info {
  employerName: string;
  employerEIN: string;
  wages: number; // Box 1
  federalTaxWithheld: number; // Box 2
  socialSecurityWages?: number; // Box 3
  socialSecurityTaxWithheld?: number; // Box 4
  medicareWages?: number; // Box 5
  medicareTaxWithheld?: number; // Box 6
}

export interface SimpleReturnInputs {
  taxpayerInfo: TaxpayerInfo;
  w2Forms: W2Info[];
  dependents: Dependent[];
  interestIncome?: number;
  unemploymentCompensation?: number;
  studentLoanInterestPaid?: number;
  estimatedTaxPayments?: number;
}

export interface TaxCalculationResults {
  adjustedGrossIncome: number;
  standardDeduction: number;
  taxableIncome: number;
  incomeTax: number;
  totalTaxWithheld: number;
  refundOrAmountDue: number;
  childTaxCredit: number;
  earnedIncomeCredit: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
}

export interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

// 2024 Tax Year Constants
export const TAX_YEAR = 2024;

export const STANDARD_DEDUCTION_2024 = {
  [FilingStatus.SINGLE]: 14600,
  [FilingStatus.MARRIED_FILING_JOINTLY]: 29200,
  [FilingStatus.MARRIED_FILING_SEPARATELY]: 14600,
  [FilingStatus.HEAD_OF_HOUSEHOLD]: 21900,
  [FilingStatus.QUALIFYING_WIDOW]: 29200
} as const;

export const ADDITIONAL_STANDARD_DEDUCTION_2024 = {
  AGE_65_OR_OLDER: 1550, // Single, Head of Household
  AGE_65_OR_OLDER_MARRIED: 1300, // Married filing jointly/separately
  BLIND: 1550, // Single, Head of Household  
  BLIND_MARRIED: 1300 // Married filing jointly/separately
} as const; 