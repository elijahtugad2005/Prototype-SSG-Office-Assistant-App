import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../firebase/firebaseConfig.js';
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Search, Edit2, Trash2, AlertCircle, Package, Clock, CheckCircle, DollarSign, Check, X, ClockIcon, CreditCard, Truck } from 'lucide-react';
import Order from '../Order/order.jsx';
import styles from './OrderManagement.module.css';

function OrderManagement() {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Navigation state
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  // ========================================
  // FETCH ORDERS FROM FIREBASE
  // ========================================
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        const ordersData = snapshot.docs.map((doc) => ({
          docId: doc.id,
          ...doc.data(),
        }));
        
        // Sort by date (newest first)
        ordersData.sort((a, b) => {
          const dateA = a.dateOrdered?.toDate?.() || new Date(a.createdAt);
          const dateB = b.dateOrdered?.toDate?.() || new Date(b.createdAt);
          return dateB - dateA;
        });

        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ========================================
  // UPDATE ORDER STATUS
  // ========================================
  const updateOrderStatus = async (docId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', docId), {
        orderStatus: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      // Show success message
      alert(`✅ Order status updated to: ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('❌ Failed to update order status. Please try again.');
    }
  };

  // ========================================
  // STATUS CHANGE HANDLERS
  // ========================================
  const handleStatusChange = (order, newStatus) => {
    if (window.confirm(`Change order ${order.orderId} status to "${newStatus}"?`)) {
      updateOrderStatus(order.docId, newStatus);
    }
  };

  // ========================================
  // FILTER ORDERS (MEMOIZED)
  // ========================================
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Filter by status
    if (statusFilter !== 'All') {
      result = result.filter(order => order.orderStatus === statusFilter);
    }

    // Filter by payment method
    if (paymentFilter !== 'All') {
      result = result.filter(order => order.paymentInfo?.paymentMethod === paymentFilter);
    }

    // Search by order ID or customer name
    if (searchQuery.trim()) {
      result = result.filter(order =>
        order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerInfo?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerInfo?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [statusFilter, paymentFilter, searchQuery, orders]);

  // ========================================
  // STATISTICS CALCULATION
  // ========================================
  const getStatistics = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.orderStatus === 'Pending').length,
      paid: orders.filter(o => o.orderStatus === 'Paid').length,
      ongoing: orders.filter(o => o.orderStatus === 'Ongoing').length,
      completed: orders.filter(o => o.orderStatus === 'Completed').length,
      cancelled: orders.filter(o => o.orderStatus === 'Cancelled').length,
      totalRevenue: orders
        .filter(o => o.orderStatus === 'Paid' || o.orderStatus === 'Completed')
        .reduce((sum, order) => sum + (order.productInfo?.totalPrice || 0), 0),
    };
  };

  const stats = getStatistics();

  // ========================================
  // MODAL HANDLERS
  // ========================================
  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleFormSuccess = () => {
    handleModalClose();
    // Optional: Add toast notification
  };

  // ========================================
  // DELETE ORDER
  // ========================================
  const handleDeleteOrder = async (docId, orderId) => {
    if (!window.confirm(`Are you sure you want to delete order ${orderId}?\nThis action cannot be undone.`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'orders', docId));
      alert('🗑️ Order deleted successfully!');
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error deleting order. Please try again.');
    }
  };

  // ========================================
  // FORMAT DATE
  // ========================================
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    let date;
    if (timestamp.toDate) {
      date = timestamp.toDate();
    } else {
      date = new Date(timestamp);
    }

    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ========================================
  // GET STATUS STYLE
  // ========================================
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#fff3cd';
      case 'Paid': return '#d1e7dd';
      case 'Ongoing': return '#cfe2ff';
      case 'Completed': return '#d1e7dd';
      case 'Cancelled': return '#f8d7da';
      default: return '#e2e3e5';
    }
  };

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'Pending': return '#856404';
      case 'Paid': return '#0f5132';
      case 'Ongoing': return '#084298';
      case 'Completed': return '#0f5132';
      case 'Cancelled': return '#842029';
      default: return '#41464b';
    }
  };

  // ========================================
  // PAGINATION
  // ========================================
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PER_PAGE));
  const paginatedOrders = filteredOrders.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ========================================
  // RENDER DASHBOARD VIEW
  // ========================================
  const renderDashboardView = () => (
    <div className={styles.dashboardView}>
      {/* KPI Row */}
      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiCardHeader}>
            <span className={styles.kpiCardLabel}>Total Orders</span>
            <span className={styles.kpiCardIcon}>
              <Package size={20} />
            </span>
          </div>
          <p className={styles.kpiCardValue}>{stats.total}</p>
          <p className={styles.kpiCardSub}>all time orders</p>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiCardHeader}>
            <span className={styles.kpiCardLabel}>Pending</span>
            <span className={styles.kpiCardIcon}>
              <Clock size={20} />
            </span>
          </div>
          <p className={styles.kpiCardValue}>{stats.pending}</p>
          <p className={styles.kpiCardSub}>awaiting payment</p>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiCardHeader}>
            <span className={styles.kpiCardLabel}>Paid</span>
            <span className={styles.kpiCardIcon}>
              <CreditCard size={20} />
            </span>
          </div>
          <p className={styles.kpiCardValue}>{stats.paid}</p>
          <p className={styles.kpiCardSub}>payment confirmed</p>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiCardHeader}>
            <span className={styles.kpiCardLabel}>Ongoing</span>
            <span className={styles.kpiCardIcon}>
              <Truck size={20} />
            </span>
          </div>
          <p className={styles.kpiCardValue}>{stats.ongoing}</p>
          <p className={styles.kpiCardSub}>in progress</p>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiCardHeader}>
            <span className={styles.kpiCardLabel}>Completed</span>
            <span className={styles.kpiCardIcon}>
              <CheckCircle size={20} />
            </span>
          </div>
          <p className={styles.kpiCardValue}>{stats.completed}</p>
          <p className={styles.kpiCardSub}>successfully delivered</p>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiCardHeader}>
            <span className={styles.kpiCardLabel}>Cancelled</span>
            <span className={styles.kpiCardIcon}>
              <X size={20} />
            </span>
          </div>
          <p className={styles.kpiCardValue}>{stats.cancelled}</p>
          <p className={styles.kpiCardSub}>cancelled orders</p>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiCardHeader}>
            <span className={styles.kpiCardLabel}>Revenue</span>
            <span className={styles.kpiCardIcon}>
              <DollarSign size={20} />
            </span>
          </div>
          <p className={styles.kpiCardValue}>₱{stats.totalRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className={styles.kpiCardSub}>total revenue</p>
        </div>
      </div>
    </div>
  );

  // ========================================
  // RENDER ORDERS TABLE VIEW
  // ========================================
  const renderOrdersTableView = () => (
    <div className={styles.ordersView}>
      {/* Toolbar */}
      <div className={styles.productsToolbar}>
        <div className={styles.productsToolbarLeft}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={16} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by Order ID, Name, or Email..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className={styles.filterSelect}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}
            className={styles.filterSelect}
          >
            <option value="All">All Methods</option>
            <option value="Cash">Cash</option>
            <option value="Online">Online</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.emptyState}>
            <p>Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <AlertCircle size={48} style={{ margin: '0 auto 10px', display: 'block', color: '#94a3b8' }} />
            <p>
              {orders.length === 0 
                ? 'No orders yet. Orders will appear here once customers place them.'
                : 'No orders match your filters.'}
            </p>
          </div>
        ) : (
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.docId} className={styles.tableRow}>
                  <td className={styles.orderIdCell}>{order.orderId}</td>
                  <td>
                    <div className={styles.customerCell}>
                      <span className={styles.customerName}>{order.customerInfo?.fullName}</span>
                      <span className={styles.customerEmail}>{order.customerInfo?.email}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.productCell}>
                      <span className={styles.productName}>{order.productInfo?.productName}</span>
                      {(order.productInfo?.size !== 'N/A' || order.productInfo?.color !== 'N/A') && (
                        <span className={styles.productVariant}>
                          {order.productInfo?.size !== 'N/A' && `Size: ${order.productInfo?.size}`}
                          {order.productInfo?.size !== 'N/A' && order.productInfo?.color !== 'N/A' && ' • '}
                          {order.productInfo?.color !== 'N/A' && `Color: ${order.productInfo?.color}`}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className={styles.quantityCell}>{order.productInfo?.quantity}</td>
                  <td className={styles.priceCell}>₱{order.productInfo?.totalPrice?.toFixed(2)}</td>
                  <td>
                    <span 
                      className={styles.statusBadge}
                      style={{
                        backgroundColor: getStatusColor(order.orderStatus),
                        color: getStatusTextColor(order.orderStatus)
                      }}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>
                    <span className={styles.paymentBadge}>
                      {order.paymentInfo?.paymentMethod}
                    </span>
                  </td>
                  <td className={styles.dateCell}>{formatDate(order.dateOrdered)}</td>
                  <td>
                    <div className={styles.tableActions}>
                      {/* Status Change Dropdown */}
                      <select
                        className={styles.statusSelect}
                        value={order.orderStatus}
                        onChange={(e) => {
                          if (window.confirm(`Change order ${order.orderId} status to "${e.target.value}"?`)) {
                            updateOrderStatus(order.docId, e.target.value);
                          }
                        }}
                        title="Change Status"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      
                      <button
                        className={styles.tableEditBtn}
                        onClick={() => handleEditClick(order)}
                        title="Edit Order"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button
                        className={styles.tableDeleteBtn}
                        onClick={() => handleDeleteOrder(order.docId, order.orderId)}
                        title="Delete Order"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className={styles.pagination}>
          <span className={styles.paginationInfo}>
            Showing {filteredOrders.length === 0 ? 0 : (page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filteredOrders.length)} of {filteredOrders.length}
          </span>
          <div className={styles.paginationControls}>
            <button
              className={styles.paginationBtn}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ← Previous
            </button>
            <span className={styles.paginationPage}>{page} / {totalPages}</span>
            <button
              className={styles.paginationBtn}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ========================================
  // RENDER SETTINGS VIEW
  // ========================================
  const renderSettingsView = () => (
    <div className={styles.settingsView}>
      <div className={styles.settingsPlaceholder}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <h3>Settings</h3>
        <p>Order management settings will appear here.</p>
      </div>
    </div>
  );

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className={styles.container}>
      
      {/* Internal Tab Navigation */}
      <div className={styles.omTabNav}>
        <button
          className={`${styles.omTabBtn} ${activeSection === 'dashboard' ? styles.omTabBtnActive : ''}`}
          onClick={() => setActiveSection('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`${styles.omTabBtn} ${activeSection === 'orders' ? styles.omTabBtnActive : ''}`}
          onClick={() => setActiveSection('orders')}
        >
          📦 Orders
          <span className={styles.omTabBadge}>{orders.length}</span>
        </button>
        <button
          className={`${styles.omTabBtn} ${activeSection === 'settings' ? styles.omTabBtnActive : ''}`}
          onClick={() => setActiveSection('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      <div className={styles.viewContent}>
        {/* Render views based on active section */}
        {activeSection === 'dashboard' && renderDashboardView()}
        {activeSection === 'orders' && renderOrdersTableView()}
        {activeSection === 'settings' && renderSettingsView()}
      </div>

      {/* EDIT MODAL */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleModalClose}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <Order 
              editingOrder={selectedOrder}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default OrderManagement;