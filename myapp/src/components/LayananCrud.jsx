import { useEffect, useState } from "react";
import axios from "axios";
import "flowbite";

function LayananCrud() {
  const [layanan, setLayanan] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nama: "",
    deskripsi: "",
    gambar: null
  });
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const getLayanan = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/layanan");
      setLayanan(res.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    }
  };

  useEffect(() => {
    getLayanan();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("nama", form.nama);
      formData.append("deskripsi", form.deskripsi);
      if (form.gambar) {
        formData.append("gambar", form.gambar);
      }

      if (form.id) {
        await axios.post(
          `http://127.0.0.1:8000/api/layanan/${form.id}?_method=PUT`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        await axios.post("http://127.0.0.1:8000/api/layanan", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      setForm({ id: null, nama: "", deskripsi: "", gambar: null });
      setShowModal(false);
      getLayanan();
    } catch (err) {
      console.error("Gagal menyimpan:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/layanan/${deleteId}`);
      setDeleteId(null);
      getLayanan();
    } catch (err) {
      console.error("Gagal menghapus:", err);
    }
  };

  const openModal = (l = null) => {
    setForm(
      l
        ? { id: l.id, nama: l.nama, deskripsi: l.deskripsi }
        : { id: null, nama: "", deskripsi: "" }
    );
    setShowModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-900 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Manajemen Layanan
        </h1>
        <button
          onClick={() => openModal()}
          className="text-white ml-6 mt-2 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
        >
          Tambah Layanan
        </button>
      </div>

      {/* TABLE */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Gambar
              </th>
              <th scope="col" className="px-6 py-3">
                Nama Layanan
              </th>
              <th scope="col" className="px-6 py-3">
                Deskripsi
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {layanan.length > 0 ? (
              layanan.map((l) => (
                <tr
                  key={l.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="px-6 py-4">
                    {l.gambar_url ? (
                      <img
                        src={l.gambar_url}
                        alt={l.nama}
                        onClick={() => setPreviewImage(l.gambar_url)} // 🟢 klik gambar buka modal
                        className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm italic">
                        Tidak ada gambar
                      </span>
                    )}
                  </td>

                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {l.nama}
                  </th>

                  <td className="px-6 py-4">{l.deskripsi}</td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => openModal(l)}
                      className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(l.id)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-4 text-gray-500 dark:text-gray-400"
                >
                  Belum ada data layanan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL ADD/EDIT */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              {form.id ? " Edit Layanan" : " Tambah Layanan"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Nama Layanan
                </label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Deskripsi
                </label>
                <textarea
                  value={form.deskripsi}
                  onChange={(e) =>
                    setForm({ ...form, deskripsi: e.target.value })
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Gambar
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, gambar: e.target.files[0] })
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 px-4 py-2 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`${
                    form.id
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white px-4 py-2 rounded-lg`}
                >
                  {loading ? "Menyimpan..." : form.id ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS */}
      {deleteId && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              Anda Ingin Menghapus layanan ini?
            </h3>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PREVIEW GAMBAR */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setPreviewImage(null)} // klik luar modal = tutup
        >
          <div
            className="relative bg-white dark:bg-gray-800 rounded-lg p-4 max-w-3xl w-auto flex flex-col items-center"
            onClick={(e) => e.stopPropagation()} // biar klik dalam modal tidak nutup
          >
            <img
              src={previewImage}
              alt="Preview"
              className="rounded-lg max-h-[80vh] object-contain"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LayananCrud;
