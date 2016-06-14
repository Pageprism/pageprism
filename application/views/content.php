<?php 
$this->load->helper('shorten');

if (empty($page->page_n)) $page->page_n = 1;

?>
<div class="single-page" id="page_<?= $page->page_n; ?>" data-page-number="<?= $page->page_n; ?>">
  <div class="page-share">
    <span class="pagenumber"><?= $page->page_n ?></span>
    <div class="share-part">
      <div share-part-separator>
        <h5 class="url">Page URL: </h5>
        <a href="<?= base_url() ?><?= $book->book_name_clean ?>/p<?= $page->page_n ?>" class="direct-url"><?= base_url() ?><?= $book->book_name_clean ?>/p<?= $page->page_n ?></a>
      </div>
      <div share-part-separator>
        <h5>Mobile File: </h5>
        <?php if (!empty($book->file_url_pdf)): ?>
        <a href="<?= $book->file_url_pdf ?>" class="download-pdf " onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= $book->book_name ?>\', \'download pdf\);"><i class="icon-book"></i> PDF</a>
        <?php endif; ?>
        <?php if (!empty($book->file_url_epub)): ?>
        <a href="<?= $book->file_url_epub ?>" class="download-epub " onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= $book->book_name ?>\', \'download epub\);"><i class="icon-book"></i> ePub</a>
        <?php endif; ?>
        <?php if (!empty($book->file_url_music)): ?>
        <a href="<?= $book->file_url_music ?>" class="download-music " onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= $book->book_name ?>\', \'download music\);"><i class="icon-play-sign"></i> MP3</a>
        <?php endif; ?>
      </div>
      <?php foreach($page->audio_tracks as $audio_file): ?>
      <div share-part-separator class="audiotrack">
        <h5>
          <?php if ($audio_file->track_number) echo $audio_file->track_number, '.' ?> <?= $audio_file->title ?>
        </h5>
        <a href="<?= $audio_file->audio_file_url ?>" class="download-music" onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= $book->book_name ?>\', \'download music\);"><i class="icon-music"></i> MP3</a>
        <audio preload="metadata" src="<?= $audio_file->audio_file_url ?>" />
        </div>
        <?php endforeach; ?>
        <div share-part-separator>
          <?php foreach($book->attributes->url as $attribute_name => $attribute_values): ?>
          <h5><?= $attribute_name ?>: </h5>
          <?php foreach($attribute_values as $attribute_value): ?>
          <a href="<?= htmlspecialchars($attribute_value->value) ?>" target="_blank" 
            onclick="_gaq.push([\'_trackEvent\', \'eSamiszat-Shelf\', \'<?= htmlspecialchars($book->book_name) ?>\', \'<?= $attribute_name ?>\);">
            <?php if ($attribute_value->subtitle): ?>
            <?= htmlspecialchars($attribute_value->subtitle); ?>: 
            <?php endif; ?>
            <?= htmlspecialchars(shorten($attribute_value->value)) ?>
          </a>
          <?php endforeach; ?>
          <?php endforeach; ?>
        </div>
      </div>
    </div>
    <?php if(isset($page->page_image_url)): ?>
    <img src="<?= $page->page_image_url ?>" />
    <?php else: ?>
    <div class="empty-page"></div>
    <?php endif; ?>
</div>
