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
        body {
            /*max-width: 1000px;*/
            padding: 0 20px;
            color: #4d4d4d;

        }

        .header {
            border-bottom: 1px solid #1A1A1A;
            background: #444444;
            height: 60px;
            /*width: 100%;*/
            /*background-position-y: 10px;*/
            display: block;
            padding-top: 15px;
        }

        .header a.awr-logo{
            background: url('https://www.awiar.net/assets/img/read_header_logo.png?v=23') no-repeat;
            background-size: 245px;
            min-height: 50px;
            min-width: 225px;
            display: inline-block;
        }

        .header a.awr-logo img {
            width: 225px;
            padding: 10px;
            display: none;
        }

        .content {
            max-width: 800px;
            /*padding: 20px;*/

        }

        .content h1, h2, h3, h4, h5, h6 {
        }

        span.heart {
            color: red;
            font-size: 1.3em;
        }

        .footer {
            text-align: center;
            overflow-x: hidden;
        }

        .footer .top {
            background: #f1f1f1;
            height: 110px;
            width: 100%;
            padding: 5px;
        }

        .footer .top .links {
            display: inline-block;
            padding-left: 20px;

        }

        .footer .top .links a {
            text-decoration: none;
        }

        .footer .awr-links {
            display: block;
            /*flex-direction: column;*/
            padding-left: 20px;
            text-align: left;
            width: 200px;
            margin: 0 auto;
        }

        .footer .awr-links a {
            display: block;
        }

        .footer .awr-links a:visited, .footer .awr-links a:active, .footer .awr-links a {
            color: #0000F0;
            text-decoration: none;
        }

        .footer .awr-links a span:hover {
            text-decoration: underline;
        }

        .footer .awr-links a img {
            width: 16px;
            text-decoration: none;
        }

        .footer .links a img {
            width: 42px;
        }

        .content{
            display: block;
            margin: 0 auto;
        }
        .content .info .category{
            text-transform: capitalize;
        }
        .content .cnt-title{
            font-size: 1.3em;
        }
        .content .cnt-title .new{
            border-bottom: 2px solid #47dadc;
        }
        .article{
            max-width: 600px;
            margin: 0 auto;
            background: #f1f1f1;
        }
        .article .head{
            background: #444444;
            color: #fff;
            padding: 10px;
            display: flex;
        }
        .article .head .author-img{
            @if(!empty($author) && !empty($author->picture))
              background: url('{{ $author->picture }}') center;
            @else
              background: url('https://www.awiar.net/assets/img/icons/profile_icon.png') center;
            @endif
            min-width: 42px;
            min-height: 42px;
            width: 42px;
            height: 42px;
            background-size: contain;
            border-radius: 50%;
        }
        .article .head .author-name{
            margin: 10px;
            font-weight: 600 !important;
        }
        .author-name{
            text-transform: capitalize;
        }
        .article .title, .article .summary{
            padding: 10px 20px;
        }
        .article .title{
            font-size: 1.4em;
            font-weight: 500 !important;
            display: table-cell;
            cursor: pointer;
            color: #444444;
        }
        .article .title a{
            color: #444444;
            text-decoration: none;
        }
        .article .title a:hover{
            color: #444444;
            text-decoration: underline;
        }

        .article .summary{
            color: #404040;
            font-style: italic;
            padding-bottom: 20px;
        }

        .read-btn{
            display: block;
            width: 150px;
            height: 150px;
            margin: 0 auto;
            cursor: pointer;
        }
        .read-btn .btn-img{
            background: url('https://www.awiar.net/assets/img/email_read_btn.png') center;
            background-repeat: no-repeat;
            width: 100%;
            height: 100%;
            min-width: 150px;
            min-height: 150px;
        }
        .read-btn span{
            display: none;
        }
    </style>
</head>
<body>
<div class="header">
    <a class="awr-logo" href="https://www.awiar.net/read" target="_blank" >
        <img class="dark-logo" src="https://www.awiar.net/assets/img/read_header_logo_white_sm.png?v=23" alt="">
    </a>
</div>
<div class="main">
    @yield('content')
</div>
<div class="footer">
    <div class="top">
        <h3>Follow and connect with Awiar on Facebook and Instagram</h3>
        <div class="links">
            <a href="https://www.facebook.com/AwiarSolutions/">
                <img src="https://www.awiar.net/assets/img/email/fb_icon_sm.png" width="42px" alt="">
            </a>

            <a href="https://www.instagram.com/awiarsolutions/">
                <img src="https://www.awiar.net/assets/img/email/instagram_icon_sm.png" width="42px" alt="">
            </a>
        </div>
    </div>

    <h3>Visit Awiar apps & websites</h3>
    <div class="awr-links">
        <a href="https://awiarsolutions.com" target="_blank">
            <img src="https://www.awiar.net/assets/img/email/icon_sm.png" width="16px" alt="">&nbsp;
            <span>https://awiarsolutions.com</span>
        </a><br>
        <a href="https://awiar.net" target="_blank">
            <img src="https://www.awiar.net/assets/img/email/icon_sm.png" width="16px" alt="">&nbsp;
            <span>https://awiar.net</span>
        </a><br>
        <a href="https://awiar.net/read" target="_blank">
            <img src="https://www.awiar.net/assets/img/email/read_icon_sm.png" width="16px" alt="">&nbsp;
            <span>https://awiar.net/read</span>
        </a><br>
        <a href="https://awiar.net/profile" target="_blank">
            <img src="https://www.awiar.net/assets/img/email/profile_icon_sm.png?v=2" alt="">&nbsp;
            <span>https://awiar.net/profile</span>
        </a><br>
        <a href="https://awiar.net/insider" target="_blank">
            <img src="https://www.awiar.net/assets/img/email/icon_sm.png" width="16px" alt="">&nbsp;
            <span>https://awiar.net/insider</span>
        </a>
    </div>
</div>
</body>
</html>
