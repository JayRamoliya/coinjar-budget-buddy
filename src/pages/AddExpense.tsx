import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addExpense, categories } from '@/lib/budgetStorage';
import { ArrowLeft, Coins } from 'lucide-react';

const AddExpense: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    note: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in amount and category",
        variant: "destructive"
      });
      return;
    }
    
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive amount",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      addExpense({
        amount,
        category: formData.category,
        note: formData.note,
        date: formData.date
      });
      
      toast({
        title: "Expense Added! 💰",
        description: `₹${amount} spent on ${formData.category}`,
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save expense. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <Coins className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Add Expense</h1>
          </div>
        </div>

        {/* Form */}
        <Card className="p-6 shadow-card-budget">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount *
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">₹</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="pl-8 text-lg"
                  step="0.01"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-medium">
                Category *
              </Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note" className="text-sm font-medium">
                Note (Optional)
              </Label>
              <Textarea
                id="note"
                placeholder="Add a note about this expense..."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="resize-none"
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="expense"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Saving..." : "Save Expense"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Quick Amount Buttons */}
        <Card className="p-4 shadow-card-budget">
          <p className="text-sm text-muted-foreground mb-3">Quick amounts:</p>
          <div className="grid grid-cols-4 gap-2">
            {[100, 200, 500, 1000].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                className="text-xs"
              >
                ₹{amount}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AddExpense;