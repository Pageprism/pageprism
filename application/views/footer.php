</div>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script> 

    <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
    <script src="<?= base_url();?>assets/js/perfect-scrollbar.jquery.min.js"></script>
    <script src="<?= base_url();?>assets/audiojs/audio.min.js"></script>
    <script src="<?= base_url();?>assets/js/audio.js?v=0"></script>
    <script src="<?= base_url();?>assets/js/shelf.js?v=6c"></script>
    <script src="<?= base_url();?>assets/js/navi.js?v=2"></script>
    <?php if (isset($current_book)):  ?>
    <script>
      $(document).ready(function() {
        openBook(<?= $current_book->id ?>, <?= $current_book->pages ?: 1 ?>, <?= $current_page ?>, function() { scrollToPage(<?= $current_page ?>); });
      });
    </script>
    <?php endif; ?>
  </body>
</html>
