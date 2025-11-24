# Trip Expense Splitter

A local-first web application for splitting trip expenses fairly among participants. This is a Tricount replacement that runs entirely in your browser with no accounts needed.

## Features

- **Trip Management**: Create multiple trips to organize expenses by event (weekend trips, gifts, group dinners, etc.)
- **Participant Management**: Add and manage participants for each trip
- **Flexible Expense Splitting**: Three distribution methods for expenses:
  - **Equal Split**: Automatically divide expenses equally among selected participants
  - **Custom Amounts**: Specify exact amounts (€) for each participant
  - **Percentage Split**: Assign percentages to each participant (must total 100%)
- **Smart Settlement Calculation**: Automatically calculates the optimal reimbursement plan
- **Local Storage**: All data is stored locally in your browser - no server, no accounts, no tracking
- **Participant Selection**: Use checkboxes to include/exclude specific people from individual expenses

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository or download the source code
2. Navigate to the project directory:
   ```bash
   cd trip-expense-splitter
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### Development Mode

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

#### Production Build

```bash
npm run build
```

This creates an optimized build in the `dist` folder.

#### Preview Production Build

```bash
npm run preview
```

### Opening the App

After running `npm run dev`, open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`).

## How to Use

### 1. Create a Trip

- Click "New Trip" on the home screen
- Enter a name (e.g., "Weekend in Paris", "Birthday Gift for Sarah")
- Optionally add a description
- Click "Create Trip"

### 2. Add Participants

- In the "Participants" tab, enter names of people involved
- Add all participants before creating expenses
- You can remove participants who haven't been involved in any expenses yet

### 3. Add Expenses

- Switch to the "Expenses" tab
- Click "Add Expense"
- Fill in the expense details:
  - **Description**: What was purchased (e.g., "Restaurant dinner", "Hotel booking")
  - **Total Amount**: The total cost in euros
  - **Date**: When the expense occurred
  - **Paid by**: Who paid for this expense
  - **Distribution Method**: Choose how to split the cost
  - **Participants**: Check/uncheck people who should share this expense

#### Distribution Methods

1. **Equal Split**: The amount is automatically divided equally among checked participants
2. **Custom Amount (€)**: Enter specific euro amounts for each checked participant
   - The sum must equal the total amount
   - A validation indicator shows if amounts match
3. **Percentage (%)**: Enter percentage values for each checked participant
   - The percentages must sum to 100%
   - A validation indicator shows if percentages are correct

### 4. View Settlements

- Switch to the "Settlements" tab
- See "Suggested Reimbursements" showing who owes whom and how much
- View "Individual Balances" to see each person's net position:
  - Positive (green): Gets money back
  - Negative (red): Owes money
  - Zero: All settled

## Data Storage

All your data is stored locally in your browser using `localStorage`. This means:
- ✅ Your data stays on your device
- ✅ No internet connection needed after initial load
- ✅ Complete privacy - no data is sent to any server
- ⚠️ Clearing browser data will delete your trips
- ⚠️ Data doesn't sync across devices or browsers

## Technology Stack

- **React**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server
- **CSS3**: Styling with modern features

## Project Structure

```
src/
├── components/          # React components
│   ├── TripList.tsx    # Trip list and creation
│   ├── TripDetails.tsx # Main trip view with tabs
│   ├── ParticipantManager.tsx  # Participant management
│   ├── ExpenseList.tsx # Expense list view
│   ├── ExpenseForm.tsx # Expense creation form
│   └── SettlementView.tsx # Settlement calculations display
├── utils/
│   └── calculations.ts # Settlement calculation algorithms
├── types.ts           # TypeScript type definitions
├── storage.ts         # LocalStorage wrapper
├── App.tsx           # Main app component
└── main.tsx          # App entry point
```

## License

This project is provided as-is for personal use.

## Contributing

This is a personal project, but feel free to fork and modify it for your own needs.
