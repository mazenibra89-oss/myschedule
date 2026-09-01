import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Plus,
  Trash2,
  Bold,
  Heading,
  CheckSquare,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  CornerDownRight,
  Eye,
  Copy,
  Check,
  Search,
  Quote,
  Paperclip,
  FileText,
  Download,
  GripVertical,
  X,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';

export default function NotesWorkspace() {
  const { notes, addNote, updateNote, deleteNote, reorderNotes, courses } = useApp();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('Akademik'); // 'Akademik' | 'Non-Akademik'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState(() => notes[0]?.id || null);
  const [activeNote, setActiveNote] = useState(() => notes[0] || null);
  const [expandedParents, setExpandedParents] = useState({ note_c1: true, note_c2: true });
  const [previewMode, setPreviewMode] = useState(true);
  const [activeMediaPreview, setActiveMediaPreview] = useState(null);
  const [activeDocumentPreview, setActiveDocumentPreview] = useState(null);
  const [copied, setCopied] = useState(false);
  const [draggedNoteId, setDraggedNoteId] = useState(null);

  const fileInputRef = useRef(null);

  // Sync activeNote with notes state automatically
  useEffect(() => {
    if (notes && notes.length > 0) {
      const currentSelected = notes.find((n) => n.id === selectedNoteId);
      if (!currentSelected) {
        setSelectedNoteId(notes[0].id);
        setActiveNote(notes[0]);
      } else {
        if (previewMode || !activeNote || activeNote.id !== currentSelected.id) {
          setActiveNote(currentSelected);
        }
      }
    }
  }, [notes, selectedNoteId, previewMode]);

  const toggleExpandParent = (parentId, e) => {
    e.stopPropagation();
    setExpandedParents((prev) => ({
      ...prev,
      [parentId]: !prev[parentId]
    }));
  };

  const handleSelectNote = (note) => {
    if (!previewMode && activeNote && activeNote.id !== note.id) {
      updateNote(activeNote);
    }
    setSelectedNoteId(note.id);
    setActiveNote(note);
  };

  // Helper for file metadata badge & color styling (PPTX, DOCX, XLSX, PDF, ZIP, etc.)
  const getFileMeta = (fileName = '', fileType = '') => {
    const name = String(fileName || '').toLowerCase();
    const type = String(fileType || '').toLowerCase();

    if (name.endsWith('.pptx') || name.endsWith('.ppt') || type.includes('presentation') || type.includes('powerpoint')) {
      return { label: 'PPTX', color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' };
    }
    if (name.endsWith('.docx') || name.endsWith('.doc') || type.includes('wordprocessingml') || type.includes('msword')) {
      return { label: 'DOCX', color: 'text-blue-400 bg-blue-500/15 border-blue-500/30' };
    }
    if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.csv') || type.includes('spreadsheet') || type.includes('excel')) {
      return { label: 'XLSX', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' };
    }
    if (name.endsWith('.pdf') || type.includes('pdf')) {
      return { label: 'PDF', color: 'text-red-400 bg-red-500/15 border-red-500/30' };
    }
    if (name.endsWith('.zip') || name.endsWith('.rar') || name.endsWith('.7z') || type.includes('zip') || type.includes('compressed')) {
      return { label: 'ZIP', color: 'text-purple-400 bg-purple-500/15 border-purple-500/30' };
    }
    return { label: 'FILE', color: 'text-[#38bdf8] bg-[#0099dd]/15 border-[#0099dd]/30' };
  };

  // Helper to extract raw direct URL for Google Drive, Vercel Blob, Base64 images
  const getDirectImageUrl = (url) => {
    if (!url || typeof url !== 'string') return '';
    if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/\/d\/([^/]+)/);
      if (match && match[1]) {
        return `https://lh3.googleusercontent.com/d/${match[1]}`;
      }
    }
    return url;
  };

  // Drag and Drop handlers for page/sub-page reordering (Enabled in Edit Mode)
  const handleDragStartNote = (e, noteId) => {
    if (previewMode) return;
    setDraggedNoteId(noteId);
    e.dataTransfer.setData('text/plain', noteId);
  };

  const handleDropNote = (e, targetNoteId) => {
    if (previewMode) return;
    e.preventDefault();
    if (!draggedNoteId || draggedNoteId === targetNoteId) return;

    const sourceIdx = notes.findIndex((n) => n.id === draggedNoteId);
    const targetIdx = notes.findIndex((n) => n.id === targetNoteId);

    if (sourceIdx !== -1 && targetIdx !== -1) {
      const updatedNotes = [...notes];
      const [draggedItem] = updatedNotes.splice(sourceIdx, 1);
      updatedNotes.splice(targetIdx, 0, draggedItem);
      if (reorderNotes) {
        reorderNotes(updatedNotes);
      }
    }
    setDraggedNoteId(null);
  };

  // Create a brand new Top-Level Note
  const handleCreateTopNote = () => {
    const newNote = {
      title: 'Halaman Catatan Baru',
      category: activeCategoryFilter === 'Non-Akademik' ? 'Non-Akademik' : 'Akademik',
      iconType: 'book',
      parentId: null,
      blocks: [
        { id: 'b_h1', type: 'h2', content: 'Judul Rangkuman Materi' },
        { id: 'b_p1', type: 'text', content: 'Tuliskan catatan detail di sini...' }
      ]
    };
    addNote(newNote);
  };

  // Create a Sub-Page (Halaman Turunan) under active note
  const handleCreateSubPage = () => {
    if (!activeNote) return;
    const parentId = activeNote.parentId ? activeNote.parentId : activeNote.id;

    const newSubNote = {
      title: 'Halaman Turunan Baru',
      category: activeNote.category || 'Akademik',
      iconType: 'file',
      parentId: parentId,
      blocks: [
        { id: 'b_sub_h1', type: 'h2', content: `Sub-Halaman dari ${activeNote.title}` },
        { id: 'b_sub_p1', type: 'text', content: 'Tuliskan catatan detail sub-halaman di sini...' }
      ]
    };
    addNote(newSubNote);
    setExpandedParents((prev) => ({ ...prev, [parentId]: true }));
  };

  // Block manipulation helpers
  const handleAddBlock = (type) => {
    if (!activeNote) return;
    let newBlock = { id: 'b_' + Date.now(), type, content: '' };
    if (type === 'h1') newBlock.content = 'Judul Utama Baru';
    if (type === 'h2') newBlock.content = 'Sub-Judul Baru';
    if (type === 'h3') newBlock.content = 'Poin Bahasan';
    if (type === 'text') newBlock.content = 'Ketik paragraf materi baru di sini...';
    if (type === 'todo') {
      newBlock.content = 'Tugas checklist...';
      newBlock.checked = false;
    }
    if (type === 'callout') newBlock.content = 'Catatan Dosen / Formula Penting';

    const updated = {
      ...activeNote,
      blocks: [...(activeNote.blocks || []), newBlock]
    };
    setActiveNote(updated);
    updateNote(updated);
  };

  // File Attachment Upload Handler (Google Drive Storage + PostgreSQL Metadata API)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeNote) return;

    const isImage = file.type ? file.type.startsWith('image/') : false;
    const formattedSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.success && (data.file?.drive_view_link || data.url)) {
          const rawUrl = data.file?.drive_view_link || data.url;
          const targetUrl = typeof rawUrl === 'string' ? rawUrl : '';

          if (targetUrl) {
            const fileBlock = {
              id: 'b_file_' + Date.now(),
              type: isImage ? 'image' : 'file',
              fileName: data.file?.name || file.name || 'File Sisipan',
              fileSize: formattedSize,
              fileType: file.type || 'application/octet-stream',
              url: targetUrl,
              driveFileId: data.file?.drive_file_id || '',
              driveViewLink: targetUrl,
              content: data.file?.name || file.name || 'File Sisipan'
            };

            const updated = {
              ...activeNote,
              blocks: [...(activeNote.blocks || []), fileBlock]
            };
            setActiveNote(updated);
            updateNote(updated);
            e.target.value = '';
            return;
          }
        }
      }
    } catch (apiErr) {
      console.warn('[Upload API Notice] Falling back to local data URL mode:', apiErr.message);
    }

    // Local Fallback if API route is not running locally or returns non-string URL
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const fileDataUrl = uploadEvent.target?.result;
      if (!fileDataUrl || typeof fileDataUrl !== 'string') return;

      const fileBlock = {
        id: 'b_file_' + Date.now(),
        type: isImage ? 'image' : 'file',
        fileName: file.name || 'File Sisipan',
        fileSize: formattedSize,
        fileType: file.type || 'application/octet-stream',
        url: fileDataUrl,
        content: file.name || 'File Sisipan'
      };

      const updated = {
        ...activeNote,
        blocks: [...(activeNote.blocks || []), fileBlock]
      };
      setActiveNote(updated);
      updateNote(updated);
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Universal File & Image Preview Handler (Handles PPTX, DOCX, XLSX, PDF, Images, Data URLs)
  const handlePreviewFile = (block) => {
    if (!block || !block.url || typeof block.url !== 'string') {
      alert('URL file atau gambar tidak valid.');
      return;
    }
    const url = block.url;
    const fileName = String(block.fileName || block.content || '').toLowerCase();

    // 1. Image preview modal
    if (block.type === 'image' || (block.fileType && String(block.fileType).startsWith('image/')) || url.startsWith('data:image/')) {
      const directUrl = getDirectImageUrl(url);
      setActiveMediaPreview({
        url: directUrl,
        fileName: block.fileName || block.content || 'Gambar Sisipan',
        fileType: block.fileType || 'image/png'
      });
      return;
    }

    // 2. Google Drive File Preview (Native Google Slide / Doc / Sheet viewer)
    if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/\/d\/([^/]+)/);
      if (match && match[1]) {
        const driveEmbedUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
        setActiveDocumentPreview({
          embedUrl: driveEmbedUrl,
          url: url,
          fileName: block.fileName || block.content || 'Pratinjau Dokumen',
          label: meta.label,
          rawBlock: block
        });
        return;
      }
    }

    // 3. HTTP / Vercel URLs for PPTX, DOCX, XLSX, PDF
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const isOfficeDoc = fileName.endsWith('.pptx') || fileName.endsWith('.ppt') ||
                          fileName.endsWith('.docx') || fileName.endsWith('.doc') ||
                          fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

      const embedUrl = isOfficeDoc
        ? `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`
        : url;

      setActiveDocumentPreview({
        embedUrl: embedUrl,
        url: url,
        fileName: block.fileName || block.content || 'Pratinjau Dokumen',
        label: meta.label,
        rawBlock: block
      });
      return;
    }

    // 4. Data URL Base64 preview conversion to Blob Object URL
    if (url.startsWith('data:')) {
      try {
        const parts = url.split(',');
        const mimeMatch = parts[0]?.match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
        const bstr = atob(parts[1] || '');
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const fileBlob = new Blob([u8arr], { type: mime });
        const objectUrl = URL.createObjectURL(fileBlob);

        const embedUrl = mime.includes('pdf')
          ? objectUrl
          : `https://docs.google.com/gview?url=${encodeURIComponent(objectUrl)}&embedded=true`;

        setActiveDocumentPreview({
          embedUrl: embedUrl,
          url: objectUrl,
          fileName: block.fileName || block.content || 'Pratinjau Dokumen',
          label: meta.label,
          rawBlock: block
        });
        return;
      } catch (err) {
        console.error('[Preview Data URL Error]:', err);
        handleDownloadFile(block);
        return;
      }
    }

    // 4. Direct HTTP / PDF / Vercel Blob / Google Drive URLs
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Universal File & Image Download Handler
  const handleDownloadFile = (block) => {
    if (!block || !block.url || typeof block.url !== 'string') {
      alert('URL file atau gambar tidak valid.');
      return;
    }
    const url = block.url;
    const fileName = block.fileName || block.content || 'file_catatan';

    if (url.startsWith('data:')) {
      try {
        const parts = url.split(',');
        const mimeMatch = parts[0]?.match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
        const bstr = atob(parts[1] || '');
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const fileBlob = new Blob([u8arr], { type: mime });
        const objectUrl = URL.createObjectURL(fileBlob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
        return;
      } catch (err) {
        console.error('[Download Data URL Error]:', err);
      }
    }

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleUpdateBlockContent = (blockId, newContent) => {
    if (!activeNote) return;
    const updatedBlocks = (activeNote.blocks || []).map((b) => (b.id === blockId ? { ...b, content: newContent } : b));
    const updated = { ...activeNote, blocks: updatedBlocks };
    setActiveNote(updated);
  };

  // Delete Block Helper (Removes specific block, image, or file attachment)
  const handleDeleteBlock = (blockId) => {
    if (!activeNote) return;
    const updatedBlocks = activeNote.blocks.filter((b) => b.id !== blockId);
    const updated = { ...activeNote, blocks: updatedBlocks };
    setActiveNote(updated);
    updateNote(updated);
  };

  const toggleTodoBlock = (blockId) => {
    if (!activeNote) return;
    const updatedBlocks = activeNote.blocks.map((b) => (b.id === blockId ? { ...b, checked: !b.checked } : b));
    const updated = { ...activeNote, blocks: updatedBlocks };
    setActiveNote(updated);
    updateNote(updated);
  };

  const handleCopyNoteContent = () => {
    if (!activeNote) return;
    const textContent = activeNote.blocks.map((b) => b.content).join('\n\n');
    navigator.clipboard.writeText(`${activeNote.title}\n\n${textContent}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter notes by Category & Search query (ONLY Akademik & Non-Akademik)
  const filteredNotes = notes.filter((n) => {
    const matchesSearch = (n.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const cat = n.category === 'Non-Akademik' ? 'Non-Akademik' : 'Akademik';
    return matchesSearch && cat === activeCategoryFilter;
  });

  // Top level parent notes (parentId === null)
  const parentNotes = filteredNotes.filter((n) => !n.parentId);

  // Compute Word Count for Active Note
  const computeWordCount = () => {
    if (!activeNote || !activeNote.blocks) return 0;
    const text = activeNote.blocks.map((b) => b.content || '').join(' ');
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  // Breadcrumb path computation
  const getBreadcrumbs = () => {
    if (!activeNote) return [];
    const crumbs = [];
    if (activeNote.category) crumbs.push(activeNote.category);

    if (activeNote.parentId) {
      const parent = notes.find((n) => n.id === activeNote.parentId);
      if (parent) crumbs.push(parent.title);
    }
    crumbs.push(activeNote.title);
    return crumbs;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Hidden File Input for Attachments (PPTX, DOCX, XLSX, PDF, ZIP, Images, etc.) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="*/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            Catatan
          </h1>
          <p className="text-xs text-[#8a90a2] mt-0.5">
            Kelola dokumen perkuliahan, sisipkan berkas/gambar, dan buat struktur bertingkat (Sub-Pages).
          </p>
        </div>
      </div>

      {/* Main Grid: Left Tree Navigation & Right Note Editor */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[640px]">
        {/* Left Side: Tree Navigation (Catatan Sidebar) */}
        <div className="card-myits p-4 bg-[#1a1b22] border-[#292b37] space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Header Title & Add Page Button BELOW Title */}
            <div className="space-y-2 border-b border-[#262835] pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Catatan
              </h2>
              <button
                onClick={handleCreateTopNote}
                className="w-full px-3 py-2 rounded-xl bg-[#0099dd] hover:bg-[#0088cc] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-cyan-900/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Halaman Baru</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#73798c] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari dalam catatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs focus:outline-none focus:border-[#0099dd]"
              />
            </div>

            {/* Filter Category Select (ONLY Akademik & Non-Akademik) */}
            <div>
              <select
                value={activeCategoryFilter}
                onChange={(e) => setActiveCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#131419] border border-[#2a2c38] text-white text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="Akademik">Akademik ({notes.filter((n) => n.category !== 'Non-Akademik').length})</option>
                <option value="Non-Akademik">Non-Akademik ({notes.filter((n) => n.category === 'Non-Akademik').length})</option>
              </select>
            </div>

            {/* Document Tree Navigation List */}
            <div className="space-y-1 overflow-y-auto max-h-[460px] pt-1 pr-1">
              {parentNotes.map((parent) => {
                const childNotes = notes.filter((n) => n.parentId === parent.id);
                const hasChildren = childNotes.length > 0;
                const isExpanded = expandedParents[parent.id];
                const isSelected = selectedNoteId === parent.id;

                return (
                  <div key={parent.id} className="space-y-1">
                    {/* Parent Note Row (Draggable in Edit Mode) */}
                    <div
                      onClick={() => handleSelectNote(parent)}
                      draggable={!previewMode}
                      onDragStart={(e) => handleDragStartNote(e, parent.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDropNote(e, parent.id)}
                      className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between group transition-all text-xs ${
                        isSelected
                          ? 'bg-[#00425a] text-white font-bold border-l-4 border-[#0099dd]'
                          : 'hover:bg-[#222430] text-[#9ea4b5]'
                      } ${!previewMode ? 'hover:border hover:border-[#38bdf8]/30' : ''}`}
                    >
                      <div className="flex items-center gap-2 truncate min-w-0">
                        {!previewMode && (
                          <GripVertical className="w-3.5 h-3.5 text-[#646a7c] cursor-grab active:cursor-grabbing shrink-0" />
                        )}

                        {hasChildren ? (
                          <button
                            onClick={(e) => toggleExpandParent(parent.id, e)}
                            className="p-0.5 hover:text-white text-[#73798c]"
                          >
                            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>
                        ) : (
                          <div className="w-3.5" />
                        )}

                        <div className="w-5 h-5 rounded bg-[#20222d] flex items-center justify-center shrink-0 text-emerald-400 font-bold">
                          <BookOpen className="w-3.5 h-3.5" />
                        </div>

                        <span className="truncate">{parent.title}</span>
                      </div>

                      {/* Delete Button (ONLY Visible directly in Edit Mode) */}
                      {!previewMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Apakah Anda yakin ingin menghapus halaman "${parent.title}"?`)) {
                              deleteNote(parent.id);
                            }
                          }}
                          className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all cursor-pointer shrink-0 ml-1"
                          title="Hapus Halaman Ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Sub-Pages / Child Notes List (Nested Hierarchy & Draggable in Edit Mode) */}
                    {hasChildren && isExpanded && (
                      <div className="ml-5 pl-2 border-l border-[#282a36] space-y-1">
                        {childNotes.map((child) => {
                          const isChildSelected = selectedNoteId === child.id;

                          return (
                            <div
                              key={child.id}
                              onClick={() => handleSelectNote(child)}
                              draggable={!previewMode}
                              onDragStart={(e) => handleDragStartNote(e, child.id)}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => handleDropNote(e, child.id)}
                              className={`p-2 rounded-lg cursor-pointer flex items-center justify-between text-xs group transition-all ${
                                isChildSelected
                                  ? 'bg-[#00425a]/80 text-[#38bdf8] font-bold border-l-2 border-[#0099dd]'
                                  : 'hover:bg-[#20222d] text-[#8e94a6]'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate min-w-0">
                                {!previewMode && (
                                  <GripVertical className="w-3 h-3 text-[#646a7c] cursor-grab active:cursor-grabbing shrink-0" />
                                )}
                                <CornerDownRight className="w-3 h-3 text-[#646a7c] shrink-0" />
                                <span className="truncate">{child.title}</span>
                              </div>

                              {/* Sub-Page Delete Button (ONLY Visible directly in Edit Mode) */}
                              {!previewMode && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Apakah Anda yakin ingin menghapus sub-halaman "${child.title}"?`)) {
                                      deleteNote(child.id);
                                    }
                                  }}
                                  className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all cursor-pointer shrink-0 ml-1"
                                  title="Hapus Sub-Halaman Ini"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Note Editor Workspace */}
        <div className="md:col-span-3 card-myits p-6 bg-[#1a1b22] border-[#292b37] flex flex-col justify-between space-y-6">
          {activeNote ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Editor Header Row: Breadcrumbs & Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#282a37] pb-4">
                  {/* Breadcrumb Path */}
                  <div className="flex items-center gap-1.5 text-xs text-[#878d9f] font-medium truncate">
                    {getBreadcrumbs().map((crumb, idx) => (
                      <React.Fragment key={idx}>
                        {idx > 0 && <span className="text-[#525768]">/</span>}
                        <span className={idx === getBreadcrumbs().length - 1 ? 'text-white font-bold' : ''}>
                          {crumb}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Top Action Buttons (Preview Mode, Copy, + Sub-Page, Hapus Catatan) */}
                  <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
                    <button
                      onClick={() => {
                        if (!previewMode && activeNote) {
                          updateNote(activeNote);
                        }
                        setPreviewMode(!previewMode);
                      }}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        previewMode
                          ? 'bg-[#20222d] hover:bg-[#282b3a] text-[#a0a6b7] border-[#2e3142]'
                          : 'bg-[#0099dd] text-white border-[#0099dd] shadow-md shadow-cyan-900/30'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{previewMode ? 'Mode Edit (Ubah Catatan)' : 'Mode Preview (Simpan & Baca)'}</span>
                    </button>

                    <button
                      onClick={handleCopyNoteContent}
                      className="p-2 rounded-xl bg-[#20222d] hover:bg-[#282b3a] text-[#a0a6b7] hover:text-white border border-[#2e3142] transition-all"
                      title="Salin Teks Catatan"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    {!previewMode && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Apakah Anda yakin ingin menghapus catatan "${activeNote.title}"?`)) {
                            deleteNote(activeNote.id);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Hapus Halaman Catatan Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Catatan</span>
                      </button>
                    )}

                    <button
                      onClick={handleCreateSubPage}
                      className="px-3 py-1.5 rounded-xl bg-[#232533] hover:bg-[#2c2f42] text-white border border-[#35384d] text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#0099dd]" />
                      <span>+ Sub-Page</span>
                    </button>
                  </div>
                </div>

                {/* Document Title Input */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#20222d] border border-[#2e3142] flex items-center justify-center text-emerald-400 shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={activeNote.title}
                    onChange={(e) => {
                      const updated = { ...activeNote, title: e.target.value };
                      setActiveNote(updated);
                      updateNote(updated);
                    }}
                    className="w-full text-2xl font-extrabold text-white bg-transparent focus:outline-none tracking-tight"
                    placeholder="Judul Catatan..."
                  />
                </div>

                {/* Formatting Toolbar (Includes + File Attachment Button) */}
                {!previewMode && (
                  <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-[#14151a] border border-[#272936] text-xs text-[#878d9f]">
                    <button
                      onClick={() => handleAddBlock('h1')}
                      className="px-2.5 py-1 rounded bg-[#20222d] hover:bg-[#292c3a] text-white font-bold"
                    >
                      + H1
                    </button>
                    <button
                      onClick={() => handleAddBlock('h2')}
                      className="px-2.5 py-1 rounded bg-[#20222d] hover:bg-[#292c3a] text-white font-bold"
                    >
                      + H2
                    </button>
                    <button
                      onClick={() => handleAddBlock('h3')}
                      className="px-2.5 py-1 rounded bg-[#20222d] hover:bg-[#292c3a] text-white font-bold"
                    >
                      + H3
                    </button>
                    <span className="w-px h-4 bg-[#2a2c3a] mx-1"></span>
                    <button
                      onClick={() => handleAddBlock('text')}
                      className="px-2.5 py-1 rounded bg-[#20222d] hover:bg-[#292c3a] text-white flex items-center gap-1"
                    >
                      <Bold className="w-3 h-3" /> + Teks
                    </button>
                    <button
                      onClick={() => handleAddBlock('todo')}
                      className="px-2.5 py-1 rounded bg-[#20222d] hover:bg-[#292c3a] text-white flex items-center gap-1"
                    >
                      <CheckSquare className="w-3 h-3 text-emerald-400" /> + Checklist
                    </button>
                    <button
                      onClick={() => handleAddBlock('callout')}
                      className="px-2.5 py-1 rounded bg-[#20222d] hover:bg-[#292c3a] text-white flex items-center gap-1"
                    >
                      <Quote className="w-3 h-3 text-[#0099dd]" /> + Callout
                    </button>

                    {/* + File Attachment Button (Images, PDF, Docs) */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded bg-[#20222d] hover:bg-[#0099dd]/30 text-[#38bdf8] flex items-center gap-1.5 font-bold transition-all border border-[#0099dd]/30"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>+ Sisipkan File / Gambar</span>
                    </button>
                  </div>
                )}

                {/* Blocks Content Area (Supports Image & File Attachments) */}
                <div className="space-y-4 pt-2">
                  {(activeNote.blocks || []).map((block) => {
                    if (previewMode) {
                      return (
                        <div key={block.id} className="text-xs text-[#d6dae6] leading-relaxed">
                          {block.type === 'h1' && <h2 className="text-lg font-bold text-white mt-4 border-b border-[#282a36] pb-1">{block.content}</h2>}
                          {block.type === 'h2' && <h3 className="text-base font-bold text-white mt-4 border-b border-[#282a36] pb-1">{block.content}</h3>}
                          {block.type === 'h3' && <h4 className="text-sm font-bold text-white mt-3">{block.content}</h4>}
                          {block.type === 'text' && <p className="py-1">{block.content}</p>}
                          {block.type === 'callout' && (
                            <div className="p-3.5 rounded-xl bg-[#0099dd]/10 border border-[#0099dd]/30 text-[#e1f2fe] flex items-start gap-3">
                              <Sparkles className="w-4 h-4 text-[#0099dd] shrink-0 mt-0.5" />
                              <span>{block.content}</span>
                            </div>
                          )}
                          {block.type === 'todo' && (
                            <div className="flex items-center gap-2 text-xs py-0.5">
                              <span className={block.checked ? 'line-through text-[#646a7c]' : 'text-white'}>
                                [{block.checked ? 'x' : ' '}] {block.content}
                              </span>
                            </div>
                          )}

                          {/* Image Attachment Preview */}
                          {block.type === 'image' && (
                            <div className="space-y-2 p-3 rounded-2xl bg-[#14151a] border border-[#272935]">
                              <div
                                onClick={() => handlePreviewFile(block)}
                                className="relative group cursor-pointer overflow-hidden rounded-xl bg-black/40 border border-[#262835] flex items-center justify-center max-h-96"
                              >
                                <img
                                  src={getDirectImageUrl(block.url)}
                                  alt={block.fileName || 'Gambar'}
                                  className="max-h-96 max-w-full rounded-xl object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-white font-bold text-xs transition-opacity duration-200 backdrop-blur-[2px]">
                                  <Eye className="w-4 h-4 text-[#0099dd]" />
                                  <span>Klik untuk Memperbesar / Unduh</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-[#878d9f] pt-1">
                                {block.content && <p className="italic truncate mr-2">{block.content}</p>}
                                <div className="flex items-center gap-2 ml-auto shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handlePreviewFile(block)}
                                    className="px-2.5 py-1 rounded-lg bg-[#20222d] hover:bg-[#0099dd] text-[#38bdf8] hover:text-white font-semibold flex items-center gap-1 transition-all cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Lihat</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadFile(block)}
                                    className="px-2.5 py-1 rounded-lg bg-[#20222d] hover:bg-emerald-600 text-emerald-400 hover:text-white font-semibold flex items-center gap-1 transition-all cursor-pointer"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Unduh</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* File Attachment Card (PPTX, DOCX, XLSX, PDF, ZIP, TXT) */}
                          {block.type === 'file' && (() => {
                            const meta = getFileMeta(block.fileName || block.content, block.fileType);
                            return (
                              <div className="p-4 rounded-2xl bg-[#14151a] border border-[#272935] flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border shrink-0 ${meta.color}`}>
                                    {meta.label}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-white truncate">{block.fileName || block.content}</p>
                                    <p className="text-[10px] text-[#787e91]">{block.fileSize || 'Dokumen'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handlePreviewFile(block)}
                                    className="px-3 py-1.5 rounded-xl bg-[#20222d] hover:bg-[#2a2d3c] text-[#38bdf8] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Lihat</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadFile(block)}
                                    className="px-3 py-1.5 rounded-xl bg-[#0099dd] hover:bg-[#0088cc] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-900/20 cursor-pointer"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Unduh</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      );
                    }

                    return (
                      <div key={block.id} className="group/block flex items-start gap-2 relative">
                        {/* Main Block Content */}
                        <div className="flex-1">
                          {block.type === 'h1' && (
                            <input
                              type="text"
                              value={block.content}
                              onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                              className="w-full text-lg font-bold text-white bg-transparent focus:outline-none border-b border-[#282a36] pb-1 mt-2"
                              placeholder="Judul Utama H1..."
                            />
                          )}
                          {block.type === 'h2' && (
                            <input
                              type="text"
                              value={block.content}
                              onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                              className="w-full text-base font-bold text-white bg-transparent focus:outline-none border-b border-[#282a36] pb-1 mt-2"
                              placeholder="Sub-Judul H2..."
                            />
                          )}
                          {block.type === 'h3' && (
                            <input
                              type="text"
                              value={block.content}
                              onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                              className="w-full text-sm font-bold text-white bg-transparent focus:outline-none border-b border-[#282a36] pb-1 mt-1"
                              placeholder="Poin Bahasan H3..."
                            />
                          )}
                          {block.type === 'text' && (
                            <textarea
                              value={block.content}
                              onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                              rows={2}
                              className="w-full text-xs text-[#d6dae6] bg-[#14151a] p-3 rounded-xl border border-[#262835] focus:outline-none focus:border-[#0099dd] leading-relaxed"
                              placeholder="Paragraf catatan..."
                            />
                          )}
                          {block.type === 'callout' && (
                            <div className="p-3.5 rounded-xl bg-[#0099dd]/10 border border-[#0099dd]/30 text-xs text-[#e1f2fe] flex items-start gap-3">
                              <Sparkles className="w-4 h-4 text-[#0099dd] shrink-0 mt-0.5" />
                              <input
                                type="text"
                                value={block.content}
                                onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                                className="w-full bg-transparent text-xs text-white focus:outline-none"
                                placeholder="Callout / Poin penting..."
                              />
                            </div>
                          )}
                          {block.type === 'todo' && (
                            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#14151a] border border-[#262835]">
                              <div
                                onClick={() => toggleTodoBlock(block.id)}
                                className={`w-4 h-4 rounded flex items-center justify-center border cursor-pointer ${
                                  block.checked ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-[#3a3d4f]'
                                }`}
                              >
                                {block.checked && <CheckCircle2 className="w-3 h-3" />}
                              </div>
                              <input
                                type="text"
                                value={block.content}
                                onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                                className={`w-full bg-transparent text-xs focus:outline-none ${
                                  block.checked ? 'line-through text-[#646a7c]' : 'text-white font-medium'
                                }`}
                                placeholder="Item checklist..."
                              />
                            </div>
                          )}

                          {/* Image Attachment Block in Edit Mode */}
                          {block.type === 'image' && (
                            <div className="space-y-2 p-3 rounded-2xl bg-[#14151a] border border-[#272935]">
                              <div className="flex items-center justify-between text-[11px] text-[#878d9f]">
                                <span className="flex items-center gap-1.5 text-[#38bdf8] font-semibold">
                                  <ImageIcon className="w-3.5 h-3.5" /> Gambar Sisipan: {block.fileName}
                                </span>
                                <span>{block.fileSize}</span>
                              </div>
                              <div
                                onClick={() => handlePreviewFile(block)}
                                className="relative group cursor-pointer overflow-hidden rounded-xl bg-black/40 border border-[#262835] flex items-center justify-center max-h-96"
                              >
                                <img
                                  src={getDirectImageUrl(block.url)}
                                  alt={block.fileName || 'Gambar'}
                                  className="max-h-96 max-w-full rounded-xl object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-white font-bold text-xs transition-opacity duration-200 backdrop-blur-[2px]">
                                  <Eye className="w-4 h-4 text-[#0099dd]" />
                                  <span>Klik untuk Memperbesar / Unduh</span>
                                </div>
                              </div>
                              <input
                                type="text"
                                value={block.content}
                                onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                                placeholder="Tuliskan keterangan/caption gambar di sini..."
                                className="w-full bg-[#1b1c24] px-3 py-1.5 rounded-lg text-xs text-white border border-[#282a36] focus:outline-none focus:border-[#0099dd]"
                              />
                            </div>
                          )}

                          {/* File Attachment Card Block in Edit Mode */}
                          {block.type === 'file' && (
                            <div className="p-4 rounded-2xl bg-[#14151a] border border-[#272935] flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-[#20222d] border border-[#2a2c3a] flex items-center justify-center text-[#0099dd] shrink-0">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-[#e2e8f0] truncate">{block.fileName || block.content}</p>
                                  <p className="text-[10px] text-[#787e91]">{block.fileSize || 'Dokumen'}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handlePreviewFile(block)}
                                  className="px-3 py-1.5 rounded-xl bg-[#20222d] hover:bg-[#2a2d3c] text-[#38bdf8] text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Lihat</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadFile(block)}
                                  className="px-3 py-1.5 rounded-xl bg-[#0099dd] hover:bg-[#0088cc] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-900/20 cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Unduh</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Delete Block Trash Icon Button (Always Visible in Edit Mode) */}
                        <button
                          onClick={() => handleDeleteBlock(block.id)}
                          className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all shrink-0 mt-1 cursor-pointer flex items-center justify-center"
                          title="Hapus Blok Ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Footer Bar */}
              <div className="pt-4 border-t border-[#262835] flex items-center justify-between text-[11px] text-[#73798c]">
                <span>Terakhir diperbarui: {activeNote.updatedAt || 'Jumat, 28 Agustus 2026'}</span>
                <span>{computeWordCount()} kata</span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[#73798c] text-xs">Pilih dokumen di panel sebelah kiri.</div>
          )}
        </div>
      </div>

      {/* High Resolution Image / Media Preview Lightbox Modal */}
      {activeMediaPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in my-auto">
          <div className="card-myits bg-[#181920] border-[#2c2f3d] w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl space-y-0 relative my-auto">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#282a36] bg-[#14151b] flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <ImageIcon className="w-4 h-4 text-[#0099dd]" />
                <span className="text-xs font-bold text-white truncate">{activeMediaPreview.fileName || 'Preview Gambar'}</span>
              </div>
              <button
                onClick={() => setActiveMediaPreview(null)}
                className="p-1.5 rounded-xl bg-[#22242e] text-[#8e94a5] hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Full Image Display Container */}
            <div className="p-4 sm:p-6 bg-black/60 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={getDirectImageUrl(activeMediaPreview.url)}
                alt={activeMediaPreview.fileName || 'Preview'}
                className="max-h-[70vh] w-auto max-w-full rounded-xl object-contain shadow-2xl border border-[#272935]"
              />
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-[#282a36] bg-[#14151b] flex items-center justify-between gap-3">
              <a
                href={activeMediaPreview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#20222d] hover:bg-[#2a2d3c] text-white text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <Eye className="w-4 h-4 text-[#0099dd]" />
                <span>Buka di Tab Baru</span>
              </a>

              <div className="flex items-center gap-2">
                <a
                  href={activeMediaPreview.url}
                  download={activeMediaPreview.fileName || 'gambar_catatan'}
                  className="px-5 py-2 rounded-xl bg-[#0099dd] hover:bg-[#0088cc] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Gambar</span>
                </a>
                <button
                  onClick={() => setActiveMediaPreview(null)}
                  className="btn-myits-secondary text-xs px-4 py-2"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* High Resolution Document Preview Modal (PPTX, DOCX, XLSX, PDF Viewer) */}
      {activeDocumentPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in my-auto">
          <div className="card-myits bg-[#181920] border-[#2c2f3d] w-full max-w-5xl h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between relative my-auto">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#282a36] bg-[#14151b] flex items-center justify-between">
              <div className="flex items-center gap-2.5 truncate">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {activeDocumentPreview.label || 'DOC'}
                </span>
                <span className="text-xs font-bold text-white truncate">{activeDocumentPreview.fileName || 'Pratinjau Dokumen'}</span>
              </div>
              <button
                onClick={() => setActiveDocumentPreview(null)}
                className="p-1.5 rounded-xl bg-[#22242e] text-[#8e94a5] hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Embedded Document Viewer Frame */}
            <div className="flex-1 bg-black/60 relative w-full h-full overflow-hidden">
              <iframe
                src={activeDocumentPreview.embedUrl}
                title="Document Preview"
                className="w-full h-full border-0"
                allow="autoplay"
              />
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-[#282a36] bg-[#14151b] flex items-center justify-between gap-3">
              <a
                href={activeDocumentPreview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#20222d] hover:bg-[#2a2d3c] text-white text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <ExternalLink className="w-4 h-4 text-[#0099dd]" />
                <span>Buka Tab Baru</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadFile(activeDocumentPreview.rawBlock)}
                  className="px-5 py-2 rounded-xl bg-[#0099dd] hover:bg-[#0088cc] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Berkas</span>
                </button>
                <button
                  onClick={() => setActiveDocumentPreview(null)}
                  className="btn-myits-secondary text-xs px-4 py-2 cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
