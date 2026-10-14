import { describe, expect, it } from 'vitest';
import {
  calculateAtmPlan,
  calculateInternetBundle,
  calculateMaxWithdrawal,
  calculateQuickDeposit,
  calculateTargetWithdrawal,
  calculateVirtualCard,
  calculateWithdrawalFee,
} from '../src/lib/calculator';
import { AppSettings } from '../src/types';

const defaultSettings: AppSettings = {
  balance: 10000,
  withdrawalFeePercent: 1.0,
  fixedFeePerThousand: 10.0,
  feeMode: 'percentage',
  feeRoundingPolicy: 'proportional',
  cardIssuanceFee: 10.0,
  atmLimitPerTx: 8000.0,
  defaultBundlePrice: 296.4,
  bundleIncludesTax: true,
  defaultTaxRate: 14.0,
  depositRounding: 'whole',
  language: 'en',
  decimalPrecision: 2,
  theme: 'dark',
};

describe('Vodafone Cash Calculation Engine', () => {
  // Test 1: Maximum withdrawal
  // Balance: 10,107.08 EGP. Fee: 1%.
  // Expected: Withdrawal: 10,007 EGP. Fee: 100.07 EGP. Remaining balance: 0.01 EGP.
  it('Test 1: calculates maximum withdrawal correctly from 10,107.08 EGP at 1% fee', () => {
    const balance = 10107.08;
    const result = calculateMaxWithdrawal(balance, defaultSettings);

    expect(result.maxWithdrawal).toBe(10007);
    expect(result.estimatedFee).toBe(100.07);
    expect(result.totalConsumed).toBe(10107.07);
    expect(result.remainingBalance).toBe(0.01);
    expect(result.totalConsumed).toBeLessThanOrEqual(balance);
  });

  // Test 2: Target withdrawal
  // Balance: 9,581.08 EGP. Target: 9,500 EGP.
  // Expected: Required balance: 9,595 EGP. Deposit needed: 13.92 EGP. Suggested whole-pound deposit: 14 EGP.
  it('Test 2: calculates target withdrawal and deposit deficit correctly for 9,500 EGP target', () => {
    const balance = 9581.08;
    const target = 9500;
    const result = calculateTargetWithdrawal(target, balance, defaultSettings);

    expect(result.requestedWithdrawal).toBe(9500);
    expect(result.estimatedFee).toBe(95);
    expect(result.totalRequired).toBe(9595);
    expect(result.additionalDepositNeeded).toBe(13.92);
    expect(result.suggestedDepositWhole).toBe(14);
    expect(result.isSufficient).toBe(false);
  });

  // Test 3: ATM split
  // Balance: 10,107.08 EGP. Target: 10,007 EGP. ATM limit: 8,000 EGP.
  // Expected: First withdrawal: 8,000 EGP. Second withdrawal: 2,007 EGP.
  // Total fees: 100.07 EGP. Remaining balance: 0.01 EGP.
  it('Test 3: splits ATM withdrawal into transactions without exceeding limit', () => {
    const balance = 10107.08;
    const target = 10007;
    const atmLimit = 8000;
    const result = calculateAtmPlan(target, balance, atmLimit, defaultSettings);

    expect(result.steps.length).toBe(2);
    expect(result.steps[0].withdrawalAmount).toBe(8000);
    expect(result.steps[0].fee).toBe(80);
    expect(result.steps[0].totalCost).toBe(8080);

    expect(result.steps[1].withdrawalAmount).toBe(2007);
    expect(result.steps[1].fee).toBe(20.07);
    expect(result.steps[1].totalCost).toBe(2027.07);

    expect(result.totalWithdrawn).toBe(10007);
    expect(result.totalFees).toBe(100.07);
    expect(result.totalCost).toBe(10107.07);
    expect(result.remainingBalance).toBe(0.01);
    expect(result.isFeasible).toBe(true);
  });

  // Test 4: Virtual card and internet bundle
  // Balance: 321.89 EGP. Bundle price including tax: 296.40 EGP. Issuance fee: 10 EGP.
  // Expected: Total required balance: 306.40 EGP. Remaining balance: 15.49 EGP.
  it('Test 4: calculates internet bundle payment with virtual card issuance fee', () => {
    const balance = 321.89;
    const bundlePrice = 296.4;
    const issuanceFee = 10;
    const result = calculateInternetBundle(bundlePrice, true, 14, balance, issuanceFee);

    expect(result.finalBundleCost).toBe(296.4);
    expect(result.issuanceFee).toBe(10);
    expect(result.totalRequired).toBe(306.4);
    expect(result.remainingBalance).toBe(15.49);
    expect(result.isSufficient).toBe(true);
  });

  // Test 5: Maximum withdrawal from a smaller balance
  // Balance: 2,984.08 EGP. Fee: 1%.
  // Expected: Maximum whole-pound withdrawal: 2,954 EGP. Fee: 29.54 EGP. Remaining balance: 0.54 EGP.
  it('Test 5: calculates maximum whole-pound withdrawal from 2,984.08 EGP', () => {
    const balance = 2984.08;
    const result = calculateMaxWithdrawal(balance, defaultSettings);

    expect(result.maxWithdrawal).toBe(2954);
    expect(result.estimatedFee).toBe(29.54);
    expect(result.totalConsumed).toBe(2983.54);
    expect(result.remainingBalance).toBe(0.54);
    expect(result.totalConsumed).toBeLessThanOrEqual(balance);
  });

  // Test 6: Deposit required
  // Balance: 7,315.60 EGP. Target: 7,300 EGP. Fee: 1%.
  // Expected: Required balance: 7,373 EGP. Exact deposit deficit: 57.40 EGP. Suggested deposit: 58 EGP.
  it('Test 6: calculates deposit deficit and rounded suggestion for 7,300 EGP withdrawal', () => {
    const balance = 7315.6;
    const target = 7300;
    const result = calculateQuickDeposit(target, balance, defaultSettings, 'whole');

    expect(result.targetWithdrawal).toBe(7300);
    expect(result.estimatedFee).toBe(73);
    expect(result.totalRequired).toBe(7373);
    expect(result.exactDeficit).toBe(57.4);
    expect(result.suggestedDeposit).toBe(58);
    expect(result.balanceAfterOperation).toBe(0.6);
  });

  // Test 7: ATM transaction limit validation
  // Balance: 10,107.08 EGP. Target: 10,007 EGP. ATM limit: 8,000 EGP.
  // Verify that no individual transaction exceeds 8,000 EGP and total fees and remaining balance match Test 3.
  it('Test 7: validates that no individual transaction exceeds ATM limit', () => {
    const balance = 10107.08;
    const target = 10007;
    const atmLimit = 8000;
    const result = calculateAtmPlan(target, balance, atmLimit, defaultSettings);

    for (const step of result.steps) {
      expect(step.withdrawalAmount).toBeLessThanOrEqual(atmLimit);
    }
    expect(result.totalFees).toBe(100.07);
    expect(result.remainingBalance).toBe(0.01);
  });

  // Additional Edge Cases
  it('handles zero balance properly in max withdrawal', () => {
    const result = calculateMaxWithdrawal(0, defaultSettings);
    expect(result.maxWithdrawal).toBe(0);
    expect(result.estimatedFee).toBe(0);
    expect(result.totalConsumed).toBe(0);
    expect(result.remainingBalance).toBe(0);
  });

  it('never allows total consumed to exceed available balance', () => {
    for (let raw = 1; raw < 20000; raw += 137.49) {
      const amount = parseFloat(raw.toFixed(2));
      const result = calculateMaxWithdrawal(amount, defaultSettings);
      expect(result.totalConsumed).toBeLessThanOrEqual(amount);
    }
  });

  it('handles fixed fee per 1,000 EGP in ceil and floor modes', () => {
    const settingsCeil: AppSettings = {
      ...defaultSettings,
      feeMode: 'fixed_per_thousand',
      fixedFeePerThousand: 10,
      feeRoundingPolicy: 'ceil',
    };
    // 1500 EGP -> 2 units of 1000 -> 20 EGP fee
    expect(calculateWithdrawalFee(1500, settingsCeil)).toBe(20);

    const settingsFloor: AppSettings = {
      ...defaultSettings,
      feeMode: 'fixed_per_thousand',
      fixedFeePerThousand: 10,
      feeRoundingPolicy: 'floor',
    };
    // 1500 EGP -> 1 unit of 1000 -> 10 EGP fee
    expect(calculateWithdrawalFee(1500, settingsFloor)).toBe(10);
  });

  it('calculates virtual card Mode 1 (fee separate) and Mode 2 (budget deduct)', () => {
    const balance = 500;
    const cardAmount = 400;
    const fee = 10;

    // Mode 1: fee added to card amount
    const mode1 = calculateVirtualCard(cardAmount, balance, fee, 0, 'fee_separate');
    expect(mode1.totalRequired).toBe(410);
    expect(mode1.remainingBalance).toBe(90);
    expect(mode1.isSufficient).toBe(true);
    expect(mode1.maxAffordableCard).toBe(490);

    // Mode 2: budget deduct
    const mode2 = calculateVirtualCard(cardAmount, balance, fee, 0, 'budget_deduct');
    expect(mode2.totalRequired).toBe(400);
    expect(mode2.maxAffordableCard).toBe(490);
  });

  it('calculates internet bundle with tax applied separately', () => {
    const balance = 500;
    const bundlePrice = 100;
    const taxRate = 14;
    const cardFee = 10;
    const result = calculateInternetBundle(bundlePrice, false, taxRate, balance, cardFee);

    expect(result.taxAmount).toBe(14);
    expect(result.finalBundleCost).toBe(114);
    expect(result.totalRequired).toBe(124);
    expect(result.remainingBalance).toBe(376);
  });
});
