import { useState, useEffect, useRef } from "react";
import { Search, Eye, Edit, Trash2, X, FileText, File, FileType, FileImage, FileArchive, Plus, FilePlus, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import React from 'react';
import { notificationService } from './services/notificationService';
import { db } from './firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const PAGE_SIZE = 10;

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
  const [documents, setDocuments] = useState<Document[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Document | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<Document>({
    id: '',
    name: '',
    type: 'PDF',
    category: '',
    client: '',
    uploaded: '',
    size: '',
    status: 'Pending',
    notes: '',
    url: '',
  });
  const [formError, setFormError] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [docClient, setDocClient] = useState('');
  const [docCategory, setDocCategory] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      const docsSnapshot = await getDocs(collection(db, 'documents'));
      setDocuments(docsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Document)));
      setLoading(false);
    };
    fetchDocuments();
  }, []);

  const filtered = documents.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.client.toLowerCase().includes(search.toLowerCase()) ||
      doc.category.toLowerCase().includes(search.toLowerCase());
    
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Drag-and-drop upload handler
  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
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

  async function handleAddDocument(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.client.trim() || !form.category.trim()) {
      setFormError('Name, Client, and Category are required.');
      toast.error('Name, Client, and Category are required.');
      return;
    }
    if (editIndex !== null && selected) {
      // Edit
      await updateDoc(doc(db, 'documents', selected.id), form);
      setDocuments(docs => docs.map(d => d.id === selected.id ? { ...form, id: selected.id } : d));
      toast.success('Document updated!');
    } else {
      // Add
      const docRef = await addDoc(collection(db, 'documents'), form);
      setDocuments(docs => [{ ...form, id: docRef.id }, ...docs]);
      toast.success('Document added!');
    }
    setShowAdd(false);
    setForm({
      id: '',
      name: '',
      type: 'PDF',
      category: '',
      client: '',
      uploaded: '',
      size: '',
      status: 'Pending',
      notes: '',
      url: '',
    });
    setFormError('');
    setEditIndex(null);
    setSelected(null);
  }

  function handleEdit(document: Document, idx: number) {
    setForm(document);
    setEditIndex(idx);
    setSelected(document);
    setShowAdd(true);
  }

  function handleCheck(id: string, checkedVal: boolean) {
    setChecked(prev => checkedVal ? [...prev, id] : prev.filter(e => e !== id));
  }

  function handleCheckAll(checkedVal: boolean) {
    setChecked(checkedVal ? paginated.map(d => d.id) : checked.filter(e => !paginated.map(d => d.id).includes(e)));
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

  async function handleDelete(id: string) {
    await deleteDoc(doc(db, 'documents', id));
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
        </motion.div>

        {/* Document List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          {loading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
              ))}
              </div>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 text-gray-300">
                <FilePlus className="w-full h-full" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No documents</h3>
              <p className="mt-2 text-sm text-gray-500">Get started by uploading your first document.</p>
              <div className="mt-6">
              <button
                onClick={() => setShowAdd(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                  <Plus className="w-5 h-5 mr-2" />
                  Upload Document
              </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={checked.length === paginated.length}
                        onChange={e => handleCheckAll(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {paginated.map((doc, idx) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={checked.includes(doc.id)}
                          onChange={e => handleCheck(doc.id, e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {getFileTypeIcon(doc.type)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                            <div className="text-sm text-gray-500">{doc.size}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.client}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          doc.status === 'Processed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => window.open(doc.url, '_blank')}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(doc, idx)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {documents.length > 0 && (
            <motion.div
            initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
            >
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
                    </button>
                  </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * PAGE_SIZE + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(page * PAGE_SIZE, filtered.length)}</span> of{' '}
                  <span className="font-medium">{filtered.length}</span> results
                </p>
                </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                    </svg>
                    </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        page === i + 1
                          ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                    <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                    </button>
                </nav>
                  </div>
                </div>
            </motion.div>
          )}

        {/* Upload Modal */}
        {showAdd && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            >
            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
                >
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => setShowAdd(false)}
                    >
                      <span className="sr-only">Close</span>
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <h3 className="text-base font-semibold leading-6 text-gray-900">
                        {editIndex !== null ? 'Edit Document' : 'Upload Document'}
                      </h3>
                      <div className="mt-4">
                        <form onSubmit={handleAddDocument} className="space-y-4">
                    <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              value={form.name}
                              onChange={e => setForm({ ...form, name: e.target.value })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                    </div>
                    <div>
                            <label htmlFor="client" className="block text-sm font-medium text-gray-700">
                              Client
                            </label>
                            <input
                              type="text"
                              id="client"
                              value={form.client}
                              onChange={e => setForm({ ...form, client: e.target.value })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                    </div>
                    <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                              Category
                            </label>
                            <input
                              type="text"
                              id="category"
                              value={form.category}
                              onChange={e => setForm({ ...form, category: e.target.value })}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                    </div>
                    <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                              Notes
                            </label>
                            <textarea
                              id="notes"
                              value={form.notes}
                              onChange={e => setForm({ ...form, notes: e.target.value })}
                              rows={3}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                    </div>
                          {formError && (
                            <p className="mt-2 text-sm text-red-600">{formError}</p>
                          )}
                          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button
                              type="submit"
                              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                            >
                              {editIndex !== null ? 'Update' : 'Upload'}
                            </button>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              onClick={() => setShowAdd(false)}
                            >
                              Cancel
                            </button>
                    </div>
                        </form>
                      </div>
                      </div>
                  </div>
                </motion.div>
                  </div>
                </div>
          </motion.div>
        )}

        {/* Drag and Drop Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={e => handleFileUpload(e.target.files)}
          />
          <div className="space-y-2">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="text-sm text-gray-600">
                    <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-500"
                onClick={() => fileInputRef.current?.click()}
                    >
                Upload a file
                    </button>
              {' '}or drag and drop
                  </div>
            <p className="text-xs text-gray-500">PDF, DOCX, JPG, PNG up to 10MB</p>
                </div>
              </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
