@extends('layouts.ps_mail_master')

@section('content')
<div class="">
    <div class="content">
        <div class="invite-body">

            <div class="text">
                <p>
                    <strong>{{ UCWORDS($invite->inviter->name) }}</strong> has invited to join
                    <strong class="ps-name">Pageshare</strong>
                </p>
                <p class="quote">
                    {{$invite->invite_text}}
                </p>
            </div>
            <div class="go-to-app">
                <a href="{{$join_link}}" class="read-btn">
                    <span>Join now</span>
                </a>
            </div>
<!--            <div class="extra-info">-->
<!--                <br>-->
<!--                <p>-->
<!--                    If you want to reject this request, please use the link below-->
<!--                </p>-->
<!--                <a href="">{{$reject_link}}</a>-->
<!--            </div>-->
        </div>
    </div>

</div>
<br>
</div>
@endsection('content')