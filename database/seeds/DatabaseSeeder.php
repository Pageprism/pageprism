<?php

use Illuminate\Database\Seeder;
use App\User;
use App\Requester;
use App\ContactMessage;
use App\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $team[] = array(
            'name' => 'Kavan Soleimanbeigi',
            'picture' => '/assets/img/team/kavan.jpg',
            'email' =>'solxiom@gmail.com',
            'password' => bcrypt('.rox6384'),
            'active' => 1,
            'phone' =>'+000000000'
        );
        $team[] = array(
            'name' => 'Helen Charoupia',
            'picture' => '/assets/img/team/helen.jpg',
            'email' =>'heleninwonderl4nd@gmail.com',
            'password' => bcrypt('.welcomeH_12n'),
            'active' => 1,
            'phone' =>'+000000000'
        );
        $team[] = array(
            'name' => 'Andrew Kozadinos',
            'picture' => '/assets/img/team/andrew.jpg',
            'email' =>'koza-sparrow@hotmail.com',
            'password' => bcrypt('.welcomeA_903v'),
            'active' => 1,
            'phone' =>'+000000000'
        );

        $team[] = array(
            'name' => 'Renata Hnykova',
            'picture' => '/assets/img/team/renata.jpg',
            'email' =>'hnykova.renata@gmail.com',
            'password' => bcrypt('.welcomeR_15x'),
            'active' => 1,
            'phone' =>'+000000000'
        );

        $moderatorRole = Role::where('name', 'moderator')->first();
//        $basicRole = Role::where('name', 'basic')->first();
        if(empty($moderatorRole)){
            factory(Role::class,1)->create(['name'=>'moderator']);
            $moderatorRole = Role::where('name', 'moderator')->first();

        }
        foreach($team as $member){
            factory(User::class,1)->create($member)->each(function ($u) use ($moderatorRole){
                $u->roles()->save($moderatorRole);
            });
        }
        // $this->call(UsersTableSeeder::class);
//        $moderatorRole = Role::where('name', 'moderator')->first();
//        $basicRole = Role::where('name', 'basic')->first();
//        factory(Requester::class, 100)->create()->each(function ($requester) {
//            $messages = factory(ContactMessage::class, 1)->make();
//            $requester->messages()->save($messages[0]);
//        });
//        factory(User::class, 100)->create()->each(function ($u) use ($moderatorRole, $basicRole) {
//            $u->roles()->save($basicRole);
//        });


    }
}
