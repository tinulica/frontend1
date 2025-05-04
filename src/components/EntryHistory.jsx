// src/components/EntryHistory.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSalaryHistory } from '../services/api';
import './EntryHistory.css';

export default function EntryHistory() {
  const { id } = useParams();
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError(null);
      try {
        const { data } = await getSalaryHistory(id);
        // assuming `data` is an array of { id, changedAt, amount, hours, net }
        setHistory(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [id]);

  if (loading) {
    return <p className="history-loading">Loading history…</p>;
  }

  if (error) {
    return <p className="history-error">{error}</p>;
  }

  if (!history.length) {
    return <p className="history-empty">No salary history available.</p>;
  }

  return (
    <main className="history-container">
      <h1>Salary History</h1>
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount (€)</th>
            <th>Hours</th>
            <th>Net (€)</th>
          </tr>
        </thead>
        <tbody>
          {history
            .slice()
            .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))
            .map(item => (
              <tr key={item.id}>
                <td>{new Date(item.changedAt).toLocaleDateString()}</td>
                <td>{item.amount.toFixed(2)}</td>
                <td>{item.hours}</td>
                <td>{item.net.toFixed(2)}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </main>
  );
}
