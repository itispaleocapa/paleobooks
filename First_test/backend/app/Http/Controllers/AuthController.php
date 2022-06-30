<?php

namespace App\Http\Controllers;

use Validator;
use App\User;
use App\Models\PasswordReset;
use Firebase\JWT\JWT;
use Illuminate\Http\Request;
use Firebase\JWT\ExpiredException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\Reset;
use Laravel\Lumen\Routing\Controller as BaseController;

class AuthController extends BaseController
{
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
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Create a new token given the user and the expiration time.
     *
     * @param \App\User $user
     * @return string
     */
    protected function jwt(User $user, $expires)
    {
        $payload = [
            'iss' => "lumen-jwt", // Issuer of the token
            'sub' => $user->id, // Subject of the token
            'iat' => time(), // Time when JWT was issued.
            'exp' => time() + $expires // Expiration time
        ];

        // As you can see we are passing `JWT_SECRET` as the second parameter that will
        // be used to decode the token in the future.
        return JWT::encode($payload, env('JWT_SECRET'));
    }

    /**
     * Try to decode the reset token used to reset the password.
     *
     * @param $reset_token
     * @return bool
     */
    public function decodeResetToken($reset_token)
    {
        try {
            JWT::decode($reset_token, env('JWT_SECRET'), ['HS256']);
        } catch (ExpiredException $e) {
            return false;
        } catch (Exception $e) {
            return false;
        }
        return true;
    }

    /**
     * Authenticate a user and return the token if the provided credentials are correct.
     *
     * @param \App\User $user
     * @return mixed
     */
    public function authenticate(User $user)
    {
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
            if (!$user->refresh_token) {
                $refresh_token = $this->jwt($user, 60 * 60 * 24 * 30);

                $user->refresh_token = $refresh_token;
                $user->save();
            } else {
                if ($this->decodeResetToken($user->refresh_token)) {
                    $refresh_token = $user->refresh_token;
                } else {
                    $refresh_token = $this->jwt($user, 60 * 60 * 24 * 30);

                    $user->refresh_token = $refresh_token;
                    $user->save();
                }
            }

            return response()->json([
                'success' => 'Successfully logged in.',
                'access_token' => $this->jwt($user, 60 * 60),
                'refresh_token' => $refresh_token
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
    public function register(Request $request)
    {
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

        $hashed_password = Hash::make($this->request->input('password'));

        $user = new User;

        $user->name = $this->request->input('name');
        $user->email = $this->request->input('email');
        $user->password = $hashed_password;
        $user->refresh_token = $this->jwt($user, 60 * 60 * 24 * 30);

        try {
            $user->save();
        } catch (Exception $e) {
            return response()->json([
                'error' => 'An error while signing up.' // To get the error message use this: $e->getMessage()
            ], 400);
        }

        return response()->json([
            'success' => 'Successfully registered.',
            'access_token' => $this->jwt($user, 60 * 60),
            'refresh_token' => $user->refresh_token
        ], 201);
    }

    public function authenticatePaleoID(Request $request)
    {
        $this->validate($this->request, [
            'code' => 'required'
        ]);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, env('PALEOID_BASEURL') . "/oauth/token");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(array("grant_type" => "authorization_code", "code" => $request->input('code'), "redirect_uri" => (strlen($request->input('redirect_uri')) > 0 ? $request->input('redirect_uri') : env('PALEOID_REDIRECT_URI')), "client_id" => env('PALEOID_CLIENT_ID'), "client_secret" => env('PALEOID_CLIENT_SECRET'))));
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

        $class = '';
        $matricola = 0;

        if (isset($response['info_studente']['classe'])) {
            $class = $response['info_studente']['classe'];
        }

        if ($response['tipo'] == "studente") {
            $matricola = $response['info_studente']['matricola'];
            $user = User::where('matricola', $matricola)->first();
        } else {
            $user = User::where('email', $response['email'])->first();
        }

        if (!$user) {
            $user = new User;
            $user->password = 'paleoid';
            $user->matricola = $matricola;
        }

        $user->name = $response['nome'] . " " . $response['cognome'];

        $userEmail = User::where('email', $response['email'])->first();
        if ($userEmail && $userEmail->password !== "paleoid") {
            return response()->json([
                'error' => 'Email already exists.'
            ], 400);
        }

        $user->email = $response['email'];
        $user->save();

        if (!$user->refresh_token) {
            $refresh_token = $this->jwt($user, 60 * 60 * 24 * 30);

            $user->refresh_token = $refresh_token;
            $user->save();
        } else {
            $refresh_token = $user->refresh_token;
        }

        return response()->json([
            'access_token' => $this->jwt($user, 60 * 60),
            'refresh_token' => $refresh_token,
            'class' => $class
        ], 200);
    }

    public function authenticateTelBot(Request $request)
    {
        $this->validate($this->request, [
            'code' => 'required',
            'state' => 'required'
        ]);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, env('PALEOID_BASEURL') . "/oauth/token");
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(array("grant_type" => "authorization_code", "code" => $request->input('code'), "redirect_uri" => (strlen($request->input('redirect_uri')) > 0 ? $request->input('redirect_uri') : env('PALEOID_REDIRECT_URI')), "client_id" => env('PALEOID_CLIENT_ID'), "client_secret" => env('PALEOID_CLIENT_SECRET'))));
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

        $class = '';
        $matricola = 0;

        if (isset($response['info_studente']['classe'])) {
            $class = $response['info_studente']['classe'];
        }

        if ($response['tipo'] == "studente") {
            $matricola = $response['info_studente']['matricola'];
            $user = User::where('matricola', $matricola)->first();
        } else {
            $user = User::where('email', $response['email'])->first();
        }

        if (!$user) {
            $user = new User;
            $user->password = 'paleoid';
            $user->matricola = $matricola;
        }

        $user->name = $response['nome'] . " " . $response['cognome'];

        $userEmail = User::where('email', $response['email'])->first();
        if ($userEmail && $userEmail->password !== "paleoid") {
            return response()->json([
                'error' => 'Email already exists.'
            ], 400);
        }

        $user->email = $response['email'];
        $user->save();

        if (!$user->refresh_token) {
            $refresh_token = $this->jwt($user, 60 * 60 * 24 * 30);

            $user->refresh_token = $refresh_token;
            $user->save();
        } else {
            $refresh_token = $user->refresh_token;
        }

        /*  return response()->json([
            'access_token' => $this->jwt($user, 60 * 60),
            'refresh_token' => $refresh_token,
            'state' => base64_decode($request['state'])
        ], 200);*/

        $user_id = base64_decode($request['state']);

        $result = app('db')->connection('telegram')->select('SELECT user_id from users WHERE user_id = ?', [$user_id]);

        if ($result) {
            $res = app('db')->connection('telegram')->update('update users set refresh_token = ? where user_id = ?', [$refresh_token, $user_id]);
        } else {
            $res = app('db')->connection('telegram')->insert('insert into users (user_id, access_token, refresh_token) values (?, ?, ?)', [$user_id, $this->jwt($user, 60 * 60), $refresh_token]);
        }

        if ($res == 1) {
            return redirect('https://t.me/Paleobooks_bot?start=success');
        } else {
            return response()->json([
                'error' => 'Login failed'
            ], 400);
        }
    }


    /**
     * Logout and delete the refresh_token
     *
     * @param \App\User $user
     * @return mixed
     */
    public function logout(Request $request)
    {
        $user = $request->auth;

        $user->refresh_token = null;

        try {
            $user->save();
        } catch (Exception $e) {
            return response()->json([
                'error' => 'An error while logging out.' // To get the error message use this: $e->getMessage()
            ], 400);
        }

        return response()->json([
            'success' => 'Successfully logged out.'
        ], 200);
    }

    /**
     * Refresh the user token if middleware validate the provided refresh token.
     *
     * @param \App\User $user
     * @return mixed
     */
    public function refreshToken(Request $request)
    {
        $user = $request->auth;

        return response()->json([
            'access_token' => $this->jwt($user, 60 * 60)
        ], 200);
    }

    /**
     * Send an email with the link for the password reset.
     *
     * @param $email, $reset_token, $new_password
     * @return mixed
     */
    public function sendResetPassword(Request $request)
    {
        $this->validate($this->request, [
            'email' => 'required|email'
        ]);

        $email = $request->input('email');

        $user = User::where('email', $email)->first();

        if (!$user) {
            return response()->json([
                'error' => 'Email does not exist.'
            ], 400);
        }

        if ($user->password === "paleoid") {
            return response()->json([
                'error' => 'Authentication managed by PaleoID.'
            ], 400);
        }

        // Check if user already has a reset password request
        $password_reset = PasswordReset::where('email', $email)->first();
        $reset_token = $this->jwt($user, 60 * 15);

        if ($password_reset) {
            $password_reset->reset_token = $reset_token;

            $password_reset->save();
        } else {
            $request->merge(['reset_token' => $reset_token]);

            $password_reset = PasswordReset::create($request->all());
        }

        // Create a valid url using the reset token
        $reset_token = urlencode(base64_encode($reset_token));

        $this->sendEmail($email, $reset_token);

        return response()->json([
            'success' => 'Email sent.'
        ], 200);
    }

    /**
     * Reset the password using the provided password_reset_token.
     *
     * @param \App\User $user
     * @return mixed
     */
    public function resetPassword(Request $request, $token)
    {
        if (!$token) {
            return response()->json([
                'error' => 'Reset token is required.'
            ], 400);
        }

        /*$reset_token[36] = '.';
        $reset_token[120] = '.';*/

        $reset_token = base64_decode(urldecode($token));

        $password_reset = PasswordReset::where('reset_token', $reset_token)->first();

        if (!$password_reset) {
            return response()->json([
                'error' => 'This request is not valid.'
            ], 400);
        }

        // Try to decode the reset token
        if (!$this->decodeResetToken($reset_token)) {
            return response()->json([
                'error' => 'This request is not valid.'
            ], 400);
        }

        $user = User::where('email', $password_reset->email)->first();

        $this->validate($this->request, [
            'new_password' => 'required'
        ]);

        // Save the hashed password
        $hashed_password = Hash::make($this->request->input('new_password'));
        $user->password = $hashed_password;

        try {
            $user->save();
        } catch (Exception $e) {
            return response()->json([
                'error' => 'An error while updating password.' // To get the error message use this: $e->getMessage()
            ], 400);
        }

        $password_reset->delete();

        return response()->json([
            'success' => 'Password successfully updated.'
        ], 200);
    }

    public function sendEmail($email, $reset_token)
    {
        // Replace the '.' in token with the '_', to create a valid url using the JWT token
        /*$reset_token[36] = '_';
        $reset_token[120] = '_';*/

        //$reset_token = str_replace(".", "_", $reset_token);

        Mail::to($email)->send(new Reset($reset_token));
    }
}
