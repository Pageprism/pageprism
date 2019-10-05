<?php

use Faker\Generator as Faker;
use App\CoverStory;

$factory->define(CoverStory::class, function (Faker $faker) {
    return [
        //
        'starting'=>$faker->dateTimeBetween('+5 days','+6 days'),
        'ending'=>$faker->dateTimeBetween('+12 days','+13 days')
    ];
});
