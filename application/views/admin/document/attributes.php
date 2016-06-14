<?php

$attributes = (array)$book->attributes->{$type} ?? new StdClass;

if (isset($default_attributes)) {
  foreach($default_attributes as $attr_name) {
    if (empty($attributes[$attr_name])) {
      $attributes[$attr_name] = [];
    }
  }
}

//A dummy attribute for the editor to use. It does not get saved since it's contents are completely empty
$attributes[''] = [];

$i = 0;
?>
<div class="attributeEditor<?php if (empty($allow_multiple_values)): ?> no-multiple-values<?php endif; ?>" data-type="<?= $type ?>">
<?php foreach($attributes as $name => $values): 
if (empty($values)) {
  $values[] = (object)['value' => '', 'subtitle' => ''];
}
?>
  <div class="attribute<?php if ($name === ''): ?> dummy<?php endif; ?>">
    <input class="title" type="text" name="attributes[<?= $type ?>][<?= $i ?>][name]" value="<?= htmlspecialchars($name) ?>" />
    <div class="values">
      <?php foreach($values as $v => $value): ?>
      <div class="value">
        <input class="subtitle" type="hidden" name="attributes[<?= $type ?>][<?= $i ?>][values][<?= $v ?>][subtitle]" value="<?= htmlspecialchars($value->subtitle) ?>" />
        <input class="value" type="text" name="attributes[<?= $type ?>][<?= $i ?>][values][<?= $v ?>][value]" value="<?= htmlspecialchars($value->value) ?>" />
        <button class="remove">X</button>
      </div>
      <?php endforeach; ?>
      <button class="add">+ Add <span><?= htmlspecialchars(strtolower($name)) ?></span></button>
    </div>
  </div>
  <?php $i++; endforeach; ?>
  <!--
  <div class="add_attribute">
    <button class="add">Add <?= $type ?></button>
  </div>
  -->
</div>