<ul>
  <?php foreach($menu as $menuitem): ?>
  <li <?php 
  if(!empty($menuitem['classes'])): ?> class="<?= $menuitem['classes']; ?>"
  <?php endif; if(!empty($menuitem['id'])): ?> id="<?= $menuitem['id']; ?>" 
  <?php endif; ?> >
    <?php if (empty($menuitem['html'])): ?>
    <a href='<?= $menuitem['url'] ?>'>
      <?= $menuitem['title'] ?>
      <?php if (!empty($menuitem['children'])): ?>
      <svg class="arrow" viewBox="0 0 64 64"><use xlink:href="#arrow-right"></svg>
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
