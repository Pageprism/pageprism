<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\User;

class ApiToken extends Model
{
    //

    /**
     * @var array
     */
     /* We need to cast id as string as many services such as SocketClientResolver
     * need access to the string version of id.
     *
     *  This is because by default the primary key is casted as int unless explicitly stated otherwise.
     *
     *       (int) "wISw4JmlMQCCrMupjojcuDTK3k4hwtkb" == 0
     *  The value still exists as string, but if you use the $model->id it will go through magic __get() method defined in Illuminate\Database\Eloquent\Model class.
     *
     *  I'm not going to argue against using id field as string, but if you do and also want to get the string value using $model->id, you'll have to cast it as string in you model definition. There is a protected $casts array you can use for that. Just add the following to your OauthClient model:
     *     protected $casts = ['id' => 'string'];
     *   This will do the trick and cast the id attribute as string instead of default integer. All though I
     *  would recommend not to use id as string in the first place.
     *      - https://stackoverflow.com/questions/38463624/laravel-eloquent-model-id-as-string-return-wrong-value-in/38464932
     */
    protected $casts = ['id' => 'string'];

    protected $table = 'oauth_access_tokens';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
