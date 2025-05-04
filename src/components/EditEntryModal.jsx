// src/components/EditEntryModal.jsx
import React, { useState, useEffect } from 'react';
import { updateEntry } from '../services/api';
import { X } from 'lucide-react';

const defaultForm = {
  fullName: '',
  email: '',
  platform: '',
  externalId: '',
  companyName: '',
  iban: '',
  bankName: '',
  beneficiary: '',
  extraData: {},
  salaryHistories: [],
  salary: ''
};

export default function EditEntryModal({ isOpen, entry, onClose, onUpdated }) {
  const [formData, setFormData] = useState(defaultForm);
  const [error, setError] = useState(null);

  // Populate form when entry changes
  useEffect(() => {
    if (entry) {
      const histories = Array.isArray(entry.salaryHistories) ? entry.salaryHistories : [];
      // pick latest amount
      const latest = histories.slice().sort(
        (a, b) => new Date(b.changedAt) - new Date(a.changedAt)
      )[0];
      setFormData({
        fullName: entry.fullName || '',
        email: entry.email || '',
        platform: entry.platform || '',
        externalId: entry.externalId || '',
        companyName: entry.companyName || '',
        iban: entry.iban || '',
        bankName: entry.bankName || '',
        beneficiary: entry.beneficiary || '',
        extraData: typeof entry.extraData === 'object' && entry.extraData ? entry.extraData : {},
        salaryHistories: histories,
        salary: latest ? latest.amount : ''
      });
      setError(null);
    }
  }, [entry]);

  if (!isOpen || !entry) return null;

  // Safely extract
  const extraData = typeof formData.extraData === 'object' && formData.extraData
    ? formData.extraData
    : {};
  const salaryHistories = Array.isArray(formData.salaryHistories)
    ? formData.salaryHistories
    : [];
  const { salary } = formData;

  // Latest history for display
  const latestHistory = salaryHistories.length
    ? salaryHistories.slice().sort(
        (a, b) => new Date(b.changedAt) - new Date(a.changedAt))
      [0]
    : {};

  const handleChange = (key, value, nested = false) => {
    if (nested) {
      setFormData(f => ({
        ...f,
        extraData: { ...f.extraData, [key]: value }
      }));
    } else {
      setFormData(f => ({ ...f, [key]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);

    // build updated salary history
    let updatedHistories = salaryHistories;
    if (salary !== '' && Number(salary) !== latestHistory.amount) {
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
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <aside className="w-full lg:max-w-2xl h-full bg-white shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Entry</h2>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Full Name', key: 'fullName', type: 'text', required: true },
              { label: 'Email', key: 'email', type: 'email', required: true },
              { label: 'Company Name', key: 'companyName', type: 'text' },
              { label: 'External ID', key: 'externalId', type: 'text' },
              { label: 'IBAN', key: 'iban', type: 'text' },
              { label: 'Bank Name', key: 'bankName', type: 'text' },
              { label: 'Beneficiary', key: 'beneficiary', type: 'text' }
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  required={field.required || false}
                  value={formData[field.key]}
                  onChange={e => handleChange(field.key, e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm
                             focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            ))}

            {/* Platform selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Platform</label>
              <select
                required
                value={formData.platform}
                onChange={e => handleChange('platform', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm
                           focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select platform</option>
                <option value="GLOVO">GLOVO</option>
                <option value="TAZZ">TAZZ</option>
                <option value="BRINGO">BRINGO</option>
                <option value="ANGAJAT">ANGAJAT</option>
              </select>
            </div>

            {/* Salary input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Salary (€)</label>
              <input
                type="number"
                step="0.01"
                value={salary}
                onChange={e => handleChange('salary', e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm
                           focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Latest change display */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Latest Change</label>
              <p className="mt-1 text-gray-600">
                €{(latestHistory.amount ?? 0).toFixed(2)} on{' '}
                {latestHistory.changedAt
                  ? new Date(latestHistory.changedAt).toLocaleDateString()
                  : '-'}
              </p>
            </div>
          </div>

          {/* Extra fields for Glovo */}
          {formData.platform === 'GLOVO' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Glovo Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(extraData).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">
                      {key}
                    </label>
                    <input
                      type="text"
                      value={value}
                      onChange={e => handleChange(key, e.target.value, true)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm
                                 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-red-600">{error}</p>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
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

      {/* Clickable backdrop */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
}
