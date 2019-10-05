
<div class="em-main">

    <div class="">
        <div class="">
            @if($notFound)
            <h4 class=""><span class="fa fa-chain-broken text-danger"></span>&nbsp;{{ $message }}</h4>
            @else
            <h4 class=""><span class="fa fa-check-circle text-success"></span>&nbsp;{{ $message }}</h4>
            @endif
        </div>
    </div>
</div>