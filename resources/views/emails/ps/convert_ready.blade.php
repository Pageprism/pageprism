@extends('layouts.ps_mail_master')

@section('content')
<div class="">
    <div class="content">
        <br>
        <strong class="cnt-title">
            PDF conversion job completed.
        </strong>
        <br>
        <div class="cont-body">
            <div class="cover">
                <img src="{{$server_root}}{{$cover_image}}" alt="">
            </div>
            <div class="desc-side">
                <p class="info">
                    PDF conversion job is completed for
                    <strong class="category">{{ UCWORDS($book->title) }}</strong>.
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

                <div class="tags">
                    <strong>Status: </strong>
                    <span class="tag-item">{{ strtoupper($book->status) }}</span>
                </div>
                <div class="tags">
                    <strong>Ordered by: </strong>
                    <span class="tag-item">{{ UCWORDS($uploader->name) }}</span>
                </div>

                <div class="go-to-app">
                    <a href="{{$book_link }}" class="read-btn">
                        <span>Start reading</span>
                    </a>
                </div>

            </div>
        </div>
    </div>

</div>
@endsection('content')