<?php
namespace Database\Seeders;
use App\Models\{User, AgentProfile, AgentLanguage,
                AgentZone, Availability, Booking};
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $langues = ['Français','Anglais','Arabe','Espagnol','Wolof'];
        $zones   = ['Dakar','Saint-Louis','Thiès','Ziguinchor','Touba'];

        // 1 Admin
        User::factory()->admin()->create([
            'name'  => 'Admin Atlas',
            'email' => 'admin@atlas.com',
        ]);

        // 10 agents validés
        for ($i = 0; $i < 10; $i++) {
            $user    = User::factory()->agent()->create();
            $profile = AgentProfile::factory()
                         ->create(['user_id' => $user->id]);

            $selectedLangs = array_slice(
              $langues, 0, rand(2,3)
            );
            foreach ($selectedLangs as $lang) {
                AgentLanguage::create([
                    'agent_profile_id' => $profile->id,
                    'language'         => $lang,
                ]);
            }
            $selectedZones = array_slice(
              $zones, 0, rand(1,2)
            );
            foreach ($selectedZones as $zone) {
                AgentZone::create([
                    'agent_profile_id' => $profile->id,
                    'zone'             => $zone,
                ]);
            }
            Availability::factory()->count(2)
              ->create(['agent_profile_id' => $profile->id]);
        }

        // 2 agents en attente
        for ($i = 0; $i < 2; $i++) {
            $user = User::factory()->agent()->create();
            AgentProfile::factory()->enAttente()
              ->create(['user_id' => $user->id]);
        }

        // 5 voyageurs
        User::factory()->voyageur()->create([
            'name'  => 'Voyageur Test',
            'email' => 'voyageur@atlas.com',
        ]);
        User::factory()->voyageur()->count(4)->create();

        // 15 bookings variés
        $voyageurs = User::where('role','voyageur')->get();
        $profiles  = AgentProfile::where('status','valide')->get();
        $statuts   = array_merge(
            array_fill(0, 5, 'en_attente'),
            array_fill(0, 5, 'acceptee'),
            array_fill(0, 5, 'refusee')
        );
        foreach ($statuts as $statut) {
            Booking::factory()->create([
                'user_id'          => $voyageurs->random()->id,
                'agent_profile_id' => $profiles->random()->id,
                'status'           => $statut,
            ]);
        }
    }
}
