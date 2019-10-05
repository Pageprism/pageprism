@extends('layouts.mail_read_master')

@section('content')

<div class="">
    <div class="content">
        <br>
        <strong class="cnt-title"><span class="new">New</span> article from the people you follow.</strong>
        <br>
        <p class="info"><span class="author-name">{{  UCWORDS($author->first_name) }}</span>
            @if(!empty($category))
              published a new article on <span class="category">{{ UCWORDS($category) }}</span>!
            @else
                published a new article.
            @endif
            Read it now, on the platform.
        </p>
        <br>
        <div class="article">
            <div class="head">
                <div class="author-img"></div>
                <strong class="author-name">{{ UCWORDS($author->name) }}</strong>
            </div>
            <br>
            <strong class="title"><a href="{{$article->share_link }}" target="_blank">{{ $article->title }}</a></strong>
            <div class="summary">&ldquo;&nbsp;{{ $article->summary }}&nbsp;&rdquo;</div>
        </div>
    </div>
    <br>
    <a href="{{$article->share_link }}" class="read-btn">
        <div class="btn-img"></div>
        <span>Read the article</span>
    </a>
    <br>
    <br>
</div>
@endsection('content')