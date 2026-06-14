<?php
$user = App\Models\User::firstOrCreate(['email' => 'agent@example.com'], ['name' => 'Agent Test', 'password' => Hash::make('password'), 'role' => 'agent']);
App\Models\AgentProfile::firstOrCreate(['user_id' => $user->id], ['bio' => 'Agent de test', 'type' => 'tourisme', 'status' => 'valide']);
echo "Agent created successfully\n";
