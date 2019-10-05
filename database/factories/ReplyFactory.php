<?php

use Faker\Generator as Faker;

$factory->define(App\Reply::class, function (Faker $faker) {
    return [
        'subject' => $faker->sentence,
        'content' => $faker->realText(),
        'is_auto_reply' => false,
        'sent_time' => $faker->dateTimeBetween('-1 week','now')
        ];
});
