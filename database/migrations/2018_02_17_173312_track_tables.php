<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TrackTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::create('tracks', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->text('content')->nullable()->default(null);
            $table->string('target_type')->nullable()->default(null);
            $table->integer('target_id')->unsigned()->nullable()->default(null);
            $table->string('from_link')->nullable()->default(null);
            $table->string('to_link')->nullable()->default(null);
            $table->string('link')->nullable()->default(null);
            $table->string('ip')->nullable()->default(null);
            $table->string('agent')->nullable()->default(null);
            $table->string('session_id')->nullable()->default(null);
            $table->string('device_session_id')->nullable()->default(null);
            $table->integer('min')->nullable()->default(null);
            $table->integer('max')->nullable()->default(null);
            $table->integer('count')->unsigned()->nullable()->default(null);
            $table->integer('duration')->unsigned()->nullable()->default(null);
            $table->integer('user_id')->unsigned()->nullable()->default(null);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('cover_stories', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title');
            $table->string('key');
            $table->dateTime('starting');
            $table->dateTime('ending');
            $table->integer('story_id')->unsigned();
            $table->foreign('story_id')->references('id')->on('stories')->onDelete('cascade');
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
        Schema::dropIfExists('tracks');
        Schema::dropIfExists('cover_stories');

    }
}
