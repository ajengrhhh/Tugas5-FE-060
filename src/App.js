import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://tu6-be60-700231807331.us-central1.run.app";

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [editId, setEditId] = useState(null);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(API_URL);
      console.log("API result:", res.data); // cek bentuk data
      if (Array.isArray(res.data)) {
        setNotes(res.data);
      } else if (Array.isArray(res.data.data)) {
        setNotes(res.data.data); // fallback kalau masih dibungkus
      } else {
        console.warn("Data yang diterima bukan array:", res.data);
        setNotes([]); // fallback aman
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setNotes([]);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      try {
        const res = await axios.put(`${API_URL}/${editId}`, formData);
        setNotes(notes.map((note) => (note.id === editId ? res.data : note)));
        setEditId(null);
        setFormData({ title: "", content: "" });
      } catch (error) {
        console.error("Gagal mengupdate catatan:", error);
      }
    } else {
      try {
        const res = await axios.post(API_URL, formData);
        setNotes([...notes, res.data]);
        setFormData({ title: "", content: "" });
      } catch (error) {
        console.error("Gagal menambah catatan:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Gagal menghapus catatan:", error);
    }
  };

  const handleEdit = (note) => {
    setFormData({ title: note.title, content: note.content });
    setEditId(note.id);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({ title: "", content: "" });
  };

  return (
    <div className="container">
      <h1>Catatan Saya</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Judul"
          required
        />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Isi Catatan"
          required
        ></textarea>
        <div className="form-buttons">
          <button type="submit">{editId ? "Update Catatan" : "Tambah Catatan"}</button>
          {editId && (
            <button type="button" className="cancel" onClick={handleCancelEdit}>
              Batal Edit
            </button>
          )}
        </div>
      </form>

      <ul>
        {Array.isArray(notes) && notes.map((note) => (
          <li key={note.id}>
            <div className="note-header">
              <h2>{note.title}</h2>
              <div className="note-actions">
                <button className="edit" onClick={() => handleEdit(note)}>
                  Edit
                </button>
                <button className="delete" onClick={() => handleDelete(note.id)}>
                  Hapus
                </button>
              </div>
            </div>
            <p>{note.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
