<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained()->onDelete('cascade');
            $table->foreignId('agent_profile_id')
                  ->constrained()->onDelete('cascade');
            $table->enum('status', ['en_attente','acceptee','refusee'])
                  ->default('en_attente');
            $table->text('message')->nullable();
            $table->dateTime('slot_start');
            $table->dateTime('slot_end');
            $table->timestamps();
            $table->index(['user_id','agent_profile_id','status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
