this["awr"] = this["awr"] || {};
this["awr"]["core"] = this["awr"]["core"] || {};
this["awr"]["core"]["templates"] = this["awr"]["core"]["templates"] || {};
this["awr"]["core"]["templates"]["ux"] = this["awr"]["core"]["templates"]["ux"] || {};
this["awr"]["core"]["templates"]["ux"]["awrNotifBar"] = this["awr"]["core"]["templates"]["ux"]["awrNotifBar"] || {};
this["awr"]["core"]["templates"]["ux"]["awrNotifBar"]["awrNotifBar"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                <span class=\""
    + container.escapeExpression(((helper = (helper = helpers.iconStyle || (depth0 != null ? depth0.iconStyle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"iconStyle","hash":{},"data":data}) : helper)))
    + "\"></span>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                <button class=\"btn-success\" onclick=\"awr.ux.notifBar.act()\">"
    + container.escapeExpression(((helper = (helper = helpers.actionName || (depth0 != null ? depth0.actionName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"actionName","hash":{},"data":data}) : helper)))
    + "</button>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                <span class=\"link-element pull-right no-underline\" onclick=\"awr.ux.notifBar.moreInfo()\">&nbsp;"
    + container.escapeExpression(((helper = (helper = helpers.moreInfoText || (depth0 != null ? depth0.moreInfoText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"moreInfoText","hash":{},"data":data}) : helper)))
    + "</span>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"notif\" id=\"awrNotifBar\">\n    <div class=\"content\">\n        <p>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasIcon : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            &nbsp;\n             "
    + container.escapeExpression(((helper = (helper = helpers.ntfText || (depth0 != null ? depth0.ntfText : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"ntfText","hash":{},"data":data}) : helper)))
    + "\n            &nbsp;\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasAction : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasMoreInfo : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        </p>\n    </div>\n</div>";
},"useData":true});
this["awr"]["core"]["templates"]["ux"]["awrTag"] = this["awr"]["core"]["templates"]["ux"]["awrTag"] || {};
this["awr"]["core"]["templates"]["ux"]["awrTag"]["awrTag"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"awr-tag\">\n    <div class=\"tag-container\">\n        <input type=\"text\" placeholder=\""
    + container.escapeExpression(((helper = (helper = helpers.placeholder || (depth0 != null ? depth0.placeholder : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"placeholder","hash":{},"data":data}) : helper)))
    + "\"/>\n    </div>\n    <div class=\"result-container\">\n        <div class=\"results\">\n        </div>\n    </div>\n\n</div>\n</div>\n";
},"useData":true});
this["awr"]["core"]["templates"]["ux"]["basicModal"] = this["awr"]["core"]["templates"]["ux"]["basicModal"] || {};
this["awr"]["core"]["templates"]["ux"]["basicModal"]["basicModal"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                <div class=\"modal-footer\">\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.isInfo : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "\n                </div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                        <button type=\"button\" id=\"basicMdlAction\"\n                                onclick=\"awr.basicModal.action.call(awr.basicModal)\"\n                                class=\"btn "
    + alias4(((helper = (helper = helpers.actionClass || (depth0 != null ? depth0.actionClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"actionClass","hash":{},"data":data}) : helper)))
    + "\"\n                                style=\""
    + alias4(((helper = (helper = helpers.actionStyle || (depth0 != null ? depth0.actionStyle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"actionStyle","hash":{},"data":data}) : helper)))
    + "\">\n                            ok\n                        </button>\n";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.hideAction : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "\n\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                            <button type=\"button\" id=\"basicMdlCancel\"\n                                    class=\"btn btn-secondary\" data-dismiss=\"modal\" style=\""
    + alias4(((helper = (helper = helpers.cancelStyle || (depth0 != null ? depth0.cancelStyle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cancelStyle","hash":{},"data":data}) : helper)))
    + "\">\n                                "
    + alias4(((helper = (helper = helpers.cancelName || (depth0 != null ? depth0.cancelName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cancelName","hash":{},"data":data}) : helper)))
    + "</button>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                            <button type=\"button\" id=\"basicMdlAction\"\n                                    onclick=\"awr.basicModal.action.call(awr.basicModal)\"\n                                    class=\"btn "
    + alias4(((helper = (helper = helpers.actionClass || (depth0 != null ? depth0.actionClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"actionClass","hash":{},"data":data}) : helper)))
    + "\"\n                                    style=\""
    + alias4(((helper = (helper = helpers.actionStyle || (depth0 != null ? depth0.actionStyle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"actionStyle","hash":{},"data":data}) : helper)))
    + "\">\n                                "
    + alias4(((helper = (helper = helpers.actionName || (depth0 != null ? depth0.actionName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"actionName","hash":{},"data":data}) : helper)))
    + "</button>\n                            <button type=\"button\" id=\"basicMdlCancel\"\n                                    class=\"btn btn-secondary\" data-dismiss=\"modal\" style=\""
    + alias4(((helper = (helper = helpers.cancelStyle || (depth0 != null ? depth0.cancelStyle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cancelStyle","hash":{},"data":data}) : helper)))
    + "\">\n                                "
    + alias4(((helper = (helper = helpers.cancelName || (depth0 != null ? depth0.cancelName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cancelName","hash":{},"data":data}) : helper)))
    + "</button>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"modal fade\" id=\"basicModal\">\n    <div class=\"modal-dialog\" role=\"document\">\n        <div class=\"modal-content "
    + alias4(((helper = (helper = helpers.mainClass || (depth0 != null ? depth0.mainClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"mainClass","hash":{},"data":data}) : helper)))
    + "\">\n            <div class=\"modal-header\">\n                <h3 class=\"modal-title\">\n                    <span class=\""
    + alias4(((helper = (helper = helpers.titleIcon || (depth0 != null ? depth0.titleIcon : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"titleIcon","hash":{},"data":data}) : helper)))
    + "\"></span>\n                    "
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "\n                </h3>\n                <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\">\n                    <span aria-hidden=\"true\">&times;</span>\n                </button>\n            </div>\n            <div class=\"modal-body\">\n                "
    + alias4(((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"message","hash":{},"data":data}) : helper)))
    + "\n            </div>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasFooter : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n    </div>\n</div>";
},"useData":true});
this["awr"]["core"]["templates"]["ux"]["uiComps"] = this["awr"]["core"]["templates"]["ux"]["uiComps"] || {};
this["awr"]["core"]["templates"]["ux"]["uiComps"]["basicTable"] = this["awr"]["core"]["templates"]["ux"]["uiComps"]["basicTable"] || {};
this["awr"]["core"]["templates"]["ux"]["uiComps"]["basicTable"]["basicTable"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "            <tr class=\"coll-row-parent "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.$inEditMode : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n                <th scope=\"row\" class=\"data row-main-text\">\n                    <span awr-class-toggle=\".coll-row-parent:edit-mode\"\n                          class=\"awr-icon edit-element name icon-left awr-btn-group\">\n                        "
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n                    <input type=\"text\" id=\"input-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" value=\""
    + alias4(((helper = (helper = helpers.$inEditValue || (depth0 != null ? depth0.$inEditValue : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"$inEditValue","hash":{},"data":data}) : helper)))
    + "\"/>\n                    <div class=\"btn-group\">\n                        <button awr-value-reset=\"#input-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + ":["
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "]\"\n                                awr-class-remove=\".coll-row-parent:edit-mode\"\n                                class=\"awr-btn-group btn btn-default\">reset\n                        </button>\n                        <button class=\"btn btn-primary\"\n                                awr-click=\"saveEdit:"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + ",event\">save\n                        </button>\n                        <!--onclick=\"pageshare.editCollections.saveCollection(event,"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + ")\"-->\n                    </div>\n                    <div class=\"mobile-tools\">\n                        <div class=\"item-count loading\" id=\"item-count-mobile-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n                            <span class=\""
    + alias4(alias5((depths[1] != null ? depths[1].itemCountIcon : depths[1]), depth0))
    + " item-count-text\"></span><span\n                                class=\"fa fa-spinner fa-spin\">&nbsp;</span>\n                        </div>\n\n                        <span awr-click=\"removeItem:"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + ",event\"\n                              class=\"coll-remove fa fa-remove text-danger bold-element awr-clickable-text\">&nbsp;remove</span>\n                        <input class=\"main-toggle\" data-width=\"70px\" data-on=\"Main&nbsp;\"\n                               data-off=\"Main\" type=\"checkbox\" data-toggle=\"toggle\"\n                               data-coll-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n\n                    </div>\n                </th>\n                <td class=\"data text-center loading medium-extra\" id=\"item-count-"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"><span\n                        class=\""
    + alias4(alias5((depths[1] != null ? depths[1].itemCountIcon : depths[1]), depth0))
    + " item-count-text\"></span><span\n                        class=\"fa fa-spinner fa-spin\">&nbsp;</span></td>\n                <td class=\"data text-center screen-extra\"><span class=\"awr-icon date-element\">"
    + alias4(((helper = (helper = helpers.created || (depth0 != null ? depth0.created : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"created","hash":{},"data":data}) : helper)))
    + "</span></td>\n                <td class=\"buttons\">\n                    <input class=\"main-toggle\" data-width=\"94px\" data-on=\""
    + alias4(alias5((depths[1] != null ? depths[1].toggleOnLabel : depths[1]), depth0))
    + "\"\n                           data-off=\""
    + alias4(alias5((depths[1] != null ? depths[1].toggleOffLabel : depths[1]), depth0))
    + "\" type=\"checkbox\" data-toggle=\"toggle\"\n                           data-coll-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n                </td>\n                <!--<td class=\"data\"><span class=\"awr-icon add-element bold-element\">&nbsp;Add version</span></td>-->\n                <td class=\"data\"\n                    awr-click=\"removeItem:"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + ",event\">\n                    <span class=\"fa fa-remove text-danger bold-element awr-clickable-text\">&nbsp;remove</span>\n                </td>\n            </tr>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "edit-mode";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<!-- Container -->\n<div id=\""
    + alias4(((helper = (helper = helpers.tableId || (depth0 != null ? depth0.tableId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tableId","hash":{},"data":data}) : helper)))
    + "\" class=\"container awr-basic-table\">\n    <strong class=\"awr-icon back-link\" awr-link=\""
    + alias4(((helper = (helper = helpers.backLink || (depth0 != null ? depth0.backLink : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"backLink","hash":{},"data":data}) : helper)))
    + "\">&nbsp;"
    + alias4(((helper = (helper = helpers.backLinkName || (depth0 != null ? depth0.backLinkName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"backLinkName","hash":{},"data":data}) : helper)))
    + "</strong>\n    <div class=\"awr-head-row\">\n        <!--<h3>Edit Collections:</h3>-->\n        <h3>"
    + alias4(((helper = (helper = helpers.mainTableTitle || (depth0 != null ? depth0.mainTableTitle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"mainTableTitle","hash":{},"data":data}) : helper)))
    + "</h3>\n        <strong class=\"awr-icon add-element keep-right\"\n        awr-click=\"createItem:event\">&nbsp;\n            <!--Create new collection-->\n            "
    + alias4(((helper = (helper = helpers.createTitle || (depth0 != null ? depth0.createTitle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"createTitle","hash":{},"data":data}) : helper)))
    + "\n        </strong>\n        <!--onclick=\"pageshare.editCollections.createNew()\"-->\n    </div>\n    <table class=\"table table-inverse\">\n        <thead class=\"\">\n        <tr>\n            <!--<th class=\"awr-text-left row-main-text\">Collection name</th>-->\n            <th class=\"awr-text-left row-main-text\">"
    + alias4(((helper = (helper = helpers.itemName || (depth0 != null ? depth0.itemName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"itemName","hash":{},"data":data}) : helper)))
    + "</th>\n            <!--<th class=\"medium-extra\">Documents</th>-->\n            <th class=\"medium-extra\">"
    + alias4(((helper = (helper = helpers.itemCountTitle || (depth0 != null ? depth0.itemCountTitle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"itemCountTitle","hash":{},"data":data}) : helper)))
    + "</th>\n            <!--<th class=\"screen-extra\">Created</th>-->\n            <th class=\"screen-extra\">"
    + alias4(((helper = (helper = helpers.itemDateTitle || (depth0 != null ? depth0.itemDateTitle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"itemDateTitle","hash":{},"data":data}) : helper)))
    + "</th>\n            <!--<th class=\"awr-text-left\"><span class=\"fa fa-home\">&nbsp;Main Collection</span></th>-->\n            <th class=\"awr-text-left\"><span class=\"fa fa-home\">&nbsp;"
    + alias4(((helper = (helper = helpers.toggleTitle || (depth0 != null ? depth0.toggleTitle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"toggleTitle","hash":{},"data":data}) : helper)))
    + "</span></th>\n            <th></th>\n        </tr>\n        </thead>\n        <tbody>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.collection : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </tbody>\n    </table>\n\n</div>\n<!--onclick=\"pageshare.editCollections.removeCollection(event,"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + ")\"-->\n<!--awr-click=\"removeCollection:"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + ",some string\"-->\n<!--onclick=\"pageshare.editCollections.removeCollection(event,"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + ")\"-->";
},"useData":true,"useDepths":true});
this["awr"]["core"]["templates"]["ux"]["uiComps"]["demos"] = this["awr"]["core"]["templates"]["ux"]["uiComps"]["demos"] || {};
this["awr"]["core"]["templates"]["ux"]["uiComps"]["demos"]["table"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "active";
},"3":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "-->\n            <!--<tr onclick=\"awr.demo.app1.$select(event,'"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "')\">-->\n                <!--<th scope=\"row\">-->\n                    <!--<span class=\"fa fa-phone\"></span>-->\n                    <!--&nbsp;"
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "</th>-->\n                <!--<td>"
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "</td>-->\n                <!--<td>"
    + alias2(alias1((depth0 != null ? depth0.status : depth0), depth0))
    + "</td>-->\n                <!--<td><span class=\"fa fa-envelope\"></span>-->\n                    <!--&nbsp;"
    + alias2(alias1((depth0 != null ? depth0.chat : depth0), depth0))
    + "</td>-->\n                <!--<td>"
    + alias2(alias1((depth0 != null ? depth0.rating : depth0), depth0))
    + "</td>-->\n            <!--</tr>-->\n        <!--";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<!--<div class=\"demoApp1\">-->\n    <!--<div class=\"head\">-->\n        <!--<strong class=\"text-primary\">Find a developer for help:</strong>-->\n        <!--<div class=\"pull-right\">-->\n            <!--<form class=\"form-inline my-2 my-lg-0\">-->\n                <!--<input class=\"form-control mr-sm-2\" type=\"text\" placeholder=\"Search\">-->\n                <!--<button class=\"btn btn-outline-success my-2 my-sm-0\" type=\"submit\">Search</button>-->\n            <!--</form>-->\n        <!--</div>-->\n    <!--</div>-->\n    <!--<ul id='tabs' class=\"nav nav-tabs\">-->\n        <!--<li class=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isAll : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"><a href=\"#\" onclick=\"awr.demo.app1.$all(event)\">All</a></li>-->\n        <!--<li class=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isSen : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"><a href=\"#\" onclick=\"awr.demo.app1.$seniors(event)\">Senior & Lead</a></li>-->\n        <!--<li class=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isExp : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"><a href=\"#\" onclick=\"awr.demo.app1.$experts(event)\">Experienced</a></li>-->\n        <!--<li class=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isOth : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"><a href=\"#\" onclick=\"awr.demo.app1.$others(event)\">Others</a></li>-->\n    <!--</ul>-->\n    <!--<table class=\"table table-inverse\">-->\n        <!--<thead>-->\n        <!--<tr>-->\n            <!--<th># Call</th>-->\n            <!--<th>Name</th>-->\n            <!--<th>Title</th>-->\n            <!--<th>Chat Name</th>-->\n            <!--<th>Rating</th>-->\n        <!--</tr>-->\n        <!--</thead>-->\n        <!--<tbody>-->\n        <!--"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.collection : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "-->\n        <!--</tbody>-->\n    <!--</table>-->\n<!--</div>-->";
},"useData":true});
this["awr"]["core"]["templates"]["app"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<div awr-app=\""
    + container.escapeExpression(((helper = (helper = helpers.appName || (depth0 != null ? depth0.appName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"appName","hash":{},"data":data}) : helper)))
    + "\">\n    <header>\n        <nav class=\"navbar navbar-inverse bg-inverse\">\n            <a class=\"navbar-brand\" href=\"#\">\n                <strong>Awiar UX</strong>&nbsp;<small>Demo Apps</small>\n            </a>\n        </nav>\n    </header>\n\n    <div class=\"main\">\n        <h1 class=\"fa fa-meh-o\"> AWIAR UX </h1>\n    </div>\n</div>\n";
},"useData":true});
this["awr"]["core"]["templates"]["app"] = this["awr"]["core"]["templates"]["app"] || {};
this["awr"]["core"]["templates"]["app"]["module"] = this["awr"]["core"]["templates"]["app"]["module"] || {};
this["awr"]["core"]["templates"]["app"]["module"]["one"] = this["awr"]["core"]["templates"]["app"]["module"]["one"] || {};
this["awr"]["core"]["templates"]["app"]["module"]["one"]["example"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true});