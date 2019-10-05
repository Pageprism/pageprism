@extends('layouts.socket_master')

@section('content')
    <div class="flex-center position-ref full-height">
        <div class="content">


            <div class="container">
                <div class="row">
                    <div class="">
                        <div id="messages"></div>
                    </div>
                </div>
            </div>
            <script>
                let socketKey = 'c29ja2V0OnNvY2tldF81YWY4MTYzMmNmNDhhNi4xNjc1NjQ3MA',
                    socket = io.connect(`ws://localhost:8890?token=${socketKey}`);
                socket.on('notification', function (data) {
                    $("#messages").append("<p>" + data.message + "</p>");
                });
                $("#messages").append("<p> Listening...</p>");
            </script>
        </div>

    </div>
@endsection('content')