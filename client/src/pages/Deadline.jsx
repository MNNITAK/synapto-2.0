import { useState, useEffect } from 'react';
import { useDeadlines } from '../context/DeadlineContext';
import { useAuth } from '../context/contextapi';
import './Deadline.css';

export default function DeadlineManager() {
  const { localuser } = useAuth();
  const userId = localuser?.id;

  const {
    deadlines,
    fetchDeadlines,
    addDeadline,
    markDone,
    savePhoneNumber,
  } = useDeadlines();

  const [form, setForm] = useState({
    title: '',
    content: '',
    tags: '',
    deadline: '',
    remindBeforeDays: 1,
  });

  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (userId) fetchDeadlines(userId);
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDeadline({
      ...form,
      tags: form.tags.split(',').map(tag => tag.trim()),
      userId,
    });
    setForm({ title: '', content: '', tags: '', deadline: '', remindBeforeDays: 1 });
  };

  const handlePhoneSave = async () => {
    await savePhoneNumber(userId, phone);
    alert('Phone number saved!');
  };

  return (
    <div className="deadline-wrapper">
      <div className="left-panel">
        <h2>📅 Set a Deadline</h2>

        <div className="phone-save">
          <input
            type="text"
            placeholder="Enter WhatsApp Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button onClick={handlePhoneSave}>Save Number</button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Remind Before (days)"
            value={form.remindBeforeDays}
            onChange={(e) => setForm({ ...form, remindBeforeDays: e.target.value })}
            required
          />
          <button type="submit">Add Deadline</button>
        </form>
      </div>

      <div className="right-panel">
        <h3>📚 Your Deadlines</h3>
        <div className="deadline-list">
          {deadlines.map((d) => (
            <div key={d._id} className={`deadline-card ${d.done ? 'done' : ''}`}>
              <h4>{d.title}</h4>
              <p>{d.content}</p>
              <small>⏰ {new Date(d.deadline).toLocaleDateString()}</small>
              {!d.done ? (
                <button onClick={() => markDone(d._id)}>Mark as Done</button>
              ) : (
                <span>✅ Done</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
