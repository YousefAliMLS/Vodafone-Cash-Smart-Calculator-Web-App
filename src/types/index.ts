export type Language = 'en' | 'ar';

export type ThemeMode = 'dark' | 'light';

export type FeeMode = 'percentage' | 'fixed_per_thousand';

export type RoundingPolicy = 'proportional' | 'ceil' | 'floor' | 'nearest';

export type DepositRounding = 'exact' | 'two_decimals' | 'whole';

export type VirtualCardMode = 'fee_separate' | 'budget_deduct';

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'fee'
  | 'card_issuance'
  | 'card_payment'
  | 'bundle_payment'
  | 'adjustment';

export type TabType =
  | 'dashboard'
  | 'withdrawals'
  | 'atm_planner'
  | 'virtual_card'
  | 'internet_bundle'
  | 'quick_deposit'
  | 'history'
  | 'settings';

export interface AppSettings {
  balance: number;
  withdrawalFeePercent: number;
  fixedFeePerThousand: number;
  feeMode: FeeMode;
  feeRoundingPolicy: RoundingPolicy;
  cardIssuanceFee: number;
  atmLimitPerTx: number;
  defaultBundlePrice: number;
  bundleIncludesTax: boolean;
  defaultTaxRate: number;
  depositRounding: DepositRounding;
  language: Language;
  decimalPrecision: number;
  theme: ThemeMode;
}

export interface HistoryRecord {
  id: string;
  timestamp: string;
  type: TransactionType;
  amount: number;
  fee: number;
  balanceImpact: number;
  balanceBefore: number;
  balanceAfter: number;
  note: string;
}

export interface MaxWithdrawalResult {
  availableBalance: number;
  maxWithdrawal: number;
  estimatedFee: number;
  totalConsumed: number;
  remainingBalance: number;
  isValid: boolean;
  errorMessage?: string;
}

export interface TargetWithdrawalResult {
  requestedWithdrawal: number;
  estimatedFee: number;
  totalRequired: number;
  currentBalance: number;
  additionalDepositNeeded: number;
  suggestedDepositWhole: number;
  suggestedDepositTwoDecimals: number;
  surplusBalance: number;
  isSufficient: boolean;
  isValid: boolean;
  errorMessage?: string;
}

export interface AtmPlanStep {
  stepNumber: number;
  withdrawalAmount: number;
  fee: number;
  totalCost: number;
  cumulativeWithdrawn: number;
  remainingTarget: number;
  remainingBalance: number;
}

export interface AtmPlanResult {
  targetWithdrawal: number;
  atmLimit: number;
  steps: AtmPlanStep[];
  totalWithdrawn: number;
  totalFees: number;
  totalCost: number;
  startingBalance: number;
  remainingBalance: number;
  isFeasible: boolean;
  maxFeasibleWithdrawal?: number;
  disclaimer: string;
  errorMessage?: string;
}

export interface VirtualCardResult {
  requestedAmount: number;
  issuanceFee: number;
  additionalFees: number;
  totalRequired: number;
  currentBalance: number;
  remainingBalance: number;
  isSufficient: boolean;
  maxAffordableCard: number;
  mode: VirtualCardMode;
  disclaimer: string;
}

export interface BundlePaymentResult {
  bundlePriceInput: number;
  taxIncluded: boolean;
  taxRatePercent: number;
  taxAmount: number;
  finalBundleCost: number;
  cardAmount: number;
  issuanceFee: number;
  additionalFees: number;
  totalRequired: number;
  currentBalance: number;
  remainingBalance: number;
  isSufficient: boolean;
  maxAffordablePurchase: number;
}

export interface QuickDepositResult {
  currentBalance: number;
  targetWithdrawal: number;
  estimatedFee: number;
  totalRequired: number;
  exactDeficit: number;
  suggestedDeposit: number;
  balanceAfterOperation: number;
  isSufficient: boolean;
}

export interface LastCalculationSummary {
  title: string;
  primaryValue: string;
  details: string;
  timestamp: string;
}
