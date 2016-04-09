<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <base href="<?php echo base_url()?>">
    <title>PageShare</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Bootstrap -->
    <link href='https://fonts.googleapis.com/css?family=Open+Sans&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
    <link href="<?php echo base_url();?>assets/css/bootstrap.min.css" rel="stylesheet" media="screen" />
    <link href="<?php echo base_url();?>assets/css/perfect-scrollbar.css" rel="stylesheet" media="screen" />
    <link href="<?php echo base_url();?>assets/css/font-awesome.min.css" rel="stylesheet">
    <link href="<?php echo base_url();?>assets/css/esamizdat.css?v=7" rel="stylesheet" media="screen" />
    <link rel="shortcut icon" href="<?php echo base_url();?>assets/img/esamizdat.ico" />
    <?php if (isset($cover_image)): ?>
    <meta property="og:image" content="<?= base_url(), $cover_image; ?>" />
    <?php endif; ?>

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
    <!-- Top Header -->
    <div class="navbar-fake"></div>
    <div class="navbar navbar-inverse">
      <div class="navbar-inner" id="top-header">
        <div class="container-fluid">
          <a id="mainlogo" class="brand" href="<?= $this->Shelf_model->getFrontPageLink(isset($shelf_id) ? $shelf_id : false); ?>">PageShare</a>
          <a href="#" id="sidebar-toggle">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </a>
        </div>
      </div>
    </div>
    <!-- Main menu -->
    <div id="mainmenu">
      <?php $this->load->view('menu', array('menu' => $this->Menu_model->getMenu())); ?>
    </div>
    <div id="contents">
      <?php if ($this->session->flashdata('msg')): ?>
      <div id="message_holder">
        <div id="message">
          <span class="close">x</span>
          <?= $this->session->flashdata('msg'); ?>
        </div>
      </div>
      <?php endif; ?>
      <?php $load_inner_view(); ?>
      </div id="ajax"></div>
    </div>
    <script>
    if (window.localStorage.menuOpen != "false") {
      document.body.className = "open-sidebar";
    }
    </script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script> 

    <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
    <script src="<?= base_url();?>assets/js/perfect-scrollbar.jquery.min.js"></script>
    <script src="<?= base_url();?>assets/audiojs/audio.min.js"></script>
    <script src="<?= base_url();?>assets/js/audio.js?v=0"></script>
    <script src="<?= base_url();?>assets/js/shelf.js?v=7"></script>
    <script src="<?= base_url();?>assets/js/navi.js?v=3"></script>
    <?php if (isset($current_book)):  ?>
    <script>
    $(document).ready(function() {
      openBook(<?= $current_book->id ?>, <?= $current_book->pages ?: 1 ?>, <?= $current_page ?>, function() { scrollToPage(<?= $current_page ?>); });
    });
    </script>
    <?php endif; ?>
    <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', 'UA-41565206-1', 'auto');
    ga('send', 'pageview');
    </script>
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
  </body>
</html>
