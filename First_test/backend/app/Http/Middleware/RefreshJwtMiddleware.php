<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use App\User;
use Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;

class RefreshJwtMiddleware
{
    public function handle($request, Closure $next, $guard = null)
    {
        $refresh_token = $request->bearerToken();

        if (!$refresh_token)
            $refresh_token = $request->get('refresh_token');

        if(!$refresh_token) {
            // Unauthorized response if token not there
            return response()->json([
                'error' => 'Refresh token not provided.'
            ], 401);
        }

        $authenticate = User::where('refresh_token', $refresh_token)->first();

        if (!$authenticate) {
            return response()->json([
                'error' => 'Provided refresh token does not exist.'
            ], 400);
        }

        try {
            $credentials = JWT::decode($refresh_token, env('JWT_SECRET'), ['HS256']);
        } catch(ExpiredException $e) {
            // Need to logout
            $authenticate->refresh_token = null;
            $authenticate->save();
            
            return response()->json([
                'error' => 'Provided refresh token is expired.'
            ], 400);
        } catch(Exception $e) {
            return response()->json([
                'error' => 'An error while decoding refresh token.'
            ], 400);
        }

        $user = User::find($credentials->sub);

        // Now let's put the user in the request class so that you can grab it from there
        $request->auth = $user;

        return $next($request);
    }
}
