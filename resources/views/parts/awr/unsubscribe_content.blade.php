<div>
    <style>
        .panel {
            color: #2c2c2c;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;

        }

        @media (max-width: 650px) {
            .panel-body > h3 {
                text-align: center;
            }

            ul.next-links li {
                text-align: center;
            }

        }

        .panel-heading h1 {
            font-size: 1.8em;
        }

        .panel-body > h3, .panel-body > ul {
            margin: 40px auto;
            max-width: 500px;
        }

        .panel-body > h3 {
            font-size: 1.4em;
        }

        ul.next-links {
            list-style: none;
        }

        ul.next-links li a {
            color: #337ab7;
        }

        ul.next-links li a img {
            width: 22px;
        }

        ul.next-links li a, ul.next-links li a:hover, ul.next-links li a:visited {
            text-decoration: none;
        }

        ul.next-links li a:hover, ul.next-links li a:visited {
            text-decoration: none;
            color: #77acd9;
        }

        ul.next-links li a h3 {
            font-size: 1.2em;
        }

        ul.next-links li a h3 span:hover {
            text-decoration: underline;
            text-decoration-color: #77acd9;
        }

        .panel-heading {
            display: flex;
        }

        .panel-heading .icon {
            position: relative;
        }

        .panel-heading .icon .fa {
            font-size: 2.0em;
        }

        .panel-heading .cont {
            margin-left: 15px;
            font-size: 1.2em;
        }
    </style>
    <div class="error-main">
        <div class="panel panel-default">
            <div class="panel-heading">
                <div class="icon">
                    <span class="fa fa-bell-slash-o"></span>
                </div>
                <span class="cont">
                    @if(!$alreadyUnsubscribed)
                        Thank you, we have unsubscribed you. You no longer receive notifications about this subject.
                    @else
                        Your have been already unsubscribed from this subject.
                    @endif
                </span>
            </div>

            <div class="panel-body">
                <h3>Where to next?</h3>
                <ul class="next-links">
                    @foreach ($next as $n)
                    <li>
                        <a href="{{$n->href}}">

                            <h3><img src="{{$n->icon_img}}" alt="">&nbsp;<span>{{ $n->name }}</span></h3>
                        </a>
                    </li>
                    @endforeach
                </ul>


            </div>
        </div>
    </div>

</div>