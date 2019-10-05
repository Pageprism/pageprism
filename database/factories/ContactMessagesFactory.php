<?php

use Faker\Generator as Faker;

$factory->define(App\ContactMessage::class, function (Faker $faker) {
    //for enum 'something' => $faker->randomElement(['foo' ,'bar', 'baz']),
    return [
        'subject' => $faker->text(30),
        'content' => $faker->realText(),
        'type' => $faker->randomElement(['contact', 'career', 'newsletter']),
        'newsletter_topic' => $faker->randomElement(['AwrUX', 'frameworks', 'Rebel', 'Awiar Solutions', 'Shop DIAMOS', 'e-commerce', 'Continues Integration']),
        'created_at' => $faker->dateTimeBetween('-3 weeks', '-1 week')
    ];
});
