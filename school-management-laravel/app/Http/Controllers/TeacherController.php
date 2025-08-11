<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Teacher;
use Illuminate\Support\Facades\Hash;
use Iluminate\Validation\Rule;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $teachers = Teacher::with('user')->where('status', 'active')->paginate(5);

        return response()->json($teachers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated_data = $request->validate(
            [
                'email' => 'required|email|unique:users',
                'username' => 'required|string|unique:users',
                'password' => 'required|string|min:6',
                'first_name' => 'required|string|min:2',
                'last_name' => 'required|string',
                'phone' => 'required|string|digits:10',
                'subject_specialization' => 'required|string',
                'employee_id' => 'required|string|unique:teachers',
                'date_of_joining' => 'required|date',
                'status' => 'required|in:active,inactive',
            ]
        );

        $user = User::create([
            'name' => $validated_data['first_name'] . ' ' . $validated_data['last_name'],
            'email' => $validated_data['email'],
            'password' => Hash::make($validated_data['password']),
            'username' => $validated_data['username'],
            'role' => 'teacher',
            'status' => $validated_data['status']
        ]);

        $teacher = Teacher::create([
            'user_id' => $user->id,
            'first_name' => $validated_data['first_name'],
            'last_name' => $validated_data['last_name'],
            'phone' => $validated_data['phone'],
            'email' => $validated_data['email'],
            'subject_specialization' => $validated_data['subject_specialization'],
            'employee_id' => $validated_data['employee_id'],
            'date_of_joining' => $validated_data['date_of_joining'],
            'status' => $validated_data['status']
        ]);

        return response()->json([
            'message' => 'Teacher Created Successfully',
            'teacher' => $validated_data['first_name'] . ' ' . $validated_data['last_name']
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $teacher = Teacher::with('user')->findOrFail($id);
        return response()->json($teacher);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $teacher = Teacher::with('user')->findOrFail($id);
        $user = $teacher->user;
        $validated = $request->validate([
            'first_name' => 'sometimes|string|min:2',
            'last_name' => 'sometimes|string',
            'employee_id' => 'sometimes|string|unique:teachers,employee_id,' . $teacher->id,
            'email' => 'sometimes|string|email|unique:users,email,' . $user->id,
            'phone' => 'sometimes|digits:10',
            'subject_specialization' => 'sometimes|string',
            'date_of_joining' => 'sometimes|date',
        ]);

        $teacher->update($validated);

        $user->name = $validated['first_name'] . ' ' . $validated['last_name'];
        $user->email = $validated['email'];

        $user->save();

        return response()->json([
            'message' => 'details updated successfully',
            'teacher' => $teacher['first_name'] . ' ' . $teacher['last_name']
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $teacher = Teacher::with('user')->findOrFail($id);
        $user = $teacher->user;

        $teacher['status'] = 'inactive';
        $teacher->save();
        $user['status'] = 'inactive';
        $user->save();

        return response()->json([
            'message' => 'succesfully deleted user'
        ]);
    }
}
