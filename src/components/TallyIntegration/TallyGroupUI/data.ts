export interface TallyItem {
  name: string;
  type: 'group' | 'ledger';
  children?: TallyItem[];
  italic?: boolean; // Tally uses italics for some masters
}

export const groupData: TallyItem[] = [
  { name: 'Branch / Divisions', type: 'group' },
  { 
    name: 'Capital Account', 
    type: 'group',
    children: [
      { name: 'Reserves & Surplus', type: 'group', italic: true }
    ]
  },
  { 
    name: 'Current Assets', 
    type: 'group',
    children: [
      { name: 'Bank Accounts', type: 'group' },
      { name: 'Cash-in-Hand', type: 'group' },
      { name: 'Deposits (Asset)', type: 'group' },
      { name: 'Loans & Advances (Asset)', type: 'group' },
      { name: 'Stock-in-Hand', type: 'group' },
      { name: 'Sundry Debtors', type: 'group' },
    ]
  },
  { 
    name: 'Current Liabilities', 
    type: 'group',
    children: [
      { name: 'Duties & Taxes', type: 'group' },
      { name: 'Provisions', type: 'group' },
      { name: 'Sundry Creditors', type: 'group' },
    ]
  },
  { name: 'Direct Expenses', type: 'group' },
  { name: 'Direct Incomes', type: 'group' },
  { name: 'Fixed Assets', type: 'group' },
  { name: 'Indirect Expenses', type: 'group' },
  { name: 'Indirect Incomes', type: 'group' },
  { name: 'Investments', type: 'group' },
  { 
    name: 'Loans (Liability)', 
    type: 'group',
    children: [
      { name: 'Bank OD A/c', type: 'group' },
      { name: 'Secured Loans', type: 'group' },
      { name: 'Unsecured Loans', type: 'group' },
    ]
  },
  { name: 'Misc. Expenses (ASSET)', type: 'group' },
  { name: 'Purchase Accounts', type: 'group' },
  { name: 'Sales Accounts', type: 'group' },
  { name: 'Suspense A/c', type: 'group', italic: true },
];
