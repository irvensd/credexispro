import { useState } from 'react';
import { PlusCircle, Edit, Eye, Trash2, FileText, ChevronRight, History, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LetterTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    type: 'Dispute',
    content: '',
    fields: [] as string[],
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<{ [key: string]: string }>({});
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);

  // Extract fields from content
  function extractFields(content: string) {
    const matches = content.match(/\[([^\]]+)\]/g) || [];
    return Array.from(new Set(matches.map(f => f.replace(/\[|\]/g, ''))));
  }

  // Handle template save
  function handleSaveTemplate(e: React.FormEvent) {
    e.preventDefault();
    const fields = extractFields(form.content);
    if (editIndex !== null) {
      setTemplates(templates => templates.map((t, i) => i === editIndex ? { ...form, fields, id: t.id, created: t.created } : t));
    } else {
      setTemplates([{ ...form, fields, id: Math.random().toString(36).substr(2, 9), created: new Date().toISOString().split('T')[0] }, ...templates]);
    }
    setShowBuilder(false);
    setForm({ name: '', type: 'Dispute', content: '', fields: [] });
    setEditIndex(null);
  }

  // Handle template edit
  function handleEditTemplate(template: typeof templates[0], idx: number) {
    setForm({ ...template });
    setEditIndex(idx);
    setShowBuilder(true);
  }

  // Handle template delete
  function handleDeleteTemplate(idx: number) {
    setTemplates(templates => templates.filter((_, i) => i !== idx));
  }

  // Handle preview
  function handlePreview(template: typeof templates[0]) {
    setSelectedTemplate(template);
    // Set default preview data
    const data: { [key: string]: string } = {};
    template.fields.forEach(f => { data[f] = f + ' Example'; });
    setPreviewData(data);
    setShowPreview(true);
  }

  // Generate letter with data
  function generateLetter(content: string, data: { [key: string]: string }) {
    let result = content;
    Object.entries(data).forEach(([key, value]) => {
      // Use global regex to replace all occurrences
      result = result.replace(new RegExp(`\\[${key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\]`, 'g'), value);
    });
    return result;
  }

  // Automated generation by dispute type
  function handleAutoGenerate(type: string) {
    const found = templates.find(t => t.type === type);
    if (found) handlePreview(found);
  }

  // Save to history
  function handleSaveToHistory(template: typeof templates[0], data: { [key: string]: string }) {
    setHistory(h => [{
      id: Math.random().toString(36).substr(2, 9),
      templateName: template.name,
      generatedFor: data['Client Name'] || 'Unknown',
      date: new Date().toISOString().split('T')[0],
      preview: generateLetter(template.content, data).slice(0, 60) + '...'
    }, ...h]);
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="letter-templates-page"
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Letter Templates</h1>
            <p className="text-base sm:text-lg text-gray-500 mt-1">Create, manage, and use templates for dispute and goodwill letters</p>
          </div>
          <button
            className="flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition text-base w-full sm:w-auto"
            onClick={() => { setShowBuilder(true); setEditIndex(null); setForm({ name: '', type: 'Dispute', content: '', fields: [] }); }}
          >
            <PlusCircle className="w-5 h-5" /> New Template
          </button>
        </motion.div>
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-0.5"
        >
          {templates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FileText className="w-16 h-16 text-indigo-200 mb-4" />
              <div className="text-2xl font-semibold text-gray-500 mb-2">No templates found</div>
              <div className="text-gray-400 mb-6">Create your first template to get started.</div>
              <button
                className="flex items-center gap-2 px-6 py-2 rounded-full bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition text-base"
                onClick={() => { setShowBuilder(true); setEditIndex(null); setForm({ name: '', type: 'Dispute', content: '', fields: [] }); }}
              >
                <PlusCircle className="w-5 h-5" /> New Template
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <motion.table className="w-full text-base bg-white rounded-2xl shadow-xl">
                <thead>
                  <tr className="text-gray-400 text-xs bg-gray-50">
                    <th className="py-4 px-4 font-semibold tracking-wide">Name</th>
                    <th className="text-left font-semibold py-4 px-4 tracking-wide">Type</th>
                    <th className="text-left font-semibold py-4 px-4 tracking-wide">Fields</th>
                    <th className="text-left font-semibold py-4 px-4 tracking-wide">Created</th>
                    <th className="text-left font-semibold py-4 px-4 tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {templates.map((template, idx) => (
                      <motion.tr
                        key={template.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        transition={{ delay: 0.05 * idx, duration: 0.4 }}
                        className="border-t border-gray-100 hover:bg-indigo-50 transition-colors group"
                      >
                        <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">{template.name}</td>
                        <td className="py-4 px-4 text-gray-700 whitespace-nowrap">{template.type}</td>
                        <td className="py-4 px-4 text-gray-700 whitespace-nowrap">{template.fields.length}</td>
                        <td className="py-4 px-4 text-gray-500 whitespace-nowrap">{template.created}</td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button className="p-2 rounded hover:bg-indigo-100 focus:bg-indigo-200 transition shadow-sm" title="Preview" onClick={() => handlePreview(template)}><Eye className="w-5 h-5 text-indigo-600" /></button>
                            <button className="p-2 rounded hover:bg-indigo-100 focus:bg-indigo-200 transition shadow-sm" title="Edit" onClick={() => handleEditTemplate(template, idx)}><Edit className="w-5 h-5 text-indigo-600" /></button>
                            <button className="p-2 rounded hover:bg-red-100 focus:bg-red-200 transition shadow-sm" title="Delete" onClick={() => handleDeleteTemplate(idx)}><Trash2 className="w-5 h-5 text-red-500" /></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </motion.table>
            </div>
          )}
        </motion.div>
        {/* Letter History */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-0.5"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Letter History</h2>
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <History className="w-12 h-12 text-indigo-200 mb-2" />
                <div className="text-lg font-semibold text-gray-500 mb-2">No letter history yet</div>
                <div className="text-gray-400">Generated letters will appear here.</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead>
                    <tr className="text-gray-400 text-xs bg-gray-50">
                      <th className="py-3 px-4 font-semibold tracking-wide">Template</th>
                      <th className="py-3 px-4 font-semibold tracking-wide">Client</th>
                      <th className="py-3 px-4 font-semibold tracking-wide">Date</th>
                      <th className="py-3 px-4 font-semibold tracking-wide">Preview</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id} className="border-t border-gray-100 hover:bg-indigo-50 transition-colors">
                        <td className="py-3 px-4 text-gray-900 whitespace-nowrap">{item.templateName}</td>
                        <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{item.generatedFor}</td>
                        <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{item.date}</td>
                        <td className="py-3 px-4 text-gray-500 whitespace-pre-line max-w-xs truncate">{item.preview}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
        {/* Template Builder Modal */}
        <AnimatePresence>
          {showBuilder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
            >
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative">
                <button onClick={() => { setShowBuilder(false); setEditIndex(null); setForm({ name: '', type: 'Dispute', content: '', fields: [] }); }} className="absolute top-4 right-4 p-2 rounded hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                <div className="font-bold text-lg text-gray-900 mb-4">{editIndex !== null ? 'Edit Template' : 'New Template'}</div>
                <form className="space-y-6" onSubmit={handleSaveTemplate}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Template Name *</label>
                    <input className="w-full border rounded px-3 py-2 text-sm" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select className="w-full border rounded px-3 py-2 text-sm" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                      <option value="Dispute">Dispute</option>
                      <option value="Goodwill">Goodwill</option>
                      <option value="Validation">Validation</option>
                      <option value="Identity Theft">Identity Theft</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Template Content *</label>
                    <textarea
                      className="w-full border rounded px-3 py-2 text-sm font-mono min-h-[120px]"
                      value={form.content}
                      onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                      placeholder={"e.g. To Whom It May Concern,\n\nI am writing to dispute..."}
                      required
                    />
                    <div className="text-xs text-gray-400 mt-2">Use [Field Name] for customizable fields (e.g., [Client Name], [Account Number]).</div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                      onClick={() => { setShowBuilder(false); setEditIndex(null); setForm({ name: '', type: 'Dispute', content: '', fields: [] }); }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                    >
                      {editIndex !== null ? 'Save Changes' : 'Create Template'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Letter Preview Modal */}
        <AnimatePresence>
          {showPreview && selectedTemplate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
            >
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative">
                <button onClick={() => setShowPreview(false)} className="absolute top-4 right-4 p-2 rounded hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                <div className="font-bold text-lg text-gray-900 mb-4">Letter Preview</div>
                <div className="mb-4">
                  {selectedTemplate.fields.map(field => (
                    <div key={field} className="mb-2">
                      <label className="block text-xs text-gray-500 mb-1">{field}</label>
                      <input
                        className="w-full border rounded px-3 py-2 text-sm"
                        value={previewData[field] || ''}
                        onChange={e => setPreviewData(d => ({ ...d, [field]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 border rounded p-4 font-mono whitespace-pre-wrap text-sm text-gray-800 mb-4 min-h-[120px]">
                  {generateLetter(selectedTemplate.content, previewData)}
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                    onClick={() => { handleSaveToHistory(selectedTemplate, previewData); setShowPreview(false); }}
                  >
                    Save to History
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                    onClick={() => setShowPreview(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
} 