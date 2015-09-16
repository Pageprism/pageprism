<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <base href="<?php echo base_url()?>">
    <title>PageShare</title>
    <meta name="viewport" content="width=550" />

    <!-- Bootstrap -->
    <link href='https://fonts.googleapis.com/css?family=Open+Sans&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
    <link href="<?php echo base_url();?>assets/css/bootstrap.min.css" rel="stylesheet" media="screen" />
	<link href="<?php echo base_url();?>assets/css/font-awesome.min.css" rel="stylesheet">
    <link href="<?php echo base_url();?>assets/css/esamizdat.css?v=3" rel="stylesheet" media="screen" />
    <link rel="shortcut icon" href="<?php echo base_url();?>assets/img/esamizdat.ico" />

<script type="text/javascript">
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-41565206-1']);
_gaq.push(['_trackPageview']);
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
</script>

  </head>
  <body>


    <div id="fb-root"></div>
    <script>
    window.fbAsyncInit = function() {
    FB.init({
    appId : '366708340107485',
    status : true, // check login status
    cookie : true, // enable cookies to allow the server to access the session
    xfbml : true // parse XFBML
    });
    };
     
    (function() {
    var e = document.createElement('script');
    e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
    e.async = true;
    document.getElementById('fb-root').appendChild(e);
    }());
    </script>

<!-- Top Header -->
<div class="navbar-fake"></div>
<div class="navbar navbar-inverse navbar-fixed-top">
	<div class="navbar-inner" id="top-header">
    	<div class="container-fluid">

            <a class="brand" href="/">PageShare</a>
            <div class="nav">
                <?php
                $query = $this->db->query("SELECT id,title,url_title FROM pages");
                    if ($query->num_rows() > 0)
                    {
                        foreach ($query->result_array() as $pages_top)
                        {?>
                            <a href="/page/<?=$pages_top['url_title']?>"><?=$pages_top['title']?></a>
                        <?php
                        }
                    }


                    if ($this->session->userdata('user_name') != "") { echo "<a href='admin/'>Admin mainpage</a>"; }
                ?>
            </div>

            <div id="scroll-to-top" style="display:none"><button class="btn">Back to shelves</button></div>
		</div>
    </div>
</div>

