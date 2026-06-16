<?php
namespace Database\Seeders;
use App\Models\{User, AgentProfile, AgentLanguage,
                AgentZone, Availability, Booking, Destination, Post, Review};
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $langues = ['Français','Anglais','Arabe','Espagnol','Wolof','Japonais','Peul'];

        // 1 Admin
        User::factory()->admin()->create([
            'name'  => 'Admin Atlas',
            'email' => 'admin@atlas.com',
        ]);

        // 5 Voyageurs fixes
        $voyageurTest = User::factory()->voyageur()->create([
            'name'  => 'Voyageur Test',
            'email' => 'voyageur@atlas.com',
        ]);
        User::factory()->voyageur()->count(9)->create();
        $voyageurs = User::where('role', 'voyageur')->get();

        // ---------------- Destinations Riches ----------------
        $destinationsData = [
            // Touristique
            ['name' => 'Paris', 'description' => 'La ville lumière, capitale de la mode et de la culture.', 'latitude' => 48.8566, 'longitude' => 2.3522, 'travel_type' => 'touristique'],
            ['name' => 'Tokyo', 'description' => 'Mégalopole vibrante, où tradition et technologie se rencontrent.', 'latitude' => 35.6762, 'longitude' => 139.6503, 'travel_type' => 'touristique'],
            ['name' => 'Rome', 'description' => 'La ville éternelle, un musée à ciel ouvert.', 'latitude' => 41.9028, 'longitude' => 12.4964, 'travel_type' => 'touristique'],
            ['name' => 'Kyoto', 'description' => 'Le Japon authentique avec ses temples millénaires et ses jardins zen.', 'latitude' => 35.0116, 'longitude' => 135.7681, 'travel_type' => 'touristique'],
            ['name' => 'New York', 'description' => 'La ville qui ne dort jamais.', 'latitude' => 40.7128, 'longitude' => -74.0060, 'travel_type' => 'touristique'],
            ['name' => 'Barcelone', 'description' => 'L\'architecture de Gaudí et le soleil méditerranéen.', 'latitude' => 41.3851, 'longitude' => 2.1734, 'travel_type' => 'touristique'],
            ['name' => 'Rio de Janeiro', 'description' => 'Le Carnaval, le Corcovado et Copacabana.', 'latitude' => -22.9068, 'longitude' => -43.1729, 'travel_type' => 'touristique'],
            
            // Omra & Hajj
            ['name' => 'La Mecque', 'description' => 'Le lieu saint de l\'Islam, pour accomplir votre pèlerinage.', 'latitude' => 21.3891, 'longitude' => 39.8579, 'travel_type' => 'hajj'],
            ['name' => 'Médine', 'description' => 'La ville du prophète, havre de paix.', 'latitude' => 24.5247, 'longitude' => 39.5692, 'travel_type' => 'omra'],
            ['name' => 'Jérusalem', 'description' => 'Troisième lieu saint de l\'Islam, la mosquée Al-Aqsa.', 'latitude' => 31.7683, 'longitude' => 35.2137, 'travel_type' => 'omra'],

            // Aventure
            ['name' => 'Mont Blanc', 'description' => 'Le toit de l\'Europe pour les passionnés d\'alpinisme.', 'latitude' => 45.8326, 'longitude' => 6.8652, 'travel_type' => 'aventure'],
            ['name' => 'Bali', 'description' => 'L\'île des dieux, parfaite pour le surf, la détente et l\'aventure.', 'latitude' => -8.4095, 'longitude' => 115.1889, 'travel_type' => 'aventure'],
            ['name' => 'Grand Canyon', 'description' => 'Des paysages spectaculaires et des randonnées vertigineuses.', 'latitude' => 36.1069, 'longitude' => -112.1129, 'travel_type' => 'aventure'],
            ['name' => 'Kilimandjaro', 'description' => 'Le plus haut sommet d\'Afrique, une ascension inoubliable.', 'latitude' => -3.0674, 'longitude' => 37.3556, 'travel_type' => 'aventure'],
            ['name' => 'Patagonie', 'description' => 'Des glaciers impressionnants et des terres sauvages au bout du monde.', 'latitude' => -50.3370, 'longitude' => -72.2606, 'travel_type' => 'aventure'],

            // Afrique
            ['name' => 'Dakar', 'description' => 'La capitale du Sénégal, porte de l\'Afrique de l\'Ouest avec son hospitalité légendaire.', 'latitude' => 14.7167, 'longitude' => -17.4677, 'travel_type' => 'afrique'],
            ['name' => 'Casablanca', 'description' => 'Métropole marocaine dynamique, entre modernité et tradition.', 'latitude' => 33.5731, 'longitude' => -7.5898, 'travel_type' => 'afrique'],
            ['name' => 'Abidjan', 'description' => 'Le carrefour culturel et économique de la Côte d\'Ivoire.', 'latitude' => 5.3599, 'longitude' => -4.0083, 'travel_type' => 'afrique'],
            ['name' => 'Nairobi', 'description' => 'La capitale du Kenya, célèbre pour son parc national.', 'latitude' => -1.2921, 'longitude' => 36.8219, 'travel_type' => 'afrique'],
            ['name' => 'Le Cap', 'description' => 'Ville magnifique au pied de la montagne de la Table.', 'latitude' => -33.9249, 'longitude' => 18.4241, 'travel_type' => 'afrique'],
            ['name' => 'Marrakech', 'description' => 'La ville rouge, sa médina animée et ses jardins majestueux.', 'latitude' => 31.6295, 'longitude' => -8.0083, 'travel_type' => 'afrique'],

            // Luxe
            ['name' => 'Maldives', 'description' => 'Des atolls paradisiaques et des eaux cristallines pour un luxe absolu.', 'latitude' => 3.2028, 'longitude' => 73.2207, 'travel_type' => 'luxe'],
            ['name' => 'Dubaï', 'description' => 'L\'extravagance, le shopping de luxe et les gratte-ciels démesurés.', 'latitude' => 25.2048, 'longitude' => 55.2708, 'travel_type' => 'luxe'],
            ['name' => 'Monaco', 'description' => 'La principauté du glamour, du Grand Prix et de la Côte d\'Azur.', 'latitude' => 43.7384, 'longitude' => 7.4246, 'travel_type' => 'luxe'],
            ['name' => 'Bora Bora', 'description' => 'Le joyau du Pacifique, avec ses bungalows sur l\'eau.', 'latitude' => -16.5004, 'longitude' => -151.7415, 'travel_type' => 'luxe']
        ];

        foreach ($destinationsData as $d) {
            Destination::create(array_merge($d, ['is_featured' => true]));
        }

        // ---------------- Agents Spécialisés ----------------
        // On va créer 40 agents. Chaque agent aura une ou plusieurs "zones" correspondant au NOM d'une destination.
        // Cela permettra de lier un agent à une destination spécifique et de faire matcher la catégorie.
        
        $names = [
            'Mamadou Ndiaye', 'Fatou Diop', 'Aïssatou Sow', 'Cheikh Fall', 'Abdoulaye Diallo', 
            'Kenji Tanaka', 'Maria Garcia', 'Ahmed Ben Ali', 'Sophie Martin', 'John Smith', 
            'Khadija Ba', 'Ousmane Sene', 'Amina Cissé', 'Ibrahim Diouf', 'Ndeye Gueye', 
            'Yuki Takahashi', 'Elena Rossi', 'Omar Hassan', 'Emma Brown', 'Lucas Dubois',
            'Isabella Costa', 'David Kim', 'Amadou Sy', 'Yassine Berrada', 'Chloe Thomas',
            'Moussa Camara', 'Hiroshi Watanabe', 'Julia Muller', 'Hassan Tariq', 'Pauline Lefevre',
            'Sara Gomez', 'Alioune Fall', 'Noemie Dubois', 'Aya Kurosawa', 'Tarik El Amrani',
            'William Jones', 'Marie Lambert', 'Yusuf Erdogan', 'Olivia Martinez', 'Karim Ziani'
        ];

        // Pour chaque type, une liste d'agents
        $categories = ['touristique', 'omra', 'aventure', 'afrique', 'luxe'];
        
        for ($i = 0; $i < 40; $i++) {
            $catIndex = $i % 5;
            $agentCat = $categories[$catIndex];
            
            $userData = [
                'name' => $names[$i],
                'avatar' => "https://images.unsplash.com/photo-150" . (6277886164 + $i * 1000) . "?w=400&h=400&fit=crop"
            ];
            
            // L'agent 0 (Touristique) sera l'agent par défaut
            if ($i === 0) {
                $userData['email'] = 'agent@atlas.com';
            }
            
            $user = User::factory()->agent()->create($userData);
            
            $bioMap = [
                'touristique' => "Spécialiste des plus belles villes du monde. Laissez-moi organiser votre prochain city-break inoubliable.",
                'omra' => "Guide certifié pour le Hajj et la Omra. Accompagnement spirituel et logistique complet aux Lieux Saints.",
                'aventure' => "Aventurier dans l'âme, je crée des itinéraires hors des sentiers battus pour les amateurs de sensations.",
                'afrique' => "Expert du continent africain. Safari, découverte culturelle et Teranga au programme.",
                'luxe' => "Concepteur de voyages de prestige. Je m'assure que chaque détail de votre séjour frôle la perfection."
            ];

            $profile = AgentProfile::factory()->create([
                'user_id' => $user->id,
                'bio' => $bioMap[$agentCat]
            ]);

            // Assign languages
            $selectedLangs = array_slice($langues, 0, rand(2,3));
            foreach ($selectedLangs as $lang) {
                AgentLanguage::create(['agent_profile_id' => $profile->id, 'language' => $lang]);
            }

            // Assign Zones matching destinations in this category
            $catDests = collect($destinationsData)->filter(fn($d) => $d['travel_type'] === $agentCat)->values();
            // Pick 1 to 3 destinations
            $selectedDests = $catDests->random(min(rand(1, 3), $catDests->count()));
            foreach ($selectedDests as $dest) {
                AgentZone::create(['agent_profile_id' => $profile->id, 'zone' => $dest['name']]);
            }

            // Availabilities
            for ($d=1; $d<=10; $d+=3) {
                Availability::create([
                    'agent_profile_id' => $profile->id,
                    'start_date' => now()->addDays($d)->toDateString(),
                    'end_date' => now()->addDays($d+2)->toDateString(),
                    'status' => 'disponible'
                ]);
            }

            // Posts (Exploits)
            for ($p=0; $p<rand(1, 3); $p++) {
                $post = Post::create([
                    'agent_id' => $profile->id,
                    'description' => "Un moment incroyable avec mes voyageurs ! #" . rand(100,999) . " #Atlas",
                    'image_url' => null,
                ]);
                $post->taggedUsers()->sync($voyageurs->random(rand(1, 2))->pluck('id')->toArray());
            }

            // Reviews
            for ($r=0; $r<rand(2, 5); $r++) {
                Review::create([
                    'agent_id' => $user->id,
                    'user_id' => $voyageurs->random()->id,
                    'rating' => rand(4, 5),
                    'comment' => 'Excellente organisation, un voyage parfaitement adapté à mes attentes.'
                ]);
            }
        }

        // ---------------- Bookings ----------------
        // On génère 150 bookings pour avoir une activité visible sur la carte
        $profiles = AgentProfile::where('status','valide')->get();
        for ($b=0; $b<150; $b++) {
            Booking::create([
                'user_id' => $voyageurs->random()->id,
                'agent_profile_id' => $profiles->random()->id,
                'slot_start' => now()->addDays(rand(1, 10))->toDateTimeString(),
                'slot_end' => now()->addDays(rand(11, 20))->toDateTimeString(),
                'status' => collect(['en_attente', 'acceptee', 'refusee'])->random(), // Pour la stat 'active_requests', on compte 'en_attente' et 'acceptee'
                'message' => 'Réservation de test automatique.'
            ]);
        }
    }
}
