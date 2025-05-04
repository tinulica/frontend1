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
        salaryHistories: entry.salaryHistories || [],
        salary: entry.salaryHistories?.length
          ? entry.salaryHistories
              .sort(
                (a, b) =>
                  new Date(b.changedAt).getTime() -
                  new Date(a.changedAt).getTime()
              )[0]
              .amount
          : ''
      });
      setError(null);
    }
  }, [entry]);

  if (!isOpen || !entry) return null;

  // Now these will always be defined arrays/objects
  const { extraData, salaryHistories, salary } = formData;

  // Safely pick the latest history
  const latestHistory =
    salaryHistories.length > 0
      ? salaryHistories
          .slice() // copy
          .sort(
            (a, b) =>
              new Date(b.changedAt).getTime() -
              new Date(a.changedAt).getTime()
          )[0]
      : {};

  const handleChange = (key, value, nested = false) => {
    if (nested) {
      setFormData((prev) => ({
        ...prev,
        extraData: { ...prev.extraData, [key]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // build updated salary history
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
      onClose();
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
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* ... other fields ... */}

          {/* Additional Glovo Data */}
          {formData.platform === 'GLOVO' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Glovo Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(extraData).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700">{key}</label>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleChange(key, e.target.value, true)}
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
      <div className="flex-1" onClick={onClose} />
    </div>
  );
}
