<?php

use Illuminate\Database\Seeder;
use App\User;

class BlogDbSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $all = User::all();
        foreach ($all as $u) {
            factory(\App\Story::class, 5)->create(['user_id' => $u->id]);
        }

    }
}
