import React, { useState, useEffect } from 'react';
import type { Invoice } from '../types/Invoice';
import type { Client } from '../types/Client';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (invoice: Partial<Invoice>) => void;
  clients: Client[];
  invoice?: Invoice;
  readOnly?: boolean;
}

const statusOptions = ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'] as const;

const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, onSubmit, clients, invoice, readOnly }) => {
  const [form, setForm] = useState<Partial<Invoice>>({
    id: invoice?.id,
    clientId: clients[0]?.id ? Number(clients[0].id) : undefined,
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: '',
    status: 'Draft',
    items: [{ description: '', amount: 0 }],
    notes: '',
    ...invoice,
  });

  useEffect(() => {
    if (invoice) setForm(invoice);
    else setForm({
      id: undefined,
      clientId: clients[0]?.id ? Number(clients[0].id) : undefined,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: '',
      status: 'Draft',
      items: [{ description: '', amount: 0 }],
      notes: '',
    });
  }, [invoice, clients]);

  const total = form.items?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;

  const handleItemChange = (idx: number, field: 'description' | 'amount', value: string | number) => {
    setForm(f => ({
      ...f,
      items: f.items?.map((item, i) => i === idx ? { ...item, [field]: value } : item)
    }));
  };

  const handleAddItem = () => {
    setForm(f => ({ ...f, items: [...(f.items || []), { description: '', amount: 0 }] }));
  };

  const handleRemoveItem = (idx: number) => {
    setForm(f => ({ ...f, items: f.items?.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...form, total });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded hover:bg-gray-100">✕</button>
        <h2 className="text-2xl font-bold mb-6">{invoice ? (readOnly ? 'View Invoice' : 'Edit Invoice') : 'New Invoice'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Client</label>
              <select
                value={form.clientId}
                onChange={e => setForm(f => ({ ...f, clientId: Number(e.target.value) }))}
                className="w-full rounded border-gray-300"
                disabled={readOnly}
                required
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as Invoice['status'] }))}
                className="w-full rounded border-gray-300"
                disabled={readOnly}
                required
              >
                {statusOptions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Issue Date</label>
              <input
                type="date"
                value={form.issueDate}
                onChange={e => setForm(f => ({ ...f, issueDate: e.target.value }))}
                className="w-full rounded border-gray-300"
                disabled={readOnly}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                className="w-full rounded border-gray-300"
                disabled={readOnly}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Items</label>
            <div className="space-y-2">
              {form.items?.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={item.description}
                    onChange={e => handleItemChange(idx, 'description', e.target.value)}
                    className="flex-1 rounded border-gray-300"
                    placeholder="Description"
                    disabled={readOnly}
                    required
                  />
                  <input
                    type="number"
                    value={item.amount}
                    onChange={e => handleItemChange(idx, 'amount', Number(e.target.value))}
                    className="w-32 rounded border-gray-300"
                    placeholder="Amount"
                    min={0}
                    step={0.01}
                    disabled={readOnly}
                    required
                  />
                  {!readOnly && (
                    <button type="button" onClick={() => handleRemoveItem(idx)} className="text-red-500 hover:text-red-700 px-2">✕</button>
                  )}
                </div>
              ))}
            </div>
            {!readOnly && (
              <button type="button" onClick={handleAddItem} className="mt-2 px-3 py-1 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200">+ Add Item</button>
            )}
          </div>
          <div className="flex justify-end text-lg font-semibold">
            Total: ${total.toFixed(2)}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              className="w-full rounded border-gray-300"
              rows={2}
              disabled={readOnly}
            />
          </div>
          {!readOnly && (
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">{invoice ? 'Save Changes' : 'Create Invoice'}</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default InvoiceModal; 