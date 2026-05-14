<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\AgentProfile;
use App\Models\AgentLanguage;
use App\Models\AgentZone;
use App\Models\Availability;
use App\Models\Booking;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin
        User::factory()->admin()->create([
            'name'  => 'Admin Atlas',
            'email' => 'admin@atlas.com',
        ]);

        // 2. Langues et zones disponibles
        $langues = ['Français', 'Anglais', 'Arabe', 'Espagnol', 'Wolof'];
        $zones   = ['Dakar', 'Saint-Louis', 'Thiès', 'Ziguinchor', 'Touba'];

        // 3. 10 agents validés avec profil complet
        for ($i = 0; $i < 10; $i++) {
            $user = User::factory()->agent()->create();
            $profile = AgentProfile::factory()->create([
                'user_id' => $user->id,
            ]);
            // Langues (2 à 3)
            $selectedLangues = array_slice(
                array_keys(array_flip($langues)), 0, rand(2, 3)
            );
            foreach ($selectedLangues as $lang) {
                AgentLanguage::create([
                    'agent_profile_id' => $profile->id,
                    'language'         => $lang,
                ]);
            }
            // Zones (1 à 2)
            $selectedZones = array_slice(
                array_keys(array_flip($zones)), 0, rand(1, 2)
            );
            foreach ($selectedZones as $zone) {
                AgentZone::create([
                    'agent_profile_id' => $profile->id,
                    'zone'             => $zone,
                ]);
            }
            // 2 disponibilités
            Availability::factory()->count(2)->create([
                'agent_profile_id' => $profile->id,
            ]);
        }

        // 4. 2 agents en attente de validation
        for ($i = 0; $i < 2; $i++) {
            $user = User::factory()->agent()->create();
            AgentProfile::factory()->enAttente()->create([
                'user_id' => $user->id,
            ]);
        }

        // 5. 5 voyageurs
        User::factory()->voyageur()->create([
            'name'  => 'Voyageur Test',
            'email' => 'voyageur@atlas.com',
        ]);
        User::factory()->voyageur()->count(4)->create();

        // 6. 15 bookings variés
        $voyageurs = User::where('role', 'voyageur')->get();
        $profiles  = AgentProfile::where('status', 'valide')->get();

        $statuts = [
            ...array_fill(0, 5, 'en_attente'),
            ...array_fill(0, 5, 'acceptee'),
            ...array_fill(0, 5, 'refusee'),
        ];

        foreach ($statuts as $statut) {
            Booking::factory()->create([
                'voyageur_id'      => $voyageurs->random()->id,
                'agent_profile_id' => $profiles->random()->id,
                'statut'           => $statut,
            ]);
        }
    }
}
