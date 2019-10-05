@extends('layouts.mail_read_master')

@section('content')

<div class="">
    <div class="content">
            <p>
                <strong>{{ UCWORDS($person->name) }}</strong> has joined
            </p>
            <p>
                {{ UCWORDS($person->name) }}, which was invited by you before, has now joined
                the platform.
            </p>
    </div>

</div>
@endsection('content')