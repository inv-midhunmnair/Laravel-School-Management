<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;
use App\Models\Student;
use App\Models\Teacher;
use App\Events\MessageSent;
use App\Models\User;
use Carbon\Carbon;

class MessageController extends Controller
{
    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string|max:1000',
        ]);

        $sender = $request->user();
        $receiver = User::findOrFail($request->receiver_id);

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

        $count = 0;
        $previousDate = null;

        $formattedMessages = $messages->map(function ($msg) use (&$previousDate, &$count) {
            $count++;
            $msgDate = Carbon::parse($msg->created_at)->timezone('Asia/Kolkata'); 
            $currentDateString = $msgDate->toDateString();

            if ($previousDate !== $currentDateString or $count%5 === 0) {
                $msg->formatted_time = $msgDate->format('M d Y, H:i'); 
            } else {
                $msg->formatted_time = $msgDate->format('H:i'); 
            }

            $previousDate = $currentDateString;

            return $msg;
        });

        return response()->json($messages);
    }

    public function getData(Request $request)
    {
        $authUser = $request->user();

        if ($authUser->role === 'student') {
            $teacher = Teacher::where('id', $authUser->student->assigned_teacher_id)->first(); 
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
