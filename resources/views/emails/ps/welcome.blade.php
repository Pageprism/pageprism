@extends('layouts.ps_mail_master')

@section('content')
<div class="">
    <div class="content">
        @if($isWelcomeLink)
            <h3>Welcome to Pageshare,</h3>
            <p>
                Congratulations, your Pageshare account is created and you have officially joined our growing community.
                Please remember to confirm your email by clicking on the link below.

            </p>
        @else
            <h3>Email confirmation link</h3>

            <p>
                Please confirm your email address by clicking on the link below.

            </p>
        @endif
        <a href="{{ $link }}">
            {{ $link }}
        </a>

        @if($isWelcomeLink)
            <br>

        @else
            <p>
                You can ignore this email if you have already confirmed your email address.
            </p>
            <br>
        @endif

    </div>
</div>
@endsection('content')