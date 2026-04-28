<?php

namespace App\Http\Controllers;

abstract class Controller
{
    /**
     * Format a standard API response.
     *
     * @param bool $success
     * @param string $message
     * @param mixed $data
     * @return \Illuminate\Http\JsonResponse
     */
    protected function sendResponse(bool $success, string $message, $data = null)
    {
        return response()->json([
            'success' => $success,
            'message' => $message,
            'data'    => $data,
        ]);
    }
}
