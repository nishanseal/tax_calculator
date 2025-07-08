# Federal Tax Calculator 🧮

An open-source personal federal tax calculator with a focus on user experience and accuracy. Built as an alternative to traditional tax software with a continuous, auto-saving interface that mirrors the actual IRS Form 1040.

## 🎯 Project Vision

Create a **better UX for tax preparation** by eliminating the annoying "click next after entering 1 thing" pattern common in tax software. Instead, provide a single continuous page that:

- **Auto-saves progress** as you fill out information
- **Mirrors Form 1040 layout** for familiarity and accuracy
- **Shows live calculations** with a persistent summary sidebar
- **Generates downloadable 1040 PDF** for mailing to the IRS
- **Stores your information securely** for future years

## 🚀 Current Status: Full MVP Complete & Running!

✅ **Complete React UI** with Form 1040 layout  
✅ **Live tax calculations** with real-time updates  
✅ **Local data persistence** (privacy-first, no servers)  
✅ **Core tax logic implemented** with 2024 IRS compliance  
✅ **Comprehensive test suite** (10 tests passing)  
✅ **TypeScript architecture** for type safety  
✅ **Responsive design** for desktop and mobile  

### Features Implemented
- **Form 1040 Interface** - Clean, professional layout matching IRS forms
- **Auto-save Progress** - Data persists locally in browser
- **Live Calculation Sidebar** - See refund/amount due as you type
- **Standard Deduction** calculation with age/blindness adjustments
- **Progressive Tax Brackets** for all filing statuses
- **Child Tax Credit** with AGI phase-out
- **W-2 Form Management** - Add/edit multiple W-2s
- **Dependent Management** - Track children and other dependents
- **Input Validation** and error handling
- **Complete Tax Return** calculation (AGI → taxable income → tax → credits → refund)

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React + TypeScript + Material UI
- **State Management:** Zustand with localStorage persistence
- **Data Storage:** Browser localStorage only (privacy-first approach)
- **Tax Logic:** Custom TypeScript modules (ported concepts from IRS Direct File)
- **Testing:** Jest
- **Forms:** React Hook Form
- **PDF Generation:** pdf-lib
- **Deployment:** Static site hosting (Vercel/Netlify)

### Project Structure
```
src/
├── tax/
│   ├── types.ts                    # TypeScript interfaces
│   └── logic/
│       ├── standardDeduction.ts    # 2024 IRS standard deduction rules
│       ├── taxBrackets.ts          # Progressive tax calculation
│       ├── credits.ts              # Child Tax Credit & others
│       ├── simpleReturn.ts         # Main calculation engine
│       └── __tests__/              # Jest test suite
└── components/                     # React UI (coming next)
```

## 🎯 MVP Scope (2024 Tax Year)

**In Scope:**
- Form 1040 with standard deduction (no itemizing)
- Filing statuses: Single, MFJ, MFS, Head of Household, Qualifying Widow
- Income: W-2 wages, interest, unemployment compensation
- Deductions: Standard deduction, student loan interest
- Credits: Child Tax Credit, Credit for Other Dependents
- Basic taxpayer info: name, address, dependents, W-2 employers

**Out of Scope (for MVP):**
- Itemized deductions
- State tax returns
- Advanced schedules (C, D, E, etc.)
- Multiple income sources beyond basic W-2/1099

## 🧪 Tax Logic Validation

Our tax calculations are tested against realistic scenarios:

```bash
npm test src/tax/logic/__tests__/taxLogic.test.ts
```

**Test Coverage:**
- Standard deduction calculations for all filing statuses
- Tax bracket calculations across income ranges
- Child Tax Credit with AGI phase-out
- Complete return integration testing
- Input validation and error handling

## 🔄 Development Workflow

### Phase 1: Core Tax Logic ✅
- [x] TypeScript types and interfaces
- [x] Standard deduction calculation
- [x] Tax bracket implementation  
- [x] Child Tax Credit logic
- [x] Complete return calculation engine
- [x] Comprehensive test suite

### Phase 2: React UI ✅
- [x] Form 1040 layout components
- [x] Auto-save functionality with localStorage
- [x] Live calculation sidebar
- [x] Input validation UI
- [x] Responsive design
- [x] Material UI theme integration

### Next Phase: Enhanced Features 🚧
- [ ] PDF generation for Form 1040
- [ ] Additional income sources (1099-INT, etc.)
- [ ] Import W-2 from image/PDF
- [ ] Tax year comparison
- [ ] Enhanced validation and error messages

### Future Considerations:
- [ ] Multi-state tax support
- [ ] Additional tax forms and schedules
- [ ] Professional tax preparer features
- [ ] Audit support tools

## 🤝 Contributing

This project extracts and reimplements **tax logic concepts** from the [IRS Direct File repository](https://github.com/IRS-Public/direct-file) while building a completely different user experience and architecture.

**Key Principles:**
- Focus on **UX over features** - better experience beats more forms
- **Security first** - handle sensitive tax data responsibly  
- **Accuracy paramount** - tax calculations must be IRS-compliant
- **Open source** - transparent, auditable, community-driven

## 📋 Getting Started

```bash
# Install dependencies
npm install

# Run tests
npm test

# Start development server
npm start

# Build for production
npm run build
```

## 🔐 Security & Privacy

**Privacy-First Architecture:**
- **No server-side data storage** - your tax information never leaves your device
- **Local storage only** - data persists in your browser's localStorage
- **Zero data collection** - no analytics, tracking, or data harvesting
- **No account required** - use immediately without signup

**Security Features:**
- HTTPS everywhere in production
- Input sanitization and validation  
- No secrets or API keys in frontend code
- Open source for full transparency and auditability

**Data Control:**
- You own your data completely
- Export/backup your information anytime
- Clear data when you're done
- No vendor lock-in

## 📄 License

Open source - helping people navigate taxes shouldn't be proprietary.

## 🙋‍♂️ Why Build This?

Tax software UX is frustrating. Every year, millions of people deal with:
- Step-by-step wizards that make simple tasks tedious
- Expensive software for basic returns
- Lack of transparency in calculations
- Poor mobile experiences

This project aims to prove that tax software can be:
- **Fast and intuitive** with a continuous form interface
- **Transparent** with open-source calculations
- **Free** for basic returns
- **Accurate** with IRS-compliant logic

---

*Built with ❤️ for better tax season experiences*
