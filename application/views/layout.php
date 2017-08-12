<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <base href="<?php echo base_url() ?>">
    <title>PageShare</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <?php $this->load->helper('asset'); ?>
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,700&subset=latin,latin-ext' rel='stylesheet'
          type='text/css'>
    <!--ESSENTIAL SCRIPTS HERE -->
    <?= load_ux_js('awr-ux.vendor'); ?>
    <?= load_ux_js('awr-ux.min'); ?>
    <!-- the following awr-ux files are actually build by the current's project's grunt!-->
    <?= load_script('awr-ux-app.vendor.min'); ?>
    <?= load_script('awr-ux-app.templates'); ?>


    <!--UX STYLES-->
    <?= load_ux_css('awr-ux.vendor'); ?>
    <?= load_ux_css('awr-ux.min'); ?>
    <!--APP STYLES-->
    <?= load_stylesheet('awr-ux-app.vendor'); ?>
    <?= load_stylesheet('pageshare-v1.min'); ?>
    <link rel="shortcut icon" href="<?php echo base_url(); ?>assets/img/esamizdat.ico"/>
    <link href='<?= base_url(); ?>' rel='top'>
    <?php if (isset($cover_image)): ?>
        <meta property="og:image" content="<?= base_url(), $cover_image; ?>"/>
    <?php endif; ?>

    <script type="application/javascript">
        awr = window.awr || {};
        pageshare = window.pageshare || {};
        /**
         * The variables set by server should be set here, and server
         * side logic should not intervene the client side logic
         * more than this. No stupid server side rendered views and
         * front-end functionalities anymore, please!!
         * We use the serverVariables also only for the sake of
         * computability with the legacy logic which is still around in many areas.
         * Otherwise even this wouldn't be necessary.
         */
        pageshare.serverVariables = {};
        /**
         * The awr-ux app templates should be registered under awr.app.templates,
         * Pageshare.Templates should be pointed to awr.app.templates to preventing
         * the legacy template calls from breaking.
         */
        var pageshare = window.pageshare || {};

        /**
         * the legacy mainMenuModel is still needed and in use.
         * The rendering job however, is moved to JavaScript.
         * The JavaScript module responsible fot this
         * can be found under front/modules/mainMenu.
         */
        <?php $mModel = $this->Menu_model->getMenu(); ?>
        pageshare.serverVariables.legacyMainMenuModel = <?php echo json_encode($mModel) ?>;
    </script>
</head>
<body id="freemium">
<!--  <h1></h1>-->
<!-- Top Header -->
<input type="hidden" id="frontPageLink" name="frontPageLink"
       value="<?= $this->Shelf_model->getFrontPageLink(isset($shelf_id) ? $shelf_id : false); ?>"/>

<div id="mainHeaderContainer">
</div>
<!-- Main menu -->
<div id="mainMenu">

</div>

<div id="contents">
    <div id="ajax-content-container">
        <div id="ajax-content"></div>
    </div>
</div>
<div id="loading">
    <h4 class=""><span class="fa fa-clock-o"></span>&nbsp;Loading...</h4>
</div>

<script type="application/javascript">
    /**
     * The awr-ux app templates should be registered under awr.app.templates,
     * Pageshare.Templates should be pointed to awr.app.templates to preventing
     * the legacy template calls from breaking.
     */
    Pageshare = window.Pageshare || {};
    if (awr.app) {
        Pageshare.Templates = awr.app.templates;
    }
</script>

<!-- app main-->
<?= load_script('pageshare-v1.min'); ?>

</body>
</html>

