<?php

namespace App\Http\Controllers;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *      version="1.0.0",
 *      title="Atlas API",
 *      description="Documentation interactive de l'API Atlas"
 * )
 *
 * @OA\SecurityScheme(
 *      securityScheme="bearerAuth",
 *      type="http",
 *      scheme="bearer"
 * )
 */
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
