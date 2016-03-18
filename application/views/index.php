<!-- Container -->
<div class="container-fluid" id="the-container">
    <div class="shelfs-and-covers">
        <!-- Books and other items -->
        <div class="list-cover<?= ($shelf_editable) ? ' editable' : '' ?>" id="covers" data-shelf-id="<?= $shelf_id ?>"> 
          <?php foreach ($shelf as $book): ?>
          <div
            class="single-cover thumbnail<?php if (isset($current_book) && $current_book->id == $book->id) echo ' selected'; ?>" 
            data-book-pages="<?= $book->pages ?: '0' ?>"
            data-book-name="<?= $book->book_name ?>"
            data-book-id="<?=$book->id?>" title="<?=$book->book_name ?>">

            <!-- The "Cover" -->
            <?php if (isset($book->file_url_cover)) {?>
            <img src="<?=$book->file_url_cover?>" alt="" />
            <?php } else {?>
            <div class="caption">
              <h3 class="title"><?=$book->book_name?></h3>
              <span class="author"><?=$book->book_author?></span>
              <span class="timestamp"><?=$book->book_timestamp?></span>
            </div>
            <?php } ?>
          </div>
          <?php endforeach; ?>
          <?php if ($shelf_editable): ?>
          <a href="/admin/document/upload?shelf=<?= $shelf_id; ?>"><div class="single-cover add-book thumbnail"><span>+</span></div></a>
          <?php endif; ?>
        </div>  
    </div>
    <hr class="book-content-separator" style="display:none" />
  
    <!-- The page(s) of single publication -->
    <div id="rendered-pages">
    </div><!-- /rendered-pages -->
</div>
