import { useState, useEffect } from "react";
import { Search, Eye, Edit, Trash2, X, FileText, Download, Upload, File, FileType, FileImage, FileArchive, FolderPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const mockDocuments = [
  { 
    id: '1',
    name: 'Credit Report - John Doe',
    type: 'PDF',
    category: 'Credit Report',
    client: 'John Doe',
    uploaded: '2 days ago',
    size: '2.4 MB',
    status: 'Processed',
    notes: 'Latest credit report from Experian'
  },
  { 
    id: '2',
    name: 'Dispute Letter - Jane Smith',
    type: 'DOCX',
    category: 'Dispute Letter',
    client: 'Jane Smith',
    uploaded: '1 week ago',
    size: '1.2 MB',
    status: 'Processed',
    notes: 'Dispute letter for Chase credit card'
  },
  { 
    id: '3',
    name: 'ID Verification - Sarah Lee',
    type: 'JPG',
    category: 'Identification',
    client: 'Sarah Lee',
    uploaded: '3 days ago',
    size: '3.5 MB',
    status: 'Pending',
    notes: 'Driver\'s license and utility bill'
  },
  { 
    id: '4',
    name: 'Payment Receipt - Mike D',
    type: 'PDF',
    category: 'Payment',
    client: 'Mike D',
    uploaded: '5 days ago',
    size: '0.8 MB',
    status: 'Processed',
    notes: 'Payment confirmation for March'
  },
];

const emptyDocument = { 
  id: '',
  name: '',
  type: 'PDF',
  category: '',
  client: '',
  uploaded: 'just now',
  size: '0 MB',
  status: 'Pending',
  notes: ''
};

const PAGE_SIZE = 10;

// Add shimmer skeleton CSS
const shimmer = `\n  @keyframes shimmer {\n    0% { background-position: -400px 0; }\n    100% { background-position: 400px 0; }\n  }\n`;

export default function Documents() {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<typeof mockDocuments>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof mockDocuments[0] | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ...emptyDocument });
  const [formError, setFormError] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'processed' | 'pending'>('all');

  useEffect(() => {
    setTimeout(() => {
      setDocuments(mockDocuments);
      setLoading(false);
    }, 1200);
  }, []);

  const filtered = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.client.toLowerCase().includes(search.toLowerCase()) ||
      doc.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' ||
      (filter === 'processed' && doc.status === 'Processed') ||
      (filter === 'pending' && doc.status === 'Pending');

    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Bulk actions
  const allChecked = paginated.length > 0 && paginated.every(d => checked.includes(d.id));
  const someChecked = paginated.some(d => checked.includes(d.id));

  function handleAddDocument(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.client.trim() || !form.category.trim()) {
      setFormError('Name, Client, and Category are required.');
      toast.error('Name, Client, and Category are required.');
      return;
    }
    if (editIndex !== null) {
      // Edit
      setDocuments(documents => documents.map((d, i) => i === editIndex ? { ...form } : d));
      toast.success('Document updated!');
    } else {
      // Add
      setDocuments([{ ...form, id: Math.random().toString(36).substr(2, 9) }, ...documents]);
      toast.success('Document added!');
    }
    setShowAdd(false);
    setForm({ ...emptyDocument });
    setFormError('');
    setEditIndex(null);
  }

  function handleEdit(document: typeof mockDocuments[0], idx: number) {
    setForm(document);
    setEditIndex(idx);
    setShowAdd(true);
  }

  function handleCheck(id: string, checkedVal: boolean) {
    setChecked(prev => checkedVal ? [...prev, id] : prev.filter(e => e !== id));
  }

  function handleCheckAll(checkedVal: boolean) {
    setChecked(checkedVal ? paginated.map(d => d.id) : checked.filter(e => !paginated.map(d => d.id).includes(e)));
  }

  function handleBulkDelete() {
    setDocuments(documents => documents.filter(d => !checked.includes(d.id)));
    setChecked([]);
    toast.success('Selected documents deleted!');
  }

  function getFileTypeIcon(type: string) {
    switch (type) {
      case 'PDF':
        return <FileText className="w-4 h-4 text-red-500" />;
      case 'DOCX':
        return <FileType className="w-4 h-4 text-blue-500" />;
      case 'JPG':
      case 'PNG':
        return <FileImage className="w-4 h-4 text-green-500" />;
      case 'ZIP':
      case 'RAR':
        return <FileArchive className="w-4 h-4 text-yellow-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-6">
        <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
        <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition text-base" onClick={() => { setShowAdd(true); setEditIndex(null); setForm({ ...emptyDocument }); }}>
          <Upload className="w-5 h-5" /> Upload Document
        </button>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="relative w-full max-w-xs">
          <input
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white"
            placeholder="Search documents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${filter === 'processed' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setFilter('processed')}
          >
            Processed
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${filter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
        </div>
        {someChecked && (
          <button className="ml-2 px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition" onClick={handleBulkDelete}>
            Delete Selected
          </button>
        )}
      </div>
      {loading ? (
        <>
          <style>{shimmer}</style>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-12 w-full rounded-lg relative overflow-hidden bg-gray-100"
                style={{ position: 'relative' }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
                    backgroundSize: '400px 100%',
                    animation: 'shimmer 1.2s infinite',
                  }}
                />
              </div>
            ))}
          </div>
        </>
      ) : paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <FolderPlus className="w-16 h-16 text-indigo-200 mb-4" />
          <div className="text-xl font-semibold text-gray-500 mb-2">No documents found</div>
          <div className="text-gray-400 mb-6">Upload your first document to get started.</div>
          <button
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition text-base"
            onClick={() => { setShowAdd(true); setEditIndex(null); setForm({ ...emptyDocument }); }}
          >
            <Upload className="w-5 h-5" /> Upload Document
          </button>
        </div>
      ) : (
        <motion.table initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full text-sm bg-white rounded-2xl shadow-lg overflow-hidden">
          <thead>
            <tr className="text-gray-400 text-xs bg-gray-50">
              <th className="py-3 px-4"><input type="checkbox" checked={allChecked} ref={el => { if (el) el.indeterminate = !allChecked && someChecked; }} onChange={e => handleCheckAll(e.target.checked)} /></th>
              <th className="text-left font-normal py-3 px-4">Name</th>
              <th className="text-left font-normal py-3 px-4">Type</th>
              <th className="text-left font-normal py-3 px-4">Category</th>
              <th className="text-left font-normal py-3 px-4">Client</th>
              <th className="text-left font-normal py-3 px-4">Status</th>
              <th className="text-left font-normal py-3 px-4">Size</th>
              <th className="text-left font-normal py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((document, idx) => (
              <tr key={document.id} className="border-t border-gray-100 hover:bg-indigo-50 transition-colors">
                <td className="py-3 px-4"><input type="checkbox" checked={checked.includes(document.id)} onChange={e => handleCheck(document.id, e.target.checked)} /></td>
                <td className="py-3 px-4 font-medium text-gray-900">{document.name}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    {getFileTypeIcon(document.type)}
                    <span className="text-gray-700">{document.type}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-700">{document.category}</td>
                <td className="py-3 px-4 text-gray-700">{document.client}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${document.status === 'Processed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {document.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500">{document.size}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button className="p-1 rounded hover:bg-indigo-100 transition" title="View" onClick={() => setSelected(document)}><Eye className="w-4 h-4 text-indigo-600" /></button>
                  <button className="p-1 rounded hover:bg-indigo-100 transition" title="Download"><Download className="w-4 h-4 text-indigo-600" /></button>
                  <button className="p-1 rounded hover:bg-indigo-100 transition" title="Edit" onClick={() => handleEdit(document, (page - 1) * PAGE_SIZE + idx)}><Edit className="w-4 h-4 text-indigo-600" /></button>
                  <button className="p-1 rounded hover:bg-red-100 transition" title="Delete" onClick={() => { setDocuments(documents => documents.filter(d => d.id !== document.id)); toast.success('Document deleted!'); }}><Trash2 className="w-4 h-4 text-red-500" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </motion.table>
      )}
      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div className="font-bold text-lg text-gray-900">Document Details</div>
              <button onClick={() => setSelected(null)} className="p-2 rounded hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
              <div>
                <div className="text-xs text-gray-400 mb-1">Name</div>
                <div className="font-semibold text-gray-900">{selected.name}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Type</div>
                <div className="flex items-center gap-1">
                  {getFileTypeIcon(selected.type)}
                  <span className="text-gray-700">{selected.type}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Category</div>
                <div className="text-gray-700">{selected.category}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Client</div>
                <div className="text-gray-700">{selected.client}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Status</div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${selected.status === 'Processed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {selected.status}
                </span>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Size</div>
                <div className="text-gray-500">{selected.size}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Uploaded</div>
                <div className="text-gray-500">{selected.uploaded}</div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Notes</div>
                <div className="text-gray-700">{selected.notes}</div>
              </div>
            </div>
          </motion.div>
        )}
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
              <button onClick={() => { setShowAdd(false); setEditIndex(null); setForm({ ...emptyDocument }); }} className="absolute top-4 right-4 p-2 rounded hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <div className="font-bold text-lg text-gray-900 mb-4">{editIndex !== null ? 'Edit Document' : 'Upload Document'}</div>
              <form className="space-y-4" onSubmit={handleAddDocument}>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Name *</label>
                  <input className="w-full border rounded px-3 py-2 text-sm" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Type</label>
                  <select className="w-full border rounded px-3 py-2 text-sm" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="JPG">JPG</option>
                    <option value="PNG">PNG</option>
                    <option value="ZIP">ZIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Category *</label>
                  <select className="w-full border rounded px-3 py-2 text-sm" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
                    <option value="">Select Category</option>
                    <option value="Credit Report">Credit Report</option>
                    <option value="Dispute Letter">Dispute Letter</option>
                    <option value="Identification">Identification</option>
                    <option value="Payment">Payment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Client *</label>
                  <input className="w-full border rounded px-3 py-2 text-sm" value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Status</label>
                  <select className="w-full border rounded px-3 py-2 text-sm" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option value="Pending">Pending</option>
                    <option value="Processed">Processed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Notes</label>
                  <textarea className="w-full border rounded px-3 py-2 text-sm" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
                {formError && <div className="text-xs text-red-500">{formError}</div>}
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition" onClick={() => { setShowAdd(false); setEditIndex(null); setForm({ ...emptyDocument }); }}>Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">{editIndex !== null ? 'Save Changes' : 'Upload Document'}</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
