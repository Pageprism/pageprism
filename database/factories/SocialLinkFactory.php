<?php

use Faker\Generator as Faker;
use App\SocialLink;

$factory->define(SocialLink::class, function (Faker $faker) {
    return [
        'name' => $faker->domainName,
        'url' => $faker->url
    ];
});
