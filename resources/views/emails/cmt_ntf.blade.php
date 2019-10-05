@extends('layouts.mail_read_master')

@section('content')

<div class="">
    <div class="content">
        <br>
        <strong class="cnt-title"><span class="new">New</span>

            @if($isForAuthor)
            comment in your article.
            @else
            comment in conversation you follow.
            @endif
        </strong>
        <br>

        <p class="info"><span class="author-name">{{  UCWORDS($commenter->name) }}</span>

            @if($isForAuthor)
            @if(!empty($category))
            commented your article on <span class="category">{{ UCWORDS($category) }}</span>!
            @else
            commented your article.
            @endif
            @else
            @if(!empty($category))
            commented the article on <span class="category">{{ UCWORDS($category) }}</span>!
            @else
            commented the article you read.
            @endif
            @endif

            Read and reply to {{ UCWORDS($commenter->first_name) }}'s comment, on the platform.
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

    @if(!$isForAuthor)
    <div class="content notif-info">
        <p>
            You received this email because you are following this article and discussion about it. If
            you no longer want to receive email notifications about this article, please unsubscribe using the link
            below.
        </p>
        <br>
        <a href="{{$unsubscribeLink}}" target="_blank">{{$unsubscribeLink}}</a>
    </div>
    <br>
    @endif
    <br>
</div>
@endsection('content')