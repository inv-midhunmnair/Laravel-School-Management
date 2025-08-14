<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Student;
use App\Models\Teacher;
use App\Events\MessageSent;


class MessageController extends Controller
{


    public function fetchMessages($receiverId)
    {
        $user = request()->user(); // authenticated user
        $userId = $user->id;

        $messages = Message::where(function ($q) use ($userId, $receiverId) {
            $q->where('sender_id', $userId)
                ->where('receiver_id', $receiverId);
        })->orWhere(function ($q) use ($userId, $receiverId) {
            $q->where('sender_id', $receiverId)
                ->where('receiver_id', $userId);
        })->orderBy('created_at', 'asc')->get();

        return response()->json($messages);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        $senderId = auth()->id();

        // Optionally validate teacher-student assignment
        $sender = auth()->user();
        if ($sender->role === 'student') {
            $student = $sender->student;
            if ($student->assigned_teacher_id != $request->receiver_id) {
                return response()->json(['error' => 'Cannot send message to this teacher'], 403);
            }
        }

        if ($sender->role === 'teacher') {
            $student = Student::where('user_id', $request->receiver_id)
                ->where('assigned_teacher_id', $sender->teacher->id)
                ->first();
            if (!$student) {
                return response()->json(['error' => 'Cannot send message to this student'], 403);
            }
        }

        $message = Message::create([
            'sender_id' => $senderId,
            'receiver_id' => $request->receiver_id,
            'message' => $request->message
        ]);



        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message);
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
