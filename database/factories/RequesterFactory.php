<?php

use Faker\Generator as Faker;

$factory->define(App\Requester::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'email' => $faker->safeEmail,
        'phone' => $faker->phoneNumber,
        'title' => $faker->jobTitle,
        'company' =>$faker->company,
        'note' => $faker->paragraph,
        'created_at' => $faker->dateTimeBetween('-2 months','-1 month')
    ];
});
