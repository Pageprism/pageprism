<?php

use Faker\Generator as Faker;
use Illuminate\Support\Facades\Hash;


$factory->define(App\Exchange::class, function (Faker $faker) {
    return [
        'key' => Hash::make(md5(microtime())),
        'expires' => null
    ];
});
