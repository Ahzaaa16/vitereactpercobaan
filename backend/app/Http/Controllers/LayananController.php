<?php

namespace App\Http\Controllers;

use App\Models\Layanan;
use Illuminate\Http\Request;

class LayananController extends Controller
{
    public function index()
    {
        return response()->json(Layanan::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'gambar' => 'nullable|string',
        ]);

        $layanan = Layanan::create($validated);

        return response()->json($layanan, 201);
    }

    public function show(Layanan $layanan)
    {
        return response()->json($layanan);
    }

    public function update(Request $request, Layanan $layanan)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'gambar' => 'nullable|string',
        ]);

        $layanan->update($validated);

        return response()->json($layanan);
    }

    public function destroy(Layanan $layanan)
    {
        $layanan->delete();

        return response()->json(null, 204);
    }
}
