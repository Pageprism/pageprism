@extends('layouts.ps_mail_master')

@section('content')
<div class="">
    <div class="content">
        <br>
        <strong class="cnt-title">
            New publication on the topics you follow.
        </strong>
        <br>
        <div class="cont-body">
            <div class="cover">
                <img src="{{$server_root}}{{$cover_image}}" alt="">
            </div>
            <div class="desc-side">
                <p class="info"><strong class="author-name">{{  UCWORDS($uploader->name) }}</strong>
                    published a new reading <strong class="category">{{ UCWORDS($book->title) }}</strong>.
                </p>
                <div class="tags">
                    <strong>Author: </strong>
                    @foreach ($authors as $name)
                    <span class="tag-item">{{ $name }}</span>
                    @endforeach
                </div>
                <div class="tags">
                    <strong>Tags: </strong>
                    @foreach ($book->tags as $tag)
                    <span class="tag-item">{{ $tag->name }}</span>
                    @endforeach
                </div>


                <div class="go-to-app">
                    <a href="{{$book_link }}" class="read-btn">
                        <span>Start reading</span>
                    </a>
                </div>

            </div>
        </div>
        <p class="info extra-info">
            Please note that you are receiving this notification email based on your tags
            subscription settings. You can change your tags subscription settings anytime by visiting
            <span class="app-info-path">Pageshare > Controls > Tags</span>.
        </p>
    </div>

</div>
@endsection('content')