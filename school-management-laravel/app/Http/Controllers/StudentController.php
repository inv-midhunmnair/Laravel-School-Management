<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();

        if ($user->role === 'admin') {

            $students = Student::where('status', 'active')
                ->with('Teacher:id,first_name,last_name')
                ->paginate(5);
        } elseif ($user->role === 'teacher') {

            $teacher = $user->teacher;

            if (!$teacher) {
                return response()->json(['message' => 'Teacher profile not found'], 404);
            }

            $students = Student::where('assigned_teacher_id', $teacher->id)->where('status', 'active')->paginate(1);
        } else {

            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'data' => $students,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated_data = $request->validate([
            'email' => 'required|email|unique:users',
            'username' => 'required|string|unique:users',
            'password' => 'required|string|min:6',
            'first_name' => 'required|string|min:2',
            'last_name' => 'required|string',
            'phone' => 'required|digits:10',
            'roll_number' => 'required|string|unique:students',
            'class' => 'required|string',
            'date_of_birth' => 'required|date',
            'admission_date' => 'required|date',
            'status' => 'required|in:active,inactive',
            'assigned_teacher_id' => 'required|integer'
        ]);

        $user = User::create([
            'name' => $validated_data['first_name'] . ' ' . $validated_data['last_name'],
            'email' => $validated_data['email'],
            'password' => Hash::make($validated_data['password']),
            'username' => $validated_data['username'],
            'role' => 'student',
            'status' => $validated_data['status']
        ]);

        $student = Student::create([
            'user_id' => $user->id,
            'first_name' => $validated_data['first_name'],
            'last_name' => $validated_data['last_name'],
            'phone' => $validated_data['phone'],
            'email' => $validated_data['email'],
            'roll_number' => $validated_data['roll_number'],
            'class' => $validated_data['class'],
            'date_of_birth' => $validated_data['date_of_birth'],
            'admission_date' => $validated_data['admission_date'],
            'status' => $validated_data['status'],
            'assigned_teacher_id' => $validated_data['assigned_teacher_id']
        ]);

        return response()->json([
            'message' => 'student Created Successfully',
            'student' => $validated_data['first_name'] . ' ' . $validated_data['last_name']
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $student = Student::with('user')->findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json(['error' => 'No user found'], 404);
        }
        return response()->json($student);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $student = Student::with('user')->findOrFail($id);
        $user = $student->user;
        $validated = $request->validate([
            'first_name' => 'sometimes|string|min:2',
            'last_name' => 'sometimes|string',
            'assigned_teacher_id' => 'sometimes|integer',
            'email' => 'sometimes|string|email|unique:users,email,' . $user->id,
            'phone' => 'sometimes|digits:10',
            'roll_number' => 'sometimes|string|unique:students,roll_number,' . $student->id,
            'class' => 'sometimes|string',
            'admission_date' => 'sometimes|string',
            'date_of_birth' => 'sometimes|date',
        ]);

        $student->update($validated);

        $user->name = $validated['first_name'] . ' ' . $validated['last_name'];
        $user->email = $validated['email'];

        $user->save();

        return response()->json([
            'message' => 'details updated successfully',
            'student' => $student['first_name'] . ' ' . $student['last_name']
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $student = Student::with('user')->findOrFail($id);
        $user = $student->user;

        $student['status'] = 'inactive';
        $student->save();
        $user['status'] = 'inactive';
        $user->save();

        return response()->json([
            'message' => 'succesfully deleted user'
        ]);
    }
}
