<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         User::create([
            'name' => 'adminUser',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin'),
            'username' => 'admin',
            'role' => 'admin',
            'status' => 'active'
        ]);
    }
}
