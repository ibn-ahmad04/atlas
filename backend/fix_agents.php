<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = App\Models\User::where('role', 'agent')->whereDoesntHave('agentProfile')->get();
foreach($users as $user) {
    App\Models\AgentProfile::create([
        'user_id' => $user->id,
        'type' => 'tourisme',
        'status' => 'valide'
    ]);
    echo "Created profile for user {$user->id}\n";
}
echo "Done.\n";
