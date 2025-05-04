// src/components/Notifications.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import api from '../services/api';
import './Notifications.css';

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  // click outside to close
  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // fetch notifications
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notifications');
      setNotes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // mark one read
  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotes(notes.map(n => n.id === id ? { ...n, readAt: new Date().toISOString() } : n));
    } catch (err) {
      console.error(err);
    }
  };

  // on open, refresh
  const toggle = () => {
    setOpen(o => !o);
    if (!open) fetchNotes();
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
                  onClick={() => markRead(n.id)}
                >
                  <div className="notif-type">{n.type}</div>
                  <div className="notif-text">
                    {/* Customize render based on your `n.data` */}
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
