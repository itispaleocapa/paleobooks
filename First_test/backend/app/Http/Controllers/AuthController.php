<?php

namespace App\Http\Controllers;

use Validator;
use App\User;
use Firebase\JWT\JWT;
use Illuminate\Http\Request;
use Firebase\JWT\ExpiredException;
use Illuminate\Support\Facades\Hash;
use Laravel\Lumen\Routing\Controller as BaseController;

class AuthController extends BaseController {
    /**
     * The request instance.
     *
     * @var \Illuminate\Http\Request
     */
    private $request;

    /**
     * Create a new controller instance.
     *
     * @param \Illuminate\Http\Request $request
     * @return void
     */
    public function __construct(Request $request) {
        $this->request = $request;
    }

    /**
     * Create a new token.
     *
     * @param \App\User $user
     * @return string
     */
    protected function jwt(User $user) {
        $payload = [
            'iss' => "lumen-jwt", // Issuer of the token
            'sub' => $user->id, // Subject of the token
            'iat' => time(), // Time when JWT was issued.
            'exp' => time() + 60 * 60 // Expiration time
        ];

        // As you can see we are passing `JWT_SECRET` as the second parameter that will
        // be used to decode the token in the future.
        return JWT::encode($payload, env('JWT_SECRET'));
    }

    /**
     * Create a new refresh token.
     *
     * @param \App\User $user
     * @return string
     */
    protected function refreshJwt(User $user) {
        $payload = [
            'iss' => "lumen-jwt", // Issuer of the token
            'sub' => $user->id, // Subject of the token
            'iat' => time(), // Time when JWT was issued.
            'exp' => time() + 60 * 60 * 24 * 30 // Expiration time -> 30 days
        ];

        // As you can see we are passing `JWT_SECRET` as the second parameter that will
        // be used to decode the token in the future.
        return JWT::encode($payload, env('JWT_SECRET'));
    }

    /**
     * Authenticate a user and return the token if the provided credentials are correct.
     *
     * @param \App\User $user
     * @return mixed
     */
    public function authenticate(User $user) {
        $this->validate($this->request, [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Find the user by email
        $user = User::where('email', $this->request->input('email'))->first();

        if (!$user) {
            // You wil probably have some sort of helpers or whatever
            // to make sure that you have the same response format for
            // differents kind of responses. But let's return the
            // below respose for now.
            return response()->json([
                'error' => 'Email does not exist.'
            ], 400);
        }

        // Verify the password and generate the token
        if (Hash::check($this->request->input('password'), $user->password)) {
            return response()->json([
                'token' => $this->jwt($user),
                'refresh_token' => $this->refreshJwt($user)
            ], 200);
        }

        // Bad Request response
        return response()->json([
            'error' => 'Email or password is wrong.'
        ], 400);
    }

    /**
     * Validate the params and register a new user if those ones are correct.
     *
     * @param  //username, email, password
     * @return mixed
     */
    public function register(Request $request) {
        $this->validate($this->request, [
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Find the user by email
        $user = User::where('email', $this->request->input('email'))->first();

        if ($user) {
            return response()->json([
                'error' => 'Email already exists.'
            ], 400);
        }

        //verify if username is unique
        $user = User::where('name', '=', $this->request->input('name'))->first();

        if ($user) {
            return response()->json([
                'error' => 'Name already exists.'
            ], 400);
        }

        $hashed_password = Hash::make($this->request->input('password'));

        $user = new User;

        $user->name = $this->request->input('name');
        $user->email = $this->request->input('email');
        $user->password = $hashed_password;

        try {
            $user->save();
        } catch (Exception $e) {
            return response()->json([
                'error' => 'An error while signing up.' // To get the error message use this: $e->getMessage()
            ], 400);
        }

        return response()->json([
            'success' => 'Successfully registered.',
            'token' => $this->jwt($user),
            'refresh_token' => $this->refreshJwt($user)
        ], 400);
    }

    public function authenticatePaleoID(Request $request) {
        $this->validate($this->request, [
            'code' => 'required'
        ]);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, env('PALEOID_BASEURL') . "/oauth/token");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(array("grant_type" => "authorization_code", "code" => $request->input('code'), "redirect_uri" => env('PALEOID_REDIRECT_URI'), "client_id" => env('PALEOID_CLIENT_ID'), "client_secret" => env('PALEOID_CLIENT_SECRET'))));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $serverOutput = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($httpCode != 200) {
            return response()->json([
                'error' => 'PaleoID authentication failed.'
            ], 401);
        }
        $serverOutput = json_decode($serverOutput, true);
        $token = $serverOutput['access_token'];
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, env('PALEOID_BASEURL') . "/api/user");
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json", "Authorization: Bearer " . $token));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $serverOutput = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($httpCode != 200) {
            return response()->json([
                'error' => 'PaleoID authentication failed.'
            ], 401);
        }
        $response = json_decode($serverOutput, true);

        /*  TODO: vogliamo restringere l'accesso solo agli studenti?
        if ($response['tipo'] != "studente") {
            return response()->json([
                'error' => 'Only for students.'
            ], 401);
        }*/

        $user = User::where('email', $response['email'])->first();

        if ($user && $user->password !== "paleoid") {
            return response()->json([
                'error' => 'Email already exists.'
            ], 400);
        }

        if (!$user) {
            $user = new User;
            $user->name = $response['nome'] . " " . $response['cognome'];
            $user->email = $response['email'];
            $user->password = 'paleoid';
            $user->save();
        }

        return response()->json([
            'token' => $this->jwt($user),
            'refresh_token' => $this->refreshJwt($user)
        ], 200);
    }

    /**
     * Refresh the user token if middleware validate the provided refresh token.
     *
     * @param \App\User $user
     * @return mixed
     */
    public function refreshToken(Request $request) {
        $user = $request->auth;

        return response()->json([
            'token' => $this->jwt($user)
        ], 200);
    }
}
