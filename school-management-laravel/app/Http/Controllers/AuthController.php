<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('username', 'password');
        
        try{
        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }}
        catch (JWTException $e){
            return response()->json(['error'=>'could not create token'],500);
        }

        return $this->respondWithToken($token);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'role' => auth()->user()->role,
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }

    public function me()
{
    try {
        return response()->json(auth()->user());
    } catch (TokenExpiredException $e) {
        return response()->json(['error' => 'Token expired'], 401);
    } catch (TokenInvalidException $e) {
        return response()->json(['error' => 'Token invalid'], 401);
    } catch (JWTException $e) {
        return response()->json(['error' => 'Token absent or malformed'], 401);
    }
}
}
