<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class BlogTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
//        Schema::dropIfExists('story_tag');
//        Schema::dropIfExists('tags');
//        Schema::dropIfExists('reactions');
//        Schema::dropIfExists('reaction_types');
//        Schema::dropIfExists('comments');
//        Schema::dropIfExists('stories');

        Schema::create('stories', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->string('type')->nullable()->default(null);
            $table->string('status')->default('draft');
            $table->string('content_type')->nullable()->default(null);
            $table->text('title')->nullable()->default(null);
            $table->text('summary')->nullable()->default(null);
            $table->text('snippet')->nullable()->default(null);
            $table->longText('content')->nullable()->default(null);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('comments', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->integer('story_id')->unsigned();
            $table->integer('parent_id')->unsigned()->nullable()->default(null);
            $table->text('content');
            $table->string('content_type')->nullable()->default(null);
            $table->foreign('parent_id')->references('id')->on('comments')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('story_id')->references('id')->on('stories')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('reaction_types', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('reactions', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('reaction_type_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->integer('story_id')->unsigned()->nullable()->default(null);
            $table->integer('comment_id')->unsigned()->nullable()->default(null);
            $table->foreign('reaction_type_id')->references('id')->on('reaction_types')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('story_id')->references('id')->on('stories')->onDelete('cascade');
            $table->foreign('comment_id')->references('id')->on('comments')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('tags', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('story_tag', function (Blueprint $table) {
            $table->integer('story_id')->unsigned();
            $table->integer('tag_id')->unsigned();
            $table->foreign('story_id')->references('id')->on('stories')->onDelete('cascade');
            $table->foreign('tag_id')->references('id')->on('tags')->onDelete('cascade');
            $table->primary(['story_id', 'tag_id']);
            $table->timestamps();
        });

        Schema::create('bookmarks', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->integer('story_id')->unsigned();
            $table->unique(['user_id','story_id']);
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
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
        Schema::dropIfExists('story_tag');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('reactions');
        Schema::dropIfExists('reaction_types');
        Schema::dropIfExists('comments');
        Schema::dropIfExists('stories');
        Schema::dropIfExists('bookmarks');

    }
}
