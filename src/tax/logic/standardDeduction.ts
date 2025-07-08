import { 
  FilingStatus, 
  TaxpayerInfo, 
  STANDARD_DEDUCTION_2024, 
  ADDITIONAL_STANDARD_DEDUCTION_2024 
} from '../types';

/**
 * Calculates the standard deduction for a taxpayer based on 2024 IRS rules
 * @param taxpayerInfo - Information about the taxpayer including filing status, age, and blindness
 * @returns The total standard deduction amount
 */
export function calculateStandardDeduction(taxpayerInfo: TaxpayerInfo): number {
  const { filingStatus, age, spouseAge, isBlind, isSpouseBlind, canBeClaimedAsDependent } = taxpayerInfo;
  
  // If taxpayer can be claimed as dependent, use dependent standard deduction rules
  if (canBeClaimedAsDependent) {
    return calculateDependentStandardDeduction(taxpayerInfo);
  }
  
  // Base standard deduction for filing status
  let standardDeduction = STANDARD_DEDUCTION_2024[filingStatus];
  
  // Additional deductions for age (65 or older)
  if (isMarriedFiling(filingStatus)) {
    // Married filing jointly or separately
    if (age >= 65) {
      standardDeduction += ADDITIONAL_STANDARD_DEDUCTION_2024.AGE_65_OR_OLDER_MARRIED;
    }
    if (spouseAge && spouseAge >= 65 && filingStatus === FilingStatus.MARRIED_FILING_JOINTLY) {
      standardDeduction += ADDITIONAL_STANDARD_DEDUCTION_2024.AGE_65_OR_OLDER_MARRIED;
    }
  } else {
    // Single, head of household, or qualifying widow
    if (age >= 65) {
      standardDeduction += ADDITIONAL_STANDARD_DEDUCTION_2024.AGE_65_OR_OLDER;
    }
  }
  
  // Additional deductions for blindness
  if (isMarriedFiling(filingStatus)) {
    if (isBlind) {
      standardDeduction += ADDITIONAL_STANDARD_DEDUCTION_2024.BLIND_MARRIED;
    }
    if (isSpouseBlind && filingStatus === FilingStatus.MARRIED_FILING_JOINTLY) {
      standardDeduction += ADDITIONAL_STANDARD_DEDUCTION_2024.BLIND_MARRIED;
    }
  } else {
    if (isBlind) {
      standardDeduction += ADDITIONAL_STANDARD_DEDUCTION_2024.BLIND;
    }
  }
  
  return standardDeduction;
}

/**
 * Calculates standard deduction for dependents (special rules apply)
 * @param taxpayerInfo - Information about the dependent taxpayer
 * @returns The standard deduction amount for a dependent
 */
function calculateDependentStandardDeduction(taxpayerInfo: TaxpayerInfo): number {
  // For dependents, the standard deduction is limited
  // The greater of:
  // 1. $1,300 (for 2024)
  // 2. Earned income + $400 (but not more than the regular standard deduction)
  
  const minimumDependentDeduction = 1300; // 2024 amount
  
  // Note: For this MVP, we're assuming earned income equals wages from W-2s
  // In a full implementation, this would need to be calculated from all income sources
  // For now, return the minimum dependent deduction
  return minimumDependentDeduction;
}

/**
 * Helper function to determine if filing status is married
 * @param filingStatus - The filing status to check
 * @returns true if married filing jointly or separately
 */
function isMarriedFiling(filingStatus: FilingStatus): boolean {
  return filingStatus === FilingStatus.MARRIED_FILING_JOINTLY || 
         filingStatus === FilingStatus.MARRIED_FILING_SEPARATELY;
}

/**
 * Gets the base standard deduction amount for a given filing status
 * @param filingStatus - The filing status
 * @returns The base standard deduction amount
 */
export function getBaseStandardDeduction(filingStatus: FilingStatus): number {
  return STANDARD_DEDUCTION_2024[filingStatus];
}

/**
 * Calculates additional standard deduction amounts for age and blindness
 * @param taxpayerInfo - Information about the taxpayer
 * @returns Object with breakdown of additional deductions
 */
export function getAdditionalStandardDeductions(taxpayerInfo: TaxpayerInfo): {
  ageDeduction: number;
  blindnessDeduction: number;
  total: number;
} {
  const { filingStatus, age, spouseAge, isBlind, isSpouseBlind } = taxpayerInfo;
  let ageDeduction = 0;
  let blindnessDeduction = 0;
  
  const isMarried = isMarriedFiling(filingStatus);
  const ageAmount = isMarried ? ADDITIONAL_STANDARD_DEDUCTION_2024.AGE_65_OR_OLDER_MARRIED : ADDITIONAL_STANDARD_DEDUCTION_2024.AGE_65_OR_OLDER;
  const blindAmount = isMarried ? ADDITIONAL_STANDARD_DEDUCTION_2024.BLIND_MARRIED : ADDITIONAL_STANDARD_DEDUCTION_2024.BLIND;
  
  // Age deductions
  if (age >= 65) {
    ageDeduction += ageAmount;
  }
  if (spouseAge && spouseAge >= 65 && filingStatus === FilingStatus.MARRIED_FILING_JOINTLY) {
    ageDeduction += ageAmount;
  }
  
  // Blindness deductions
  if (isBlind) {
    blindnessDeduction += blindAmount;
  }
  if (isSpouseBlind && filingStatus === FilingStatus.MARRIED_FILING_JOINTLY) {
    blindnessDeduction += blindAmount;
  }
  
  return {
    ageDeduction,
    blindnessDeduction,
    total: ageDeduction + blindnessDeduction
  };
} 