import Note from '../models/Note.js';

// Create note
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = new Note({ title, content, user: req.user._id });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create note' });
  }
};

// Get all notes for the logged-in user
export const getUserNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

// Update note
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Note.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { ...req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Note not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note' });
  }
};

// like note
export const likeNote = async (req, res) => {
    try {
      const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
      if (!note) return res.status(404).json({ message: "Note not found" });
      note.liked = !note.liked;
      await note.save();
      res.json({ message: "Like status updated", liked: note.liked });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

// Delete note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Note.findOneAndDelete({ _id: id, user: req.user._id });
    if (!deleted) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
};