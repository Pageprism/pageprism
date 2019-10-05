<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class PageshareTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('files', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('path', 500);
            $table->timestamps();
        });

        Schema::create('series', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->string('name');
            $table->string('type')->nullable()->default(null);
            $table->string('status')->default('draft');
            $table->text('description')->nullable()->default(null);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('meta_keys', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('meta_values', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('meta_key_id')->unsigned();
            $table->string('value');
            $table->foreign('meta_key_id')->references('id')->on('meta_keys')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('setting_keys', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('setting_values', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('setting_key_id')->unsigned();
            $table->string('value');
            $table->foreign('setting_key_id')->references('id')->on('setting_keys')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('story_meta_values', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('story_id')->unsigned();
            $table->integer('meta_value_id')->unsigned();
            $table->foreign('story_id')->references('id')->on('stories')->onDelete('cascade');
            $table->foreign('meta_value_id')->references('id')->on('meta_values')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('story_setting_values', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('story_id')->unsigned();
            $table->integer('setting_value_id')->unsigned();
            $table->foreign('story_id')->references('id')->on('stories')->onDelete('cascade');
            $table->foreign('setting_value_id')->references('id')->on('setting_values')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('story_attachments', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('story_id')->unsigned();
            $table->integer('file_id')->unsigned();
            $table->unique(['story_id','file_id']);
            $table->foreign('story_id')->references('id')->on('stories')->onDelete('cascade');
            $table->foreign('file_id')->references('id')->on('files')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('story_pages', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('story_id')->unsigned();
            $table->integer('file_id')->unsigned();
            $table->integer('number');
            $table->integer('width')->nullable()->default(null);
            $table->integer('height')->nullable()->default(null);
            $table->integer('resolution')->nullable()->default(null);
            $table->boolean('is_cover')->default(false);
            $table->foreign('story_id')->references('id')->on('stories')->onDelete('cascade');
            $table->foreign('file_id')->references('id')->on('files')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('story_series', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('story_id')->unsigned();
            $table->integer('series_id')->unsigned();
            $table->foreign('story_id')->references('id')->on('stories')->onDelete('cascade');
            $table->foreign('series_id')->references('id')->on('series')->onDelete('cascade');
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
        Schema::dropIfExists('story_series');
        Schema::dropIfExists('story_pages');
        Schema::dropIfExists('story_attachments');
        Schema::dropIfExists('story_setting_values');
        Schema::dropIfExists('story_meta_values');
        Schema::dropIfExists('setting_values');
        Schema::dropIfExists('setting_keys');
        Schema::dropIfExists('meta_values');
        Schema::dropIfExists('meta_keys');
        Schema::dropIfExists('series');
        Schema::dropIfExists('files');
    }
}
