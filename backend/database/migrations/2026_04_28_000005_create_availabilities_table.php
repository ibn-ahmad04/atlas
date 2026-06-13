<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agent_profile_id')
                  ->constrained()->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['disponible','occupe'])
                  ->default('disponible');
            $table->timestamps();
            $table->index('agent_profile_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('availabilities');
    }
};
