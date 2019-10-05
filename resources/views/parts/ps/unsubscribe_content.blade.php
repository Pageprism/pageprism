<div>
    <style>
        .panel-heading{
            display: flex;
            font-weight: 500;
            font-size: 14px;
        }
    </style>
    <div class="error-main">
        <div class="panel panel-default">
            <div class="panel-heading">
                <div class="icon">
                    <span class="far fa-bell-slash"></span>
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


            </div>
        </div>
    </div>

</div>