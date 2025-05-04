// src/components/Notifications.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import {
  getNotifications,
  markNotificationRead
} from '../services/api';
import './Notifications.css';

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Fetch notifications
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data } = await getNotifications();
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Mark a single notification as read
  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotes(notes.map(n =>
        n.id === id ? { ...n, readAt: new Date().toISOString() } : n
      ));
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle dropdown & refresh on open
  const toggle = () => {
    setOpen(o => {
      const willOpen = !o;
      if (willOpen) fetchNotes();
      return willOpen;
    });
  };

  const unreadCount = notes.filter(n => !n.readAt).length;

  return (
    <div className="notif-wrapper" ref={ref}>
      <button className="icon-btn" onClick={toggle}>
        <Bell size={20} />
        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          {loading ? (
            <p className="notif-loading">Loading…</p>
          ) : notes.length === 0 ? (
            <p className="notif-empty">No notifications</p>
          ) : (
            <ul className="notif-list">
              {notes.map(n => (
                <li
                  key={n.id}
                  className={`notif-item ${n.readAt ? 'read' : 'unread'}`}
                  onClick={() => handleMarkRead(n.id)}
                >
                  <div className="notif-type">{n.type}</div>
                  <div className="notif-text">
                    {n.data.message || JSON.stringify(n.data)}
                  </div>
                  <div className="notif-time">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
