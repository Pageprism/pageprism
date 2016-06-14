$(function() {

  function modifyInputIndex(input, index, value) {
    //The names are like this "attributes[attribute][0][values][0][value]"
    var nameParts = input.attr('name').split('][');
    nameParts[index] = value;
    input.attr('name', nameParts.join(']['));
  }
  function renumberAttributes(container) {
    container.find('div.attribute').each(function(i) {
      $(this).find('input').each(function() {
        modifyInputIndex($(this), 1, i);
      });
    });
  }
  function countValues(container) {
    return container.find('div.value').length;
  }
  
  $(document).on('click', '.attributeEditor .values .add', function(e) {
    e.preventDefault(); 
    var container = $(this).parents('.values');
    var clone = container.find('div.value:eq(0)').clone();
    var valueCount = countValues($(this).parents('.values'));

    clone.find('input').val("").each(function() {
      modifyInputIndex($(this), 3, valueCount); 
    });
    container.find('.add').before(clone);
    clone.find('.value').focus();
  });
  $(document).on('click', '.attributeEditor .add_attribute .add', function(e) {
    e.preventDefault(); 

    var container = $(this).parents('.attributeEditor');
    var clone = container.find('div.attribute.dummy').clone().removeClass('dummy');
    container.find('.add_attribute').before(clone);
    renumberAttributes(container);
    clone.find('.title').focus();
  });
  $(document).on('click', '.attributeEditor .remove', function(e) {
    e.preventDefault(); 
    console.log(this);
    
    var valueCount = countValues($(this).parents('.values'));
    if (valueCount > 1) {
      $(this).parents('.value').remove();
    } else {
      $(this).parents('.attribute').remove();
    }
  });

});
