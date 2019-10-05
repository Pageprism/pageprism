@extends('layouts.mail_master')

@section('content')
<div class="">
    <div class="content">
        @if($isWelcomeLink)
            <h3>Welcome to Awiar community,</h3>
            <p>
                Congratulations, your Awiar Insider account is created and you have officially joined our growing community.
                You can use your account to access all Awiar apps & services.
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
            <p>
                With L<span class="heart">&#x2665;</span>VE, <br>
                <strong>Awiar Team</strong>
            </p>
        @else
            <p>
                You can ignore this email if you have already confirmed your email address.
            </p>
            <br>
            <p>
                With L<span class="heart">&#x2665;</span>VE, <br>
                <strong>Awiar Team</strong>
            </p>
        @endif

    </div>
</div>
@endsection('content')