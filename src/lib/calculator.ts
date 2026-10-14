import {
  AppSettings,
  AtmPlanResult,
  AtmPlanStep,
  BundlePaymentResult,
  DepositRounding,
  MaxWithdrawalResult,
  QuickDepositResult,
  TargetWithdrawalResult,
  VirtualCardMode,
  VirtualCardResult,
} from '../types';
import { addMoney, fromPiastres, subtractMoney, toPiastres } from './money';

/**
 * Calculates withdrawal fee based on chosen mode and settings.
 */
export function calculateWithdrawalFee(
  withdrawalAmount: number,
  settings: Pick<
    AppSettings,
    'feeMode' | 'withdrawalFeePercent' | 'fixedFeePerThousand' | 'feeRoundingPolicy'
  >
): number {
  if (withdrawalAmount <= 0 || isNaN(withdrawalAmount)) {
    return 0;
  }

  if (settings.feeMode === 'percentage') {
    const feeRate = settings.withdrawalFeePercent / 100;
    const amountPiastres = toPiastres(withdrawalAmount);
    const feePiastres = Math.round(amountPiastres * feeRate);
    return fromPiastres(feePiastres);
  }

  // Fixed fee per 1,000 EGP mode
  const feeRatePerThousand = settings.fixedFeePerThousand;
  switch (settings.feeRoundingPolicy) {
    case 'proportional': {
      const amountPiastres = toPiastres(withdrawalAmount);
      const feePiastres = Math.round(amountPiastres * (feeRatePerThousand / 1000));
      return fromPiastres(feePiastres);
    }
    case 'ceil': {
      const units = Math.ceil(withdrawalAmount / 1000);
      return units * feeRatePerThousand;
    }
    case 'floor': {
      const units = Math.floor(withdrawalAmount / 1000);
      return units * feeRatePerThousand;
    }
    case 'nearest': {
      const units = Math.round(withdrawalAmount / 1000);
      return units * feeRatePerThousand;
    }
    default:
      return 0;
  }
}

/**
 * Feature A: Calculates the maximum whole-EGP amount that can be withdrawn
 * without exceeding the available balance after fees.
 */
export function calculateMaxWithdrawal(
  availableBalance: number,
  settings: AppSettings
): MaxWithdrawalResult {
  const normalizedBalance = fromPiastres(toPiastres(availableBalance));
  if (normalizedBalance <= 0 || isNaN(normalizedBalance)) {
    return {
      availableBalance: Math.max(0, normalizedBalance || 0),
      maxWithdrawal: 0,
      estimatedFee: 0,
      totalConsumed: 0,
      remainingBalance: Math.max(0, normalizedBalance || 0),
      isValid: true,
    };
  }

  const balancePiastres = toPiastres(normalizedBalance);

  // Initial whole-EGP estimate
  let initialEstimate = 0;
  if (settings.feeMode === 'percentage') {
    const feeRate = settings.withdrawalFeePercent / 100;
    initialEstimate = Math.floor(availableBalance / (1 + feeRate));
  } else if (settings.feeRoundingPolicy === 'proportional') {
    const feeRate = settings.fixedFeePerThousand / 1000;
    initialEstimate = Math.floor(availableBalance / (1 + feeRate));
  } else {
    initialEstimate = Math.floor(availableBalance);
  }

  let w = Math.max(0, initialEstimate);

  // Guard against overshooting balance
  while (w > 0) {
    const fee = calculateWithdrawalFee(w, settings);
    const totalPiastres = toPiastres(w) + toPiastres(fee);
    if (totalPiastres <= balancePiastres) {
      break;
    }
    w--;
  }

  // Guard against undershooting balance
  while (true) {
    const nextW = w + 1;
    const fee = calculateWithdrawalFee(nextW, settings);
    const totalPiastres = toPiastres(nextW) + toPiastres(fee);
    if (totalPiastres <= balancePiastres) {
      w = nextW;
    } else {
      break;
    }
  }

  const estimatedFee = calculateWithdrawalFee(w, settings);
  const totalConsumed = addMoney(w, estimatedFee);
  const remainingBalance = Math.max(0, subtractMoney(availableBalance, totalConsumed));

  return {
    availableBalance,
    maxWithdrawal: w,
    estimatedFee,
    totalConsumed,
    remainingBalance,
    isValid: true,
  };
}

/**
 * Feature B: Calculates total required balance and deposit deficit for a target withdrawal amount.
 */
export function calculateTargetWithdrawal(
  requestedWithdrawal: number,
  currentBalance: number,
  settings: AppSettings
): TargetWithdrawalResult {
  if (requestedWithdrawal <= 0 || isNaN(requestedWithdrawal)) {
    return {
      requestedWithdrawal: 0,
      estimatedFee: 0,
      totalRequired: 0,
      currentBalance: Math.max(0, currentBalance || 0),
      additionalDepositNeeded: 0,
      suggestedDepositWhole: 0,
      suggestedDepositTwoDecimals: 0,
      surplusBalance: Math.max(0, currentBalance || 0),
      isSufficient: true,
      isValid: false,
      errorMessage: 'Please enter a valid withdrawal amount greater than zero.',
    };
  }

  const estimatedFee = calculateWithdrawalFee(requestedWithdrawal, settings);
  const totalRequired = addMoney(requestedWithdrawal, estimatedFee);

  const reqPiastres = toPiastres(totalRequired);
  const balPiastres = toPiastres(currentBalance);

  const isSufficient = balPiastres >= reqPiastres;
  const deficitPiastres = Math.max(0, reqPiastres - balPiastres);
  const surplusPiastres = Math.max(0, balPiastres - reqPiastres);

  const additionalDepositNeeded = fromPiastres(deficitPiastres);
  const suggestedDepositWhole = Math.ceil(additionalDepositNeeded);
  const suggestedDepositTwoDecimals = additionalDepositNeeded;
  const surplusBalance = fromPiastres(surplusPiastres);

  return {
    requestedWithdrawal,
    estimatedFee,
    totalRequired,
    currentBalance,
    additionalDepositNeeded,
    suggestedDepositWhole,
    suggestedDepositTwoDecimals,
    surplusBalance,
    isSufficient,
    isValid: true,
  };
}

/**
 * Feature C: ATM Multi-Transaction Withdrawal Planner
 */
export function calculateAtmPlan(
  targetWithdrawal: number,
  currentBalance: number,
  atmLimit: number,
  settings: AppSettings
): AtmPlanResult {
  const effectiveAtmLimit = atmLimit > 0 ? atmLimit : 8000;
  const steps: AtmPlanStep[] = [];

  const disclaimer =
    'This plan assumes withdrawal fee is calculated per transaction based on configured fee rules. No extra ATM surcharge is assumed unless configured in settings.';

  if (targetWithdrawal <= 0 || isNaN(targetWithdrawal)) {
    return {
      targetWithdrawal: 0,
      atmLimit: effectiveAtmLimit,
      steps: [],
      totalWithdrawn: 0,
      totalFees: 0,
      totalCost: 0,
      startingBalance: currentBalance,
      remainingBalance: currentBalance,
      isFeasible: false,
      disclaimer,
      errorMessage: 'Please enter a valid target withdrawal amount.',
    };
  }

  let remainingTarget = targetWithdrawal;
  let runningBalance = currentBalance;
  let cumulativeWithdrawn = 0;
  let totalFees = 0;
  let stepNumber = 1;

  while (remainingTarget > 0) {
    const chunkAmount = Math.min(remainingTarget, effectiveAtmLimit);
    const fee = calculateWithdrawalFee(chunkAmount, settings);
    const totalCost = addMoney(chunkAmount, fee);

    cumulativeWithdrawn = addMoney(cumulativeWithdrawn, chunkAmount);
    remainingTarget = subtractMoney(remainingTarget, chunkAmount);
    runningBalance = subtractMoney(runningBalance, totalCost);
    totalFees = addMoney(totalFees, fee);

    steps.push({
      stepNumber,
      withdrawalAmount: chunkAmount,
      fee,
      totalCost,
      cumulativeWithdrawn,
      remainingTarget: Math.max(0, remainingTarget),
      remainingBalance: runningBalance,
    });

    stepNumber++;
  }

  const totalCost = addMoney(cumulativeWithdrawn, totalFees);
  const isFeasible = currentBalance >= totalCost;
  const maxFeasible = calculateMaxWithdrawal(currentBalance, settings).maxWithdrawal;

  return {
    targetWithdrawal,
    atmLimit: effectiveAtmLimit,
    steps,
    totalWithdrawn: cumulativeWithdrawn,
    totalFees,
    totalCost,
    startingBalance: currentBalance,
    remainingBalance: Math.max(0, subtractMoney(currentBalance, totalCost)),
    isFeasible,
    maxFeasibleWithdrawal: maxFeasible,
    disclaimer,
    errorMessage: isFeasible
      ? undefined
      : `Insufficient balance. Total required is ${totalCost.toFixed(2)} EGP, but your balance is ${currentBalance.toFixed(2)} EGP. Max feasible withdrawal is ${maxFeasible.toFixed(0)} EGP.`,
  };
}

/**
 * Feature D: Temporary Vodafone Cash Virtual Card Calculator
 */
export function calculateVirtualCard(
  cardAmount: number,
  currentBalance: number,
  cardIssuanceFee: number,
  additionalFees: number = 0,
  mode: VirtualCardMode = 'fee_separate'
): VirtualCardResult {
  const safeCardAmount = Math.max(0, cardAmount || 0);
  const safeIssuanceFee = Math.max(0, cardIssuanceFee || 0);
  const safeAdditionalFees = Math.max(0, additionalFees || 0);
  const totalExtraFees = addMoney(safeIssuanceFee, safeAdditionalFees);

  const disclaimer =
    'Vodafone Cash typically charges a 10 EGP fee per issued temporary virtual card. Verify current provider terms before issuing.';

  if (mode === 'fee_separate') {
    // Mode 1: Issuance fee charged separately from the card face value
    const totalRequired = addMoney(safeCardAmount, totalExtraFees);
    const remainingBalance = subtractMoney(currentBalance, totalRequired);
    const isSufficient = currentBalance >= totalRequired;
    const maxAffordableCard = Math.max(0, subtractMoney(currentBalance, totalExtraFees));

    return {
      requestedAmount: safeCardAmount,
      issuanceFee: safeIssuanceFee,
      additionalFees: safeAdditionalFees,
      totalRequired,
      currentBalance,
      remainingBalance,
      isSufficient,
      maxAffordableCard,
      mode,
      disclaimer,
    };
  } else {
    // Mode 2: User enters total amount they can afford, including issuance fees
    const maxAffordableCard = Math.max(0, subtractMoney(currentBalance, totalExtraFees));
    const totalRequired = safeCardAmount;
    const remainingBalance = subtractMoney(currentBalance, totalRequired);
    const isSufficient = currentBalance >= totalRequired;

    return {
      requestedAmount: safeCardAmount,
      issuanceFee: safeIssuanceFee,
      additionalFees: safeAdditionalFees,
      totalRequired,
      currentBalance,
      remainingBalance,
      isSufficient,
      maxAffordableCard,
      mode,
      disclaimer,
    };
  }
}

/**
 * Feature E: Internet Bundle Payment Calculator
 */
export function calculateInternetBundle(
  bundlePriceInput: number,
  bundleIncludesTax: boolean,
  taxRatePercent: number,
  currentBalance: number,
  cardIssuanceFee: number,
  additionalFees: number = 0,
  customCardAmount?: number
): BundlePaymentResult {
  const safePrice = Math.max(0, bundlePriceInput || 0);
  const safeTaxRate = Math.max(0, taxRatePercent || 0);
  const safeCardFee = Math.max(0, cardIssuanceFee || 0);
  const safeAdditionalFees = Math.max(0, additionalFees || 0);

  let finalBundleCost = safePrice;
  let taxAmount = 0;

  if (!bundleIncludesTax && safePrice > 0) {
    const taxPiastres = Math.round(toPiastres(safePrice) * (safeTaxRate / 100));
    taxAmount = fromPiastres(taxPiastres);
    finalBundleCost = addMoney(safePrice, taxAmount);
  }

  const effectiveCardAmount =
    customCardAmount !== undefined && customCardAmount > 0 ? customCardAmount : finalBundleCost;

  const totalRequired = addMoney(effectiveCardAmount, addMoney(safeCardFee, safeAdditionalFees));

  const remainingBalance = subtractMoney(currentBalance, totalRequired);
  const isSufficient = currentBalance >= totalRequired;
  const maxAffordablePurchase = Math.max(
    0,
    subtractMoney(currentBalance, addMoney(safeCardFee, safeAdditionalFees))
  );

  return {
    bundlePriceInput: safePrice,
    taxIncluded: bundleIncludesTax,
    taxRatePercent: safeTaxRate,
    taxAmount,
    finalBundleCost,
    cardAmount: effectiveCardAmount,
    issuanceFee: safeCardFee,
    additionalFees: safeAdditionalFees,
    totalRequired,
    currentBalance,
    remainingBalance,
    isSufficient,
    maxAffordablePurchase,
  };
}

/**
 * Feature F: Quick Deposit Calculator
 */
export function calculateQuickDeposit(
  targetWithdrawal: number,
  currentBalance: number,
  settings: AppSettings,
  roundingMode: DepositRounding
): QuickDepositResult {
  const fee = calculateWithdrawalFee(targetWithdrawal, settings);
  const totalRequired = addMoney(targetWithdrawal, fee);
  const reqPiastres = toPiastres(totalRequired);
  const balPiastres = toPiastres(currentBalance);

  const exactDeficitPiastres = Math.max(0, reqPiastres - balPiastres);
  const exactDeficit = fromPiastres(exactDeficitPiastres);

  let suggestedDeposit = exactDeficit;
  if (roundingMode === 'whole') {
    suggestedDeposit = Math.ceil(exactDeficit);
  } else if (roundingMode === 'two_decimals') {
    suggestedDeposit = exactDeficit;
  }

  const balanceAfter = subtractMoney(addMoney(currentBalance, suggestedDeposit), totalRequired);

  return {
    currentBalance,
    targetWithdrawal,
    estimatedFee: fee,
    totalRequired,
    exactDeficit,
    suggestedDeposit,
    balanceAfterOperation: balanceAfter,
    isSufficient: balPiastres >= reqPiastres,
  };
}
