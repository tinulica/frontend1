// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardSummary } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await getDashboardSummary();
        setSummary(data);
        // simulate historical data (replace with real API later)
        setHistory([
          { month: 'Jan', payroll: data.totalPayroll * 0.7 },
          { month: 'Feb', payroll: data.totalPayroll * 0.8 },
          { month: 'Mar', payroll: data.totalPayroll * 0.9 },
          { month: 'Apr', payroll: data.totalPayroll * 0.85 },
          { month: 'May', payroll: data.totalPayroll }
        ]);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <main className="dashboard">
      <h1>Dashboard</h1>
      <div className="cards">
        <div className="card">
          <h3>Total Employees</h3>
          <p>{summary.totalEmployees}</p>
        </div>
        <div className="card">
          <h3>Total Entries</h3>
          <p>{summary.totalEntries}</p>
        </div>
        <div className="card">
          <h3>Total Payroll</h3>
          <p>€{summary.totalPayroll.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Average Salary</h3>
          <p>€{summary.averageSalary.toFixed(2)}</p>
        </div>
      </div>
      <div className="chart-container">
        <h2>Payroll Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="payroll" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
