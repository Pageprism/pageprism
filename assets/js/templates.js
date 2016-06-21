this["Pageshare"] = this["Pageshare"] || {};
this["Pageshare"]["Templates"] = this["Pageshare"]["Templates"] || {};

this["Pageshare"]["Templates"]["assets/handlebars/book_info.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<a href=\"/shelf/"
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "</a>"
    + ((stack1 = helpers.unless.call(depth0 != null ? depth0 : {},(data && data.last),{"name":"unless","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n";
},"2":function(container,depth0,helpers,partials,data) {
    return ",";
},"4":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1;

  return "<h2>"
    + container.escapeExpression(container.lambda(blockParams[0][1], depth0))
    + ":</h2>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},depth0,{"name":"each","hash":{},"fn":container.program(5, data, 0, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<a href=\"/search/"
    + alias2(alias1(blockParams[1][1], depth0))
    + "/"
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "</a>"
    + ((stack1 = helpers.unless.call(depth0 != null ? depth0 : {},(data && data.last),{"name":"unless","hash":{},"fn":container.program(2, data, 0, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"editBook oo-ui-iconElement\">\n  <a class=\"popUnder\" href=\"/admin/document/modify/"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.book : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">\n    <span class=\"oo-ui-iconElement-icon oo-ui-icon-edit\"></span> Edit\n  </a>\n</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<h2>Collections:</h2>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.collections : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + ((stack1 = helpers.each.call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.book : depth0)) != null ? stack1.attributes : stack1)) != null ? stack1.attribute : stack1),{"name":"each","hash":{},"fn":container.program(4, data, 2, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.editable : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "");
},"useData":true,"useBlockParams":true});

this["Pageshare"]["Templates"]["assets/handlebars/book_pages.handlebars"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {};

  return "<div class=\"single-page\" id=\"page_"
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.nr : stack1), depth0))
    + "\" data-page-number=\""
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.nr : stack1), depth0))
    + "\">\n  <div class=\"page-share\">\n    <span class=\"pagenumber\">"
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.nr : stack1), depth0))
    + "</span>\n    <div class=\"share-part\">\n      <div share-part-separator>\n        <h5 class=\"url\">Page URL: </h5>\n        <a href=\""
    + alias2(alias1((depths[1] != null ? depths[1].base_url : depths[1]), depth0))
    + alias2(alias1(((stack1 = (depths[1] != null ? depths[1].book : depths[1])) != null ? stack1.book_name_clean : stack1), depth0))
    + "/p"
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.nr : stack1), depth0))
    + "\" class=\"direct-url\">"
    + alias2(alias1((depths[1] != null ? depths[1].base_url : depths[1]), depth0))
    + alias2(alias1(((stack1 = (depths[1] != null ? depths[1].book : depths[1])) != null ? stack1.book_name_clean : stack1), depth0))
    + "/p"
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.nr : stack1), depth0))
    + "</a>\n      </div>\n"
    + ((stack1 = helpers["with"].call(alias3,(depths[1] != null ? depths[1].book : depths[1]),{"name":"with","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias3,((stack1 = blockParams[0][0]) != null ? stack1.audio : stack1),{"name":"if","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "      <div share-part-separator>\n"
    + ((stack1 = helpers.each.call(alias3,((stack1 = ((stack1 = (depths[1] != null ? depths[1].book : depths[1])) != null ? stack1.attributes : stack1)) != null ? stack1.url : stack1),{"name":"each","hash":{},"fn":container.program(12, data, 2, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "      </div>\n    </div>\n  </div>\n"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = blockParams[0][0]) != null ? stack1.url : stack1),{"name":"if","hash":{},"fn":container.program(16, data, 0, blockParams, depths),"inverse":container.program(18, data, 0, blockParams, depths),"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "</div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "      <div share-part-separator>\n        <h5>Mobile File: </h5>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.file_url_pdf : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.file_url_epub : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.file_url_music : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "      </div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <a href=\""
    + alias4(((helper = (helper = helpers.file_url_pdf || (depth0 != null ? depth0.file_url_pdf : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"file_url_pdf","hash":{},"data":data}) : helper)))
    + "\" class=\"download-pdf \" onclick=\"_gaq.push([\\'_trackEvent\\', \\'eSamiszat-Shelf\\', \\'"
    + alias4(((helper = (helper = helpers.book_name || (depth0 != null ? depth0.book_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"book_name","hash":{},"data":data}) : helper)))
    + "\\', \\'download pdf\\);\"><i class=\"icon-book\"></i> PDF</a>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <a href=\""
    + alias4(((helper = (helper = helpers.file_url_epub || (depth0 != null ? depth0.file_url_epub : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"file_url_epub","hash":{},"data":data}) : helper)))
    + "\" class=\"download-epub \" onclick=\"_gaq.push([\\'_trackEvent\\', \\'eSamiszat-Shelf\\', \\'"
    + alias4(((helper = (helper = helpers.book_name || (depth0 != null ? depth0.book_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"book_name","hash":{},"data":data}) : helper)))
    + "\\', \\'download epub\\);\"><i class=\"icon-book\"></i> ePub</a>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "        <a href=\""
    + alias4(((helper = (helper = helpers.file_url_music || (depth0 != null ? depth0.file_url_music : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"file_url_music","hash":{},"data":data}) : helper)))
    + "\" class=\"download-music \" onclick=\"_gaq.push([\\'_trackEvent\\', \\'eSamiszat-Shelf\\', \\'"
    + alias4(((helper = (helper = helpers.book_name || (depth0 != null ? depth0.book_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"book_name","hash":{},"data":data}) : helper)))
    + "\\', \\'download music\\);\"><i class=\"icon-play-sign\"></i> MP3</a>\n";
},"9":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "      <div share-part-separator class=\"audiotrack\">\n        <h5>\n          "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = ((stack1 = blockParams[1][0]) != null ? stack1.audio : stack1)) != null ? stack1.track : stack1),{"name":"if","hash":{},"fn":container.program(10, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + alias2(alias1(((stack1 = ((stack1 = blockParams[1][0]) != null ? stack1.audio : stack1)) != null ? stack1.title : stack1), depth0))
    + "\n        </h5>\n        <a href=\""
    + alias2(alias1(((stack1 = ((stack1 = blockParams[1][0]) != null ? stack1.audio : stack1)) != null ? stack1.url : stack1), depth0))
    + "\" class=\"download-music\" onclick=\"_gaq.push([\\'_trackEvent\\', \\'eSamiszat-Shelf\\', \\'"
    + alias2(alias1(((stack1 = (depths[1] != null ? depths[1].book : depths[1])) != null ? stack1.book_name : stack1), depth0))
    + "\\', \\'download music\\);\"><i class=\"icon-music\"></i> MP3</a>\n        <audio preload=\"metadata\" src=\""
    + alias2(alias1(((stack1 = ((stack1 = blockParams[1][0]) != null ? stack1.audio : stack1)) != null ? stack1.url : stack1), depth0))
    + "\" />\n      </div>\n";
},"10":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = ((stack1 = blockParams[2][0]) != null ? stack1.audio : stack1)) != null ? stack1.track : stack1), depth0))
    + ". ";
},"12":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "          <h5>"
    + container.escapeExpression(container.lambda(blockParams[0][1], depth0))
    + ": </h5>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},depth0,{"name":"each","hash":{},"fn":container.program(13, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "");
},"13":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4=container.lambda;

  return "          <a href=\""
    + alias3(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" target=\"_blank\" \n            onclick=\"_gaq.push([\\'_trackEvent\\', \\'eSamiszat-Shelf\\', \\'"
    + alias3(alias4(((stack1 = (depths[2] != null ? depths[2].book : depths[2])) != null ? stack1.book_name : stack1), depth0))
    + "\\', \\'"
    + alias3(alias4(blockParams[1][1], depth0))
    + "\\);\">\n            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.subtitle : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "\n            "
    + alias3((helpers.shorten || (depth0 && depth0.shorten) || alias2).call(alias1,(depth0 != null ? depth0.value : depth0),{"name":"shorten","hash":{},"data":data,"blockParams":blockParams}))
    + "\n          </a>\n";
},"14":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.subtitle || (depth0 != null ? depth0.subtitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"subtitle","hash":{},"data":data}) : helper)))
    + ": ";
},"16":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "  <img data-original=\""
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? stack1.url : stack1), depth0))
    + "\" width=\""
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? stack1.width : stack1), depth0))
    + "\" height=\""
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? stack1.height : stack1), depth0))
    + "\" />\n";
},"18":function(container,depth0,helpers,partials,data) {
    return "  <div class=\"empty-page\">\n    <img data-original=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\" style=\"display: none;\" />\n  </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.pages : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "\n";
},"useData":true,"useDepths":true,"useBlockParams":true});