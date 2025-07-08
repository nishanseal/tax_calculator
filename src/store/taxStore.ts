import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FilingStatus, TaxpayerInfo, W2Info, Dependent, TaxCalculationResults } from '../tax/types';
import { calculateSimpleReturn } from '../tax/logic/simpleReturn';

interface TaxReturnStore {
  // Personal Information
  taxpayerInfo: TaxpayerInfo;
  spouseName?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Income
  w2Forms: W2Info[];
  interestIncome?: number;
  unemploymentCompensation?: number;
  studentLoanInterestPaid?: number;
  estimatedTaxPayments?: number;
  
  // Dependents
  dependents: Dependent[];
  
  // Calculated Results
  calculationResults?: TaxCalculationResults;
  
  // Actions
  updateTaxpayerInfo: (info: Partial<TaxpayerInfo>) => void;
  updateAddress: (address: Partial<TaxReturnStore['address']>) => void;
  addW2Form: (w2: W2Info) => void;
  updateW2Form: (index: number, w2: Partial<W2Info>) => void;
  removeW2Form: (index: number) => void;
  updateIncome: (field: 'interestIncome' | 'unemploymentCompensation' | 'studentLoanInterestPaid' | 'estimatedTaxPayments', value: number) => void;
  addDependent: (dependent: Dependent) => void;
  updateDependent: (index: number, dependent: Partial<Dependent>) => void;
  removeDependent: (index: number) => void;
  calculateReturn: () => void;
  resetReturn: () => void;
  setSpouseName: (name: string) => void;
}

const initialTaxpayerInfo: TaxpayerInfo = {
  filingStatus: FilingStatus.SINGLE,
  age: 30,
  isBlind: false,
  canBeClaimedAsDependent: false,
};

const initialAddress = {
  street: '',
  city: '',
  state: '',
  zipCode: '',
};

export const useTaxStore = create<TaxReturnStore>()(
  persist(
    (set, get) => ({
      // Initial state
      taxpayerInfo: initialTaxpayerInfo,
      address: initialAddress,
      w2Forms: [],
      dependents: [],
      
      // Actions
      updateTaxpayerInfo: (info) => {
        set((state) => ({
          taxpayerInfo: { ...state.taxpayerInfo, ...info }
        }));
        // Auto-calculate when taxpayer info changes
        setTimeout(() => get().calculateReturn(), 0);
      },
      
      updateAddress: (address) => {
        set((state) => ({
          address: { ...state.address, ...address }
        }));
      },
      
      setSpouseName: (name) => {
        set({ spouseName: name });
      },
      
      addW2Form: (w2) => {
        set((state) => ({
          w2Forms: [...state.w2Forms, w2]
        }));
        setTimeout(() => get().calculateReturn(), 0);
      },
      
      updateW2Form: (index, w2) => {
        set((state) => ({
          w2Forms: state.w2Forms.map((form, i) => 
            i === index ? { ...form, ...w2 } : form
          )
        }));
        setTimeout(() => get().calculateReturn(), 0);
      },
      
      removeW2Form: (index) => {
        set((state) => ({
          w2Forms: state.w2Forms.filter((_, i) => i !== index)
        }));
        setTimeout(() => get().calculateReturn(), 0);
      },
      
      updateIncome: (field, value) => {
        set({ [field]: value });
        setTimeout(() => get().calculateReturn(), 0);
      },
      
      addDependent: (dependent) => {
        set((state) => ({
          dependents: [...state.dependents, dependent]
        }));
        setTimeout(() => get().calculateReturn(), 0);
      },
      
      updateDependent: (index, dependent) => {
        set((state) => ({
          dependents: state.dependents.map((dep, i) => 
            i === index ? { ...dep, ...dependent } : dep
          )
        }));
        setTimeout(() => get().calculateReturn(), 0);
      },
      
      removeDependent: (index) => {
        set((state) => ({
          dependents: state.dependents.filter((_, i) => i !== index)
        }));
        setTimeout(() => get().calculateReturn(), 0);
      },
      
      calculateReturn: () => {
        const state = get();
        
        // Only calculate if we have minimum required data
        if (state.w2Forms.length === 0) {
          set({ calculationResults: undefined });
          return;
        }
        
        try {
          const inputs = {
            taxpayerInfo: state.taxpayerInfo,
            w2Forms: state.w2Forms,
            dependents: state.dependents,
            interestIncome: state.interestIncome,
            unemploymentCompensation: state.unemploymentCompensation,
            studentLoanInterestPaid: state.studentLoanInterestPaid,
            estimatedTaxPayments: state.estimatedTaxPayments,
          };
          
          const results = calculateSimpleReturn(inputs);
          set({ calculationResults: results });
        } catch (error) {
          console.error('Error calculating return:', error);
          set({ calculationResults: undefined });
        }
      },
      
      resetReturn: () => {
        set({
          taxpayerInfo: initialTaxpayerInfo,
          address: initialAddress,
          w2Forms: [],
          dependents: [],
          interestIncome: undefined,
          unemploymentCompensation: undefined,
          studentLoanInterestPaid: undefined,
          estimatedTaxPayments: undefined,
          calculationResults: undefined,
          spouseName: undefined,
        });
      },
    }),
    {
      name: 'tax-return-storage', // localStorage key
      // Only persist form data, not calculated results
      partialize: (state) => ({
        taxpayerInfo: state.taxpayerInfo,
        address: state.address,
        w2Forms: state.w2Forms,
        dependents: state.dependents,
        interestIncome: state.interestIncome,
        unemploymentCompensation: state.unemploymentCompensation,
        studentLoanInterestPaid: state.studentLoanInterestPaid,
        estimatedTaxPayments: state.estimatedTaxPayments,
        spouseName: state.spouseName,
      }),
    }
  )
); 