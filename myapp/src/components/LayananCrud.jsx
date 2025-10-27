import { useEffect, useState } from "react";
import axios from "axios";

function LayananCrud() {
  const [layanan, setLayanan] = useState([]);
  const [form, setForm] = useState({ id: null, nama: "", deskripsi: "" });
  const [loading, setLoading] = useState(false);

  // 🔹 Ambil data dari API
  const getLayanan = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/layanan");
      setLayanan(res.data);
    } catch (err) {
      console.error("❌ Gagal konek ke API:", err);
    }
  };

  useEffect(() => {
    getLayanan();
  }, []);

  // 🔹 Simpan atau Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (form.id) {
        // UPDATE
        await axios.put(`http://127.0.0.1:8000/api/layanan/${form.id}`, form);
      } else {
        // CREATE
        await axios.post("http://127.0.0.1:8000/api/layanan", form);
      }
      setForm({ id: null, nama: "", deskripsi: "" });
      getLayanan();
    } catch (err) {
      console.error("❌ Gagal menyimpan layanan:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Pilih layanan untuk diedit
  const handleSelect = (l) => {
    setForm({ id: l.id, nama: l.nama, deskripsi: l.deskripsi });
  };

  // 🔹 Hapus layanan
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus layanan ini?")) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/layanan/${id}`);
      if (form.id === id) setForm({ id: null, nama: "", deskripsi: "" });
      getLayanan();
    } catch (err) {
      console.error("❌ Gagal menghapus layanan:", err);
    }
  };

  // 🔹 Reset form
  const resetForm = () => setForm({ id: null, nama: "", deskripsi: "" });

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        💼 Manajemen Layanan
      </h1>

      {/* Form Tambah / Edit */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-8">
        <input
          type="text"
          placeholder="Nama Layanan"
          value={form.nama}
          onChange={(e) => setForm({ ...form, nama: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Deskripsi Layanan"
          value={form.deskripsi}
          onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
          className="w-full border p-2 rounded"
          rows="3"
          required
        />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className={`${
              form.id
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white px-4 py-2 rounded w-full`}
          >
            {loading
              ? "Menyimpan..."
              : form.id
              ? "Update Layanan"
              : "Tambah Layanan"}
          </button>

          {form.id && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* Daftar Layanan */}
      <ul className="space-y-3">
        {layanan.map((l) => (
          <li
            key={l.id}
            className={`border rounded p-3 shadow-sm flex justify-between items-center hover:shadow-md transition cursor-pointer ${
              form.id === l.id ? "bg-yellow-50 border-yellow-400" : ""
            }`}
            onClick={() => handleSelect(l)}
          >
            <div>
              <h2 className="font-semibold">{l.nama}</h2>
              <p className="text-gray-600 text-sm">{l.deskripsi}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // supaya tidak ikut select
                handleDelete(l.id);
              }}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LayananCrud;
