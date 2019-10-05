@extends(!empty($app) && isset($app->layout_group) ? 'layouts.app_master':'layouts.master')

@section('content')

<div class="main error-main">

    <div class="panel panel-default">
        <div class="panel-heading">
            <h1 class="text-warning"><span class="fa fa-exclamation-triangle"></span>&nbsp;500 Something went wrong!</h1>
        </div>
        <div class="panel-body">
            <h3>
                <strong>Something went wrong and we are currently working on it. Please try this later!</strong>
            </h3>
        </div>
    </div>
</div>

@endsection