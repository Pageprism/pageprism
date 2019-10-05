<?php

use Faker\Generator as Faker;
use App\Experience;

$factory->define(Experience::class, function (Faker $faker) {
    return [
        'type' => $faker->sentence,
        'position' => $faker->jobTitle,
        'at' => $faker->company,
        'description' => $faker->realText(),
        'started' =>$faker->dateTimeBetween('-2 years','-1 year'),
        'ended' => $faker->dateTimeBetween('-11 months','-1 month'),
        'is_current' => false
    ];
});
