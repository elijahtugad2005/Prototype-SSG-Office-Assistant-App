// context/FinanceContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { useAuth } from '../AuthContext/AuthContext';

// Create the context - THIS IS WHAT YOU NEED TO EXPORT
const FinanceContext = createContext();

// Custom hook to use finance context
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};

// The provider component
export const FinanceProvider = ({ children }) => {
  const { userRole, userName } = useAuth();
  
  // State for budgets
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for funds
  const [funds, setFunds] = useState({
    annualBudget: 0,
    incomeGenerated: 0,
    totalFunds: 0,
    lastUpdated: null
  });
  
  // Statistics
  const [statistics, setStatistics] = useState({
    totalAllocated: 0,
    totalSpent: 0,
    totalRemaining: 0,
    budgetCount: 0,
    categories: {},
    committees: {}
  });

  // Fetch all budgets from Firestore
  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const budgetsQuery = query(
        collection(db, 'budgets'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(budgetsQuery);
      const budgetList = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        budgetList.push({
          id: doc.id,
          ...data,
          startDate: data.startDate?.toDate?.() || data.startDate || null,
          endDate: data.endDate?.toDate?.() || data.endDate || null,
          createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt || new Date(),
        });
      });
      
      setBudgets(budgetList);
      calculateStatistics(budgetList);
      
    } catch (err) {
      console.error('Error fetching budgets:', err);
      setError('Failed to load budget data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch funds data
  const fetchFunds = useCallback(async () => {
    try {
      const fundsQuery = query(collection(db, 'funds'));
      const querySnapshot = await getDocs(fundsQuery);
      
      if (!querySnapshot.empty) {
        const docSnapshot = querySnapshot.docs[0];
        const fundsData = docSnapshot.data();
        setFunds({
          annualBudget: fundsData.annualBudget || 0,
          incomeGenerated: fundsData.incomeGenerated || 0,
          totalFunds: fundsData.totalFunds || 0,
          lastUpdated: fundsData.lastUpdated?.toDate?.() || fundsData.lastUpdated || null,
          id: docSnapshot.id
        });
      }
    } catch (err) {
      console.error('Error fetching funds:', err);
    }
  }, []);

  // Add a new budget
  const addBudget = async (budgetData) => {
    try {
      setError(null);
      
      const budgetWithMetadata = {
        ...budgetData,
        createdBy: userName,
        userRole: userRole,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true
      };
      
      const docRef = await addDoc(collection(db, 'budgets'), budgetWithMetadata);
      const newBudget = {
        id: docRef.id,
        ...budgetWithMetadata,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Update local state
      const updatedBudgets = [newBudget, ...budgets];
      setBudgets(updatedBudgets);
      calculateStatistics(updatedBudgets);
      
      return docRef.id;
      
    } catch (err) {
      console.error('Error adding budget:', err);
      setError('Failed to add budget. Please try again.');
      throw err;
    }
  };

  // Update existing budget
  const updateBudget = async (budgetId, updatedData) => {
    try {
      setError(null);
      
      const budgetRef = doc(db, 'budgets', budgetId);
      const updateData = {
        ...updatedData,
        updatedAt: serverTimestamp(),
        updatedBy: userName
      };
      
      await updateDoc(budgetRef, updateData);
      
      // Update local state
      const updatedBudgets = budgets.map(budget => 
        budget.id === budgetId 
          ? { ...budget, ...updateData, updatedAt: new Date() }
          : budget
      );
      
      setBudgets(updatedBudgets);
      calculateStatistics(updatedBudgets);
      
      return budgetId;
      
    } catch (err) {
      console.error('Error updating budget:', err);
      setError('Failed to update budget. Please try again.');
      throw err;
    }
  };

  // Delete budget
  const deleteBudget = async (budgetId) => {
    try {
      setError(null);
      
      await deleteDoc(doc(db, 'budgets', budgetId));
      
      // Update local state
      const updatedBudgets = budgets.filter(budget => budget.id !== budgetId);
      setBudgets(updatedBudgets);
      calculateStatistics(updatedBudgets);
      
    } catch (err) {
      console.error('Error deleting budget:', err);
      setError('Failed to delete budget. Please try again.');
      throw err;
    }
  };

  // Update funds
  const updateFunds = async (fundsData) => {
    try {
      setError(null);
      
      let fundsRef;
      const fundsQuery = query(collection(db, 'funds'));
      const querySnapshot = await getDocs(fundsQuery);
      
      const updatedFundsData = {
        ...fundsData,
        lastUpdated: serverTimestamp(),
        updatedBy: userName
      };
      
      if (querySnapshot.empty) {
        // Create new funds document
        const docRef = await addDoc(collection(db, 'funds'), updatedFundsData);
        fundsRef = { id: docRef.id, ...updatedFundsData };
      } else {
        // Update existing funds document
        const docSnapshot = querySnapshot.docs[0];
        fundsRef = doc(db, 'funds', docSnapshot.id);
        await updateDoc(fundsRef, updatedFundsData);
        fundsRef = { id: docSnapshot.id, ...updatedFundsData };
      }
      
      setFunds({
        annualBudget: fundsData.annualBudget || 0,
        incomeGenerated: fundsData.incomeGenerated || 0,
        totalFunds: fundsData.totalFunds || 0,
        lastUpdated: new Date(),
        ...fundsRef
      });
      
    } catch (err) {
      console.error('Error updating funds:', err);
      setError('Failed to update funds. Please try again.');
      throw err;
    }
  };

  // Calculate statistics from budgets
  const calculateStatistics = (budgetList) => {
    const stats = {
      totalAllocated: 0,
      totalSpent: 0,
      totalRemaining: 0,
      budgetCount: budgetList.length,
      categories: {},
      committees: {},
      statusCount: {
        'Not Started': 0,
        'On Track': 0,
        'In Progress': 0,
        'Almost Spent': 0,
        'Fully Spent': 0,
        'Over Budget': 0
      }
    };

    budgetList.forEach(budget => {
      stats.totalAllocated += budget.allocated || 0;
      stats.totalSpent += budget.spent || 0;
      stats.totalRemaining += budget.remaining || 0;
      
      // Count by category
      const category = budget.category || 'Uncategorized';
      stats.categories[category] = (stats.categories[category] || 0) + 1;
      
      // Count by committee
      const committee = budget.committee || 'General';
      stats.committees[committee] = (stats.committees[committee] || 0) + 1;
      
      // Count by status
      const status = budget.status || 'Not Started';
      stats.statusCount[status] = (stats.statusCount[status] || 0) + 1;
    });

    setStatistics(stats);
  };

  // Get budget by ID
  const getBudgetById = (budgetId) => {
    return budgets.find(budget => budget.id === budgetId);
  };

  // Get budgets by category
  const getBudgetsByCategory = (category) => {
    return budgets.filter(budget => budget.category === category);
  };

  // Get budgets by committee
  const getBudgetsByCommittee = (committee) => {
    return budgets.filter(budget => budget.committee === committee);
  };

  // Get budgets by status
  const getBudgetsByStatus = (status) => {
    return budgets.filter(budget => budget.status === status);
  };

  // Get recent budgets
  const getRecentBudgets = (limit = 5) => {
    return budgets.slice(0, limit);
  };

  // Calculate fund utilization percentage
  const getFundUtilizationPercentage = () => {
    if (funds.totalFunds === 0) return 0;
    return (statistics.totalAllocated / funds.totalFunds) * 100;
  };

  // Get available funds (total funds minus allocated)
  const getAvailableFunds = () => {
    return funds.totalFunds - statistics.totalAllocated;
  };

  // Initialize data fetching
  useEffect(() => {
    fetchBudgets();
    fetchFunds();
  }, [fetchBudgets, fetchFunds]);

  const value = {
    // State
    budgets,
    funds,
    statistics,
    loading,
    error,
    
    // Budget CRUD operations
    addBudget,
    updateBudget,
    deleteBudget,
    fetchBudgets,
    
    // Funds operations
    updateFunds,
    fetchFunds,
    
    // Getter functions
    getBudgetById,
    getBudgetsByCategory,
    getBudgetsByCommittee,
    getBudgetsByStatus,
    getRecentBudgets,
    
    // Calculation functions
    getFundUtilizationPercentage,
    getAvailableFunds,
    
    // Helper for BudgetForm compatibility
    updateBudgetStats: (newBudget) => {
      const updatedBudgets = [newBudget, ...budgets];
      setBudgets(updatedBudgets);
      calculateStatistics(updatedBudgets);
    }
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

// Export the context itself if needed for useContext
export  default { FinanceContext };