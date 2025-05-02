import React, { useEffect, useState } from 'react';
import { getDashboardSummary } from '../services/api';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const { data } = await getDashboardSummary();
        setSummary(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  if (loading) return <p>Loading summary...</p>;
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="dashboard-stats">
        <div>
          <h2>Total Employees</h2>
          <p>{summary.totalEmployees}</p>
        </div>
        <div>
          <h2>Total Entries</h2>
          <p>{summary.totalEntries}</p>
        </div>
        <div>
          <h2>Total Payroll</h2>
          <p>{summary.totalPayroll.toFixed(2)} EUR</p>
        </div>
        <div>
          <h2>Average Salary</h2>
          <p>{summary.averageSalary.toFixed(2)} EUR</p>
        </div>
      </div>
    </main>
  );
}
