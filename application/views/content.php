<?php 
namespace pageshare;

//Adds ellipsis to too long urls, namespaced to prevent conflicts
if (!function_exists('pageshare\shorten')) {
  function shorten($str, $limit = 40) {
    if (strlen($str) <= $limit) return $str;

    return substr($str,0,$limit).'...';
  }
}

if (empty($page->page_n)) $page->page_n = 1;

?>
<div class="single-page" id="page_<?= $page->page_n; ?>" data-page-number="<?= $page->page_n; ?>">
  <div class="page-share">
    <span class="pagenumber"><?= $page->page_n ?></span>
    <div class="share-part">
      <div share-part-separator>
        <h5 class="url">Page URL: </h5>
        <a href="<?= base_url() ?><?= $page->book_name_clean ?>/p<?= $page->page_n ?>" class="direct-url"><?= base_url() ?><?= $page->book_name_clean ?>/p<?= $page->page_n ?></a>
      </div>
      <div share-part-separator>
        <h5>Mobile File: </h5>
        <?php if (!empty($page->file_url_pdf)): ?>
        <a href="<?= $page->file_url_pdf ?>" class="download-pdf " onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= $page->book_name ?>\', \'download pdf\);"><i class="icon-book"></i> PDF</a>
        <?php endif; ?>
        <?php if (!empty($page->file_url_epub)): ?>
        <a href="<?= $page->file_url_epub ?>" class="download-epub " onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= $page->book_name ?>\', \'download epub\);"><i class="icon-book"></i> ePub</a>
        <?php endif; ?>
        <?php if (!empty($page->file_url_music)): ?>
        <a href="<?= $page->file_url_music ?>" class="download-music " onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= $page->book_name ?>\', \'download music\);"><i class="icon-play-sign"></i> MP3</a>
        <?php endif; ?>
      </div>
      <?php foreach($page->audio_tracks as $audio_file): ?>
      <div share-part-separator class="audiotrack">
        <h5>
          <?php if ($audio_file->track_number) echo $audio_file->track_number, '.' ?> <?= $audio_file->title ?>
        </h5>
        <a href="<?= $audio_file->audio_file_url ?>" class="download-music" onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= $page->book_name ?>\', \'download music\);"><i class="icon-music"></i> MP3</a>
        <audio preload="metadata" src="<?= $audio_file->audio_file_url ?>" />
        </div>
        <?php endforeach; ?>
        <div share-part-separator>

          <?php if (!empty($page->follow_author_url)): ?>
          <h5>Meme: </h5>
          <a href="<?= $page->follow_author_url ?>" target="_blank" 
            onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= $page->book_name ?>\', \'Meme\);">
            <?= shorten($page->follow_author_url) ?>
          </a>
          <?php endif; ?>

          <?php if (!empty($page->memory_piece_url)): ?>
          <h5>Print: </h5>
          <a href="<?= $page->memory_piece_url ?>" target="_blank" 
            onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= $page->book_name ?>\', \'Print\);">
            <?= shorten($page->memory_piece_url) ?>
          </a>
          <?php endif; ?>

          <?php if (!empty($page->misc_file_url)): ?>
          <h5>Designs: </h5>
          <a href="<?= $page->misc_file_url ?>" target="_blank" 
            onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= $page->book_name ?>\', \'Layouts/Licences\);">
            <?= shorten($page->misc_file_url) ?>
          </a>
          <?php endif; ?>
        </div>
      </div>
    </div>
    <?php if(isset($page->page_image_url)): ?>
    <img src="<?= $page->page_image_url ?>" />
    <?php else: ?>
    <div class="empty-page"></div>
    <?php endif; ?>
</div>
