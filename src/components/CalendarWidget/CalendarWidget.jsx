// components/CalendarWidget/CalendarWidget.jsx
// PURPOSE: Display event calendar on homepage with upcoming events
// FEATURES:
//   - Shows current month calendar
//   - Displays events on specific dates
//   - Click on date to see event details
//   - Month navigation
//   - Fetches events from Firebase in real-time

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import styles from './CalendarWidget.module.css';

function CalendarWidget() {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // ========================================
  // FETCH EVENTS FROM FIREBASE
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
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
  // HANDLE DATE CLICK
  // ========================================
  const handleDateClick = (day) => {
    const events = getEventsForDate(day);
    if (events.length > 0) {
      setSelectedDate({
        day,
        events,
        dateStr: `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      });
      setShowEventModal(true);
    }
  };

  // ========================================
  // RENDER CALENDAR GRID
  // ========================================
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.calendarDayEmpty}></div>);
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
          className={`${styles.calendarDay} ${isToday ? styles.calendarDayToday : ''} ${events.length > 0 ? styles.hasEvents : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <div className={styles.calendarDayNumber}>{day}</div>
          {events.length > 0 && (
            <div className={styles.calendarDayEvents}>
              {events.slice(0, 2).map((event, idx) => (
                <div 
                  key={idx}
                  className={styles.calendarEventDot}
                  style={{ backgroundColor: getEventTypeColor(event.eventType) }}
                  title={event.eventName}
                >
                  {event.eventName.substring(0, 8)}...
                </div>
              ))}
              {events.length > 2 && (
                <div className={styles.calendarMoreEvents}>+{events.length - 2}</div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  // ========================================
  // GET UPCOMING EVENTS (Next 5)
  // ========================================
  const getUpcomingEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return calendarEvents
      .filter(event => new Date(event.eventDate) >= today)
      .slice(0, 5);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>📅 Event Calendar</h2>
        <p className={styles.subtitle}>Stay updated with upcoming events</p>
      </div>

      {/* CALENDAR */}
      <div className={styles.calendarWrapper}>
        <div className={styles.calendarHeader}>
          <button 
            onClick={() => {
              if (selectedMonth === 0) {
                setSelectedMonth(11);
                setSelectedYear(selectedYear - 1);
              } else {
                setSelectedMonth(selectedMonth - 1);
              }
            }}
            className={styles.calendarNavButton}
          >
            ◀
          </button>
          <h3 className={styles.calendarTitle}>
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
            className={styles.calendarNavButton}
          >
            ▶
          </button>
        </div>
        
        <div className={styles.calendarDayNames}>
          {dayNames.map(name => (
            <div key={name} className={styles.calendarDayName}>{name}</div>
          ))}
        </div>
        
        <div className={styles.calendarGrid}>
          {renderCalendar()}
        </div>
      </div>

      {/* UPCOMING EVENTS LIST */}
      <div className={styles.upcomingSection}>
        <h3 className={styles.upcomingTitle}>Upcoming Events</h3>
        {getUpcomingEvents().length === 0 ? (
          <p className={styles.noEvents}>No upcoming events scheduled.</p>
        ) : (
          <div className={styles.eventsList}>
            {getUpcomingEvents().map((event) => (
              <div key={event.id} className={styles.eventItem}>
                <div 
                  className={styles.eventTypeIndicator}
                  style={{ backgroundColor: getEventTypeColor(event.eventType) }}
                />
                <div className={styles.eventDetails}>
                  <h4 className={styles.eventName}>{event.eventName}</h4>
                  <p className={styles.eventDate}>
                    📅 {formatDate(event.eventDate)}
                  </p>
                  {event.requiresAttendance && (
                    <span className={styles.attendanceBadge}>✓ Attendance Required</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EVENT DETAILS MODAL */}
      {showEventModal && selectedDate && (
        <div className={styles.modalOverlay} onClick={() => setShowEventModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                Events on {formatDate(selectedDate.dateStr)}
              </h3>
              <button 
                onClick={() => setShowEventModal(false)}
                className={styles.modalClose}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              {selectedDate.events.map((event) => (
                <div key={event.id} className={styles.modalEvent}>
                  <div className={styles.modalEventHeader}>
                    <h4 className={styles.modalEventName}>{event.eventName}</h4>
                    <span 
                      className={styles.modalEventType}
                      style={{ backgroundColor: getEventTypeColor(event.eventType) }}
                    >
                      {event.eventType}
                    </span>
                  </div>
                  {event.description && (
                    <p className={styles.modalEventDesc}>{event.description}</p>
                  )}
                  {event.requiresAttendance && (
                    <p className={styles.modalAttendance}>✓ Attendance Required</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarWidget;