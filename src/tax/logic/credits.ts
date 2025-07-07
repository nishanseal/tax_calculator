import { Dependent, FilingStatus } from '../types';

/**
 * Calculates the Child Tax Credit for 2024
 * @param dependents - Array of dependents
 * @param agi - Adjusted Gross Income
 * @param filingStatus - Filing status
 * @returns The Child Tax Credit amount
 */
export function calculateChildTaxCredit(
  dependents: Dependent[], 
  agi: number, 
  filingStatus: FilingStatus
): number {
  // 2024 Child Tax Credit amounts
  const maxCreditPerChild = 2000;
  const maxCreditForOtherDependents = 500;
  
  // AGI phase-out thresholds for 2024
  const phaseOutThreshold = getChildTaxCreditPhaseOutThreshold(filingStatus);
  const phaseOutRate = 0.05; // $50 for every $1,000 over threshold
  
  let totalCredit = 0;
  
  // Calculate credit for each dependent
  dependents.forEach(dependent => {
    if (isQualifyingChildForCTC(dependent)) {
      totalCredit += maxCreditPerChild;
    } else {
      // Other dependents get $500 credit
      totalCredit += maxCreditForOtherDependents;
    }
  });
  
  // Apply AGI phase-out
  if (agi > phaseOutThreshold) {
    const excessIncome = agi - phaseOutThreshold;
    const phaseOutAmount = Math.floor(excessIncome / 1000) * 50; // $50 per $1,000
    totalCredit = Math.max(0, totalCredit - phaseOutAmount);
  }
  
  return totalCredit;
}

/**
 * Determines if a dependent qualifies for the full Child Tax Credit
 * @param dependent - The dependent to check
 * @returns true if the dependent qualifies for CTC
 */
function isQualifyingChildForCTC(dependent: Dependent): boolean {
  // For MVP, simplified logic based on age
  const currentYear = new Date().getFullYear();
  const childAge = currentYear - dependent.birthDate.getFullYear();
  
  // Must be under 17 at end of tax year to qualify for full CTC
  return childAge < 17 && dependent.isQualifyingChild;
}

/**
 * Gets the AGI phase-out threshold for Child Tax Credit based on filing status
 * @param filingStatus - The filing status
 * @returns The phase-out threshold amount
 */
function getChildTaxCreditPhaseOutThreshold(filingStatus: FilingStatus): number {
  // 2024 phase-out thresholds
  switch (filingStatus) {
    case FilingStatus.MARRIED_FILING_JOINTLY:
    case FilingStatus.QUALIFYING_WIDOW:
      return 400000;
    case FilingStatus.SINGLE:
    case FilingStatus.HEAD_OF_HOUSEHOLD:
    case FilingStatus.MARRIED_FILING_SEPARATELY:
      return 200000;
    default:
      return 200000;
  }
}

/**
 * Calculates the Earned Income Credit (simplified version for MVP)
 * @param earnedIncome - Total earned income
 * @param agi - Adjusted Gross Income
 * @param filingStatus - Filing status
 * @param numberOfChildren - Number of qualifying children
 * @returns The EIC amount
 */
export function calculateEarnedIncomeCredit(
  earnedIncome: number,
  agi: number,
  filingStatus: FilingStatus,
  numberOfChildren: number
): number {
  // For MVP, return 0 - EIC calculation is very complex
  // In production, this would involve multiple income ranges,
  // different rates based on number of children, etc.
  
  // Basic eligibility check
  const maxAGILimits = getEICMaxAGI(filingStatus, numberOfChildren);
  
  if (agi > maxAGILimits || earnedIncome === 0) {
    return 0;
  }
  
  // Simplified calculation - in reality this involves complex tables
  // For now, return a basic amount for demonstration
  if (numberOfChildren > 0) {
    return Math.min(1000 * numberOfChildren, 2000); // Placeholder
  }
  
  return 0;
}

/**
 * Gets maximum AGI limits for EIC eligibility
 * @param filingStatus - Filing status
 * @param numberOfChildren - Number of qualifying children
 * @returns Maximum AGI for EIC eligibility
 */
function getEICMaxAGI(filingStatus: FilingStatus, numberOfChildren: number): number {
  // 2024 approximate EIC AGI limits (simplified)
  const isMarried = filingStatus === FilingStatus.MARRIED_FILING_JOINTLY;
  const marriedBonus = isMarried ? 6000 : 0;
  
  if (numberOfChildren === 0) {
    return 18650 + marriedBonus;
  } else if (numberOfChildren === 1) {
    return 46560 + marriedBonus;
  } else if (numberOfChildren === 2) {
    return 52918 + marriedBonus;
  } else {
    return 56838 + marriedBonus;
  }
}

/**
 * Calculates the Credit for Other Dependents
 * @param dependents - Array of dependents
 * @param agi - Adjusted Gross Income
 * @param filingStatus - Filing status
 * @returns The Credit for Other Dependents amount
 */
export function calculateCreditForOtherDependents(
  dependents: Dependent[],
  agi: number,
  filingStatus: FilingStatus
): number {
  const creditPerDependent = 500; // 2024 amount
  const phaseOutThreshold = getChildTaxCreditPhaseOutThreshold(filingStatus);
  
  // Count dependents who don't qualify for CTC but qualify for this credit
  let qualifyingDependents = 0;
  
  dependents.forEach(dependent => {
    if (!isQualifyingChildForCTC(dependent)) {
      qualifyingDependents++;
    }
  });
  
  let totalCredit = qualifyingDependents * creditPerDependent;
  
  // Apply same phase-out as Child Tax Credit
  if (agi > phaseOutThreshold) {
    const excessIncome = agi - phaseOutThreshold;
    const phaseOutAmount = Math.floor(excessIncome / 1000) * 50;
    totalCredit = Math.max(0, totalCredit - phaseOutAmount);
  }
  
  return totalCredit;
}

/**
 * Gets the number of qualifying children for various credits
 * @param dependents - Array of dependents
 * @returns Number of qualifying children
 */
export function getNumberOfQualifyingChildren(dependents: Dependent[]): number {
  return dependents.filter(dependent => 
    isQualifyingChildForCTC(dependent)
  ).length;
} 