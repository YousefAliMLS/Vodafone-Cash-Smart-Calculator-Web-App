# Vodafone Cash Smart Calculator Web App

A production-quality, responsive personal financial calculator and Progressive Web Application (PWA) specifically designed for Vodafone Cash wallet users in Egypt. Calculate cash withdrawals, transaction fees, multi-transaction ATM withdrawal plans, temporary virtual credit cards (VCN), and internet bundle renewals with decimal-safe integer piastre precision.

All calculations execute entirely offline directly in your browser. No financial data, credentials, PINs, or sensitive information are ever transmitted to external servers.

---

## Key Features

1. **Maximum Withdrawal Calculator (Feature A)**
   - Computes the maximum whole-EGP amount that can be withdrawn from your current wallet balance without exceeding funds after fees.
   - Eliminates guessing when standing at an ATM or branch.
   - Shows withdrawal amount, exact estimated fee, total balance consumed, and remaining balance down to the exact piastre.

2. **Target Withdrawal and Deposit Deficit Calculator (Feature B & Feature F)**
   - Enter desired cash amount to instantly calculate total required balance.
   - Calculates exact deposit deficit if wallet balance is insufficient.
   - Provides convenient whole-pound rounded deposit recommendations guaranteed to cover the deficit.

3. **ATM Multi-Transaction Withdrawal Planner (Feature C)**
   - Solves the problem of ATM per-transaction withdrawal limits (default 8,000 EGP).
   - Generates an ordered transaction plan with per-transaction fee breakdown, cumulative amounts, and leftover balance.
   - Validates that no single transaction exceeds ATM hardware limits and suggests the maximum feasible withdrawal if balance is exceeded.

4. **Temporary Virtual Card (VCN) Calculator (Feature D)**
   - Supports Vodafone Cash 24-to-48 hour temporary online cards.
   - Provides two explicit accounting modes:
     - Mode 1: Issuance fee charged separately from the card face value.
     - Mode 2: Budget deduction mode where total available funds cover both card face value and issuance fees.
   - Prevents double-counting fees and calculates maximum affordable card value.

5. **Internet Bundle Payment Calculator (Feature E)**
   - Calculates exact costs for renewing home ADSL/VDSL or mobile internet packages.
   - Interactive toggle for "Bundle price already includes tax" vs "Calculate tax separately" (e.g. 14% VAT).
   - Calculates total required wallet balance including virtual card issuance fee.

6. **Local Transaction History (Feature G)**
   - Manual transaction log for deposits, withdrawals, fees, virtual cards, bundle payments, and manual adjustments.
   - Confirmation dialog before recording any calculation.
   - Full control to edit notes, delete records, or clear history.
   - Complete JSON backup export and validated JSON import.

7. **Configurable Settings and Tariff Assumptions (Feature H)**
   - Percentage-based fee mode (default 1%).
   - Fixed fee per 1,000 EGP mode with configurable rounding policies (proportional, ceil, floor, nearest).
   - Configurable ATM transaction limits and virtual card issuance fees.
   - "Restore Defaults" option with confirmation dialog.

8. **Bilingual English and Arabic (RTL) Support**
   - Seamless language toggle between English and Arabic.
   - Complete right-to-left (RTL) layout switching for Arabic.
   - Proper Egyptian Pound formatting (`EGP` and `ج.م`).

9. **Installable Progressive Web App (PWA)**
   - Full offline functionality after the initial load.
   - Installable on iOS (Add to Home Screen) and Android devices.
   - Standalone app display with cached assets and service worker.

---

## Application Screenshots

> Note: Screenshots below represent the responsive layout across desktop and mobile devices.

```
+-----------------------------------------------------------------------+
|  VF  Vodafone Cash Smart Calculator              [Online] [العربية]   |
+-----------------------------------------------------------------------+
|  [Dashboard] [Withdrawals] [ATM Planner] [Virtual Card] [Settings]    |
+-----------------------------------------------------------------------+
|  CURRENT WALLET BALANCE: 10,107.08 EGP             [ Update Balance ]  |
+-----------------------------------------------------------------------+
|  MAXIMUM WITHDRAWABLE CASH NOW: 10,007 EGP                            |
|  Estimated Fee: 100.07 EGP | Consumed: 10,107.07 EGP | Left: 0.01 EGP |
+-----------------------------------------------------------------------+
|  QUICK FINANCIAL TOOLS                                                |
|  [Max Withdrawal]  [Target Cash Goal]  [ATM Split Plan]               |
|  [Virtual Card]    [Internet Bundle]   [Deposit Deficit]              |
+-----------------------------------------------------------------------+
```

---

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS with custom Vodafone red color palette
- **Icons**: Lucide React (strictly professional icons, zero emojis)
- **Offline / PWA**: `vite-plugin-pwa` with Workbox caching
- **Testing**: Vitest 3
- **Code Quality**: ESLint 9, Prettier 3, TypeScript strict mode

---

## Application Architecture

```
Vodafone-Cash-Smart-Calculator-Web-App/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   ├── workflows/
│   │   ├── ci.yml                 # Automated build, lint, typecheck, and unit tests
│   │   └── deploy.yml             # Automated GitHub Pages static deployment
│   ├── dependabot.yml             # Automated dependency security updates
│   └── PULL_REQUEST_TEMPLATE.md
├── public/
│   ├── favicon.svg                # Application vector favicon
│   ├── apple-touch-icon.png       # iOS home screen icon
│   └── icons/
│       ├── icon-192x192.png       # PWA standard icon
│       └── icon-512x512.png       # PWA high resolution icon
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── BalanceBanner.tsx  # Prominent balance banner and quick editor
│   │   │   ├── CopyButton.tsx     # Copy-to-clipboard button
│   │   │   ├── RecordModal.tsx    # Transaction recording confirmation modal
│   │   │   └── ResultCard.tsx     # Reusable metric display card
│   │   ├── layout/
│   │   │   ├── Footer.tsx         # Disclaimer and repository links
│   │   │   ├── Header.tsx         # Navigation header, language, and status
│   │   │   └── Navigation.tsx     # Responsive tab navigation bar
│   │   └── tabs/
│   │       ├── ATMPlannerTab.tsx      # Feature C: ATM Multi-Transaction Planner
│   │       ├── DashboardTab.tsx       # Feature 3: Main Dashboard
│   │       ├── HistoryTab.tsx         # Feature G: Local Transaction History
│   │       ├── InternetBundleTab.tsx  # Feature E: Internet Bundle Calculator
│   │       ├── QuickDepositTab.tsx    # Feature F: Quick Deposit Deficit
│   │       ├── SettingsTab.tsx        # Feature H: Settings & Tariff Preferences
│   │       ├── VirtualCardTab.tsx     # Feature D: Temporary Virtual Card
│   │       └── WithdrawalTab.tsx      # Features A & B: Max & Target Withdrawals
│   ├── context/
│   │   └── AppContext.tsx         # Central reactive state and storage synchronization
│   ├── i18n/
│   │   └── translations.ts        # English and Arabic bilingual dictionaries
│   ├── lib/
│   │   ├── calculator.ts          # Pure financial calculation engine
│   │   ├── money.ts               # Decimal-safe integer piastre arithmetic
│   │   └── storage.ts             # LocalStorage manager with JSON import/export
│   ├── types/
│   │   └── index.ts               # Core TypeScript interfaces and domain types
│   ├── App.tsx                    # Main application router and shell
│   ├── index.css                  # Global styles and Tailwind directives
│   └── main.tsx                   # React root mount point
├── tests/
│   └── calculator.test.ts         # Automated unit tests for all 7 specification cases
├── .editorconfig                  # Uniform formatting configuration
├── .gitignore                     # Git ignore rules
├── .prettierrc                    # Code formatting configuration
├── eslint.config.js               # ESLint configuration
├── index.html                     # HTML5 shell with PWA manifest headers
├── LICENSE                        # MIT License
├── package.json                   # Scripts, dependencies, and project metadata
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.js             # Tailwind CSS configuration
├── tsconfig.json                  # TypeScript compiler options
└── vite.config.ts                 # Vite bundler, PWA, and Vitest configuration
```

---

## Financial Calculation Formulas and Precision

All monetary arithmetic is conducted internally in integer piastres (1 EGP = 100 piastres):

- **Maximum Whole-EGP Withdrawal**:
  Let $B$ be the available balance in piastres and $r$ be the fee rate.
  $$\text{Withdrawal} = \left\lfloor \frac{B}{100 \times (1 + r)} \right\rfloor$$
  The integer result is validated by ensuring that:
  $$\text{Withdrawal} + \text{Fee}(\text{Withdrawal}) \le B$$

- **Target Withdrawal Required Balance**:
  $$\text{Required Balance} = \text{Target} + \text{Fee}(\text{Target})$$

- **Deposit Deficit**:
  $$\text{Deficit} = \max(0, \text{Required Balance} - \text{Current Balance})$$

- **Suggested Deposit (Rounded)**:
  $$\text{Suggested Deposit} = \lceil \text{Deficit} \rceil$$

---

## Required Test Cases Verification

All calculations have been tested and verified through automated unit tests against the examples in the prompt:

| Test Case                          | Inputs                                                                | Expected Output                                                         | Vitest Status |
| :--------------------------------- | :-------------------------------------------------------------------- | :---------------------------------------------------------------------- | :------------ |
| **Test 1: Max Withdrawal**         | Balance: 10,107.08 EGP, Fee: 1%                                       | Withdrawal: 10,007 EGP, Fee: 100.07 EGP, Left: 0.01 EGP                 | Passed        |
| **Test 2: Target Withdrawal**      | Balance: 9,581.08 EGP, Target: 9,500 EGP                              | Required: 9,595 EGP, Deficit: 13.92 EGP, Suggested: 14 EGP              | Passed        |
| **Test 3: ATM Split**              | Balance: 10,107.08 EGP, Target: 10,007 EGP, Limit: 8,000 EGP          | Tx 1: 8,000 EGP, Tx 2: 2,007 EGP, Total Fee: 100.07 EGP, Left: 0.01 EGP | Passed        |
| **Test 4: Virtual Card & Bundle**  | Balance: 321.89 EGP, Bundle: 296.40 EGP (tax incl.), Card Fee: 10 EGP | Required: 306.40 EGP, Remaining: 15.49 EGP                              | Passed        |
| **Test 5: Smaller Max Withdrawal** | Balance: 2,984.08 EGP, Fee: 1%                                        | Withdrawal: 2,954 EGP, Fee: 29.54 EGP, Left: 0.54 EGP                   | Passed        |
| **Test 6: Quick Deposit Deficit**  | Balance: 7,315.60 EGP, Target: 7,300 EGP, Fee: 1%                     | Required: 7,373 EGP, Deficit: 57.40 EGP, Suggested: 58 EGP              | Passed        |
| **Test 7: ATM Limit Enforcement**  | Balance: 10,107.08 EGP, Target: 10,007 EGP, Limit: 8,000 EGP          | No transaction exceeds 8,000 EGP, results match Test 3                  | Passed        |

---

## Prerequisites

- **Node.js**: Version 20 LTS or Version 22 LTS
- **Package Manager**: npm 10 or later
- Modern web browser (Chrome, Safari, Edge, or Firefox)

---

## Installation and Development

1. Clone the repository:

   ```bash
   git clone https://github.com/YousefAliMLS/Vodafone-Cash-Smart-Calculator-Web-App.git
   cd Vodafone-Cash-Smart-Calculator-Web-App
   ```

2. Install dependencies:

   ```bash
   npm ci
   ```

3. Start local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## Testing and Quality Verification

Run the full automated test suite:

```bash
npm run test
```

Run test watcher during development:

```bash
npm run test:watch
```

Run TypeScript compilation check:

```bash
npm run typecheck
```

Run ESLint analysis:

```bash
npm run lint
```

Run Prettier formatting validation:

```bash
npm run format:check
```

Format all codebase files:

```bash
npm run format
```

---

## Production Build and Preview

Generate production build in the `dist/` directory:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Deployment Instructions

### Automated GitHub Pages Deployment (Recommended)

This repository includes a preconfigured GitHub Actions deployment workflow at `.github/workflows/deploy.yml`.

To deploy to GitHub Pages:

1. Open the repository on GitHub: `https://github.com/YousefAliMLS/Vodafone-Cash-Smart-Calculator-Web-App`
2. Go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Push your changes to the `main` branch. The deployment workflow will automatically run, build the static application, and publish it to GitHub Pages.

### Manual Static Hosting

The build output in `dist/` is a static web application. It can be hosted on any static host such as Cloudflare Pages, Vercel, Netlify, or AWS S3 without any server or database requirement.

---

## Privacy and Data Storage

- **100% Local Storage**: All settings, preferences, balances, and transaction history are stored strictly in the client browser using `localStorage`.
- **Zero External API Calls**: The application makes no network calls to external financial services or analytics.
- **No Credentials Requested**: The application never requests Vodafone Cash passwords, PINs, OTP codes, national IDs, or credit card numbers.
- **Export and Import**: Users can export their complete data to an offline JSON file for backup and re-import it anytime.

---

## Progressive Web App (PWA) Offline Usage

To install the app on an iPhone or iPad:

1. Open the website in Safari.
2. Tap the **Share** button.
3. Scroll down and tap **Add to Home Screen**.
4. The calculator will launch as a standalone app and function with zero internet connectivity.

To install on Android:

1. Open the website in Chrome.
2. Tap the three-dot menu and select **Install app** or **Add to Home Screen**.

---

## Known Limitations

- Vodafone Cash tariffs, promotional fee waivers, and ATM limits are set by Vodafone Egypt and the Central Bank of Egypt. The application provides default assumptions (1% withdrawal fee, 10 EGP card issuance fee, 8,000 EGP ATM limit) that must be configured in Settings if official provider tariffs change.
- The transaction history is purely a manual personal ledger. It does not connect to or read real Vodafone Cash accounts.

---

## Contributing

Contributions are welcome. Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines, code formatting rules, and development instructions.

---

## License

This project is licensed under the [MIT License](LICENSE).
