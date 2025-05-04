import React, { useState, useEffect } from 'react';
import { updateEntry } from '../services/api';
import { XIcon } from '@heroicons/react/outline';

export default function EditEntryModal({ isOpen, entry, onClose, onUpdated }) {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  // Populate form when entry changes
  useEffect(() => {
    if (entry) {
      setFormData({
        fullName: entry.fullName || '',
        email: entry.email || '',
        platform: entry.platform || '',
        externalId: entry.externalId || '',
        companyName: entry.companyName || '',
        iban: entry.iban || '',
        bankName: entry.bankName || '',
        beneficiary: entry.beneficiary || '',
        extraData: entry.extraData || {},
        salaryHistories: entry.salaryHistories || []
      });
      setError(null);
    }
  }, [entry]);

  if (!isOpen || !entry) return null;

  const { extraData, salaryHistories } = formData;
  const latestHistory = [...salaryHistories].sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))[0] || {};

  const handleChange = (key, value, nested = false) => {
    if (nested) {
      setFormData(prev => ({
        ...prev,
        extraData: { ...prev.extraData, [key]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // build salary history
    const salary = formData.salary;
    let updatedHistories = salaryHistories;
    if (salary && Number(salary) !== latestHistory.amount) {
      updatedHistories = [
        ...salaryHistories,
        { amount: Number(salary), changedAt: new Date().toISOString() }
      ];
    }

    try {
      await updateEntry(entry.id, {
        ...formData,
        salaryHistories: updatedHistories
      });
      onUpdated();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Sidebar drawer */}
      <aside className="w-full lg:max-w-2xl h-full bg-white shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Entry</h2>
          <button onClick={onClose} className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={e => handleChange('fullName', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Platform</label>
              <select
                required
                value={formData.platform}
                onChange={e => handleChange('platform', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select platform</option>
                <option value="GLOVO">GLOVO</option>
                <option value="TAZZ">TAZZ</option>
                <option value="BRINGO">BRINGO</option>
                <option value="ANGAJAT">ANGAJAT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">External ID</label>
              <input
                type="text"
                value={formData.externalId}
                onChange={e => handleChange('externalId', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {/* Salary with history view */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Salary (€)</label>
              <input
                type="number"
                step="0.01"
                value={formData.salary || latestHistory.amount}
                onChange={e => handleChange('salary', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Latest Change</label>
              <p className="mt-1 text-gray-600">€{latestHistory.amount?.toFixed(2) || '0.00'} on {latestHistory.changedAt ? new Date(latestHistory.changedAt).toLocaleDateString() : '-'}</p>
            </div>
          </div>

          {/* Additional Glovo Data */}
          {formData.platform === 'GLOVO' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Glovo Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(formData.extraData).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">{key}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={e => handleChange(key, e.target.value, true)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-red-600">{error}</p>}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </aside>
      {/* Overlay backdrop */}
      <div className="flex-1" onClick={onClose}></div>
    </div>
  );
}
