<?php

namespace App\Http\Controllers;

use App\Models\Layanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LayananController extends Controller
{
    public function index()
    {
        // Tambahkan URL penuh untuk gambar
        $layanans = Layanan::all()->map(function ($item) {
            $item->gambar_url = $item->gambar ? asset('storage/' . $item->gambar) : null;
            return $item;
        });

        return response()->json($layanans);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Upload file jika ada
        if ($request->hasFile('gambar')) {
            $validated['gambar'] = $request->file('gambar')->store('layanan', 'public');
        }

        $layanan = Layanan::create($validated);
        $layanan->gambar_url = $layanan->gambar ? asset('storage/' . $layanan->gambar) : null;

        return response()->json($layanan, 201);
    }

    public function show(Layanan $layanan)
    {
        $layanan->gambar_url = $layanan->gambar ? asset('storage/' . $layanan->gambar) : null;
        return response()->json($layanan);
    }

    public function update(Request $request, Layanan $layanan)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Jika ada file baru, hapus lama dan upload baru
        if ($request->hasFile('gambar')) {
            if ($layanan->gambar && Storage::disk('public')->exists($layanan->gambar)) {
                Storage::disk('public')->delete($layanan->gambar);
            }
            $validated['gambar'] = $request->file('gambar')->store('layanan', 'public');
        }

        $layanan->update($validated);
        $layanan->gambar_url = $layanan->gambar ? asset('storage/' . $layanan->gambar) : null;

        return response()->json($layanan);
    }

    public function destroy(Layanan $layanan)
    {
        if ($layanan->gambar && Storage::disk('public')->exists($layanan->gambar)) {
            Storage::disk('public')->delete($layanan->gambar);
        }

        $layanan->delete();

        return response()->json(null, 204);
    }
}
