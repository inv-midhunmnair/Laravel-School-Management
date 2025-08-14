<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('chat.{conversationId}', function ($user, $conversationId) {
    // Assuming Conversation model has teacher_id and student_id:
    $conv = \App\Models\Conversation::find($conversationId);
    return $conv &&
        ($user->id == $conv->teacher_id ||
            $user->id == $conv->student_id);
});
