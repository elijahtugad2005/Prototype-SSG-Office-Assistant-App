import React, { useState, useMemo } from 'react';
import { useFinance } from '../FinanceContext/FinanceProvider.jsx'; // Adjust path
import BudgetForm from '../BudgetForm/BudgetForm.jsx'; // Reuse your existing form
import styles from './BudgetManager.module.css';
import { Search, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

const BudgetManager = () => {
  const { budgets, deleteBudget, loading } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  // Filter budgets based on search
  const filteredBudgets = useMemo(() => {
    return budgets.filter(b => 
      b.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.resolution?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [budgets, searchTerm]);

  // --- Handlers ---

  const handleEditClick = (budget) => {
    setSelectedBudget(budget);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the budget for "${name}"? This cannot be undone.`)) {
      await deleteBudget(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBudget(null);
  };

  const handleFormSuccess = () => {
    handleModalClose();
    // Optional: Add a toast notification here
  };

  // Helper for status colors (matches your previous code)
  const getStatusColor = (status) => {
    switch(status) {
      case 'Over Budget': return '#fee2e2'; // Red bg
      case 'Fully Spent': return '#dcfce7'; // Green bg
      case 'Almost Spent': return '#fef9c3'; // Yellow bg
      default: return '#f1f5f9'; // Gray bg
    }
  };
  
  const getStatusTextColor = (status) => {
    switch(status) {
      case 'Over Budget': return '#991b1b';
      case 'Fully Spent': return '#166534';
      case 'Almost Spent': return '#854d0e';
      default: return '#475569';
    }
  };

  return (
    <div className={styles.container}>
      
      {/* Header & Search */}
      <div className={styles.header}>
        <div className={styles.title}>
          <h2>Manage Budget Logs</h2>
          <p style={{color: '#64748b', margin: '4px 0 0'}}>View, edit, or remove allocations</p>
        </div>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={18} />
          <input 
            type="text" 
            className={styles.searchInput} 
            placeholder="Search by event or resolution..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List of Budgets */}
      <div className={styles.listGrid}>
        {loading ? (
           <p style={{textAlign: 'center', color: '#64748b'}}>Loading logs...</p>
        ) : filteredBudgets.length > 0 ? (
          filteredBudgets.map((budget) => (
            <div key={budget.id} className={styles.budgetCard}>
              
              {/* Column 1: Name & Resolution */}
              <div className={styles.cardMain}>
                <span className={styles.eventName}>{budget.eventName}</span>
                <span className={styles.resolution}>
                  {budget.resolution || 'No Resolution No.'}
                </span>
              </div>

              {/* Column 2: Category & Committee */}
              <div className={styles.cardMeta}>
                <span style={{fontWeight: 600}}>{budget.category}</span>
                <span style={{fontSize: '0.8rem'}}>{budget.committee}</span>
              </div>

              {/* Column 3: Amount */}
              <div className={styles.amount}>
                ₱{parseFloat(budget.allocated).toLocaleString()}
              </div>

              {/* Column 4: Status */}
              <div>
                <span 
                  className={styles.statusBadge}
                  style={{
                    backgroundColor: getStatusColor(budget.status),
                    color: getStatusTextColor(budget.status)
                  }}
                >
                  {budget.status}
                </span>
              </div>

              {/* Column 5: Actions */}
              <div className={styles.actions}>
                <button 
                  className={`${styles.actionBtn} ${styles.editBtn}`}
                  onClick={() => handleEditClick(budget)}
                  title="Edit Budget"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  onClick={() => handleDeleteClick(budget.id, budget.eventName)}
                  title="Delete Budget"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          ))
        ) : (
          <div style={{textAlign: 'center', padding: '3rem', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '16px'}}>
            <AlertCircle style={{margin: '0 auto 10px', display: 'block'}} />
            No budget logs found matching your search.
          </div>
        )}
      </div>

      {/* --- EDIT MODAL --- */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleModalClose}>
          {/* Stop propagation so clicking form doesn't close modal */}
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* We reuse the BudgetForm here! */}
            <BudgetForm 
              editingBudget={selectedBudget} 
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default BudgetManager;