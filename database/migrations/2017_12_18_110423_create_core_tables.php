<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCoreTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        /*Note: be aware of the order!*/
        Schema::create('roles', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('nickname')->unique()->nullable()->default(null);
            $table->string('email')->unique();
            $table->string('password');
            $table->boolean('active')->default(false);
            //profile fields
            $table->longText('summary')->nullable()->default(null);
            $table->string('picture')->nullable()->default(null);
            $table->string('title')->nullable()->default(null);
            $table->string('phone')->nullable()->default(null);
            $table->string('company')->nullable()->default(null);
            $table->timestamp('last_online')->nullable()->default(null);
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('requesters', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('title')->nullable()->default(null);
            $table->string('email');
            $table->string('phone')->nullable()->default(null);
            $table->string('company')->nullable()->default(null);
            //profile fields
            $table->mediumText('note')->nullable()->default(null);
            $table->timestamps();
        });

        Schema::create('contact_messages', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('requester_id')->unsigned();
            $table->string('subject');
            $table->longText('content');
            $table->string('newsletter_topic')->nullable()->default(null);
            $table->enum('type',['contact','career','newsletter']);
            $table->foreign('requester_id')->references('id')->on('requesters')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('replies', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->integer('message_id')->unsigned();

            $table->string('subject');
            $table->longText('content');
            $table->boolean('is_auto_reply')->default(false);
            $table->enum('status',['draft','waiting','progress','failed','sent']);
            $table->timestamp('sent_time')->nullable()->default(null);

            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('message_id')->references('id')->on('contact_messages')->onDelete('cascade');
        });


        //pivots
        /*@Note: This one has changed from legacy role_user pivot*/
        Schema::create('role_users', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->integer('role_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->unique(['user_id', 'role_id']);
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //removing pivots first
        Schema::dropIfExists('role_user');

        //removing tables
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('replies');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('requesters');
        Schema::dropIfExists('users');
    }
}
