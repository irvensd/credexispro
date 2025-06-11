import { useState, useEffect, useRef } from "react";
import { Search, Eye, Edit, Trash2, X, FileText, Download, Upload, File, FileType, FileImage, FileArchive, FolderPlus, Plus, FilePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import React from 'react';
import { notificationService } from './services/notificationService';

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

type Document = {
  id: string;
  name: string;
  type: string;
  category: string;
  client: string;
  uploaded: string;
  size: string;
  status: string;
  notes: string;
  url?: string;
  file?: File;
};

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
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [docClient, setDocClient] = useState('');
  const [docCategory, setDocCategory] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [plan, setPlan] = useState('basic'); // For testing, default to 'basic'
  const planOptions = ['basic', 'pro', 'enterprise'];
  const user = { plan };

  // Storage usage logic
  const getStorageLimit = (plan: string) => (plan === 'enterprise' ? 100 : 50);
  const storageUsed = 12.3; // Mocked value in GB, replace with real data later
  const storageLimit = getStorageLimit(plan);
  const storagePercent = Math.min((storageUsed / storageLimit) * 100, 100);

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

  // Drag-and-drop upload handler
  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    const newDocs: Document[] = Array.from(files).map((file: File) => {
      const fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const doc = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type.includes('pdf') ? 'PDF' : file.type.includes('image') ? 'JPG' : file.type.split('/')[1]?.toUpperCase() || 'FILE',
        category: docCategory || 'Uncategorized',
        client: docClient || 'Unassigned',
        uploaded: 'just now',
        size: fileSize,
        status: 'Pending',
        notes: '',
        url: URL.createObjectURL(file),
        file
      };
      
      // Show notification for each uploaded file
      notificationService.showFileUploadNotification(file.name, fileSize);
      
      return doc;
    });
    setDocuments((prev: Document[]) => [...newDocs, ...prev]);
    setUploading(false);
    setDocClient('');
    setDocCategory('');
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

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

  function handleDelete(id: string) {
    setDocuments(docs => docs.filter(d => d.id !== id));
    toast.success('Document deleted!');
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="documents-page"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 80, damping: 20 }}
        className="space-y-8 p-4 sm:p-8 bg-gray-50 min-h-screen"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Documents</h1>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition text-base w-full sm:w-auto"
            onClick={() => setShowAdd(true)}
          >
            <Plus className="w-5 h-5" /> Upload Document
          </button>
        </motion.div>
        {/* Filters/Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-2"
        >
          <div className="relative w-full">
            <input
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-base bg-white shadow-sm placeholder-gray-400"
              placeholder="Search documents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          {/* Add any additional filters here if needed */}
        </motion.div>
        {/* Plan dropdown for testing (remove in production) */}
        <div className="flex items-center gap-3 mb-2">
          <span className="px-2 py-1 rounded bg-gray-200 text-xs font-semibold uppercase">{plan}</span>
          <select
            value={plan}
            onChange={e => setPlan(e.target.value)}
            className="px-2 py-1 rounded border border-gray-300 text-xs bg-white"
          >
            {planOptions.map(opt => (
              <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
            ))}
          </select>
          <span className="text-xs text-gray-400">(Testing only)</span>
        </div>
        {/* Storage usage info */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-700 font-semibold">Storage Used:</span>
            <span className="text-xs text-gray-600">{storageUsed} GB of {storageLimit} GB</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-xs">
              <div
                className="h-2 bg-indigo-500 rounded-full transition-all"
                style={{ width: `${storagePercent}%` }}
              ></div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-0.5"
        >
          {loading ? (
            <div className="space-y-4 p-6">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
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
                </motion.div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FilePlus className="w-16 h-16 text-indigo-200 mb-4" />
              <div className="text-2xl font-semibold text-gray-500 mb-2">No documents found</div>
              <div className="text-gray-400 mb-6">Upload your first document to get started.</div>
              <button
                className="flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition text-base"
                onClick={() => setShowAdd(true)}
              >
                <Plus className="w-5 h-5" /> Upload Document
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <motion.table className="w-full text-base bg-white rounded-2xl shadow-xl">
                <thead>
                  <tr className="text-gray-400 text-xs bg-gray-50">
                    <th className="py-4 px-4 font-semibold tracking-wide">Name</th>
                    <th className="text-left font-semibold py-4 px-4 tracking-wide">Type</th>
                    <th className="text-left font-semibold py-4 px-4 tracking-wide">Category</th>
                    <th className="text-left font-semibold py-4 px-4 tracking-wide">Client</th>
                    <th className="text-left font-semibold py-4 px-4 tracking-wide">Status</th>
                    <th className="text-left font-semibold py-4 px-4 tracking-wide">Uploaded</th>
                    <th className="text-left font-semibold py-4 px-4 tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {paginated.map((doc, idx) => (
                      <motion.tr
                        key={doc.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ delay: 0.05 * idx, duration: 0.4 }}
                        className="border-t border-gray-100 hover:bg-indigo-50 transition-colors group"
                      >
                        <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">{doc.name}</td>
                        <td className="py-4 px-4 text-gray-700 whitespace-nowrap">{doc.type}</td>
                        <td className="py-4 px-4 text-gray-700 whitespace-nowrap">{doc.category}</td>
                        <td className="py-4 px-4 text-gray-700 whitespace-nowrap">{doc.client}</td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${doc.status === 'Processed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} shadow-sm`}>{doc.status}</span>
                        </td>
                        <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{doc.uploaded}</td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button className="p-2 rounded hover:bg-indigo-100 focus:bg-indigo-200 transition shadow-sm" title="View" onClick={() => setSelected(doc)}><Eye className="w-5 h-5 text-indigo-600" /></button>
                            <button className="p-2 rounded hover:bg-red-100 focus:bg-red-200 transition shadow-sm" title="Delete" onClick={() => handleDelete(doc.id)}><Trash2 className="w-5 h-5 text-red-500" /></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </motion.table>
            </div>
          )}
          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex justify-center items-center gap-2 mt-8"
            >
              <button
                className="px-3 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span className="text-base text-gray-500">Page {page} of {totalPages}</span>
              <button
                className="px-3 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 focus:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                disabled={page === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Upload Modal */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl"
              >
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Upload Document</h2>
                    <button
                      onClick={() => setShowAdd(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div
                  className={`p-6 ${dragActive ? 'bg-indigo-50' : 'bg-white'}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                    <Upload className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop files here or click to upload</h3>
                    <p className="text-gray-500 mb-4">Support for PDF, JPG, PNG up to 5MB</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Select Files
                    </button>
                  </div>

                  {uploading && (
                    <div className="mt-4 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
                      <p className="mt-2 text-gray-600">Uploading...</p>
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-gray-100">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowAdd(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setShowAdd(false);
                        toast.success('Document uploaded successfully!');
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Document Details Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl"
              >
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Document Details</h2>
                    <button
                      onClick={() => setSelected(null)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-gray-900">{selected.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <p className="mt-1 text-gray-900">{selected.type}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <p className="mt-1 text-gray-900">{selected.category}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Client</label>
                      <p className="mt-1 text-gray-900">{selected.client}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <p className="mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${selected.status === 'Processed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {selected.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Uploaded</label>
                      <p className="mt-1 text-gray-900">{selected.uploaded}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Notes</label>
                      <p className="mt-1 text-gray-900">{selected.notes}</p>
                    </div>
                    {/* Versioning (Pro/Enterprise only) */}
                    {(user.plan === 'pro' || user.plan === 'enterprise') ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Version History</label>
                        <div className="mt-1 text-gray-900">(Version history UI here)</div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">Upgrade to Pro for version history</div>
                    )}
                    {/* Sharing (Pro/Enterprise only) */}
                    {(user.plan === 'pro' || user.plan === 'enterprise') ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Sharing</label>
                        <div className="mt-1 text-gray-900">(Sharing UI here)</div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400">Upgrade to Pro for document sharing</div>
                    )}
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setSelected(null)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        // Handle download
                        toast.success('Document downloaded!');
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Templates section (example) */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Templates</h2>
          {user.plan === 'basic' ? (
            <div>Standard Templates (upgrade for custom templates)</div>
          ) : (
            <div>Custom Templates (Pro/Enterprise)</div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
