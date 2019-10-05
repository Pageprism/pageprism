@extends(!empty($app) && isset($app->layout_group) ? 'layouts.app_master':'layouts.master')

@section('content')

<div class="main error-main">

    <div class="panel panel-default">
        <div class="panel-heading">
            <h1 class="text-warning"><span class="fa fa-exclamation-triangle"></span>&nbsp;503 Service Unavailable!</h1>
        </div>
        <div class="panel-body">
            <h3>
                <strong>The server is currently unable to handle the request due to a temporary overloading or maintenance of the server!</strong>
            </h3>
        </div>
    </div>
</div>

@endsection