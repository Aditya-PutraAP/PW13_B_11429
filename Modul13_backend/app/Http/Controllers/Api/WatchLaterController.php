<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Contents;
use App\Models\User;
use App\Models\WatchLater;
use Illuminate\Support\Facades\Auth; 

class WatchLaterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $watchLater = WatchLater::where('id_user', Auth::user()->id)->get()->load('content');
        return response()->json(
            [
              'message' => 'All Watch Later Retrieved',
              'data' => $watchLater,
            ],
            200
          );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $storeData = $request->all();

        $idUser = Auth::user()->id;
        $user = User::find($idUser);
        if(is_null($user)){
            return response([
                'message' => 'User Not Found'
            ],404);
        }

        if(WatchLater::where('id_user', $user->id)->where('id_content', $storeData['id_content'])->exists()){
            return response([
                'message' => 'Content Already in Your Watch Later List',
                'data' => null,
            ], 400);
        }
        
        $content = Contents::where('id_user', Auth::user()->id)->get();
        if ($content->contains('id', $storeData['id_content'])) {
            return response([
                'message' => "Can't add your own content to Watch Later",
                'data' => null,
            ], 404);
        }

        $storeData['id_user'] = $user->id;
        $storeData['data_added'] = date('Y-m-d H:i:s');
        $watchLater = WatchLater::create($storeData);

        return response([
            'message' => 'Added to Your Watch Later List',
            'data' => $watchLater,
        ], 200);
    }

    

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $watchLater = WatchLater::find($id);

        if($watchLater->delete()){
            return response([
                'message' => 'Removed from Your Watch Later List',
                'data' => $watchLater,
            ],200);
        }

        return response([
            'message' => 'Delete Watch Later Failed',
            'data' => null,
        ],400);
    }
}
