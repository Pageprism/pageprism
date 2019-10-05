@extends('layouts.app_master')

@section('content')

@include('parts.'.$app->layout_group.'.email_confirmed_content')

@endsection