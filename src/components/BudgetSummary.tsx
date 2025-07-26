import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BudgetSummaryProps {
  monthlyBudget: number;
  totalSpent: number;
  remaining: number;
  className?: string;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({
  monthlyBudget,
  totalSpent,
  remaining,
  className
}) => {
  const spentPercentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;
  const isOverBudget = totalSpent > monthlyBudget;
  
  return (
    <Card className={cn("p-6 shadow-card-budget", className)}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-center mb-4">Monthly Budget</h2>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              ₹{monthlyBudget.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Budget</div>
          </div>
          
          <div>
            <div className={cn(
              "text-2xl font-bold",
              isOverBudget ? "text-expense-red" : "text-foreground"
            )}>
              ₹{totalSpent.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Spent</div>
          </div>
          
          <div>
            <div className={cn(
              "text-2xl font-bold",
              isOverBudget ? "text-expense-red" : "text-savings-green"
            )}>
              ₹{remaining.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              {isOverBudget ? "Over Budget" : "Remaining"}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Spent</span>
            <span>{spentPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-1000 rounded-full",
                isOverBudget
                  ? "bg-expense-red animate-pulse"
                  : spentPercentage > 80
                  ? "bg-yellow-500"
                  : "bg-gradient-savings"
              )}
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            />
          </div>
        </div>
        
        {isOverBudget && (
          <div className="text-center text-sm text-expense-red bg-expense-red/10 py-2 px-4 rounded-md">
            ⚠️ You've exceeded your monthly budget by ₹{Math.abs(remaining).toLocaleString()}
          </div>
        )}
      </div>
    </Card>
  );
};

export default BudgetSummary;