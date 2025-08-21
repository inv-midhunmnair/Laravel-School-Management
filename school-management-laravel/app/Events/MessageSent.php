<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Message;
use Carbon\Carbon;


class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct(Message $message)
    {   
        $this->message = $message->load('sender', 'receiver');
    }

    public function broadcastOn()
    {
        return [
            new PrivateChannel('chat.' . $this->message->receiver_id),
            new PrivateChannel('chat.' . $this->message->sender_id),
        ];
    }

    public function broadcastWith()
{
    $msgDate = Carbon::parse($this->message->created_at)->timezone('Asia/Kolkata');
    $currentDateString = $msgDate->toDateString();


     $count = Message::where(function ($q) {
            $q->where('sender_id', $this->message->sender_id)
              ->where('receiver_id', $this->message->receiver_id);
        })
        ->orWhere(function ($q) {
            $q->where('sender_id', $this->message->receiver_id)
              ->where('receiver_id', $this->message->sender_id);
        })
        ->where('id', '<=', $this->message->id)
        ->count();

    $previousMsg = Message::where(function ($q) {
            $q->where('sender_id', $this->message->sender_id)
              ->where('receiver_id', $this->message->receiver_id);
        })
        ->orWhere(function ($q) {
            $q->where('sender_id', $this->message->receiver_id)
              ->where('receiver_id', $this->message->sender_id);
        })
        ->where('id', '<', $this->message->id)
        ->orderBy('created_at', 'desc')
        ->first();

    $previousDate = $previousMsg
        ? Carbon::parse($previousMsg->created_at)->timezone('Asia/Kolkata')->toDateString()
        : null;
    
    $formattedTime = ($previousDate !== $currentDateString or $count%5==0)
        ? $msgDate->format('M d Y, H:i') 
        : $msgDate->format('H:i');       

    return [
        'id' => $this->message->id,
        'sender_id' => $this->message->sender_id,
        'receiver_id' => $this->message->receiver_id,
        'message' => $this->message->message,
        'created_at' => $this->message->created_at,
        'formatted_time' => $formattedTime,
    ];
}

    public function broadcastAs()
    {
        return 'message.sent';
    }
}
