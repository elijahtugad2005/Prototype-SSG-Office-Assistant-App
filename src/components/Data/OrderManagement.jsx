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
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
  // RENDER
  // ========================================
  return (
    <div className={styles.container}>
      
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2>Order Management</h2>
          <p>View and manage all customer orders</p>
        </div>
      </div>

      {/* STATISTICS CARDS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <Package className={styles.statIcon} size={24} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Orders</span>
            <span className={styles.statValue}>{stats.total}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <Clock className={styles.statIcon} size={24} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Pending</span>
            <span className={styles.statValue}>{stats.pending}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <CreditCard className={styles.statIcon} size={24} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Paid</span>
            <span className={styles.statValue}>{stats.paid}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <Truck className={styles.statIcon} size={24} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Ongoing</span>
            <span className={styles.statValue}>{stats.ongoing}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <CheckCircle className={styles.statIcon} size={24} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Completed</span>
            <span className={styles.statValue}>{stats.completed}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <X className={styles.statIcon} size={24} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Cancelled</span>
            <span className={styles.statValue}>{stats.cancelled}</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <DollarSign className={styles.statIcon} size={24} />
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Revenue</span>
            <span className={styles.statValue}>₱{stats.totalRevenue.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* FILTERS SECTION */}
      <div className={styles.filtersSection}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by Order ID, Name, or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <label>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Payment:</label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="All">All Methods</option>
            <option value="Cash">Cash</option>
            <option value="Online">Online</option>
          </select>
        </div>
      </div>

      {/* ORDERS TABLE */}
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
          <div className={styles.ordersGrid}>
            {filteredOrders.map((order) => (
              <div key={order.docId} className={styles.orderCard}>
                
                {/* ORDER HEADER */}
                <div className={styles.orderHeader}>
                  <div className={styles.orderIdSection}>
                    <span className={styles.orderId}>{order.orderId}</span>
                    <span className={styles.orderDate}>{formatDate(order.dateOrdered)}</span>
                  </div>
                  <span 
                    className={styles.statusBadge}
                    style={{
                      backgroundColor: getStatusColor(order.orderStatus),
                      color: getStatusTextColor(order.orderStatus)
                    }}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                {/* CUSTOMER INFO */}
                <div className={styles.infoSection}>
                  <h4 className={styles.sectionTitle}>Customer Information</h4>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Name:</span>
                      <span className={styles.infoValue}>{order.customerInfo?.fullName}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>School ID:</span>
                      <span className={styles.infoValue}>{order.customerInfo?.schoolID}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Email:</span>
                      <span className={styles.infoValue}>{order.customerInfo?.email}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Phone:</span>
                      <span className={styles.infoValue}>{order.customerInfo?.phoneNumber}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Program:</span>
                      <span className={styles.infoValue}>
                        {order.customerInfo?.bachelorDegree} - {order.customerInfo?.section}
                      </span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Address:</span>
                      <span className={styles.infoValue}>{order.customerInfo?.address}</span>
                    </div>
                  </div>
                </div>

                {/* PRODUCT INFO */}
                <div className={styles.infoSection}>
                  <h4 className={styles.sectionTitle}>Product Details</h4>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Product:</span>
                      <span className={styles.infoValue}>{order.productInfo?.productName}</span>
                    </div>
                    {order.productInfo?.size !== 'N/A' && (
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Size:</span>
                        <span className={styles.infoValue}>{order.productInfo?.size}</span>
                      </div>
                    )}
                    {order.productInfo?.color !== 'N/A' && (
                      <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Color:</span>
                        <span className={styles.infoValue}>{order.productInfo?.color}</span>
                      </div>
                    )}
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Quantity:</span>
                      <span className={styles.infoValue}>{order.productInfo?.quantity}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Price/Unit:</span>
                      <span className={styles.infoValue}>₱{order.productInfo?.pricePerUnit?.toFixed(2)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Total:</span>
                      <span className={styles.totalPrice}>₱{order.productInfo?.totalPrice?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* PAYMENT INFO */}
                <div className={styles.infoSection}>
                  <h4 className={styles.sectionTitle}>Payment Information</h4>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Method:</span>
                      <span className={styles.infoValue}>{order.paymentInfo?.paymentMethod}</span>
                    </div>
                    {order.paymentInfo?.paymentMethod === 'Online' && (
                      <>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Type:</span>
                          <span className={styles.infoValue}>{order.paymentInfo?.onlinePaymentType}</span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>Reference:</span>
                          <span className={styles.infoValue}>{order.paymentInfo?.referenceNumber}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* STATUS CHANGE BUTTONS */}
                <div className={styles.statusButtonsSection}>
                  <h4 className={styles.sectionTitle}>Update Status</h4>
                  <div className={styles.statusButtons}>
                    <button
                      className={`${styles.statusBtn} ${styles.pendingBtn} ${order.orderStatus === 'Pending' ? styles.activeStatus : ''}`}
                      onClick={() => handleStatusChange(order, 'Pending')}
                      title="Mark as Pending"
                    >
                      <ClockIcon size={14} />
                      Pending
                    </button>
                    <button
                      className={`${styles.statusBtn} ${styles.paidBtn} ${order.orderStatus === 'Paid' ? styles.activeStatus : ''}`}
                      onClick={() => handleStatusChange(order, 'Paid')}
                      title="Mark as Paid"
                    >
                      <CreditCard size={14} />
                      Paid
                    </button>
                    <button
                      className={`${styles.statusBtn} ${styles.ongoingBtn} ${order.orderStatus === 'Ongoing' ? styles.activeStatus : ''}`}
                      onClick={() => handleStatusChange(order, 'Ongoing')}
                      title="Mark as Ongoing"
                    >
                      <Truck size={14} />
                      Ongoing
                    </button>
                    <button
                      className={`${styles.statusBtn} ${styles.completedBtn} ${order.orderStatus === 'Completed' ? styles.activeStatus : ''}`}
                      onClick={() => handleStatusChange(order, 'Completed')}
                      title="Mark as Completed"
                    >
                      <Check size={14} />
                      Completed
                    </button>
                    <button
                      className={`${styles.statusBtn} ${styles.cancelledBtn} ${order.orderStatus === 'Cancelled' ? styles.activeStatus : ''}`}
                      onClick={() => handleStatusChange(order, 'Cancelled')}
                      title="Cancel Order"
                    >
                      <X size={14} />
                      Cancel
                    </button>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className={styles.actions}>
                  <button
                    className={`${styles.actionBtn} ${styles.editBtn}`}
                    onClick={() => handleEditClick(order)}
                    title="Edit Order"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    onClick={() => handleDeleteOrder(order.docId, order.orderId)}
                    title="Delete Order"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
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