@extends(!empty($app) && isset($app->layout_group) ? 'layouts.app_master':'layouts.master')

@section('content')

@include('parts.' . $app->layout_group . '.unsubscribe_content')

@endsection