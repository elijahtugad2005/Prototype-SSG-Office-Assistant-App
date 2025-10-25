import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';

function Data() {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editedOrder, setEditedOrder] = useState({});
  
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
        setFilteredOrders(ordersData);
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
  // APPLY FILTERS
  // ========================================
  useEffect(() => {
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
        order.customerInfo?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(result);
  }, [statusFilter, paymentFilter, searchQuery, orders]);

  // ========================================
  // HANDLE EDIT ORDER
  // ========================================
  const handleEditClick = (order) => {
    setEditingOrderId(order.docId);
    setEditedOrder({
      orderStatus: order.orderStatus,
      quantity: order.productInfo?.quantity || 1,
      paymentMethod: order.paymentInfo?.paymentMethod || 'Cash',
      onlinePaymentType: order.paymentInfo?.onlinePaymentType || '',
      referenceNumber: order.paymentInfo?.referenceNumber || '',
    });
  };

  // ========================================
  // HANDLE ORDER STATUS CHANGE
  // ========================================
  const handleEditChange = (field, value) => {
    setEditedOrder(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ========================================
  // SAVE UPDATED ORDER
  // ========================================
  const handleSaveOrder = async (docId) => {
    try {
      const orderRef = doc(db, 'orders', docId);
      
      await updateDoc(orderRef, {
        orderStatus: editedOrder.orderStatus,
        'productInfo.quantity': parseInt(editedOrder.quantity),
        'paymentInfo.paymentMethod': editedOrder.paymentMethod,
        'paymentInfo.onlinePaymentType': editedOrder.onlinePaymentType || null,
        'paymentInfo.referenceNumber': editedOrder.referenceNumber || null,
        updatedAt: new Date().toISOString(),
      });

      alert('✅ Order updated successfully!');
      setEditingOrderId(null);
      setEditedOrder({});

    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order. Please try again.');
    }
  };

  // ========================================
  // CANCEL EDIT
  // ========================================
  const handleCancelEdit = () => {
    setEditingOrderId(null);
    setEditedOrder({});
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
  // GET STATUS BADGE STYLE
  // ========================================
  const getStatusStyle = (status) => {
    const baseStyle = {
      padding: '0.4rem 0.8rem',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: 'bold',
      display: 'inline-block',
    };

    switch (status) {
      case 'Pending':
        return { ...baseStyle, backgroundColor: '#ff9800', color: '#000' };
      case 'Paid':
        return { ...baseStyle, backgroundColor: '#4caf50', color: '#fff' };
      case 'Ongoing':
        return { ...baseStyle, backgroundColor: '#2196f3', color: '#fff' };
      case 'Completed':
        return { ...baseStyle, backgroundColor: '#8bc34a', color: '#000' };
      case 'Cancelled':
        return { ...baseStyle, backgroundColor: '#f44336', color: '#fff' };
      default:
        return { ...baseStyle, backgroundColor: '#9e9e9e', color: '#fff' };
    }
  };

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
  // RENDER
  // ========================================
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.mainTitle}>Order Management</h2>
        <p style={styles.headerSubtitle}>View and manage all customer orders</p>
      </div>

      {/* STATISTICS CARDS */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📦</div>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Total Orders</span>
            <span style={styles.statValue}>{stats.total}</span>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>⏳</div>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Pending</span>
            <span style={styles.statValue}>{stats.pending}</span>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Completed</span>
            <span style={styles.statValue}>{stats.completed}</span>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Revenue</span>
            <span style={styles.statValue}>₱{stats.totalRevenue.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div style={styles.filtersSection}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Search:</label>
          <input
            type="text"
            placeholder="Order ID or Customer Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Payment:</label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="All">All Methods</option>
            <option value="Cash">Cash</option>
            <option value="Online">Online</option>
          </select>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div style={styles.tableWrapper}>
        {loading ? (
          <div style={styles.loadingState}>
            <p style={styles.loadingText}>Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>
              {orders.length === 0 
                ? 'No orders yet. Orders will appear here once customers place them.'
                : 'No orders match your filters.'}
            </p>
          </div>
        ) : (
          <div style={styles.ordersGrid}>
            {filteredOrders.map((order) => (
              <div key={order.docId} style={styles.orderCard}>
                {editingOrderId === order.docId ? (
                  // EDIT MODE
                  <div style={styles.editForm}>
                    <div style={styles.editHeader}>
                      <h4 style={styles.editTitle}>Edit Order: {order.orderId}</h4>
                    </div>

                    <div style={styles.editGroup}>
                      <label style={styles.editLabel}>Order Status:</label>
                      <select
                        value={editedOrder.orderStatus}
                        onChange={(e) => handleEditChange('orderStatus', e.target.value)}
                        style={styles.editSelect}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div style={styles.editGroup}>
                      <label style={styles.editLabel}>Quantity:</label>
                      <input
                        type="number"
                        value={editedOrder.quantity}
                        onChange={(e) => handleEditChange('quantity', e.target.value)}
                        min="1"
                        style={styles.editInput}
                      />
                    </div>

                    <div style={styles.editGroup}>
                      <label style={styles.editLabel}>Payment Method:</label>
                      <select
                        value={editedOrder.paymentMethod}
                        onChange={(e) => handleEditChange('paymentMethod', e.target.value)}
                        style={styles.editSelect}
                      >
                        <option value="Cash">Cash</option>
                        <option value="Online">Online</option>
                      </select>
                    </div>

                    {editedOrder.paymentMethod === 'Online' && (
                      <>
                        <div style={styles.editGroup}>
                          <label style={styles.editLabel}>Payment Type:</label>
                          <select
                            value={editedOrder.onlinePaymentType}
                            onChange={(e) => handleEditChange('onlinePaymentType', e.target.value)}
                            style={styles.editSelect}
                          >
                            <option value="">Select Type</option>
                            <option value="GCash">GCash</option>
                            <option value="PayMaya">PayMaya</option>
                          </select>
                        </div>

                        <div style={styles.editGroup}>
                          <label style={styles.editLabel}>Reference Number:</label>
                          <input
                            type="text"
                            value={editedOrder.referenceNumber}
                            onChange={(e) => handleEditChange('referenceNumber', e.target.value)}
                            style={styles.editInput}
                          />
                        </div>
                      </>
                    )}

                    <div style={styles.editButtons}>
                      <button
                        onClick={() => handleSaveOrder(order.docId)}
                        style={styles.saveButton}
                      >
                        💾 Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        style={styles.cancelButton}
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // VIEW MODE
                  <>
                    <div style={styles.orderHeader}>
                      <div>
                        <h3 style={styles.orderId}>{order.orderId}</h3>
                        <p style={styles.orderDate}>{formatDate(order.dateOrdered)}</p>
                      </div>
                      <div style={getStatusStyle(order.orderStatus)}>
                        {order.orderStatus}
                      </div>
                    </div>

                    <div style={styles.orderBody}>
                      {/* Customer Info */}
                      <div style={styles.infoSection}>
                        <h4 style={styles.sectionTitle}>Customer Information</h4>
                        <div style={styles.infoGrid}>
                          <div style={styles.infoItem}>
                            <span style={styles.infoLabel}>Name:</span>
                            <span style={styles.infoValue}>{order.customerInfo?.fullName}</span>
                          </div>
                          <div style={styles.infoItem}>
                            <span style={styles.infoLabel}>SchoolID:</span>
                            <span style={styles.infoValue}>{order.customerInfo?.schoolID}</span>
                          </div>
                          <div style={styles.infoItem}>
                            <span style={styles.infoLabel}>Email:</span>
                            <span style={styles.infoValue}>{order.customerInfo?.email}</span>
                          </div>
                          <div style={styles.infoItem}>
                            <span style={styles.infoLabel}>Phone:</span>
                            <span style={styles.infoValue}>{order.customerInfo?.phoneNumber}</span>
                          </div>
                          <div style={styles.infoItem}>
                            <span style={styles.infoLabel}>Program:</span>
                            <span style={styles.infoValue}>
                              {order.customerInfo?.bachelorDegree} - {order.customerInfo?.section}
                            </span>
                          </div>
                          <div style={styles.infoItem}>
                            <span style={styles.infoLabel}>Address:</span>
                            <span style={styles.infoValue}>{order.customerInfo?.address}</span>
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div style={styles.infoSection}>
                        <h4 style={styles.sectionTitle}>Product Details</h4>
                        <div style={styles.infoGrid}>
                          <div style={styles.infoItem}>
                            <span style={styles.infoLabel}>Product:</span>
                            <span style={styles.infoValue}>{order.productInfo?.productName}</span>
                          </div>
                          {order.productInfo?.size !== 'N/A' && (
                            <div style={styles.infoItem}>
                              <span style={styles.infoLabel}>Size:</span>
                              <span style={styles.infoValue}>{order.productInfo?.size}</span>
                            </div>
                          )}
                          {order.productInfo?.color !== 'N/A' && (
                            <div style={styles.infoItem}>
                              <span style={styles.infoLabel}>Color:</span>
                              <span style={styles.infoValue}>{order.productInfo?.color}</span>
                            </div>
                          )}
                          <div style={styles.infoItem}>
                            <span style={styles.infoLabel}>Quantity:</span>
                            <span style={styles.infoValue}>{order.productInfo?.quantity}</span>
                          </div>
                          <div style={styles.infoItem}>
                            <span style={styles.infoLabel}>Price per unit:</span>
                            <span style={styles.infoValue}>₱{order.productInfo?.pricePerUnit?.toFixed(2)}</span>
                          </div>
                          <div style={styles.infoItem}>
                            <span style={styles.infoLabel}>Total:</span>
                            <span style={styles.totalPrice}>₱{order.productInfo?.totalPrice?.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div style={styles.infoSection}>
                        <h4 style={styles.sectionTitle}>Payment Information</h4>
                        <div style={styles.infoGrid}>
                          <div style={styles.infoItem}>
                            <span style={styles.infoLabel}>Method:</span>
                            <span style={styles.infoValue}>{order.paymentInfo?.paymentMethod}</span>
                          </div>
                          {order.paymentInfo?.paymentMethod === 'Online' && (
                            <>
                              <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>Type:</span>
                                <span style={styles.infoValue}>{order.paymentInfo?.onlinePaymentType}</span>
                              </div>
                              <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>Reference:</span>
                                <span style={styles.infoValue}>{order.paymentInfo?.referenceNumber}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={styles.orderActions}>
                      <button
                        onClick={() => handleEditClick(order)}
                        style={styles.editButton}
                      >
                        ✏️ Edit Order
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.docId, order.orderId)}
                        style={styles.deleteButton}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ========================================
// STYLES
// ========================================
const styles = {
  container: {
    width: '100%',
    padding: '2rem',
    backgroundColor: '#4c1515',
    borderRadius: '1rem',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    marginBottom: '2rem',
  },
  mainTitle: {
    fontSize: '2rem',
    color: '#fe5c03',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: '1rem',
    color: '#c0c0c0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: '#5a1a1a',
    padding: '1.5rem',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    border: '1px solid rgba(254, 92, 3, 0.2)',
  },
  statIcon: {
    fontSize: '2.5rem',
  },
  statInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#c0c0c0',
    marginBottom: '0.3rem',
  },
  statValue: {
    fontSize: '1.8rem',
    color: '#fe5c03',
    fontWeight: 'bold',
  },
  filtersSection: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    backgroundColor: '#5a1a1a',
    padding: '1.5rem',
    borderRadius: '1rem',
    border: '1px solid rgba(254, 92, 3, 0.2)',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: '200px',
  },
  filterLabel: {
    fontSize: '0.9rem',
    color: '#f1f1f1',
    marginBottom: '0.4rem',
    fontWeight: '600',
  },
  searchInput: {
    padding: '0.8rem',
    border: '1px solid #7a2a2a',
    borderRadius: '0.5rem',
    backgroundColor: '#732020',
    color: '#f1f1f1',
    fontSize: '0.95rem',
    outline: 'none',
  },
  filterSelect: {
    padding: '0.8rem',
    border: '1px solid #7a2a2a',
    borderRadius: '0.5rem',
    backgroundColor: '#732020',
    color: '#f1f1f1',
    fontSize: '0.95rem',
    outline: 'none',
    cursor: 'pointer',
  },
  tableWrapper: {
    backgroundColor: '#5a1a1a',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: '1px solid rgba(254, 92, 3, 0.2)',
  },
  loadingState: {
    textAlign: 'center',
    padding: '3rem',
  },
  loadingText: {
    color: '#fe5c03',
    fontSize: '1.2rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
  },
  emptyText: {
    color: '#c0c0c0',
    fontSize: '1.1rem',
  },
  ordersGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  orderCard: {
    backgroundColor: '#732020',
    borderRadius: '0.8rem',
    padding: '1.5rem',
    border: '1px solid rgba(254, 92, 3, 0.2)',
    transition: 'transform 0.3s ease',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid rgba(254, 92, 3, 0.3)',
  },
  orderId: {
    fontSize: '1.3rem',
    color: '#fe5c03',
    fontWeight: 'bold',
    marginBottom: '0.3rem',
  },
  orderDate: {
    fontSize: '0.9rem',
    color: '#c0c0c0',
  },
  orderBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  infoSection: {
    backgroundColor: '#8a2a2a',
    padding: '1rem',
    borderRadius: '0.5rem',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    color: '#fe5c03',
    marginBottom: '0.8rem',
    fontWeight: 'bold',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '0.8rem',
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  infoLabel: {
    fontSize: '0.85rem',
    color: '#c0c0c0',
  },
  infoValue: {
    fontSize: '0.95rem',
    color: '#f1f1f1',
    fontWeight: '500',
  },
  totalPrice: {
    fontSize: '1.2rem',
    color: '#fe5c03',
    fontWeight: 'bold',
  },
  orderActions: {
    display: 'flex',
    gap: '1rem',
  },
  editButton: {
    flex: 1,
    padding: '0.9rem',
    backgroundColor: '#fe5c03',
    color: '#000',
    border: 'none',
    borderRadius: '50px',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  deleteButton: {
    flex: 1,
    padding: '0.9rem',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    fontSize: '0.95rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  editForm: {
    backgroundColor: '#8a2a2a',
    padding: '1.5rem',
    borderRadius: '0.8rem',
  },
  editHeader: {
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid rgba(254, 92, 3, 0.3)',
  },
  editTitle: {
    fontSize: '1.2rem',
    color: '#fe5c03',
    fontWeight: 'bold',
  },
  editGroup: {
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
  },
  editLabel: {
    fontSize: '0.9rem',
    color: '#f1f1f1',
    marginBottom: '0.4rem',
    fontWeight: '600',
  },
  editInput: {
    padding: '0.8rem',
    border: '1px solid #7a2a2a',
    borderRadius: '0.5rem',
    backgroundColor: '#9a3a3a',
    color: '#f1f1f1',
    fontSize: '0.95rem',
    outline: 'none',
  },
  editSelect: {
    padding: '0.8rem',
    border: '1px solid #7a2a2a',
    borderRadius: '0.5rem',
    backgroundColor: '#9a3a3a',
    color: '#f1f1f1',
    fontSize: '0.95rem',
    outline: 'none',
    cursor: 'pointer',
  },
  editButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  saveButton: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  cancelButton: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default Data;