<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Income extends Model
{
    protected $fillable = ['user_id', 'description', 'date', 'amount'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
