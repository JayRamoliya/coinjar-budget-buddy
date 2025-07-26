import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBudgetData, getSpentByCategory, categories, type Expense } from '@/lib/budgetStorage';
import { ArrowLeft, Calendar, Tag, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

const History: React.FC = () => {
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  const budgetData = getBudgetData();
  const { expenses } = budgetData;
  
  // Filter expenses
  const filteredExpenses = useMemo(() => {
    if (filterCategory === 'all') return expenses;
    return expenses.filter(expense => expense.category === filterCategory);
  }, [expenses, filterCategory]);
  
  // Sort by date (newest first)
  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filteredExpenses]);
  
  // Category totals
  const categoryTotals = useMemo(() => 
    getSpentByCategory(expenses), [expenses]
  );
  
  const totalFiltered = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/')}
            className="hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Expense History</h1>
          </div>
        </div>

        {/* Filter and Stats */}
        <Card className="p-4 shadow-card-budget">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-semibold">
                ₹{totalFiltered.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </Card>

        {/* Category Summary */}
        {filterCategory === 'all' && Object.keys(categoryTotals).length > 0 && (
          <Card className="p-4 shadow-card-budget">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">Spending by Category</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(categoryTotals)
                .sort(([,a], [,b]) => b - a)
                .map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center p-2 bg-secondary/50 rounded">
                    <span className="text-sm">{category}</span>
                    <span className="font-medium">₹{amount.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </Card>
        )}

        {/* Expenses List */}
        <div className="space-y-3">
          {sortedExpenses.length === 0 ? (
            <Card className="p-8 text-center shadow-card-budget">
              <div className="text-muted-foreground">
                {filterCategory === 'all' 
                  ? "No expenses recorded yet. Start tracking your spending!"
                  : `No expenses found for ${filterCategory}.`
                }
              </div>
              <Button 
                variant="coin" 
                onClick={() => navigate('/add-expense')}
                className="mt-4"
              >
                Add First Expense
              </Button>
            </Card>
          ) : (
            sortedExpenses.map((expense) => (
              <Card key={expense.id} className="p-4 shadow-card-budget hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-lg">₹{expense.amount.toLocaleString()}</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {expense.category}
                      </span>
                    </div>
                    
                    {expense.note && (
                      <p className="text-sm text-muted-foreground mb-2">{expense.note}</p>
                    )}
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(expense.date)}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Back to Home Button */}
        <div className="flex justify-center pt-4">
          <Button variant="jar" onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default History;