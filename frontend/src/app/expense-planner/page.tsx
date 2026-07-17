'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Plus, Trash2, PieChart, IndianRupee, Plane, Building2, Utensils, Bus, ShoppingBag } from 'lucide-react';

type ExpenseCategory = 'Flights' | 'Hotels' | 'Food' | 'Transport' | 'Shopping' | 'Other';

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Flights: '#3b82f6',   // blue-500
  Hotels: '#8b5cf6',    // violet-500
  Food: '#f59e0b',      // amber-500
  Transport: '#10b981', // emerald-500
  Shopping: '#ec4899',  // pink-500
  Other: '#6b7280'      // gray-500
};

const CATEGORY_ICONS: Record<ExpenseCategory, any> = {
  Flights: Plane,
  Hotels: Building2,
  Food: Utensils,
  Transport: Bus,
  Shopping: ShoppingBag,
  Other: Calculator
};

export default function ExpensePlannerPage() {
  const [budget, setBudget] = useState<number>(50000);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', name: 'Round-trip flights', amount: 12000, category: 'Flights' },
    { id: '2', name: 'Luxury Resort 3 Nights', amount: 15000, category: 'Hotels' }
  ]);

  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<ExpenseCategory>('Food');

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newAmount) return;
    setExpenses([
      ...expenses,
      { id: Date.now().toString(), name: newName, amount: Number(newAmount), category: newCategory }
    ]);
    setNewName('');
    setNewAmount('');
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(ex => ex.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, ex) => sum + ex.amount, 0);
  const remainingBudget = budget - totalExpenses;
  const budgetPercentage = Math.min((totalExpenses / budget) * 100, 100) || 0;

  // Calculate breakdown for visual bars
  const categoryTotals = expenses.reduce((acc, ex) => {
    acc[ex.category] = (acc[ex.category] || 0) + ex.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: 'var(--background)' }}>
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto bg-black text-white dark:bg-white dark:text-black rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <PieChart size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: 'var(--foreground)' }}>Trip Expense Planner</h1>
          <p className="text-xl font-medium max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
            Set a budget, track your spending, and ensure your dream vacation stays perfectly on track.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form & List */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Set Budget Card */}
            <div className="p-8 rounded-3xl border shadow-lg" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <h2 className="text-xl font-black mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <IndianRupee size={20} /> Total Budget Setup
              </h2>
              <div className="flex gap-4">
                <input 
                  type="number" min="0" value={budget} onChange={e => setBudget(Number(e.target.value))}
                  className="w-full rounded-xl py-4 px-4 font-black text-xl outline-none border focus:border-black dark:focus:border-white transition-colors"
                  style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', borderColor: 'var(--card-border)' }}
                />
              </div>
            </div>

            {/* Add Expense Form */}
            <div className="p-8 rounded-3xl border shadow-lg" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <h2 className="text-xl font-black mb-6" style={{ color: 'var(--foreground)' }}>Add New Expense</h2>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Description</label>
                    <input type="text" value={newName} onChange={e => setNewName(e.target.value)} required placeholder="e.g. Dinner at Taj" className="w-full rounded-xl py-3 px-4 font-bold outline-none border" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', borderColor: 'var(--card-border)' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Amount (₹)</label>
                    <input type="number" min="1" value={newAmount} onChange={e => setNewAmount(e.target.value)} required placeholder="5000" className="w-full rounded-xl py-3 px-4 font-bold outline-none border" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--foreground)', borderColor: 'var(--card-border)' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)' }}>Category</label>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(CATEGORY_COLORS) as ExpenseCategory[]).map(cat => (
                      <button type="button" key={cat} onClick={() => setNewCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${newCategory === cat ? 'ring-2 ring-black dark:ring-white bg-black/5 dark:bg-white/5' : 'opacity-70 hover:opacity-100'}`}
                        style={{ borderColor: newCategory === cat ? CATEGORY_COLORS[cat] : 'var(--card-border)', color: 'var(--foreground)' }}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" className="w-full bg-black text-white dark:bg-white dark:text-black py-4 rounded-xl font-black text-lg hover:opacity-90 transition flex items-center justify-center mt-6">
                  <Plus size={20} className="mr-2" /> Add Expense
                </button>
              </form>
            </div>

            {/* Expense List */}
            <div className="p-8 rounded-3xl border shadow-lg" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <h2 className="text-xl font-black mb-6" style={{ color: 'var(--foreground)' }}>Expense Timeline</h2>
              {expenses.length === 0 ? (
                <p className="text-center py-8 font-medium" style={{ color: 'var(--muted)' }}>No expenses added yet.</p>
              ) : (
                <div className="space-y-3">
                  {expenses.map((ex, idx) => {
                    const Icon = CATEGORY_ICONS[ex.category];
                    return (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} key={ex.id} className="flex items-center justify-between p-4 rounded-2xl border" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)' }}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: CATEGORY_COLORS[ex.category] }}>
                            <Icon size={20} />
                          </div>
                          <div>
                            <h3 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>{ex.name}</h3>
                            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: CATEGORY_COLORS[ex.category] }}>{ex.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-black text-lg" style={{ color: 'var(--foreground)' }}>₹{ex.amount.toLocaleString()}</p>
                          <button onClick={() => removeExpense(ex.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Analytics & Summary */}
          <div className="lg:col-span-5">
            <div className="p-8 rounded-3xl border shadow-xl sticky top-32" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <h3 className="text-2xl font-black mb-8 border-b pb-4" style={{ color: 'var(--foreground)', borderColor: 'var(--card-border)' }}>Budget Overview</h3>
              
              <div className="space-y-6 mb-8">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Total Budget</p>
                  <p className="text-3xl font-black" style={{ color: 'var(--foreground)' }}>₹{budget.toLocaleString()}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)' }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Spent</p>
                    <p className="text-xl font-black text-red-500">₹{totalExpenses.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-2xl border" style={{ backgroundColor: 'var(--section-alt)', borderColor: 'var(--card-border)' }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--muted)' }}>Remaining</p>
                    <p className={`text-xl font-black ${remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>₹{remainingBudget.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span style={{ color: 'var(--muted)' }}>Budget Usage</span>
                  <span className={budgetPercentage > 90 ? 'text-red-500' : 'text-black dark:text-white'}>{budgetPercentage.toFixed(1)}%</span>
                </div>
                <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${budgetPercentage}%` }} 
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full ${budgetPercentage > 100 ? 'bg-red-500' : 'bg-black dark:bg-white'}`}
                  />
                </div>
              </div>

              {/* Category Breakdown (Stacked Bar) */}
              <h4 className="text-sm font-black uppercase tracking-wider mb-4" style={{ color: 'var(--foreground)' }}>Category Breakdown</h4>
              <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden flex mb-6">
                {Object.entries(categoryTotals).map(([cat, val]) => (
                  <motion.div 
                    key={cat}
                    initial={{ width: 0 }}
                    animate={{ width: `${(val / totalExpenses) * 100}%` }}
                    className="h-full border-r border-white/20 last:border-0"
                    style={{ backgroundColor: CATEGORY_COLORS[cat as ExpenseCategory] }}
                    title={`${cat}: ₹${val}`}
                  />
                ))}
              </div>

              {/* Category Legend */}
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).map(([cat, val]) => (
                  <div key={cat} className="flex items-center gap-2 text-sm font-bold">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat as ExpenseCategory] }}></div>
                    <span style={{ color: 'var(--muted)' }}>{cat}</span>
                    <span className="ml-auto" style={{ color: 'var(--foreground)' }}>{Math.round((val / totalExpenses) * 100)}%</span>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
