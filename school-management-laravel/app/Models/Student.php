<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'phone',
        'email',
        'roll_number',
        'class',
        'date_of_birth',
        'admission_date',
        'status',
        'assigned_teacher_id'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function Teacher(){
        return $this->belongsTo(Teacher::class);
    }


}
