import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://tugas5-be-060-85782834625.us-central1.run.app/api/notes";

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [editId, setEditId] = useState(null);

  // Fungsi untuk mengambil data catatan dari backend
  const fetchNotes = async () => {
    try {
      const res = await axios.get(API_URL);
      setNotes(res.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Fungsi untuk menangani perubahan input form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi untuk menambah atau mengupdate catatan
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      // Update catatan yang sudah ada
      try {
        const res = await axios.put(`${API_URL}/${editId}`, formData);
        setNotes(notes.map((note) => (note.id === editId ? res.data : note)));
        setEditId(null);
        setFormData({ title: "", content: "" });
      } catch (error) {
        console.error("Gagal mengupdate catatan:", error);
      }
    } else {
      // Tambah catatan baru
      try {
        const res = await axios.post(API_URL, formData);
        setNotes([...notes, res.data]);
        setFormData({ title: "", content: "" });
      } catch (error) {
        console.error("Gagal menambah catatan:", error);
      }
    }
  };

  // Fungsi untuk menghapus catatan
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Gagal menghapus catatan:", error);
    }
  };

  // Fungsi untuk memulai mode edit
  const handleEdit = (note) => {
    setFormData({ title: note.title, content: note.content });
    setEditId(note.id);
  };

  // Fungsi untuk membatalkan edit
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
        {notes.map((note) => (
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
