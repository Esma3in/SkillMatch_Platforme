<?php

namespace App\Http\Controllers;

use App\Models\roadmapprogress;
use App\Models\Roadmap;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RoadmapProgressController extends Controller
{
    /**
     * Save or update roadmap progress
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function saveProgress(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'roadmap_id' => 'required|integer|exists:roadmaps,id',
            'candidate_id' => 'required|integer|exists:candidates,id',
            'progress' => 'required|integer|min:0|max:100',
            'steps' => 'nullable|string', // JSON string of step completion status
            'completed' => 'nullable|in:pending,completed', // Validate completed status
        ]);
    
        try {
            // Begin transaction for data consistency
            DB::beginTransaction();
    
            // Find or create roadmap progress record
            $roadmapProgress = RoadmapProgress::where('roadmap_id', $validated['roadmap_id'])
                ->where('candidate_id', $validated['candidate_id'])
                ->lockForUpdate() // Prevent race conditions
                ->first();
    
            $newProgress = $validated['progress'];
            $newSteps = $validated['steps'] ?? null;
            $newCompleted = $validated['completed'] ?? 'pending';
    
            if ($roadmapProgress) {
                // Prevent progress regression
                if ($newProgress < $roadmapProgress->progress) {
                    return response()->json([
                        'message' => 'Progress cannot be decreased',
                        'data' => [
                            'roadmap_id' => $roadmapProgress->roadmap_id,
                            'progress' => $roadmapProgress->progress,
                            'steps' => $roadmapProgress->steps,
                            'completed' => $roadmapProgress->completed,
                        ]
                    ], 422);
                }
    
                // Update existing record
                $roadmapProgress->update([
                    'progress' => $newProgress,
                    'steps' => $newSteps,
                ]);
            } else {
                // Create new record
                $roadmapProgress = RoadmapProgress::create([
                    'roadmap_id' => $validated['roadmap_id'],
                    'candidate_id' => $validated['candidate_id'],
                    'progress' => $newProgress,
                    'steps' => $newSteps,
                ]);
            }
    
            // Update roadmap completion status
            $roadmap = Roadmap::find($validated['roadmap_id']);
            if ($roadmap && $roadmap->candidate_id == $validated['candidate_id']) {
                $roadmap->update(['completed' => $newCompleted]);
            }
    
            DB::commit();
    
            return response()->json([
                'message' => 'Roadmap progress saved successfully',
                'data' => [
                    'roadmap_id' => $roadmapProgress->roadmap_id,
                    'progress' => $roadmapProgress->progress,
                    'steps' => $roadmapProgress->steps,
                    'completed' => $roadmap->completed ?? 'pending',
                ]
            ], 200);
    
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to save roadmap progress: ' . $e->getMessage());
    
            return response()->json([
                'message' => 'Failed to save roadmap progress',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    /**
     * Get roadmap progress for a specific roadmap and candidate
     *
     * @param  int  $roadmap_id
     * @param  int  $candidate_id
     * @return \Illuminate\Http\Response
     */
    public function getProgress($roadmap_id, $candidate_id)
    {
        if (!is_numeric($roadmap_id) || !is_numeric($candidate_id)) {
            return response()->json(['message' => 'Invalid parameters'], 400);
        }

        try {
            // Verify the roadmap belongs to the candidate
            $roadmap = Roadmap::where('id', $roadmap_id)
                ->where('candidate_id', $candidate_id)
                ->first();

            if (!$roadmap) {
                return response()->json([
                    'message' => 'Roadmap not found or does not belong to this candidate',
                ], 404);
            }

            // Fetch progress data
            $progress = roadmapprogress::where('roadmap_id', $roadmap_id)->first();

            if (!$progress) {
                return response()->json([
                    'message' => 'No progress data found for this roadmap',
                    'data' => [
                        'roadmap_id' => (int)$roadmap_id,
                        'progress' => 0,
                        'steps' => null
                    ]
                ], 200);
            }

            return response()->json([
                'message' => 'Roadmap progress retrieved successfully',
                'data' => [
                    'roadmap_id' => (int)$roadmap_id,
                    'progress' => (int)$progress->progress,
                    'steps' => $progress->steps
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve roadmap progress: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Failed to retrieve roadmap progress',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}