<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProdukController;

use App\Http\Controllers\LayananController;


Route::apiResource('layanan', LayananController::class);


Route::apiResource('produk', ProdukController::class);

Route::get('/halo', function () {
    return response()->json(['message' => 'Halo dari Laravel!']);
});
