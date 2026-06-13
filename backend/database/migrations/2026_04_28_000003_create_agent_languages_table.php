<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agent_languages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agent_profile_id')
                  ->constrained()->onDelete('cascade');
            $table->string('language', 50);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('agent_languages');
    }
};
