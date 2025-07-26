import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CoinJar from '@/components/CoinJar';
import BudgetSummary from '@/components/BudgetSummary';
import { getBudgetData, getTotalSpent } from '@/lib/budgetStorage';
import { Plus, History, Settings, Sparkles } from 'lucide-react';

const motivationalTips = [
  "💡 Every coin saved is a step towards your financial freedom!",
  "🎯 Track small expenses - they add up to big savings!",
  "🌟 Great job tracking your spending! Keep it up!",
  "💪 Building good money habits one expense at a time!",
  "🚀 Your future self will thank you for this discipline!",
  "🏆 Consistency in tracking leads to financial success!",
  "💎 Your mindful spending is an investment in yourself!"
];

const Index = () => {
  const navigate = useNavigate();
  const [budgetData, setBudgetData] = useState(getBudgetData());
  const [currentTip, setCurrentTip] = useState(0);

  // Refresh data when component mounts
  useEffect(() => {
    setBudgetData(getBudgetData());
  }, []);

  // Rotate motivational tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % motivationalTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalSpent = getTotalSpent(budgetData.expenses);
  const remaining = budgetData.monthlyLimit - totalSpent;
  const isOverBudget = remaining < 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="text-center pt-8 pb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-coin rounded-full flex items-center justify-center shadow-coin">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CoinJar Buddy
            </h1>
          </div>
          <p className="text-muted-foreground">Track your spending, watch your savings grow!</p>
        </div>

        {/* Budget Summary */}
        <BudgetSummary
          monthlyBudget={budgetData.monthlyLimit}
          totalSpent={totalSpent}
          remaining={remaining}
        />

        {/* Coin Jar Visualization */}
        <Card className="p-6 shadow-jar">
          <CoinJar
            remainingAmount={Math.max(remaining, 0)}
            totalBudget={budgetData.monthlyLimit}
            className={isOverBudget ? "animate-jar-shake" : ""}
          />
          
          {isOverBudget && (
            <div className="text-center mt-4 p-3 bg-expense-red/10 rounded-lg border border-expense-red/20">
              <p className="text-expense-red font-medium text-sm">
                🚨 Oh no! Your jar is empty and you're over budget!
              </p>
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="coin"
            size="lg"
            onClick={() => navigate('/add-expense')}
            className="h-16 flex-col gap-1"
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm">Add Expense</span>
          </Button>
          
          <Button
            variant="jar"
            size="lg"
            onClick={() => navigate('/history')}
            className="h-16 flex-col gap-1"
          >
            <History className="h-5 w-5" />
            <span className="text-sm">View History</span>
          </Button>
        </div>

        {/* Quick Stats */}
        {budgetData.expenses.length > 0 && (
          <Card className="p-4 shadow-card-budget">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-primary">
                  {budgetData.expenses.length}
                </div>
                <div className="text-xs text-muted-foreground">Expenses</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-savings-green">
                  {Math.floor(Math.max(remaining, 0) / 100)}
                </div>
                <div className="text-xs text-muted-foreground">Coins Left</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-accent">
                  {((budgetData.monthlyLimit - Math.max(remaining, 0)) / budgetData.monthlyLimit * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-muted-foreground">Used</div>
              </div>
            </div>
          </Card>
        )}

        {/* Motivational Tip */}
        <Card className="p-4 shadow-card-budget bg-gradient-to-r from-secondary/50 to-accent/10">
          <div className="text-center">
            <p className="text-sm text-foreground/80 animate-fade-in">
              {motivationalTips[currentTip]}
            </p>
          </div>
        </Card>

        {/* Settings Button */}
        <div className="flex justify-center pb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/settings')}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
