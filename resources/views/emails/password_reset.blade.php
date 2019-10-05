@extends('layouts.mail_master')

@section('content')
<div class="">
    <div class="content">
        <h3>Reset your password</h3>
        <p>
            Please use the link below for resetting your password. Note that the link can be used for
            changing your password only once.
        </p>
        <a href="{{ $link }}">
            {{ $link }}
        </a>

        <br>

        <p>
            If you didn't request this, or did change your mind, please cancel the process by
            clicking on the cancel link below.
        </p>

        <a href="{{ $cancel_link }}">
            {{ $cancel_link }}
        </a>

        <p>
            With L<span class="heart">&#x2665;</span>VE, <br>
            <strong>Awiar Team</strong>
        </p>


    </div>
</div>
@endsection('content')