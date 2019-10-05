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

    <?php
    if (!(empty($app) && empty($app->data)) && isset($app->data->redirect_link)) {
        $redirect_link = $app->data->redirect_link;
    } else {
        $redirect_link = '/read/#display/noStoryItemFound?v=index';
    }
    ?>
    <script type="text/javascript">

        var redirect_link = "{{$redirect_link}}";

        window.onload = function () {
            setTimeout(_ => {
                proceed();
            }, 500);

            function proceed() {
                window.location = typeof redirect_link === "string" && redirect_link.length > 0 ?
                    redirect_link : '/share/notFound';
            }
        };
    </script>
    <style>
        body {
            display: flex;
            flex-direction: row;
            align-items: center;
        }

        .content {
            width: 100%;
            text-align: center;
            height: 350px;
        }

        .content img.brand {
            max-width: 200px;
        }
    </style>
</head>
<body>

<div class="content">

    @include('parts.'.$app->layout_group.'.redirecting')

</div>
<!---->
<!--UX CORE ERRORS-->
<!--<script type="text/javascript" src="/{{ $app->name }}/js/awr-ux-errors.min.js?v={{ $app->ux_version }}"></script>-->
<!--UX CORE Templates-->
<!--<script type="text/javascript" src="/{{ $app->name }}/js/awr-ux-templates.min.js?v={{ $app->ux_version }}"></script>-->
<!--UX CORE SCRIPTS-->
<!--<script type="text/javascript" src="/{{ $app->name }}/js/awr-ux.min.js?v={{ $app->ux_version }}"></script>-->

<!--UX CORE ERRORS-->
<script type="text/javascript" src="/{{ $app->name }}/js/awr-ux-errors.min.js?v={{ $app->ux_version }}"></script>
<!--UX CORE Templates-->
<script type="text/javascript" src="/{{ $app->name }}/js/awr-ux-templates.min.js?v={{ $app->ux_version }}"></script>
<!--UX CORE SCRIPTS-->
<!--UX POLYFILLS-->
<script type="text/javascript" src="/{{ $app->name }}/js/awr-ux-polyfills.min.js?v={{ $app->ux_version }}"></script>
<!--UX KERNEL-->
<script type="text/javascript" src="/{{ $app->name }}/js/awr-ux-kernel.min.js?v={{ $app->ux_version }}"></script>
<!--UX UTILS-->
<script type="text/javascript" src="/{{ $app->name }}/js/awr-ux-utils.min.js?v={{ $app->ux_version }}"></script>
<!--UX EXTENSIONS-->
<script type="text/javascript" src="/{{ $app->name }}/js/awr-ux-extensions.min.js?v={{ $app->ux_version }}"></script>
<!--UX MODULES-->
<script type="text/javascript" src="/{{ $app->name }}/js/awr-ux-modules.min.js?v={{ $app->ux_version }}"></script>

<script type="application/javascript">
    window.awr = window.awr || {};
    window.awr.VERSION = "{{ $app->ux_version }}";
    /*supressing the ux warning by providing few dummy exports*/
    Q = window.awr.Q;
    setTimeout(function () {
        Q.$export('object:awr.$appFormRegistry', {});
        Q.$export('config:socketConnection', [function () {
        }]);
    }, 500);
</script>
</body>
</html>
