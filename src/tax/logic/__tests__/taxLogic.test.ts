import { FilingStatus, TaxpayerInfo, SimpleReturnInputs, Dependent } from '../../types';
import { calculateStandardDeduction } from '../standardDeduction';
import { calculateIncomeTax, getMarginalTaxRate, getEffectiveTaxRate } from '../taxBrackets';
import { calculateSimpleReturn, validateReturnInputs } from '../simpleReturn';
import { calculateChildTaxCredit } from '../credits';

describe('Tax Logic Tests', () => {
  
  describe('Standard Deduction Calculations', () => {
    test('should calculate base standard deduction for single filer', () => {
      const taxpayerInfo: TaxpayerInfo = {
        filingStatus: FilingStatus.SINGLE,
        age: 35,
        isBlind: false,
        canBeClaimedAsDependent: false
      };
      
      const deduction = calculateStandardDeduction(taxpayerInfo);
      expect(deduction).toBe(14600);
    });
    
    test('should calculate standard deduction for married filing jointly', () => {
      const taxpayerInfo: TaxpayerInfo = {
        filingStatus: FilingStatus.MARRIED_FILING_JOINTLY,
        age: 40,
        spouseAge: 38,
        isBlind: false,
        isSpouseBlind: false,
        canBeClaimedAsDependent: false
      };
      
      const deduction = calculateStandardDeduction(taxpayerInfo);
      expect(deduction).toBe(29200);
    });
    
    test('should add additional deduction for age 65+', () => {
      const taxpayerInfo: TaxpayerInfo = {
        filingStatus: FilingStatus.SINGLE,
        age: 67,
        isBlind: false,
        canBeClaimedAsDependent: false
      };
      
      const deduction = calculateStandardDeduction(taxpayerInfo);
      expect(deduction).toBe(14600 + 1550); // Base + age additional
    });
  });
  
  describe('Tax Bracket Calculations', () => {
    test('should calculate tax for income in 10% bracket (single)', () => {
      const tax = calculateIncomeTax(10000, FilingStatus.SINGLE);
      expect(tax).toBe(1000); // 10% of 10,000
    });
    
    test('should calculate tax across multiple brackets (single)', () => {
      const tax = calculateIncomeTax(50000, FilingStatus.SINGLE);
      // 10% on first 11,000 = 1,100
      // 12% on next 33,725 (44,725 - 11,000) = 4,047
      // 22% on remaining 5,275 (50,000 - 44,725) = 1,160.50
      // Total = 6,307.50, rounded = 6,308
      expect(tax).toBe(6308);
    });
    
    test('should calculate marginal tax rate correctly', () => {
      const rate = getMarginalTaxRate(50000, FilingStatus.SINGLE);
      expect(rate).toBe(0.22); // 22% bracket
    });
  });
  
  describe('Child Tax Credit Calculations', () => {
    test('should calculate CTC for one qualifying child', () => {
      const dependents: Dependent[] = [{
        name: 'Child One',
        ssn: '123-45-6789',
        relationship: 'Son',
        birthDate: new Date('2015-01-01'), // 9 years old
        isQualifyingChild: true,
        isDisabled: false
      }];
      
      const credit = calculateChildTaxCredit(dependents, 75000, FilingStatus.SINGLE);
      expect(credit).toBe(2000);
    });
  });
  
  describe('Simple Return Integration Tests', () => {
    test('should calculate complete tax return for single filer with one W-2', () => {
      const inputs: SimpleReturnInputs = {
        taxpayerInfo: {
          filingStatus: FilingStatus.SINGLE,
          age: 30,
          isBlind: false,
          canBeClaimedAsDependent: false
        },
        w2Forms: [{
          employerName: 'Test Company',
          employerEIN: '12-3456789',
          wages: 60000,
          federalTaxWithheld: 8000
        }],
        dependents: [],
        interestIncome: 500,
        estimatedTaxPayments: 1000
      };
      
      const result = calculateSimpleReturn(inputs);
      
      expect(result.adjustedGrossIncome).toBe(60500); // Wages + interest
      expect(result.standardDeduction).toBe(14600);
      expect(result.taxableIncome).toBe(45900); // AGI - standard deduction
      expect(result.totalTaxWithheld).toBe(9000); // W-2 withholding + estimated payments
      expect(result.incomeTax).toBeGreaterThan(0);
      expect(result.refundOrAmountDue).toBeDefined();
    });
  });
  
  describe('Input Validation Tests', () => {
    test('should validate required fields', () => {
      const invalidInputs = {
        taxpayerInfo: null,
        w2Forms: [],
        dependents: []
      } as any;
      
      const errors = validateReturnInputs(invalidInputs);
      expect(errors).toContain('Taxpayer information is required');
      expect(errors).toContain('At least one W-2 form is required');
    });
  });
}); 