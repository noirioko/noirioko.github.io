import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import '../styles/FinanceModule.css';

// Import finance icon
import financeIcon from '../assets/images/finance_icon.png';

// Define transaction type
interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'savings';
  date: string;
  flair?: string;
}

// Generate a unique ID helper function
const generateUniqueId = (prefix: string) => {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Default flairs
const transactionFlairs = [
  'Food',
  'Transport',
  'Utilities',
  'Entertainment',
  'Shopping',
  'Housing',
  'Salary',
  'Gift',
  'Investment',
  'Education',
  'Health',
  'Travel',
  'Other'
];

// Transaction type options with icons
const renderTypeOption = (type: 'income' | 'expense' | 'savings', label: string) => (
  <option value={type}>
    {label}
  </option>
);

const FinanceModule: React.FC = () => {
  const { addPoints } = useAppContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionTitle, setTransactionTitle] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionType, setTransactionType] = useState<'income' | 'expense' | 'savings'>('expense');
  const [transactionFlair, setTransactionFlair] = useState('Other');
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  
  // For month filtering
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Load transactions from localStorage on component mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('yuyu-finance-transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);
  
  // Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem('yuyu-finance-transactions', JSON.stringify(transactions));
  }, [transactions]);
  
  // Filter transactions for current month
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getMonth() === currentMonth.getMonth() &&
      transactionDate.getFullYear() === currentMonth.getFullYear()
    );
  });
  
  // Calculate summary data
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;
  
  // Handler for adding a new transaction
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transactionTitle || !transactionAmount || parseFloat(transactionAmount) <= 0) {
      alert('Please enter a valid title and amount');
      return;
    }
    
    const newTransaction: Transaction = {
      id: generateUniqueId('transaction'),
      title: transactionTitle,
      amount: parseFloat(transactionAmount),
      type: transactionType,
      date: transactionDate,
      flair: transactionFlair
    };
    
    setTransactions([...transactions, newTransaction]);
    
    // Award points for tracking finances
    addPoints(5, 'Tracked finances');
    
    // Reset form
    setTransactionTitle('');
    setTransactionAmount('');
    setTransactionType('expense');
    setTransactionFlair('Other');
    setTransactionDate(new Date().toISOString().split('T')[0]);
  };
  
  // Handler for deleting a transaction
  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };
  
  // Month navigation handlers
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };
  
  const currentMonthName = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
  
  return (
    <div id="yuyu-finance-module">
      <div className="module-header">
        <h1 className="module-title">
          <img src={financeIcon} alt="Finance Icon" className="module-icon" />
          Finance Tracker
        </h1>
      </div>
      
      <div id="yuyu-finance-container">
        {/* Month selector */}
        <div className="yuyu-month-selector">
          <button 
            className="yuyu-month-nav-button"
            onClick={goToPreviousMonth}
            aria-label="Previous month"
            style={{ 
              borderRadius: '50%',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '26px',
              width: '26px',
              height: '26px'
            }}
          >
            ◀
          </button>
          <div className="yuyu-current-month">{currentMonthName}</div>
          <button 
            className="yuyu-month-nav-button"
            onClick={goToNextMonth}
            aria-label="Next month"
            style={{ 
              borderRadius: '50%',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '26px',
              width: '26px',
              height: '26px'
            }}
          >
            ▶
          </button>
        </div>
        
        {/* Summary cards */}
        <div className="yuyu-finance-summary">
          <div className="yuyu-summary-card income">
            <div className="yuyu-summary-title">Income</div>
            <div className="yuyu-summary-amount">{formatCurrency(totalIncome)}</div>
          </div>
          <div className="yuyu-summary-card expense">
            <div className="yuyu-summary-title">Expenses</div>
            <div className="yuyu-summary-amount">{formatCurrency(totalExpenses)}</div>
          </div>
          <div className="yuyu-summary-card balance">
            <div className="yuyu-summary-title">Balance</div>
            <div className="yuyu-summary-amount">{formatCurrency(balance)}</div>
          </div>
        </div>
        
        {/* Transaction list */}
        <h2 className="yuyu-task-list-header">Transactions</h2>
        
        {filteredTransactions.length === 0 ? (
          <div className="yuyu-no-transactions">
            <div className="yuyu-no-transactions-icon">💰</div>
            <p>No transactions for this month</p>
          </div>
        ) : (
          <div className="yuyu-transaction-list">
            {filteredTransactions.map(transaction => (
              <div 
                key={transaction.id} 
                className={`yuyu-finance-transaction ${transaction.type}`}
              >
                <div className="yuyu-transaction-details">
                  <span className="yuyu-transaction-title">
                    <span className={`yuyu-type-icon ${transaction.type}`}></span>
                    {transaction.title}
                    {transaction.flair && (
                      <span className="yuyu-transaction-flair">
                        <span className="yuyu-flair-icon">
                          {transaction.flair.charAt(0)}
                        </span>
                        {transaction.flair}
                      </span>
                    )}
                  </span>
                  <span className="yuyu-transaction-date">{formatDate(transaction.date)}</span>
                </div>
                <span className={`yuyu-transaction-amount ${transaction.type}`}>
                  {transaction.type === 'expense' ? '-' : '+'}
                  {formatCurrency(transaction.amount)}
                </span>
                <button
                  className="yuyu-delete-transaction-button"
                  onClick={() => handleDeleteTransaction(transaction.id)}
                  aria-label="Delete transaction"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        {/* Add transaction form */}
        <form className="yuyu-add-transaction-form" onSubmit={handleAddTransaction}>
          <div className="yuyu-form-group">
            <label htmlFor="transaction-title" className="yuyu-form-label">Description</label>
            <input
              type="text"
              id="transaction-title"
              className="yuyu-transaction-input"
              value={transactionTitle}
              onChange={(e) => setTransactionTitle(e.target.value)}
              placeholder="What was this transaction for?"
              required
            />
          </div>
          
          <div className="yuyu-form-row">
            <div className="yuyu-form-group">
              <label htmlFor="transaction-amount" className="yuyu-form-label">Amount</label>
              <input
                type="number"
                id="transaction-amount"
                className="yuyu-transaction-input"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>
            
            <div className="yuyu-form-group">
              <label htmlFor="transaction-date" className="yuyu-form-label">Date</label>
              <input
                type="date"
                id="transaction-date"
                className="yuyu-transaction-input"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="yuyu-form-row">
            <div className="yuyu-form-group">
              <label htmlFor="transaction-type" className="yuyu-form-label">Type</label>
              <select
                id="transaction-type"
                className="yuyu-transaction-type-select"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as 'income' | 'expense' | 'savings')}
              >
                {renderTypeOption('income', 'Income')}
                {renderTypeOption('expense', 'Expense')}
                {renderTypeOption('savings', 'Savings')}
              </select>
            </div>
            
            <div className="yuyu-form-group">
              <label htmlFor="transaction-flair" className="yuyu-form-label">Category</label>
              <select
                id="transaction-flair"
                className="yuyu-flair-select"
                value={transactionFlair}
                onChange={(e) => setTransactionFlair(e.target.value)}
              >
                {transactionFlairs.map(flair => (
                  <option key={flair} value={flair}>{flair}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button type="submit" className="yuyu-add-transaction-button">
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default FinanceModule; 