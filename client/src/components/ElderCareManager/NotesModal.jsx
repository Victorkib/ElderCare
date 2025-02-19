import { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Plus,
  Tag,
  Search,
  Edit,
  Trash,
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import apiRequest from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';

// eslint-disable-next-line react/prop-types
const NotesModal = ({ isOpen, onClose, elderId }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [newNote, setNewNote] = useState({
    content: '',
    type: 'general', // general, medication, vital, behavior, etc.
    priority: 'normal', // normal, urgent, follow-up
    tags: [],
  });
  const [currentTag, setCurrentTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('addNote');
  const [editingNote, setEditingNote] = useState(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  const handleDeleteClick = (noteId) => {
    setNoteToDelete(noteId);
    setDeleteModalOpen(true);
  };

  const notesPerPage = 3;

  useEffect(() => {
    if (isOpen) {
      fetchNotes();
    }
  }, [isOpen, elderId]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await apiRequest.get(`/elderNotes/getNotes/${elderId}`);
      if (response.status) {
        setNotes(response?.data?.notes);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.content.trim()) {
      toast.error('Note content cannot be empty');
      return;
    }
    setLoading(true);
    setSubmitStatus('submitting');
    try {
      const response = await apiRequest.post('/elderNotes/addNote', {
        elderId,
        ...newNote,
        timestamp: new Date().toISOString(),
      });

      if (response.status) {
        setSubmitStatus('success');
        setNewNote({
          content: '',
          type: 'general',
          priority: 'normal',
          tags: [],
        });
        fetchNotes();
        toast.success('Note added successfully');
      }
    } catch (error) {
      setSubmitStatus('error');
      toast.error(error?.response?.data?.message || 'Failed to add note');
    } finally {
      setLoading(false);
    }
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    if (currentTag && !newNote.tags.includes(currentTag)) {
      setNewNote((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag],
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setNewNote((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setActiveTab('addNote');
    setNewNote({
      content: note.content,
      type: note.type,
      priority: note.priority,
      tags: note.tags,
    });
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    if (!newNote.content.trim()) {
      toast.error('Note content cannot be empty');
      return;
    }

    setLoading(true);
    setSubmitStatus('submitting');
    try {
      const response = await apiRequest.put(
        `/elderNotes/updateNote/${editingNote._id}`,
        {
          ...newNote,
        }
      );

      if (response.status) {
        setSubmitStatus('success');
        setNewNote({
          content: '',
          type: 'general',
          priority: 'normal',
          tags: [],
        });
        setEditingNote(null);
        fetchNotes();
        toast.success('Note updated successfully');
      }
    } catch (error) {
      setSubmitStatus('error');
      toast.error(error?.response?.data?.message || 'Failed to update note');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await apiRequest.delete(
        `/elderNotes/deleteNote/${noteId}`
      );
      if (response.status) {
        fetchNotes();
        toast.success('Note deleted successfully');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete note');
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);
  const currentNotes = filteredNotes.slice(
    (currentPage - 1) * notesPerPage,
    currentPage * notesPerPage
  );

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mt-12">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="p-2 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Patient Notes</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('addNote')}
              className={`flex-1 p-2 text-center ${
                activeTab === 'addNote'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              Add Note
            </button>
            <button
              onClick={() => setActiveTab('recentNotes')}
              className={`flex-1 p-2 text-center ${
                activeTab === 'recentNotes'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500'
              }`}
            >
              Recent Notes
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
            {activeTab === 'addNote' ? (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingNote ? 'Edit Note' : 'Add New Note'}
                </h3>
                <form
                  onSubmit={editingNote ? handleUpdateNote : handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <textarea
                      value={newNote.content}
                      onChange={(e) =>
                        setNewNote((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      placeholder="Enter your note here..."
                      className="w-full p-3 border rounded-lg resize-none h-32"
                      maxLength={500}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {newNote.content.length}/500 characters
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <select
                        value={newNote.type}
                        onChange={(e) =>
                          setNewNote((prev) => ({
                            ...prev,
                            type: e.target.value,
                          }))
                        }
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="general">General Note</option>
                        <option value="medication">Medication Note</option>
                        <option value="vital">Vital Signs Note</option>
                        <option value="behavior">Behavioral Note</option>
                        <option value="treatment">Treatment Note</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <select
                        value={newNote.priority}
                        onChange={(e) =>
                          setNewNote((prev) => ({
                            ...prev,
                            priority: e.target.value,
                          }))
                        }
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="normal">Normal Priority</option>
                        <option value="urgent">Urgent</option>
                        <option value="follow-up">Follow-up Required</option>
                      </select>
                    </div>
                  </div>

                  {/* Tags Input */}
                  <div>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        placeholder="Add tags..."
                        className="flex-1 p-2 border rounded-lg"
                      />
                      <button
                        onClick={handleTagAdd}
                        type="button"
                        className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newNote.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
                        >
                          <Tag size={14} />
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            type="button"
                            className="hover:text-blue-600"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingNote(null);
                        setNewNote({
                          content: '',
                          type: 'general',
                          priority: 'normal',
                          tags: [],
                        });
                      }}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitStatus === 'submitting'}
                      className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 ${
                        submitStatus === 'submitting'
                          ? 'cursor-not-allowed'
                          : ''
                      }`}
                    >
                      {submitStatus === 'submitting'
                        ? 'Saving...'
                        : editingNote
                        ? 'Update Note'
                        : 'Save Note'}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                {/* Search and Filter */}
                <div className="mb-6">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search notes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                {/* Recent Notes Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Recent Notes</h3>

                  {loading ? (
                    <div className="text-center py-4">Loading notes...</div>
                  ) : currentNotes.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex gap-4 overflow-x-auto pb-4">
                        {currentNotes &&
                          currentNotes?.map((note, index) => (
                            <Card
                              key={index}
                              className="min-w-[300px] max-w-[300px]"
                            >
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <span
                                    className={`px-2 py-1 rounded-full text-sm ${
                                      note.priority === 'urgent'
                                        ? 'bg-red-100 text-red-800'
                                        : note.priority === 'follow-up'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-blue-100 text-blue-800'
                                    }`}
                                  >
                                    {note.priority}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {new Date(
                                      note.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm mb-3">{note.content}</p>
                                <div className="flex flex-wrap gap-2">
                                  {note.tags.map((tag, tagIndex) => (
                                    <span
                                      key={tagIndex}
                                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                  <button
                                    onClick={() => handleEditNote(note)}
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick(note._id)}
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                  >
                                    <Trash size={16} />
                                  </button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>

                      {/* Pagination Controls */}
                      <div className="flex justify-center items-center gap-2 mt-4">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No notes found. Add a new note below.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {loading && (
        <div className="loader-overlay">
          <TailSpin
            height="100"
            width="100"
            color="#4fa94d"
            ariaLabel="loading"
            visible={true}
          />
        </div>
      )}
      <ToastContainer />
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mt-12">
          <div className="bg-white rounded-lg w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold mb-4">
              Deletion Confirmation
            </h3>
            <p className="text-sm mb-6">
              Are you sure you want to delete this note? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDeleteNote(noteToDelete);
                  setDeleteModalOpen(false);
                  setNoteToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotesModal;
