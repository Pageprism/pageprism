<?php 
namespace pageshare;

//Adds ellipsis to too long urls, namespaced to prevent conflicts
function shorten($str, $limit = 40) {
  if (strlen($str) <= $limit) return $str;

  return substr($str,0,$limit).'...';
}

if (empty($row->page_n)) $row->page_n = 1;

?>
<div class="row-fluid single-page" <?php
  switch($type): 
  case 'page': ?>
  id="page_<?= $row->page_n; ?>"
  <?php break; ?>
  <?php case 'epub': ?>
  class="download"
  <?php break; ?>
  <?php case 'audio': ?>
  class="player"
  <?php endswitch; ?>
  >
  <div class="span12">
    <div class="rendered-page">
      <div class="page-share">
        <span class="pagenumber"><?= $row->page_n ?></span>
        <div class="share-part">
          <div share-part-separator>
            <h5 class="url">Page URL: </h5>
            <?php switch($type): 
             case 'page': ?>
            <p class="direct-url"><?= base_url() ?>book/<?= $row->book_name_clean ?>/p<?= $row->page_n ?></p>
            <?php break; ?>
            <?php case 'epub': ?>
            <p class="direct-url"><?= base_url() ?>epub/<?= $row->book_name_clean ?></p>
            <?php break; ?>
            <?php case 'audio': ?>
            <p class="direct-url"><?= base_url() ?>music/<?= $row->book_name_clean ?></p>
            <?php endswitch; ?>
          </div>
          <div share-part-separator>
            <h5>Mobile File: </h5>
            <?php if (!empty($row->file_url_pdf)): ?>
            <a href="<?= $row->file_url_pdf ?>" class="download-pdf table-view-only" onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= $row->book_name ?>\', \'download pdf\);"><i class="icon-book"></i> PDF</a>
            <?php endif; ?>
            <?php if (!empty($row->file_url_epub)): ?>
            <a href="<?= $row->file_url_epub ?>" class="download-epub table-view-only" onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= $row->book_name ?>\', \'download epub\);"><i class="icon-book"></i> ePub</a>
            <?php endif; ?>
            <?php if (!empty($row->file_url_music)): ?>
            <a href="<?= $row->file_url_music ?>" class="download-music table-view-only" onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= $row->book_name ?>\', \'download music\);"><i class="icon-play-sign"></i> MP3</a>
            <?php endif; ?>
          </div>
          <div share-part-separator>

            <?php if (!empty($row->follow_author_url)): ?>
            <h5>Meme: </h5>
            <a href="<?= $row->follow_author_url ?>" target="_blank" 
              onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= $row->book_name ?>\', \'Meme\);">
              <?= shorten($row->follow_author_url) ?>
            </a>
            <?php endif; ?>

            <?php if (!empty($row->memory_piece_url)): ?>
            <h5>Print: </h5>
            <a href="<?= $row->memory_piece_url ?>" target="_blank" 
              onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= $row->book_name ?>\', \'Print\);">
              <?= shorten($row->memory_piece_url) ?>
            </a>
            <?php endif; ?>

            <?php if (!empty($row->misc_file_url)): ?>
            <h5>Layouts/Licences: </h5>
            <a href="<?= $row->misc_file_url ?>" target="_blank" 
              onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= $row->book_name ?>\', \'Layouts/Licences\);">
              <?= shorten($row->misc_file_url) ?>
            </a>
            <?php endif; ?>
          </div>
          <!--
          <div share-part-separator>
            <h5>Share this page: </h5>
            <a class="social share-fb" href="<?= base_url() ?>book/<?= $row->book_name_clean ?>/p<?= $row->page_n ?>" rel="<?= $row->book_name ?>" onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= $row->book_name ?>\', \'Share Facebook\);"><i class="icon-facebook-sign"></i></a>
            <a class="social share-google" href="https://plus.google.com/share?url=<?= base_url() ?>book/<?= $row->book_name_clean ?>/p<?= $row->page_n ?>" onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= $row->book_name ?>\', \'Share Google+\);"><i class="icon-google-plus-sign"></i></a>
            <a class="social share-twitter" href="https://twitter.com/share?url=<?= base_url() ?>book/<?= $row->book_name_clean ?>/p<?= $row->page_n ?>" target="_blank" onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= $row->book_name ?>\', \'Share Twitter\);"><i class="icon-twitter-sign"></i></a><br />
          </div> -->
        </div>
      </div>
      <?php switch($type): 
      case 'page': ?>
      <img class="rendered-page-single" src="<?= $row->page_image_url ?>" />
      <?php break; ?>
      <?php case 'epub': ?>
      <p class="single-epub">Click <a href="'.$downloaddata->file_url_epub.'">here</a> to download ePub</p>
      <?php break; ?>
      <?php case 'audio': ?>
      <audio preload="auto" src="<?= $row->file_url_music ?>" />
        <p class="single-lyrics"><?= nl2br($row->meta) ?></p>
      <?php endswitch; ?>
    </div>
  </div>
</div>
