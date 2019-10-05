<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8"/>
    <title>{{ $app->title }}</title>

    @foreach ($app->meta_tags as $meta)
    <meta @foreach ($meta as $key=>
    $value) {{ $key }} = "{{ $value }}" @endforeach />
    @endforeach

    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="awr-app-group" content="{{ $app->app_group }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

    <link @foreach ($app->
    icon as $key => $value) {{ $key }} = "{{ $value }}" @endforeach />

    <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="/css/awr-no-support-style.css"/>
    <link rel="stylesheet" type="text/css" href="/{{ $app->name }}/css/awr-ux.vendor.css?v={{ $app->ux_version }}"/>
    <link rel="stylesheet" type="text/css" href="/{{ $app->name }}/css/awr-ux.min.css?v={{ $app->ux_version }}"/>
    <link rel="stylesheet" type="text/css" href="/{{ $app->name }}/css/awr-app.min.css?v={{ $app->app_version }}"/>
    <script type="text/javascript" src="/{{ $app->name }}/js/awr-ux.vendor.js?v={{ $app->ux_version }}"></script>
    <?php
        if (!(empty($app) && empty($app->data))) {
            $server_data = json_encode($app->data);
        } else {
            $server_data = json_encode((object)[]);
        }
    ?>

    <script type="text/javascript">
        window.awr = window.awr || {};
        <?php echo "awr.serverData = " . $server_data . ";"  ?>
    </script>


</head>
<body>
<h4 id="rootLoadingSpinner" class="text-info">

    &nbsp;<span class="ct fas fa-circle-notch fa-spin"></span><span class="ct">&nbsp;Loading...</span>
</h4>
<div id="$$root$$">
    <h1 class="fa fa-check-square col-md-offset-1 hidden" id="rootFrameWorkLabel"> AWIAR UX (PRODUCTION) </h1>
</div>
<div id="badBrowserSupport" style="display: none">
    <h2>
        Sorry, your browser is not supported!
    </h2>
    <p class="text-info">
        This browser does not support the required features necessary for running this website / app.
        Please upgrade your OS and browser to their latest stable versions. We recommend using the
        latest version for any of the browsers listed below.
    </p>
    <img src="/assets/img/browser_icons.png" style="width:600px; max-width: 90%; margin:0 auto;display: block" alt="">

    <img src="/assets/img/awiar_logo_white_bg.png" class="bottom-page-awiar-logo" style="" alt="">
</div>
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
<!--{{--<script type="text/javascript" src="/{{ $app->name }}/js/awr-ux.min.js?v={{ $app->ux_version }}"></script>--}}-->
<!--APP FORMS-->
<script type="text/javascript" src="/{{ $app->name }}/js/awr-app-forms.min.js?v={{ $app->app_version }}"></script>
<!--APP ERRORS-->
<script type="text/javascript" src="/{{ $app->name }}/js/awr-app-errors.min.js?v={{ $app->app_version }}"></script>
<!--APP Templates-->
<script type="text/javascript" src="/{{ $app->name }}/js/awr-app-templates.min.js?v={{ $app->app_version }}"></script>
<!--APP SCRIPTS-->
<script type="text/javascript" src="/{{ $app->name }}/js/awr-app-polyfills.min.js?v={{ $app->app_version }}"></script>
<script type="text/javascript" src="/{{ $app->name }}/js/awr-app-kernel.min.js?v={{ $app->app_version }}"></script>
<script type="text/javascript" src="/{{ $app->name }}/js/awr-app-utils.min.js?v={{ $app->app_version }}"></script>
<script type="text/javascript" src="/{{ $app->name }}/js/awr-app-extensions.min.js?v={{ $app->app_version }}"></script>
<script type="text/javascript" src="/{{ $app->name }}/js/awr-app-modules.min.js?v={{ $app->app_version }}"></script>


<script type="application/javascript">
    window.awr = window.awr || {};
    window.awr.VERSION = "{{ $app->ux_version }}";
    window.awr.APP_VERSION = "{{ $app->app_version }}";
</script>

<script type="text/javascript" src="/js/on-load-register.js"></script>

</body>
</html>