<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('agent_zones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agent_profile_id')->constrained('agent_profiles')->onDelete('cascade');
            $table->string('zone', 100);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agent_zones');
    }
};
