<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Awiar Read</title>
    <link rel="icon" href="https://www.awiar.net/assets/img/m_icon.png" type="image/png"/>

    <!-- Styles -->
    <style type="text/css" rel="stylesheet">
        body, .body{
            /*max-width: 1000px;*/
            /*padding: 0 20px;*/
            background: #ececeb;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow-x: hidden;
        }

        .header {
            background: #fff;
            height: 60px;
            display: block;
            padding: 18px 0 0 15px;
            text-align: center;
            /*box-shadow: rgba(0, 0, 0, 0.3) 0 1px 7px 0;*/
            border-bottom:1px solid rgba(0, 0, 0, 0.2);
            width: 100%;
            margin-top: -10px;

        }

        .header a.awr-logo {
            background-size: 125px;
            width: 200px;
            margin: 0 auto;
            display: flex;
            text-decoration: none;
        }

        .header a.awr-logo .name {
            font-size: 24px;
            font-weight: 600;
            color: #000;
            margin-top: 15px;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }

        .header a.awr-logo img, .footer .top .connect-title img {
            width: 30px;
            height: 30px;
            padding: 10px 0;
        }

        .content h1, h2, h3, h4, h5, h6 {
        }

        span.heart {
            color: red;
            font-size: 1.3em;
        }

        .footer {
            text-align: center;
            width: 100%;
            overflow: hidden;
            /*overflow-x: hidden;*/
        }

        .footer .top {
            /*background: #f1f1f1;*/
            background: #fff;
            height: 110px;
            padding: 5px;
            /*box-shadow: rgba(0, 0, 0, 0.3) 0 1px 7px 0;*/
            border-top:1px solid rgba(0, 0, 0, 0.2);
            width: 100%;
            /*border: 1px solid rgba(0, 0, 0, 0.3);*/
        }

        .footer .top .connect-title {
            display: block;
            width: 300px;
            margin: 0 auto;
            font-size: 16px;

        }

        .footer .top .connect-title .cnt {
            display: flex;
        }

        .footer .top .connect-title .cnt .text {
            margin-top: 15px;
            font-size: 17px;
        }

        .footer .top .connect-title .cnt .text strong {
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }

        .footer .top .links {
            display: block;
            /*padding-left: ;*/
            width: 120px;
            margin: 0 auto;
            text-align: left;

        }

        .footer .top .links a {
            text-decoration: none;
        }

        .footer .top .links a img {
            width: 32px;
        }

        .main {
            display: block;
            margin: 0 auto 0 auto;
            background: #fff;
            width: 100%;
            padding: 5px;
            /*box-shadow: rgba(0, 0, 0, 0.3) 0 1px 7px 0;*/
            border:1px solid rgba(0, 0, 0, 0.16);
            border-right:none;
            border-left:none;
            overflow-x: hidden;

        }

        .main .content {
            margin: 0 auto;
            max-width: 600px;
            padding: 10px 10px 20px 10px;
            overflow-x: hidden;
        }

        .main .content .cnt-title{
            font-size: 16px;
        }

        .slogans {
            width: 100%;
            padding: 45px 0 10px 0;
            text-align: center;
            color: #757575;
            height: 60px;
            background: #ececeb;

        }

        .slogans strong, .ps-name {
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        }

        .content .cont-body {
            display: flex;
            margin: 20px auto;
            font-size: 14px;
        }

        .content .cont-body .cover {
            width: 138px;
            height: 204px;
            min-width: 138px;
            min-height: 204px;
            /*box-shadow: rgba(0, 0, 0, 0.3) 0 1px 7px 0;*/
            border:1px solid rgba(0, 0, 0, 0.3);

        }

        .content .cont-body .desc-side {
            padding-left: 20px;
        }

        .content .cont-body .cover img {
            width: 100%;
            min-width: 30px;
            min-height: 30px;
        }
        @media (max-width: 750px) {
            .content .cont-body .cover{
                display: none;
            }
        }

        .content .cont-body .tag-item {
            background: #ececeb;
            padding: 7px 10px;
            border-radius: 30px;
            margin: 3px 2px;
            display: inline-block;
            font-size: 13px;
        }
        .extra-info{
            line-height: 23px;
            font-size: 14px;

        }
        .app-info-path{
            background: #ececeb;
            padding: 7px 10px;
            border-radius: 30px;
            white-space: nowrap;
            display: inline-block;
        }
        .go-to-app{
            width: 100%;
            text-align: center;
            margin-top: 40px;
        }
        .go-to-app a{
            /*text-decoration: none;*/
            background: #ececeb;
            padding: 15px;
            border-radius: 30px;
            width: 100px;
            margin: 0 auto;
        }
        .go-to-app a:visited, .go-to-app a:active{
            color: #000;
        }
        .quote{
            font-style: italic;
            max-width: 92%;
            margin: 0 auto;
        }

    </style>
</head>
<body>
<div class="body">
    <div class="header">
        <a class="awr-logo" href="{{$server_root}}" target="_blank">
            <img src="{{$server_root}}/assets/img/email/ps-logo-v2.png?v=1" alt="">
            <div class="name">Pageshare</div>
            <!--        <img class="dark-logo" src="https://www.awiar.net/assets/img/email/awiar_single_dark_sm.png?v=43" alt="">-->
        </a>
    </div>

    <div class="slogans">
        A book publishing platform for readers, authors and publishers.
    </div>

    <div class="main">
        @yield('content')
    </div>

    <div class="slogans">
        Read and publish in <strong>Pageshare</strong>, share <strong>everywhere</strong>.
    </div>
    <div class="footer">
        <div class="top">
            <div class="connect-title">
                <div class="cnt">
                    <img src="{{$server_root}}/assets/img/email/ps-logo-v2.png?v=1" alt="">
                    <div class="text">Connect with <strong>Pageshare</strong></div>
                </div>
            </div>
            <div class="links">
                <a href="https://www.facebook.com/AwiarSolutions/">
                    <img src="{{$server_root}}/assets/ps/img/ps_fb.png" alt="">
                </a>

                <a href="https://www.instagram.com/awiarsolutions/">
                    <img src="{{$server_root}}/assets/ps/img/ps_instagram.png" alt="">
                </a>

                <a href="https://www.instagram.com/awiarsolutions/">
                    <img src="{{$server_root}}/assets/ps/img/ps_twitter.png" alt="">
                </a>
            </div>
        </div>

    </div>
</div>
</body>
</html>
