<?php

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('chat.{userIds}', function ($user, $userIds) {
    Log::info('Broadcast auth attempt', ['user' => $user, 'userIds' => $userIds]);

    $ids = explode('_', $userIds);
    logger('Broadcast auth', ['user' => $user, 'userIds' => $userIds]);
    return in_array($user->id, $ids);
});
