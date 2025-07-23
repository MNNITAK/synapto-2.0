import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaRegHeart, FaHeart } from 'react-icons/fa';

const pastelColors = [
  'bg-purple-300',
  'bg-pink-400',
  'bg-yellow-300',
  'bg-green-300',
  'bg-blue-200',
  'bg-red-200',
  'bg-orange-200',
  'bg-cyan-200',
];

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', color: pastelColors[0], _id: null });
  const [loading, setLoading] = useState(false);

  const userData = JSON.parse(localStorage.getItem("synapto"));
  const token = userData?.token;

  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:5050/api/notes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (form._id) {
        await axios.put(`http://localhost:5050/api/notes/${form._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://localhost:5050/api/notes', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ title: '', content: '', color: pastelColors[0], _id: null });
      fetchNotes();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setForm(note);
  };

  const toggleLike = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:5050/api/notes/like/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedNotes = notes.map((n) =>
        n._id === id ? { ...n, liked: res.data.liked } : n
      );
      setNotes(updatedNotes);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5050/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
              Notes Dashboard
            </h1>
            <p className="text-gray-400 text-lg">Organize your thoughts with elegance</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 shadow-2xl">
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-100 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {form._id ? 'Edit Note' : 'Create New Note'}
            </h2>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Enter note title..."
                  className="w-full p-4 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                <textarea
                  placeholder="Write your note content here..."
                  rows={5}
                  className="w-full p-4 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-300">Color Theme:</label>
                  <select
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="rounded-xl px-4 py-2 bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {pastelColors.map((color, idx) => (
                      <option key={idx} value={color}>
                        {color.replace('bg-', '').replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 px-8 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:hover:shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    form._id ? 'Update Note' : 'Create Note'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {notes.map((note, idx) => (
            <div
              key={note._id}
              className={`rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 ${note.color || pastelColors[idx % pastelColors.length]} border border-gray-200/20`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{note.title}</h3>
                  <div className="flex-shrink-0 ml-2">
                    {note.liked ? (
                      <FaHeart
                        className="text-red-500 cursor-pointer hover:scale-110 transition-transform duration-200"
                        onClick={() => toggleLike(note._id)}
                        size={20}
                      />
                    ) : (
                      <FaRegHeart
                        className="text-gray-600 cursor-pointer hover:scale-110 hover:text-red-500 transition-all duration-200"
                        onClick={() => toggleLike(note._id)}
                        size={20}
                      />
                    )}
                  </div>
                </div>
                
                <p className="text-gray-700 whitespace-pre-line mb-4 line-clamp-4">{note.content}</p>
                
                <div className="border-t border-gray-400/20 pt-4">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleEdit(note)}
                        className="text-blue-700 hover:text-blue-800 font-medium hover:underline transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(note._id)}
                        className="text-red-700 hover:text-red-800 font-medium hover:underline transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {notes.length === 0 && (
          <div className="text-center py-16">
            <svg className="mx-auto h-24 w-24 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-300 mb-2">No notes yet</h3>
            <p className="text-gray-400">Create your first note to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;