@extends('layouts.ps_mail_master')

@section('content')
<div class="">
    <div class="content">
        <div class="invite-body">

            <div class="text">
                <p>
                    <strong>{{ UCWORDS($person->name) }}</strong> has joined
                    <strong class="ps-name">Pageshare</strong>
                </p>
                <p>
                    {{ UCWORDS($person->name) }}, which was invited by you before, has now joined
                    the platform. This person has currently a reader role in the platform.
                </p>
            </div>

        </div>
    </div>

</div>
<br>
</div>
@endsection('content')