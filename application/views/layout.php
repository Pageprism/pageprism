<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <base href="<?php echo base_url()?>">
    <title>PageShare</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <?php $this->load->helper('asset'); ?>

    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,700&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
    <link href="<?php echo base_url();?>assets/css/bootstrap.min.css" rel="stylesheet" media="screen" />
    <link href="<?php echo base_url();?>assets/css/perfect-scrollbar.css" rel="stylesheet" media="screen" />
    <?= load_stylesheet('esamizdat'); ?>
    <link rel="shortcut icon" href="<?php echo base_url();?>assets/img/esamizdat.ico" />
    <link href='<?= base_url(); ?>' rel='top'>
    <?php if (isset($cover_image)): ?>
    <meta property="og:image" content="<?= base_url(), $cover_image; ?>" />
    <?php endif; ?>


  </head>
  <body>
    <!-- Top Header -->
    <div class="navbar-fake"></div>
    <div class="navbar navbar-inverse">
      <div class="navbar-inner" id="top-header">
        <div class="container-fluid">
          <a id="mainlogo" class="brand oo-ui-iconElement" href="<?= $this->Shelf_model->getFrontPageLink(isset($shelf_id) ? $shelf_id : false); ?>">
            <span class="text">PageShare</span>
            <span class="arrows"><span class="oo-ui-iconElement-icon oo-ui-icon-caretDown openArrow"></span><span class="oo-ui-iconElement-icon oo-ui-icon-caretUp closeArrow"></span></span>
          </a>
          <a href="#" id="sidebar-toggle">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </a>
        </div>
      </div>
      <div id="book_info">

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
      <div id="ajax-content-container">
        <div id="ajax-content"></div>
      </div>
    </div>
    <script>
    if (window.localStorage.menuOpen != "false") {
      document.body.className = "open-sidebar";
    }
    </script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script> 
    <script src="//code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.min.js"></script>
    <script src="<?= base_url();?>assets/js/perfect-scrollbar.jquery.min.js"></script>
    <script src="<?= base_url();?>assets/audiojs/audio.min.js"></script>
    <script src="<?= base_url();?>assets/js/jquery.lazyload.min.js"></script>
    <?= load_script('audio'); ?>
    <?= load_script('bookInfo'); ?>
    <?= load_script('shelf'); ?>
    <?= load_script('navi'); ?>
    <?= load_script('attributeEditor'); ?>
    <?php if (isset($current_book)):  ?>
    <script>
    $(document).ready(function() {
      openBook(<?= $current_book->id ?>, <?= $current_page ?>, function() { scrollToPage(<?= $current_page ?>); });
    });
    </script>
    <?php endif; ?>
    <div id="fb-root"></div>
    <script type="text/javascript">
    $(document).ready(function() { setTimeout(function() {
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
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      ga('create', 'UA-41565206-1', 'auto');
      ga('send', 'pageview');
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount', 'UA-41565206-1']);
      _gaq.push(['_trackPageview']);
      (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
    }, 2500); });
    </script>
  </body>
</html>
