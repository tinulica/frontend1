import React, { useEffect, useState } from 'react';
import { getEntries } from '../services/api';

export default function Entries() {
  const [entries, setEntries] = useState([]);
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntries() {
      try {
        const { data } = await getEntries();
        setEntries(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEntries();
  }, []);

  if (loading) return <p>Loading entries...</p>;
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <main>
      <h1>Entries</h1>
      <ul>
        {entries.map(entry => (
          <li key={entry.id}>
            <strong>{entry.id}</strong>: {entry.salaryHistories?.slice(-1)[0]?.amount} EUR
          </li>
        ))}
      </ul>
    </main>
  );
}
