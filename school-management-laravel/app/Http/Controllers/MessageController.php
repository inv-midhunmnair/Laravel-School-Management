<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Student;
use App\Models\Teacher;
use App\Events\MessageSent;
use App\Models\User;


class MessageController extends Controller
{
    // Send a message
    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string|max:1000',
        ]);

        $sender = $request->user();
        $receiver = User::findOrFail($request->receiver_id);

        // ✅ Security: Ensure teacher ↔ student assignment
        if ($sender->role === 'teacher') {
            $teacher = $sender->teacher;
            if (!$teacher || !$receiver->student || $receiver->student->assigned_teacher_id !== $teacher->id) {
                return response()->json(['error' => 'Not allowed'], 403);
            }
        } elseif ($sender->role === 'student') {
            $student = $sender->student;
            if (!$student || !$receiver->teacher || $student->assigned_teacher_id !== $receiver->teacher->id) {
                return response()->json(['error' => 'Not allowed'], 403);
            }
        }

        $message = Message::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'message' => $request->message,
        ]);

        broadcast(new MessageSent($message));

        return response()->json($message, 201);
    }

    // Fetch chat history with specific user
    public function getMessages(Request $request, $userId)
    {
        $authUser = $request->user();

        $messages = Message::where(function ($q) use ($authUser, $userId) {
            $q->where('sender_id', $authUser->id)->where('receiver_id', $userId);
        })
            ->orWhere(function ($q) use ($authUser, $userId) {
                $q->where('sender_id', $userId)->where('receiver_id', $authUser->id);
            })
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    public function getData(Request $request)
    {
        $authUser = $request->user();

        if ($authUser->role === 'student') {
            // Fetch the assigned teacher for this student
            $teacher = Teacher::where('id', $authUser->student->assigned_teacher_id)->first(); // assuming relation `assignedTeacher`
            return response()->json([
                'role' => 'student',
                'teacher' => [
                    'id' => $teacher->user_id,
                    'name' => $teacher->first_name . ' ' . $teacher->last_name,
                    'email' => $teacher->email,
                ]
            ]);
        }

        if ($authUser->role === 'teacher') {
            // Fetch all students assigned to this teacher
            $teacher = $authUser->teacher;
            $students = Student::where('assigned_teacher_id', $teacher->id)->get();
            $studentData = $students->map(function ($student) {
                return [
                    'id' => $student->user_id,
                    'name' => $student->first_name . ' ' . $student->last_name,
                    'email' => $student->email,
                ];
            });

            return response()->json([
                'role' => 'teacher',
                'students' => $studentData
            ]);
        }

        return response()->json(['error' => 'Unauthorized'], 403);
    }
}
