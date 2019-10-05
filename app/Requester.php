<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Requester extends Model
{
    /**
     * For allowing mass assignment you need $fillable
     */
    protected $fillable = [
        'name',
        'title',
        'email',
        'phone',
        'company',
        'note'];

    public function messages()
    {
        return $this->hasMany(ContactMessage::class);
    }
}
