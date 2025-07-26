export interface Expense {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string;
}

export interface BudgetData {
  monthlyLimit: number;
  expenses: Expense[];
}

const STORAGE_KEY = 'budgetTrackerData';

export const categories = [
  'Food',
  'Travel',
  'Entertainment',
  'Shopping',
  'Bills',
  'Healthcare',
  'Other'
];

export const getBudgetData = (): BudgetData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Clean old expenses (>30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentExpenses = data.expenses.filter((expense: Expense) => 
        new Date(expense.date) >= thirtyDaysAgo
      );
      
      const cleanedData = { ...data, expenses: recentExpenses };
      saveBudgetData(cleanedData);
      return cleanedData;
    }
  } catch (error) {
    console.error('Error reading budget data:', error);
  }
  
  return {
    monthlyLimit: 5000,
    expenses: []
  };
};

export const saveBudgetData = (data: BudgetData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving budget data:', error);
  }
};

export const addExpense = (expense: Omit<Expense, 'id'>): void => {
  const data = getBudgetData();
  const newExpense: Expense = {
    ...expense,
    id: Date.now().toString()
  };
  
  data.expenses.push(newExpense);
  saveBudgetData(data);
};

export const updateBudgetLimit = (limit: number): void => {
  const data = getBudgetData();
  data.monthlyLimit = limit;
  saveBudgetData(data);
};

export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getTotalSpent = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const getSpentByCategory = (expenses: Expense[]) => {
  return expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
};