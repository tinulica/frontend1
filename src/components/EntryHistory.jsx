import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSalaryHistory } from '../services/api';
import './EntryHistory.css';

export default function EntryHistory() {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        const { data } = await getSalaryHistory(id);
        setHistory(data);
      } catch {
        setError('Failed to load history');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id]);

  if (loading) return <p>Loading history...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <main className="history-container">
      <h1>Salary History</h1>
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Hours</th>
            <th>Net</th>
          </tr>
        </thead>
        <tbody>
          {history.map(item => (
            <tr key={item.id}>
              <td>{new Date(item.changedAt).toLocaleDateString()}</td>
              <td>€{item.amount.toFixed(2)}</td>
              <td>{item.hours}</td>
              <td>€{item.net.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
