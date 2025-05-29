<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChallengeResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'candidate_id',
        'challenge_id',
        'status',
        'problems_completed',
        'total_problems',
        'completion_percentage',
        'started_at',
        'completed_at',
        'certificate_id'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'problems_completed' => 'integer',
        'total_problems' => 'integer',
        'completion_percentage' => 'decimal:2',
    ];

    /**
     * Get the candidate that is taking this challenge.
     */
    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    /**
     * Get the challenge this result belongs to.
     */
    public function challenge()
    {
        return $this->belongsTo(Challenge::class);
    }

    /**
     * Get all problem results related to this challenge result.
     */
    public function problemResults()
    {
        return $this->hasMany(ProblemResult::class, 'challenge_id', 'challenge_id')
            ->where('candidate_id', $this->candidate_id);
    }

    /**
     * Calculate and update completion statistics for this challenge result.
     */
    public function updateCompletionStats()
    {
        $challenge = $this->challenge;

        // Count completed problems
        $completedProblems = ProblemResult::where([
            'candidate_id' => $this->candidate_id,
            'challenge_id' => $this->challenge_id,
            'status' => 'solved'
        ])->count();

        // Calculate total problems in challenge
        $totalStandardProblems = $challenge->problems()->count();
        $totalLeetcodeProblems = $challenge->leetcodeProblems()->count();
        $totalProblems = $totalStandardProblems + $totalLeetcodeProblems;

        // Calculate completion percentage
        $percentage = ($totalProblems > 0) ? ($completedProblems / $totalProblems) * 100 : 0;

        // Update status
        $status = 'not_started';
        if ($completedProblems > 0) {
            $status = 'in_progress';
            if ($completedProblems >= $totalProblems) {
                $status = 'completed';
                // If just completed, set completion date
                if ($this->status !== 'completed') {
                    $this->completed_at = now();
                    $this->certificate_id = $this->generateCertificateId();
                }
            }
        }

        // Update the model
        $this->problems_completed = $completedProblems;
        $this->total_problems = $totalProblems;
        $this->completion_percentage = $percentage;
        $this->status = $status;
        $this->save();

        return $this;
    }

    /**
     * Generate a unique certificate ID
     */
    private function generateCertificateId()
    {
        $prefix = 'CERT';
        $timestamp = time();
        $random = \Illuminate\Support\Str::random(4);

        return "{$prefix}-{$this->candidate_id}-{$this->challenge_id}-{$timestamp}-{$random}";
    }
}
