<ul>
  <?php foreach($menu as $menuitem): ?>
  <li <?php 
  if(!empty($menuitem['classes'])): ?> class="<?= $menuitem['classes']; ?>"
  <?php endif; if(!empty($menuitem['id'])): ?> id="<?= $menuitem['id']; ?>" 
  <?php endif; ?> >
    <?php if (empty($menuitem['html'])): ?>
    <a href='<?= $menuitem['url'] ?>'
      <?php if (isset($menuitem['popUnder'])) echo 'class="popUnder"'; ?>
      >
      <?= $menuitem['title'] ?>
      <?php if (!empty($menuitem['children'])): ?>
      <svg class="arrow" viewBox="0 0 64 64">
        <path id="arrow-right" d="M19.203 17.28l-0.003 29.44 25.6-14.72z" />
      </svg>
      <?php endif; ?>
    </a>
    <?php else: ?>
    <?= $menuitem['html'] ?>
    <?php endif; ?>
    <?php if (isset($menuitem['children'])): ?>
    <?php $this->load->view('menu', array('menu' => $menuitem['children'])); ?> 
    <?php endif; ?>
  </li>
  <?php endforeach; ?>
</ul>
