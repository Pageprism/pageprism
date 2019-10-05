<div class="em-main">
    <div class="">
        @if($cancelOk)
        <h4 class=""><span class="fa fa-check-circle text-success"></span>&nbsp;{{ $message }}</h4>
        @else
        <h4 class=""><span class="fa fa-chain-broken text-danger"></span>&nbsp;{{ $message }}</h4>
        @endif
    </div>

</div>
