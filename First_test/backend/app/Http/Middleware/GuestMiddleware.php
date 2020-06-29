<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use App\User;

class GuestMiddleware
{
    public function handle($request, Closure $next, $guard = null)
    {
        $access_token = $request->bearerToken();
        $refresh_token = $request->bearerToken();

        /*if (!$access_token && !$refresh_token) {
            $access_token = $request->get('access_token');
            $refresh_token = $request->get('refresh_token');
        } else {
            return response()->json([
                'error' => 'You are already logged in.'
            ], 403);
        }

        if ($access_token || $refresh_token) {
            return response()->json([
                'error' => 'You are already logged in.'
            ], 403);
        }*/

        return $next($request);
    }
}
