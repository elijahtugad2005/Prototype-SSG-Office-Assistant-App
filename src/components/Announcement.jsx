import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, Timestamp } from 'firebase/firestore';

function Announcement() {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  // Announcements
  const [announcements, setAnnouncements] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    description: '',
    venue: '',
    eventDate: '',
    eventTime: '',
    category: 'General',
    imageBase64: '',
  });
//Image previewer 
const [imagePreview, setImagePreview] = useState(null);
const [selectedImage, setSelectedImage] = useState(null);






// ========================================
// 📸 1. Image Compression Utility
// ========================================
/**
 * Compresses an image file using the Canvas API to generate a smaller 
 * Base64 string (JPEG, quality 0.8, max width 1000px) below the 1MB limit.
 * @param {File} file - The original image file selected by the user.
 * @returns {Promise<string>} A promise that resolves with the compressed Base64 Data URL.
 */
const CompressImage = (file) => {
    const maxWidth = 1000;
    const quality = 0.8;
    
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions, capping width at maxWidth
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Generate new Base64 string as JPEG with compression quality
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                
                // Optional: Check size again and warn, though the compression should help
                if (compressedBase64.length > 1024 * 1024) {
                    console.warn("Image still large. Consider lower quality or smaller dimensions.");
                }

                resolve(compressedBase64);
            };
            img.onerror = reject;
            img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const handleImageChange = async (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setAnnouncementForm(prev => ({ ...prev, imageBase64:""}))
      setImagePreview(null)
      return;
    }

    if(!file.type.startsWith('image/')){
        alert('Please select an image file.');
        return;
    }

    try {

        const compressedBase64 = await CompressImage(file);

        setAnnouncementForm((prev) => ({
          ...prev,
          imageBase64: compressedBase64
        }));
        setImagePreview(compressedBase64);
    } catch (error){
        console.error("Error processing image:", error);
        alert("Failed to process image. Please try another file.");
        setMember(prev => ({ ...prev, image64: ""}));
        setImagePreview(null);
    }
};

  // Calendar Events
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [eventForm, setEventForm] = useState({
    eventName: '',
    eventDate: '',
    eventType: 'Class',
    requiresAttendance: false,
    description: '',
  });

  // UI States
  const [activeTab, setActiveTab] = useState('announcements'); // 'announcements' or 'calendar'
  const [loading, setLoading] = useState(false);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // ========================================
  // FETCH ANNOUNCEMENTS FROM FIREBASE
  // ========================================
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'announcements'), (snapshot) => {
      const announcementsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Sort by event date (newest first)
      announcementsData.sort((a, b) => {
        const dateA = new Date(a.eventDate);
        const dateB = new Date(b.eventDate);
        return dateB - dateA;
      });

      setAnnouncements(announcementsData);
    });

    return () => unsubscribe();
  }, []);

  // ========================================
  // FETCH CALENDAR EVENTS FROM FIREBASE
  // ========================================
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'calendarEvents'), (snapshot) => {
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      eventsData.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
      setCalendarEvents(eventsData);
    });

    return () => unsubscribe();
  }, []);

  // ========================================
  // ANNOUNCEMENT HANDLERS
  // ========================================
  const handleAnnouncementChange = (e) => {
    const { name, value } = e.target;
    setAnnouncementForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
       await addDoc(collection(db, 'announcements'), {
            title: announcementForm.title,
            description: announcementForm.description,
            venue: announcementForm.venue,
            eventDate: announcementForm.eventDate,
            eventTime: announcementForm.eventTime,
            category: announcementForm.category,
            imageBase64: announcementForm.imageBase64,
            createdAt: new Date().toISOString(),
        });

        alert('✅ Announcement added successfully!');
        setAnnouncementForm({
            title: '',
            description: '',
            venue: '',
            eventDate: '',
            eventTime: '',
            category: 'General',     // ADD THIS
            imageBase64: '',       // ADD THIS
        });
        setImagePreview(null); 
        setSelectedImage(null); // ADD THIS
        setLoading(false);
    } catch (error) {
        console.error('Error adding announcement:', error);
        alert('Error adding announcement');
        setLoading(false);
    }
};
  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncementId(announcement.id);
    setAnnouncementForm({
      title: announcement.title,
      description: announcement.description,
      venue: announcement.venue,
      eventDate: announcement.eventDate,
      eventTime: announcement.eventTime,
      category: announcement.category,                              // ADD THIS
      imageBase64: announcement.imageBase64 || '',  
    });
     setImagePreview(announcement.imageBase64);
     setSelectedImage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

 const handleUpdateAnnouncement = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const announcementRef = doc(db, 'announcements', editingAnnouncementId);
        
        // Create a copy WITHOUT the imageFile object
        const dataToUpdate = {
            title: announcementForm.title,
            description: announcementForm.description,
            venue: announcementForm.venue,
            eventDate: announcementForm.eventDate,
            eventTime: announcementForm.eventTime,
            category: announcementForm.category,
            imageBase64: announcementForm.imageBase64,
            updatedAt: new Date().toISOString(),
        };

        await updateDoc(announcementRef, dataToUpdate);

        alert('✅ Announcement updated successfully!');
        setAnnouncementForm({
            title: '',
            description: '',
            venue: '',
            eventDate: '',
            eventTime: '',
            category: 'General',
            imageBase64: '',
        });
        setEditingAnnouncementId(null);
        setImagePreview(null);
        setSelectedImage(null);
        setLoading(false);
    } catch (error) {
        console.error('Error updating announcement:', error);
        alert('Error updating announcement');
        setLoading(false);
    }
};

  const handleDeleteAnnouncement = async (id, title) => {
    if (!window.confirm(`Delete announcement: "${title}"?`)) return;

    try {
      await deleteDoc(doc(db, 'announcements', id));
      alert('🗑️ Announcement deleted!');
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Error deleting announcement');
    }
  };

  // ========================================
  // CALENDAR EVENT HANDLERS
  // ========================================
  const handleEventChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'calendarEvents'), {
        ...eventForm,
        createdAt: new Date().toISOString(),
      });

      alert('✅ Event added to calendar!');
      setEventForm({
        eventName: '',
        eventDate: '',
        eventType: 'Class',
        requiresAttendance: false,
        description: '',
      });
      setLoading(false);
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Error adding event');
      setLoading(false);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEventId(event.id);
    setEventForm({
      eventName: event.eventName,
      eventDate: event.eventDate,
      eventType: event.eventType,
      requiresAttendance: event.requiresAttendance,
      description: event.description,
    });
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventRef = doc(db, 'calendarEvents', editingEventId);
      await updateDoc(eventRef, {
        ...eventForm,
        updatedAt: new Date().toISOString(),
      });

      alert('✅ Event updated!');
      setEventForm({
        eventName: '',
        eventDate: '',
        eventType: 'Class',
        requiresAttendance: false,
        description: '',
        imageBase64:'',
      });
      setEditingEventId(null);
      setLoading(false);
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event');
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id, name) => {
    if (!window.confirm(`Delete event: "${name}"?`)) return;

    try {
      await deleteDoc(doc(db, 'calendarEvents', id));
      alert('🗑️ Event deleted!');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
    }
  };

  // ========================================
  // CALENDAR HELPERS
  // ========================================
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const getEventsForDate = (day) => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarEvents.filter(event => event.eventDate === dateStr);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getCategoryColor = (category) => {
    const colors = {
      'General': '#fe5c03',
      'Academic': '#2196f3',
      'Sports': '#4caf50',
      'Cultural': '#9c27b0',
      'Meeting': '#ff9800',
    };
    return colors[category] || '#fe5c03';
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'Class': '#2196f3',
      'Exam': '#f44336',
      'Event': '#9c27b0',
      'Holiday': '#4caf50',
      'Meeting': '#ff9800',
    };
    return colors[type] || '#2196f3';
  };



  

  // ========================================
  // RENDER CALENDAR
  // ========================================
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={styles.calendarDayEmpty}></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const events = getEventsForDate(day);
      const isToday = 
        day === new Date().getDate() && 
        selectedMonth === new Date().getMonth() && 
        selectedYear === new Date().getFullYear();

      days.push(
        <div 
          key={day} 
          style={{
            ...styles.calendarDay,
            ...(isToday ? styles.calendarDayToday : {})
          }}
        >
          <div style={styles.calendarDayNumber}>{day}</div>
          {events.length > 0 && (
            <div style={styles.calendarDayEvents}>
              {events.slice(0, 2).map((event, idx) => (
                <div 
                  key={idx}
                  style={{
                    ...styles.calendarEventDot,
                    backgroundColor: getEventTypeColor(event.eventType)
                  }}
                  title={event.eventName}
                >
                  {event.eventName.substring(0, 10)}...
                </div>
              ))}
              {events.length > 2 && (
                <div style={styles.calendarMoreEvents}>+{events.length - 2}</div>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div style={styles.calendarWrapper}>
        <div style={styles.calendarHeader}>
          <button 
            onClick={() => {
              if (selectedMonth === 0) {
                setSelectedMonth(11);
                setSelectedYear(selectedYear - 1);
              } else {
                setSelectedMonth(selectedMonth - 1);
              }
            }}
            style={styles.calendarNavButton}
          >
            ◀
          </button>
          <h3 style={styles.calendarTitle}>
            {monthNames[selectedMonth]} {selectedYear}
          </h3>
          <button 
            onClick={() => {
              if (selectedMonth === 11) {
                setSelectedMonth(0);
                setSelectedYear(selectedYear + 1);
              } else {
                setSelectedMonth(selectedMonth + 1);
              }
            }}
            style={styles.calendarNavButton}
          >
            ▶
          </button>
        </div>
        
        <div style={styles.calendarDayNames}>
          {dayNames.map(name => (
            <div key={name} style={styles.calendarDayName}>{name}</div>
          ))}
        </div>
        
        <div style={styles.calendarGrid}>
          {days}
        </div>
      </div>
    );
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.mainTitle}>Announcements & Events</h2>
        <p style={styles.headerSubtitle}>Manage announcements and calendar events</p>
      </div>

      {/* TAB NAVIGATION */}
      <div style={styles.tabContainer}>
        <button
          onClick={() => setActiveTab('announcements')}
          style={{
            ...styles.tab,
            ...(activeTab === 'announcements' ? styles.tabActive : {})
          }}
        >
          📢 Announcements ({announcements.length})
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          style={{
            ...styles.tab,
            ...(activeTab === 'calendar' ? styles.tabActive : {})
          }}
        >
          📅 Event Calendar ({calendarEvents.length})
        </button>
      </div>

      {/* ANNOUNCEMENTS TAB */}
      {activeTab === 'announcements' && (
        <div>
          {/* ADD/EDIT ANNOUNCEMENT FORM */}
          <div style={styles.formWrapper}>
            <h3 style={styles.sectionTitle}>
              {editingAnnouncementId ? 'Edit Announcement' : 'Create New Announcement'}
            </h3>

            <form onSubmit={editingAnnouncementId ? handleUpdateAnnouncement : handleAddAnnouncement} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Announcement Title *</label>
                <input
                  type="text"
                  name="title"
                  value={announcementForm.title}
                  onChange={handleAnnouncementChange}
                  placeholder="e.g., Student Council Meeting"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description *</label>
                <textarea
                  name="description"
                  value={announcementForm.description}
                  onChange={handleAnnouncementChange}
                  placeholder="Detailed description of the announcement..."
                  rows="4"
                  style={styles.textarea}
                  required
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Venue *</label>
                  <input
                    type="text"
                    name="venue"
                    value={announcementForm.venue}
                    onChange={handleAnnouncementChange}
                    placeholder="e.g., Main Auditorium"
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Category *</label>
                  <select
                    name="category"
                    value={announcementForm.category}
                    onChange={handleAnnouncementChange}
                    style={styles.select}
                  >
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Sports">Sports</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Meeting">Meeting</option>
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Event Date *</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={announcementForm.eventDate}
                    onChange={handleAnnouncementChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Event Time *</label>
                  <input
                    type="time"
                    name="eventTime"
                    value={announcementForm.eventTime}
                    onChange={handleAnnouncementChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

             <div style={styles.formGroup}>
                <label style={styles.label}>Announcement Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={styles.fileInput}
                />
                <p style={styles.helperText}>
                    Image will be saved to: <code>/AnnouncementPic/[filename]</code>
                </p>
                
                {imagePreview && (
                    <div style={styles.imagePreviewContainer}>
                        <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
                    </div>
                )}
            </div>
              

              <div style={styles.buttonGroup}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.submitButton,
                    ...(loading ? styles.submitButtonDisabled : {})
                  }}
                >
                  {loading 
                    ? 'Processing...' 
                    : editingAnnouncementId 
                      ? '💾 Update Announcement' 
                      : '➕ Add Announcement'}
                </button>

                {editingAnnouncementId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAnnouncementId(null);
                      setAnnouncementForm({
                        title: '',
                        description: '',
                        venue: '',
                        eventDate: '',
                        eventTime: '',
                        category: 'General',
                        imageBase64: '',
                      });
                    }}
                    style={styles.cancelButton}
                  >
                    ❌ Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* ANNOUNCEMENTS LIST */}
          <div style={styles.announcementsWrapper}>
            <h3 style={styles.sectionTitle}>All Announcements</h3>
            
            {announcements.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>No announcements yet. Create your first one above!</p>
              </div>
            ) : (
              <div style={styles.announcementsList}>
                {announcements.map((announcement) => (
                  <div key={announcement.id} style={styles.announcementCard}>
                    <div 
                      style={styles.announcementHeader}
                      onClick={() => setExpandedId(expandedId === announcement.id ? null : announcement.id)}
                    >
                      <div style={styles.announcementHeaderLeft}>
                        <h4 style={styles.announcementTitle}>{announcement.title}</h4>
                        <div style={styles.announcementMeta}>
                          <span 
                            style={{
                              ...styles.categoryBadge,
                              backgroundColor: getCategoryColor(announcement.category)
                            }}
                          >
                            {announcement.category}
                          </span>
                          <span style={styles.announcementDate}>
                            📅 {formatDate(announcement.eventDate)} at {announcement.eventTime}
                          </span>
                        </div>
                      </div>
                      <div style={styles.expandIcon}>
                        {expandedId === announcement.id ? '▲' : '▼'}
                      </div>
                    </div>


                                            {/* ADD THIS BLOCK */}
                        {announcement.imageBase64 && (
                            <div style={styles.announcementImageWrapper}>
                                <img 
                                    src={announcement.imageBase64}
                                    alt={announcement.title}
                                    style={styles.announcementImage}
                                    onError={(e) => {
                                        e.target.src = '/AnnouncementPic/default.jpg';
                                    }}
                                />
                            </div>
                        )}

                    {expandedId === announcement.id && (
                      <div style={styles.announcementBody}>
                        <div style={styles.announcementDetail}>
                          <strong style={styles.detailLabel}>Description:</strong>
                          <p style={styles.detailValue}>{announcement.description}</p>
                        </div>

                        <div style={styles.announcementDetail}>
                          <strong style={styles.detailLabel}>Venue:</strong>
                          <p style={styles.detailValue}>📍 {announcement.venue}</p>
                        </div>

                        <div style={styles.announcementActions}>
                          <button
                            onClick={() => handleEditAnnouncement(announcement)}
                            style={styles.editButton}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAnnouncement(announcement.id, announcement.title)}
                            style={styles.deleteButton}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CALENDAR TAB */}
      {activeTab === 'calendar' && (
        <div>
          {/* ADD/EDIT EVENT FORM */}
          <div style={styles.formWrapper}>
            <h3 style={styles.sectionTitle}>
              {editingEventId ? 'Edit Calendar Event' : 'Add Calendar Event'}
            </h3>

            <form onSubmit={editingEventId ? handleUpdateEvent : handleAddEvent} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Event Name *</label>
                <input
                  type="text"
                  name="eventName"
                  value={eventForm.eventName}
                  onChange={handleEventChange}
                  placeholder="e.g., Midterm Exam - Math"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Event Date *</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={eventForm.eventDate}
                    onChange={handleEventChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Event Type *</label>
                  <select
                    name="eventType"
                    value={eventForm.eventType}
                    onChange={handleEventChange}
                    style={styles.select}
                  >
                    <option value="Class">Class</option>
                    <option value="Exam">Exam</option>
                    <option value="Event">Event</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Meeting">Meeting</option>
                  </select>
                </div>
              </div>

              <div style={styles.checkboxGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="requiresAttendance"
                    checked={eventForm.requiresAttendance}
                    onChange={handleEventChange}
                    style={styles.checkbox}
                  />
                  <span>Requires Attendance</span>
                </label>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description (Optional)</label>
                <textarea
                  name="description"
                  value={eventForm.description}
                  onChange={handleEventChange}
                  placeholder="Additional details about this event..."
                  rows="3"
                  style={styles.textarea}
                />
              </div>

              <div style={styles.buttonGroup}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.submitButton,
                    ...(loading ? styles.submitButtonDisabled : {})
                  }}
                >
                  {loading 
                    ? 'Processing...' 
                    : editingEventId 
                      ? '💾 Update Event' 
                      : '➕ Add Event'}
                </button>

                {editingEventId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEventId(null);
                      setEventForm({
                        eventName: '',
                        eventDate: '',
                        eventType: 'Class',
                        requiresAttendance: false,
                        description: '',
                      });
                    }}
                    style={styles.cancelButton}
                  >
                    ❌ Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* CALENDAR VIEW */}
          <div style={styles.calendarSection}>
            {renderCalendar()}
          </div>

          {/* EVENTS LIST */}
          <div style={styles.eventsListWrapper}>
            <h3 style={styles.sectionTitle}>Upcoming Events</h3>
            
            {calendarEvents.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>No events scheduled yet.</p>
              </div>
            ) : (
              <div style={styles.eventsList}>
                {calendarEvents.map((event) => (
                  <div key={event.id} style={styles.eventCard}>
                    <div style={styles.eventCardHeader}>
                      <div>
                        <h4 style={styles.eventCardTitle}>{event.eventName}</h4>
                        <p style={styles.eventCardDate}>
                          📅 {formatDate(event.eventDate)}
                        </p>
                      </div>
                      <div style={styles.eventBadges}>
                        <span 
                          style={{
                            ...styles.eventTypeBadge,
                            backgroundColor: getEventTypeColor(event.eventType)
                          }}
                        >
                          {event.eventType}
                        </span>
                        {event.requiresAttendance && (
                          <span style={styles.attendanceBadge}>
                            ✓ Attendance Required
                          </span>
                        )}
                      </div>
                    </div>

                    {event.description && (
                      <p style={styles.eventCardDesc}>{event.description}</p>
                    )}

                    <div style={styles.eventCardActions}>
                      <button
                        onClick={() => handleEditEvent(event.id)}
                        style={styles.editButton}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id, event.eventName)}
                        style={styles.deleteButton}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ========================================
// STYLES
// ========================================
const styles = {
  container: {
    width: '100%',
    maxWidth: '100%',
    padding: '1.5rem',
    backgroundColor: '#4c1515',
    borderRadius: '1rem',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box',
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
  tabContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '0.8rem 1.5rem',
    backgroundColor: '#732020',
    color: '#c0c0c0',
    border: '2px solid transparent',
    borderRadius: '50px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  tabActive: {
    backgroundColor: '#fe5c03',
    color: '#000',
    borderColor: '#fe5c03',
  },
  formWrapper: {
    margin: '0 auto',
    backgroundColor: '#5a1a1a',
    borderRadius: '1rem',
    padding: '2rem',
    marginBottom: '2rem',
    border: '1px solid rgba(254, 92, 3, 0.2)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#fe5c03',
    marginBottom: '1.5rem',
    fontWeight: 'bold',
    borderBottom: '2px solid rgba(254, 92, 3, 0.3)',
    paddingBottom: '0.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  label: {
    fontSize: '0.9rem',
    color: '#f1f1f1',
    marginBottom: '0.4rem',
    fontWeight: '600',
  },
  input: {
    padding: '0.8rem',
    border: '1px solid #7a2a2a',
    borderRadius: '0.5rem',
    backgroundColor: '#732020',
    color: '#f1f1f1',
    fontSize: '0.95rem',
    outline: 'none',
  },
  textarea: {
    padding: '0.8rem',
    border: '1px solid #7a2a2a',
    borderRadius: '0.5rem',
    backgroundColor: '#732020',
    color: '#f1f1f1',
    fontSize: '0.95rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'Arial, sans-serif',
  },
  select: {
    padding: '0.8rem',
    border: '1px solid #7a2a2a',
    borderRadius: '0.5rem',
    backgroundColor: '#732020',
    color: '#f1f1f1',
    fontSize: '0.95rem',
    outline: 'none',
    cursor: 'pointer',
  },
  checkboxGroup: {
    padding: '1rem',
    backgroundColor: '#732020',
    borderRadius: '0.5rem',
    border: '1px solid rgba(254, 92, 3, 0.2)',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    color: '#f1f1f1',
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.8rem',
    flexWrap: 'wrap',
    marginTop: '1rem',
  },
  submitButton: {
    flex: 1,
    padding: '1rem',
    backgroundColor: '#fe5c03',
    color: '#000',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '200px',
  },
  submitButtonDisabled: {
    backgroundColor: '#7a2a2a',
    cursor: 'not-allowed',
    opacity: 0.6,
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
    transition: 'all 0.3s ease',
    minWidth: '200px',
  },
  announcementsWrapper: {
    backgroundColor: '#5a1a1a',
    borderRadius: '1rem',
    padding: '2rem',
    border: '1px solid rgba(254, 92, 3, 0.2)',
  },
  emptyState: {
    textAlign: 'center',
    padding: '3rem',
  },
  emptyText: {
    color: '#c0c0c0',
    fontSize: '1.1rem',
  },
  announcementsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  announcementCard: {
    backgroundColor: '#732020',
    borderRadius: '0.8rem',
    border: '1px solid rgba(254, 92, 3, 0.2)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  },
  announcementHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  announcementHeaderLeft: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: '1.3rem',
    color: '#f1f1f1',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  announcementMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  categoryBadge: {
    padding: '0.3rem 0.8rem',
    borderRadius: '15px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#fff',
  },
  announcementDate: {
    fontSize: '0.9rem',
    color: '#c0c0c0',
  },
  expandIcon: {
    fontSize: '1.2rem',
    color: '#fe5c03',
    marginLeft: '1rem',
  },
  announcementBody: {
    padding: '0 1.5rem 1.5rem 1.5rem',
    backgroundColor: '#8a2a2a',
  },
  announcementDetail: {
    marginBottom: '1rem',
  },
  detailLabel: {
    color: '#fe5c03',
    fontSize: '0.95rem',
    display: 'block',
    marginBottom: '0.3rem',
  },
  detailValue: {
    color: '#f1f1f1',
    fontSize: '0.95rem',
    lineHeight: '1.6',
  },
  announcementActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(254, 92, 3, 0.2)',
  },
  editButton: {
    flex: 1,
    padding: '0.8rem',
    backgroundColor: '#fe5c03',
    color: '#000',
    border: 'none',
    borderRadius: '50px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  deleteButton: {
    flex: 1,
    padding: '0.8rem',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  calendarSection: {
    backgroundColor: '#5a1a1a',
    borderRadius: '1rem',
    padding: '2rem',
    marginBottom: '2rem',
    border: '1px solid rgba(254, 92, 3, 0.2)',
  },
  calendarWrapper: {
    width: '100%',
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  calendarTitle: {
    fontSize: '1.5rem',
    color: '#fe5c03',
    fontWeight: 'bold',
  },
  calendarNavButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#732020',
    color: '#fe5c03',
    border: '1px solid #fe5c03',
    borderRadius: '0.5rem',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  calendarDayNames: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  calendarDayName: {
    textAlign: 'center',
    color: '#fe5c03',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    padding: '0.5rem',
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '0.5rem',
  },
  calendarDay: {
    minHeight: '80px',
    backgroundColor: '#732020',
    borderRadius: '0.5rem',
    padding: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(254, 92, 3, 0.1)',
  },
  calendarDayToday: {
    border: '2px solid #fe5c03',
    backgroundColor: '#8a2a2a',
  },
  calendarDayEmpty: {
    minHeight: '80px',
  },
  calendarDayNumber: {
    fontSize: '0.9rem',
    color: '#f1f1f1',
    fontWeight: 'bold',
    marginBottom: '0.3rem',
  },
  calendarDayEvents: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  calendarEventDot: {
    fontSize: '0.7rem',
    color: '#fff',
    padding: '0.2rem 0.4rem',
    borderRadius: '10px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  calendarMoreEvents: {
    fontSize: '0.7rem',
    color: '#c0c0c0',
    fontStyle: 'italic',
    marginTop: '0.2rem',
  },
  eventsListWrapper: {
    backgroundColor: '#5a1a1a',
    borderRadius: '1rem',
    padding: '2rem',
    border: '1px solid rgba(254, 92, 3, 0.2)',
  },
  eventsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  eventCard: {
    backgroundColor: '#732020',
    borderRadius: '0.8rem',
    padding: '1.5rem',
    border: '1px solid rgba(254, 92, 3, 0.2)',
  },
  eventCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  eventCardTitle: {
    fontSize: '1.2rem',
    color: '#f1f1f1',
    marginBottom: '0.3rem',
    fontWeight: 'bold',
  },
  eventCardDate: {
    fontSize: '0.9rem',
    color: '#c0c0c0',
  },
  eventBadges: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  eventTypeBadge: {
    padding: '0.3rem 0.8rem',
    borderRadius: '15px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    color: '#fff',
  },
  attendanceBadge: {
    padding: '0.3rem 0.8rem',
    borderRadius: '15px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    backgroundColor: '#4caf50',
    color: '#fff',
  },
  eventCardDesc: {
    color: '#c0c0c0',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    marginBottom: '1rem',
  },
  eventCardActions: {
    display: 'flex',
    gap: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(254, 92, 3, 0.2)',
  },

  fileInput: {
    padding: '0.7rem',
    border: '2px dashed #7a2a2a',
    borderRadius: '0.5rem',
    backgroundColor: '#732020',
    color: '#f1f1f1',
    fontSize: '0.9rem',
    cursor: 'pointer',
},
helperText: {
    fontSize: '0.8rem',
    color: '#c0c0c0',
    marginTop: '0.4rem',
},
imagePreviewContainer: {
    marginTop: '1rem',
    textAlign: 'center',
},
imagePreview: {
    maxWidth: '300px',
    maxHeight: '200px',
    borderRadius: '0.5rem',
    border: '2px solid #fe5c03',
},
  announcementImageWrapper: {
    width: '100%',
    maxWidth: '400px',        // Prevents excessive width
    maxHeight: '300px',       // Prevents excessive height
    height: 'auto',
    margin: '0 auto',         // Centers the wrapper horizontally
    overflow: 'hidden',
    backgroundColor: '#8a2a2a',
    padding: '0.7rem',
    borderRadius: '10px',
    boxSizing: 'border-box',
    display: 'flex',          // Flexbox for perfect centering
    justifyContent: 'center', // Horizontal centering
    alignItems: 'center',     // Vertical centering
    marginBottom: '10px',
  },
  announcementImage: {
    width: '100%',
    height: '100%',
    maxWidth: '380px',        // Slightly less than wrapper max-width
    maxHeight: '280px',       // Slightly less than wrapper max-height
    objectFit: 'cover',       // Maintains aspect ratio, crops if needed
    borderRadius: '10px',
    display: 'block',
  },

};

export default Announcement;