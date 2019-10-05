<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8"/>
    <title>{{ $app->title }} - Awiar Read shared stories</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="awr-app-group" content="{{ $app->app_group }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    @foreach ($app->meta_tags as $meta)
    <meta @foreach ($meta as $key=>
    $value) {{ $key }} = "{{ $value }}" @endforeach />
    @endforeach

    <link @foreach ($app->
    icon as $key => $value) {{ $key }} = "{{ $value }}" @endforeach />
    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="/{{ $app->name }}/css/awr-ux.vendor.css?v={{ $app->ux_version }}"/>
    <link rel="stylesheet" type="text/css" href="/{{ $app->name }}/css/awr-ux.min.css?v={{ $app->ux_version }}"/>
    <link rel="stylesheet" type="text/css" href="/{{ $app->name }}/css/awr-app.min.css?v={{ $app->app_version }}"/>
    <script type="text/javascript" src="/{{ $app->name }}/js/awr-ux.vendor.js?v={{ $app->ux_version }}"></script>

    @include('parts.' . $app->layout_group . '.basic_head_content')

</head>
<body>

@include('parts.' . $app->layout_group . '.basic_header')

<div class="main">
    @yield('content')
</div>

</body>
</html>
