import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getBudgetData, updateBudgetLimit, clearAllData } from '@/lib/budgetStorage';
import { ArrowLeft, Settings2, AlertTriangle, Download, Upload } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const budgetData = getBudgetData();
  
  const [newBudget, setNewBudget] = useState(budgetData.monthlyLimit.toString());
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(newBudget);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Budget",
        description: "Please enter a valid positive amount",
        variant: "destructive"
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      updateBudgetLimit(amount);
      toast({
        title: "Budget Updated! 💰",
        description: `Monthly budget set to ₹${amount.toLocaleString()}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update budget. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearData = () => {
    clearAllData();
    toast({
      title: "Data Cleared",
      description: "All expenses and budget data have been removed",
    });
    navigate('/');
  };

  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(budgetData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `budget-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "Your budget data has been downloaded",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Validate the data structure
        if (!importedData.monthlyLimit || !Array.isArray(importedData.expenses)) {
          throw new Error('Invalid file format');
        }
        
        localStorage.setItem('budgetTrackerData', JSON.stringify(importedData));
        
        toast({
          title: "Data Imported",
          description: "Your budget data has been restored",
        });
        
        // Refresh the page to show imported data
        window.location.reload();
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid file format. Please select a valid backup file.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
    // Reset the input
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
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
            <Settings2 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </div>

        {/* Budget Settings */}
        <Card className="p-6 shadow-card-budget">
          <h2 className="text-lg font-semibold mb-4">Monthly Budget</h2>
          
          <div className="space-y-4">
            <div className="p-3 bg-secondary/50 rounded-lg">
              <div className="text-sm text-muted-foreground">Current Budget</div>
              <div className="text-2xl font-bold text-primary">
                ₹{budgetData.monthlyLimit.toLocaleString()}
              </div>
            </div>
            
            <form onSubmit={handleUpdateBudget} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-sm font-medium">
                  New Monthly Budget
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">₹</span>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="5000"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="pl-8"
                    step="100"
                    min="1"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                variant="savings"
                disabled={isUpdating}
                className="w-full"
              >
                {isUpdating ? "Updating..." : "Update Budget"}
              </Button>
            </form>
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-6 shadow-card-budget">
          <h2 className="text-lg font-semibold mb-4">Data Management</h2>
          
          <div className="space-y-3">
            {/* Export Data */}
            <Button
              variant="outline"
              onClick={handleExportData}
              className="w-full justify-start"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data (JSON)
            </Button>
            
            {/* Import Data */}
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button
                variant="outline"
                className="w-full justify-start pointer-events-none"
              >
                <Upload className="h-4 w-4 mr-2" />
                Import Data (JSON)
              </Button>
            </div>
            
            {/* Clear All Data */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your 
                    expense data and budget settings.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearData} className="bg-destructive hover:bg-destructive/90">
                    Delete Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Card>

        {/* App Info */}
        <Card className="p-6 shadow-card-budget">
          <h2 className="text-lg font-semibold mb-4">About</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>
              <strong>CoinJar Budget Buddy</strong> helps you track your monthly expenses 
              with a fun coin jar visualization.
            </div>
            <div>
              • Expenses are automatically cleaned after 30 days<br/>
              • Data is stored locally on your device<br/>
              • 1 coin = ₹100 in the jar visualization
            </div>
          </div>
        </Card>

        {/* Back to Home */}
        <div className="flex justify-center pt-4">
          <Button variant="jar" onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;