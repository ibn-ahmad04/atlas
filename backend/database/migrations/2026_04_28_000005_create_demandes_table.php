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
        Schema::create('demandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('voyageur_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('agent_profile_id')->constrained('agent_profiles')->onDelete('cascade');
            $table->enum('statut', ['en_attente', 'acceptee', 'refusee'])->default('en_attente');
            $table->text('message')->nullable();
            $table->dateTime('creneau_debut');
            $table->dateTime('creneau_fin');
            $table->timestamps();

            $table->index('statut');
            $table->index('voyageur_id');
            $table->index('agent_profile_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demandes');
    }
};
