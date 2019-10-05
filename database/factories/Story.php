<?php

use Faker\Generator as Faker;

function makeFakeBlog($faker)
{
    $cont = '# ' . $faker->sentences(3, true) . '\n\n';
    $p1 = $faker->paragraph(10, true) . '\n\n';
    $p2 = '## ' . $faker->sentences(2, true) . '\n\n' . $faker->paragraph(10, true) . '\n\n';
    $p3 = '## ' . $faker->sentences(2, true) . '\n\n' . $faker->sentences(6, true) . '. Please look at this [link](' . $faker->url . '). ';

    return $cont . $p1 . $p2 . $p3;
}

$factory->define(\App\Story::class, function (Faker $faker) {
    return [
        'type' => 'blog',
        'content_type' => 'markdown',
        'title' => $faker->sentences(2, true),
        'content' => makeFakeBlog($faker)
    ];
});
