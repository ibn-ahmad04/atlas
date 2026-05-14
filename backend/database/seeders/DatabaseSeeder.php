<?php

namespace Database\Seeders;

use App\Models\AgentProfile;
use App\Models\Demande;
use App\Models\Disponibilite;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // ─── Listes de référence ──────────────────────────────────────────────

        $langues = ['Français', 'Anglais', 'Arabe', 'Espagnol', 'Wolof'];
        $zones   = ['Dakar', 'Saint-Louis', 'Thiès', 'Ziguinchor', 'Touba'];

        // ─── 1. Admin ─────────────────────────────────────────────────────────

        User::factory()->admin()->create([
            'name'  => 'Admin Atlas',
            'email' => 'admin@atlas.com',
        ]);

        // ─── 2. 10 agents validés avec profil complet ─────────────────────────

        $agentProfiles = collect();

        for ($i = 0; $i < 10; $i++) {
            $agent = User::factory()->agent()->create();

            $profile = AgentProfile::factory()->create([
                'user_id' => $agent->id,
            ]);

            // 2 à 3 langues
            $selectedLangues = collect($langues)->shuffle()->take(rand(2, 3));
            foreach ($selectedLangues as $langue) {
                DB::table('agent_languages')->insert([
                    'agent_profile_id' => $profile->id,
                    'language'         => $langue,
                    'created_at'       => now(),
                    'updated_at'       => now(),
                ]);
            }

            // 1 à 2 zones
            $selectedZones = collect($zones)->shuffle()->take(rand(1, 2));
            foreach ($selectedZones as $zone) {
                DB::table('agent_zones')->insert([
                    'agent_profile_id' => $profile->id,
                    'zone'             => $zone,
                    'created_at'       => now(),
                    'updated_at'       => now(),
                ]);
            }

            // 2 créneaux de disponibilité
            Disponibilite::factory()->count(2)->create([
                'agent_profile_id' => $profile->id,
            ]);

            $agentProfiles->push($profile);
        }

        // ─── 3. 2 agents en attente de validation ────────────────────────────

        for ($i = 0; $i < 2; $i++) {
            $agent = User::factory()->agent()->create();

            $profile = AgentProfile::factory()->enAttente()->create([
                'user_id' => $agent->id,
            ]);

            // 2 à 3 langues
            $selectedLangues = collect($langues)->shuffle()->take(rand(2, 3));
            foreach ($selectedLangues as $langue) {
                DB::table('agent_languages')->insert([
                    'agent_profile_id' => $profile->id,
                    'language'         => $langue,
                    'created_at'       => now(),
                    'updated_at'       => now(),
                ]);
            }

            // 1 à 2 zones
            $selectedZones = collect($zones)->shuffle()->take(rand(1, 2));
            foreach ($selectedZones as $zone) {
                DB::table('agent_zones')->insert([
                    'agent_profile_id' => $profile->id,
                    'zone'             => $zone,
                    'created_at'       => now(),
                    'updated_at'       => now(),
                ]);
            }

            // 2 créneaux de disponibilité
            Disponibilite::factory()->count(2)->create([
                'agent_profile_id' => $profile->id,
            ]);
        }

        // ─── 4. 5 voyageurs ──────────────────────────────────────────────────

        // Voyageur avec email fixe en premier
        $voyageurAtlas = User::factory()->voyageur()->create([
            'email' => 'voyageur@atlas.com',
        ]);

        // 4 voyageurs supplémentaires
        $autresVoyageurs = User::factory()->voyageur()->count(4)->create();

        // Collection de tous les voyageurs
        $voyageurs = $autresVoyageurs->prepend($voyageurAtlas);

        // ─── 5. 15 bookings (demandes) variés ────────────────────────────────

        $statuts = [
            ...array_fill(0, 5, 'en_attente'),
            ...array_fill(0, 5, 'acceptee'),
            ...array_fill(0, 5, 'refusee'),
        ];

        shuffle($statuts);

        foreach ($statuts as $statut) {
            $voyageur = $voyageurs->random();
            $profile  = $agentProfiles->random();

            Demande::factory()->create([
                'voyageur_id'      => $voyageur->id,
                'agent_profile_id' => $profile->id,
                'statut'           => $statut,
            ]);
        }
    }
}
