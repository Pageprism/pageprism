
</div>
<!-- Footer -->
    <div class="footer">
        <a href="#" id="footer-to-top">PageShare</a>
            <ul class="nav">
                <?php
                $query = $this->db->query("SELECT id,title,url_title FROM pages");
                    if ($query->num_rows() > 0)
                    {
                        foreach ($query->result_array() as $pages_bottom)
                        {?>
                            <li><a href="/page/<?=$pages_bottom['url_title']?>"><?=$pages_bottom['title']?></a></li>
                        <?php
                        }
                    }
                ?>
            </ul>
    </div>

    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script> 
    <script src="<?= base_url();?>assets/js/perfect-scrollbar.jquery.min.js"></script>
    <script src="<?= base_url();?>assets/js/jquery.touchSwipe.min.js"></script>
    <script src="<?= base_url();?>assets/audiojs/audio.min.js"></script>
    <script src="<?= base_url();?>assets/js/audio.js?v=0"></script>
    <script src="<?= base_url();?>assets/js/shelf.js?v=6"></script>
    <script src="<?= base_url();?>assets/js/navi.js?v=2"></script>
   	<script src="<?= base_url();?>assets/js/waypoints.min.js"></script>
   	<script src="<?= base_url();?>assets/js/waypoints-sticky.min.js"></script>    
    <?php if (isset($book_id) && isset($totalpages) && isset($page)):  ?>
    <script>
      $(document).ready(function() {
        openBook(<?= $book_id ?>, <?= $totalpages ?>, <?= $page ?>);
      });
    </script>
    <?php endif; ?>
  </body>
</html>
