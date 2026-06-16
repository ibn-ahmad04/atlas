<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use OpenApi\Attributes as OA;

class PostController extends Controller
{
    #[OA\Get(path: "/api/v1/posts", summary: "Liste des posts (fil social)", tags: ["Posts"])]
    #[OA\Parameter(name: "agent_id", in: "query", required: false, description: "Filtrer par agent")]
    #[OA\Response(response: "200", description: "Liste des posts avec tags et agents")]
    public function index(Request $request)
    {
        $query = Post::with(['agentProfile.user', 'taggedUsers']);

        if ($request->has('agent_id')) {
            $query->where('agent_id', $request->agent_id);
        }

        $posts = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $posts
        ]);
    }

    #[OA\Post(path: "/api/v1/agent/posts", summary: "Créer un post (exploit)", tags: ["Agent", "Posts"], security: [["bearerAuth" => []]])]
    #[OA\Response(response: "201", description: "Post créé")]
    #[OA\Response(response: "403", description: "Non autorisé")]
    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'agent' || !$user->agentProfile) {
            return response()->json(['success' => false, 'message' => 'Seul un agent peut créer un post'], 403);
        }

        $validated = $request->validate([
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
            'tagged_users' => 'nullable|array',
            'tagged_users.*' => 'exists:users,id'
        ]);

        $post = new Post();
        $post->agent_id = $user->agentProfile->id;
        $post->description = $validated['description'];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('posts', 'public');
            $post->image_url = $path;
        }

        $post->save();

        if (isset($validated['tagged_users']) && count($validated['tagged_users']) > 0) {
            $post->taggedUsers()->sync($validated['tagged_users']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Post publié avec succès',
            'data' => $post->load('taggedUsers')
        ], 201);
    }

    #[OA\Delete(path: "/api/v1/agent/posts/{id}", summary: "Supprimer un post", tags: ["Agent", "Posts"], security: [["bearerAuth" => []]])]
    #[OA\Response(response: "200", description: "Post supprimé")]
    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['success' => false, 'message' => 'Post non trouvé'], 404);
        }

        if ($post->agentProfile->user_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
        }

        if ($post->image_url && Storage::disk('public')->exists($post->image_url)) {
            Storage::disk('public')->delete($post->image_url);
        }

        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'Post supprimé'
        ]);
    }
}
