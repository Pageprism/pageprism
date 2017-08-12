this["awr"] = this["awr"] || {};
this["awr"]["app"] = this["awr"]["app"] || {};
this["awr"]["app"]["templates"] = this["awr"]["app"]["templates"] || {};

this["awr"]["app"]["templates"]["assets/modules/activeLogin/activeLoginForm.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "    <form class=\"login-form\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasUser : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "\n        <div class=\"field\"><label>Password:</label><br/> <input type=\"password\" name=\"password\"/></div>\n        <div class=\"field\" class=\"form-control\">\n            <div class=\"visible-premium\">\n                <input type=\"checkbox\" name=\"saveUser\" checked/> Remember me!\n            </div>\n        </div>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasError : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </form>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <div>\n                <div class=\"usr-container\">\n                    <span class=\"link-element wrong-usr\" onclick=\"pageshare.activeLogin.wrongUser()\">Not you?</span>\n                    <span class=\"fa fa-user fa-3x\"></span>\n                    <div class=\"usr-data\">\n                        <span> "
    + alias4(((helper = (helper = helpers.userName || (depth0 != null ? depth0.userName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"userName","hash":{},"data":data}) : helper)))
    + " </span>\n                        <input type=\"text\" name=\"saved-user\" value=\""
    + alias4(((helper = (helper = helpers.userEmail || (depth0 != null ? depth0.userEmail : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"userEmail","hash":{},"data":data}) : helper)))
    + "\" disabled/>\n                    </div>\n\n                </div>\n            </div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "            <div class=\"field\"><label>Username:</label><br/> <input type=\"text\" name=\"user\"/></div>\n";
},"6":function(container,depth0,helpers,partials,data) {
    var helper;

  return "            <div class=\"error\">\n            <span class=\"fa fa-exclamation-triangle text-danger\">\n                "
    + container.escapeExpression(((helper = (helper = helpers.errorMsg || (depth0 != null ? depth0.errorMsg : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"errorMsg","hash":{},"data":data}) : helper)))
    + "\n            </span>\n            </div>\n";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.successView : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.program(11, data, 0),"data":data})) != null ? stack1 : "");
},"9":function(container,depth0,helpers,partials,data) {
    return "    <div class=\"login-wait\">\n        <img src=\"assets/img/spining_dots.gif\" style=\"width: 60px\"/>\n        <strong class=\"tex-success\">Logged in successfully!</strong>\n    </div>\n";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.busyView : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.program(14, data, 0),"data":data})) != null ? stack1 : "");
},"12":function(container,depth0,helpers,partials,data) {
    return "    <div class=\"login-wait\">\n        <img src=\"assets/img/spining_dots.gif\" style=\"width: 60px\"/>\n        <strong class=\"tex-info\">Logging in...</strong>\n    </div>\n";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.logoutView : depth0),{"name":"if","hash":{},"fn":container.program(15, data, 0),"inverse":container.program(17, data, 0),"data":data})) != null ? stack1 : "");
},"15":function(container,depth0,helpers,partials,data) {
    return "    <div class=\"login-wait\">\n        <img src=\"assets/img/spining_dots.gif\" style=\"width: 60px\"/>\n        <strong class=\"tex-info\">Logging out...</strong>\n    </div>\n";
},"17":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.logoutErrorView : depth0),{"name":"if","hash":{},"fn":container.program(18, data, 0),"inverse":container.program(21, data, 0),"data":data})) != null ? stack1 : "");
},"18":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "    <form class=\"login-form\">\n        <h4><span class=\"fa fa-meh-o text-info\"> &nbsp;Something went wrong!</span></h4>\n        <div class=\"error\">\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.errorMsg : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\n    </form>\n";
},"19":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                <span class=\"fa fa-exclamation-triangle text-danger\">\n                    "
    + container.escapeExpression(((helper = (helper = helpers.errorMsg || (depth0 != null ? depth0.errorMsg : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"errorMsg","hash":{},"data":data}) : helper)))
    + "\n                </span>\n";
},"21":function(container,depth0,helpers,partials,data) {
    return "    <h1>No content!</h1>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.defaultView : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(8, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});

this["awr"]["app"]["templates"]["assets/modules/communityAuthUIDriver/communityLoginBtn.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "            <div class=\"loading\"><span class=\"fa fa-spinner fa-spin\"></span>&nbsp;Loading...</div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.outMode : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.program(6, data, 0),"data":data})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                <div>Logged in as "
    + container.escapeExpression(((helper = (helper = helpers.userName || (depth0 != null ? depth0.userName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"userName","hash":{},"data":data}) : helper)))
    + "</div>\n                <br>\n                <a href=\"#\" class=\"awr-btn btn\" onclick=\"pageshare.activeLogin.logout(event)\">Log out</a>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "                <div>Using system as guest</div>\n                <br>\n                <a href=\"#\" class=\"awr-btn btn\" onclick=\"pageshare.activeLogin.login(event)\">Log in</a>\n";
},"8":function(container,depth0,helpers,partials,data) {
    return "            <span class=\"admin-label\">&#128081;&nbsp;Admin</span>\n";
},"10":function(container,depth0,helpers,partials,data) {
    var helper;

  return "            <small class=\"fa fa-remove text-danger\">&nbsp;"
    + container.escapeExpression(((helper = (helper = helpers.errMsg || (depth0 != null ? depth0.errMsg : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"errMsg","hash":{},"data":data}) : helper)))
    + "</small>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<li id=\"mainMenuLoginBtn\" class=\"community-login included-legacy-item\">\n    <div class=\"btn-content\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.loadingMode : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isAdmin : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasErr : depth0),{"name":"if","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n\n</li>";
},"useData":true});

this["awr"]["app"]["templates"]["assets/modules/docEdit/docEdit.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                        <option value=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" "
    + alias4(((helper = (helper = helpers.selected || (depth0 != null ? depth0.selected : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"selected","hash":{},"data":data}) : helper)))
    + ">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "\n                    <div class=\"visible-premium\">\n                        <button class=\"btn btn-data add-file\" onclick=\"pageshare.docEdit.addFile('pdf',true)\"><span\n                                class=\"fa fa-edit\"></span> Replace\n                        </button>\n                    </div>\n\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "\n                    <div class=\"visible-premium\">\n                        <button class=\"btn btn-data add-file\" onclick=\"pageshare.docEdit.addFile('pdf',false)\"><span\n                                class=\"fa fa-plus\"></span> Add PDF\n                        </button>\n                    </div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "\n                    <div class=\"visible-premium\">\n                        <button class=\"btn btn-data add-file\" onclick=\"pageshare.docEdit.addFile('epub',true)\"><span\n                                class=\"fa fa-edit\"></span> Replace\n                        </button>\n                    </div>\n";
},"9":function(container,depth0,helpers,partials,data) {
    return "                    <div class=\"visible-premium\">\n                        <button class=\"btn btn-data add-file\" onclick=\"pageshare.docEdit.addFile('epub',false)\"><span\n                                class=\"fa fa-plus\"></span> Add ePub\n                        </button>\n                    </div>\n\n";
},"11":function(container,depth0,helpers,partials,data) {
    return "                    <div class=\"visible-premium\">\n                        <button class=\"btn btn-data add-file\" onclick=\"pageshare.docEdit.addFile('audio',true)\"><span\n                                class=\"fa fa-edit\"></span> Replace\n                        </button>\n                    </div>\n\n";
},"13":function(container,depth0,helpers,partials,data) {
    return "\n                    <div class=\"visible-premium\">\n                        <button class=\"btn btn-data add-file\" onclick=\"pageshare.docEdit.addFile('audio',false)\"><span\n                                class=\"fa fa-plus\"></span> Add Audio\n                        </button>\n                    </div>\n";
},"15":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                        <option value=\""
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "\" "
    + alias4(((helper = (helper = helpers.selected || (depth0 != null ? depth0.selected : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"selected","hash":{},"data":data}) : helper)))
    + ">"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {};

  return "<div class=\"doc-edit col-lg-offset-2 col-lg-10 col-md-12  col-sm-12 col-xs-12 col-md-offset-0 col-xs-offset-0 col-sm-offset-0\">\n    <div>\n        <strong class=\"awr-icon back-link\">Back to collection</strong>\n    </div>\n    <div class=\"header col-md-12 col-sm-12 col-xs-12 col-lg-12\">\n\n        <h1 class=\"doc-title\">\n            <div class=\"disabled-overlay\">\n            </div>\n            <textarea name=\"doc_name\"\n                      onkeydown=\"pageshare.docEdit.adjustInputSize(this)\"\n            >"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.doc : depth0)) != null ? stack1.book_name : stack1), depth0))
    + "</textarea>\n            <input type=\"text\" name=\"doc_name\"\n                   onkeydown=\"pageshare.docEdit.adjustInputSize(this)\"\n                   value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.doc : depth0)) != null ? stack1.book_name : stack1), depth0))
    + "\"/>\n            <span class=\"fa fa-pencil\"></span>\n        </h1>\n    </div>\n    <div class=\"content col-md-12 col-xs-12 col-sm-12 col-lg-12\">\n        <div class=\"side col-md-4 col-xs-12 col-sm-12\">\n            <div class=\"col-md-12 col-sm-4 col-xs-6 no-padding\">\n                <div class=\"img-cover\">\n                    <div class=\"content\">\n                        <span class=\"fa fa-clock-o\">&nbsp;Processing...</span>\n\n                    </div>\n                </div>\n                <img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.doc : depth0)) != null ? stack1.file_url_cover : stack1), depth0))
    + "\" class=\"img-responsive\" alt=\"\">\n\n            </div>\n            <div class=\"col-md-12 col-sm-8 col-xs-6  \">\n                <div class=\"disabled-overlay\">\n                </div>\n                <h3 class=\"category-label\">Publication options</h3>\n                <hr/>\n                <input type=\"checkbox\" name=\"public\"/> Public <br/>\n                <input type=\"checkbox\" name=\"allow_aggregating\"/> Display in aggregated collections\n                and search results\n            </div>\n\n        </div>\n        <div class=\"fields col-md-8\">\n            <div class=\"disabled-overlay\">\n            </div>\n            <div class=\"row col-md-12\">\n                <label class=\"\" id=\"collLabel\">Collection </label>\n                <select id=\"collectionSelect\" class=\"form-control\">\n"
    + ((stack1 = helpers.each.call(alias3,(depth0 != null ? depth0.collections : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                </select>\n            </div>\n            <h3 class=\"category-label\">Files</h3>\n            <hr/>\n            <div class=\"row field\">\n                <label for=\"\">PDF</label>\n                <h4 class=\"text-muted file-name\">\n                    "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.doc : depth0)) != null ? stack1.pdf_name : stack1), depth0))
    + "\n                </h4>\n"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.doc : depth0)) != null ? stack1.pdf_name : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "")
    + "            </div>\n            <div class=\"row field\">\n                <label for=\"\">ePub</label>\n                <h4 class=\"text-muted file-name\">\n                    "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.doc : depth0)) != null ? stack1.epub_name : stack1), depth0))
    + "\n                </h4>\n"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.doc : depth0)) != null ? stack1.epub_name : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.program(9, data, 0),"data":data})) != null ? stack1 : "")
    + "            </div>\n            <div class=\"row field\">\n                <label for=\"\">Audio</label>\n                <h4 class=\"text-muted file-name\">\n                    "
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.doc : depth0)) != null ? stack1.audio_name : stack1), depth0))
    + "\n                </h4>\n"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = (depth0 != null ? depth0.doc : depth0)) != null ? stack1.audio_name : stack1),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.program(13, data, 0),"data":data})) != null ? stack1 : "")
    + "            </div>\n            <h3 class=\"category-label\">Details</h3>\n            <hr/>\n            <div class=\"row field\">\n                <label for=\"\">Authors</label>\n                <div class=\"meta-input\" id=\"authorsField\">\n\n                </div>\n            </div>\n            <div class=\"row field\">\n                <label for=\"\">Languages</label>\n                <div class=\"meta-input\" id=\"langsField\"></div>\n\n\n            </div>\n            <div class=\"row field\">\n                <label for=\"\">Year of publication</label>\n                <select id=\"yearSelect\" class=\"form-control\">\n"
    + ((stack1 = helpers.each.call(alias3,(depth0 != null ? depth0.years : depth0),{"name":"each","hash":{},"fn":container.program(15, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    <!--<option value=\"2015\">2015</option>-->\n                </select>\n            </div>\n            <div class=\"row field\">\n                <label for=\"\">Categories</label>\n                <div class=\"meta-input\" id=\"categsField\"></div>\n\n            </div>\n            <h3 class=\"category-label\">URLs</h3>\n            <hr/>\n            <div class=\"row field\">\n                <label for=\"\">Meme</label>\n                <input class=\"meta-input url\" type=\"text\" name=\"meme\" value=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.doc : depth0)) != null ? stack1.meta : stack1)) != null ? stack1.meme : stack1), depth0))
    + "\"/>\n            </div>\n            <div class=\"row field\">\n                <label for=\"\">Print</label>\n                <input class=\"meta-input url\" type=\"text\" name=\"print\" value=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.doc : depth0)) != null ? stack1.meta : stack1)) != null ? stack1.print : stack1), depth0))
    + "\"/>\n            </div>\n            <div class=\"row field\">\n                <label for=\"\">Designs</label>\n                <input class=\"meta-input url\" type=\"text\" name=\"designs\" value=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.doc : depth0)) != null ? stack1.meta : stack1)) != null ? stack1.designs : stack1), depth0))
    + "\"/>\n                <!--<input type=\"text\" />-->\n            </div>\n\n        </div>\n    </div>\n    <div class=\"footer col-md-12 col-sm-12 col-xs-12 col-lg-12\">\n        <div class=\"\">\n            <button onclick=\"pageshare.docEdit.update(event)\"\n                    class=\"btn btn-data edit\">Update\n            </button>\n            <button\n                    onclick=\"pageshare.docRemove.confirm(pageshare.docEdit.currentEditDoc || {})\"\n                    class=\"btn btn-danger remove\">Remove document\n            </button>\n        </div>\n    </div>\n</div>";
},"useData":true});

this["awr"]["app"]["templates"]["assets/modules/docForm/docForm.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "                                <option value=\""
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "\" "
    + alias2(alias1((depth0 != null ? depth0.selected : depth0), depth0))
    + ">"
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "</option>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {};

  return "<div class=\"doc-form\">\n    <div>\n        <strong class=\"awr-icon back-link keep-left\" awr-link=\"#c/"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.shelf : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">&nbsp;Back to collection</strong>\n    </div>\n    <div class=\"head offset-md-2  col-md-9\">\n        <div class=\"progress-container col-md-12 col-sm-12 col-xs-12\">\n            <h4 class=\"progress_level right level-badge\">1 / 3</h4>\n            <progress class=\"progress progress-warning\" id=\"pDocLevel1\" value=\"0\" max=\"100\"></progress>\n            <progress class=\"progress progress-primary\" id=\"pDocLevel2\" value=\"0\" max=\"100\"></progress>\n            <progress class=\"progress progress-primary\" id=\"pDocLevel3\" value=\"0\" max=\"100\"></progress>\n        </div>\n        <div class=\"col-md-12 col-sm-12 col-xs-12 collection-name\">\n            <h3 class=\"pull-left hidden-xs\">"
    + alias2(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias3,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h3>\n            <h3 class=\"pull-left visible-xs\">Collection:</h3>\n            <select id=\"shelfSelect\" class=\"form-control\">\n                <option value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.shelf : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.shelf : depth0)) != null ? stack1.name : stack1), depth0))
    + "</option>\n            </select>\n        </div>\n\n    </div>\n\n    <div class=\"content col-xs-12 offse-xs-0 offset-md-2 col-md-9\">\n        <ul class=\"nav nav-pills nav-stacked col-md-1\">\n            <li class=\"vertical-text active form-tab\" id=\"formGeneralTab\">\n                <!--General section is called details in UI-->\n                <span onclick=\"docForm.setLevel(1)\"><a href=\"#\" onclick=\"docForm.noopLink(event)\" class=\"\"> DETAILS </a></span>\n            <li class=\"vertical-text form-tab\" id=\"formUrlsTab\"><span onclick=\"docForm.setLevel(2)\"><a href=\"#\"\n                                                                                                       onclick=\"docForm.noopLink(event)\">URLS</a></span>\n            </li>\n            <li class=\"vertical-text form-tab\" id=\"formFilesTab\"><span onclick=\"docForm.setLevel(3)\"><a href=\"#\"\n                                                                                                        onclick=\"docForm.noopLink(event)\">FILES</a></span>\n            </li>\n        </ul>\n        <form class=\"offset-md-1 col-md-10\" action=\"cmd/doc/save\" method=\"post\" enctype=\"multipart/form-data\"\n              accept-charset=\"utf-8\">\n            <input type=\"hidden\" name=\"shelf_id\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.shelf : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">\n            <div class=\"doc-form-section col-md-12 not-valid\" id=\"generalSection\">\n                <div class=\"row col-md-12\">\n                    <!--<h3>Name: </h3>-->\n                    <div class=\"form-group \">\n                        <div class=\"field-head col-md-12\">\n                            <label for=\"book_name\">Name: </label>\n                            <li class=\"notif text-danger fa fa-exclamation-triangle pull-right\">This field should not be\n                                empty\n                            </li>\n                        </div>\n\n                        <input type=\"text\" class=\"form-control\" name=\"book_name\" placeholder=\"Enter name\">\n                    </div>\n\n                </div>\n                <div class=\"row col-md-12\">\n                    <h3>Details:</h3>\n                </div>\n                <div class=\"row col-md-12\">\n                    <div class=\"form-group \">\n                        <div class=\"field-head col-md-12\">\n                            <label for=\"Authors\">Authors:</label>\n                            <li class=\"notif text-danger fa fa-exclamation-triangle pull-right\">This field should not be\n                                empty\n                            </li>\n\n                        </div>\n                        <br/>\n                        <div id=\"authorsField\">\n\n                        </div>\n\n                        <!--<input type=\"text\" class=\"form-control\" name=\"Authors\" placeholder=\"Enter an author name\">-->\n                    </div>\n                </div>\n                <div class=\"row col-md-12\" id=\"langYearRow\">\n                    <div class=\"form-group col-md-9\">\n                        <label for=\"Languages\">Languages:</label>\n                        <!--<input type=\"text\" class=\"form-control\" name=\"Languages\" placeholder=\"Enter a language\">-->\n                        <br/>\n                        <div id=\"langsField\">\n\n                        </div>\n                    </div>\n                    <div class=\"form-group col-md-3\">\n                        <label for=\"book_name\">Year of publication:</label>\n                        <!--<input type=\"text\" class=\"form-control\" name=\"pub_year\" placeholder=\"Enter the year of publication\">-->\n                        <select id=\"yearSelect\" name=\"pub_year\" class=\"form-control\">\n"
    + ((stack1 = helpers.each.call(alias3,(depth0 != null ? depth0.years : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                            <!--<option value=\"2015\">2015</option>-->\n                        </select>\n\n                    </div>\n                </div>\n                <div class=\"row col-md-12\">\n                    <div class=\"form-group \">\n                        <div class=\"field-head col-md-12\">\n                            <label for=\"Categories\">Categories:</label>\n                            <!--<li class=\"notif text-danger fa fa-exclamation-triangle pull-right\">This field should not be empty</li>-->\n\n                        </div>\n                        <br/>\n                        <div name=\"categories\" id=\"categsField\">\n\n                        </div>\n\n                        <!--<input type=\"text\" class=\"form-control\" name=\"Authors\" placeholder=\"Enter an author name\">-->\n                    </div>\n                </div>\n                <div class=\"row col-md-12\">\n                    <h3>Publication options:</h3>\n                </div>\n                <div class=\"row col-md-12\">\n                    <div class=\"form-group\">\n                        <label class=\"checkbox-inline\"><input type=\"checkbox\" class=\"checkbox_label\" name=\"public\">Public</label>\n                    </div>\n                </div>\n                <div class=\"row col-md-12\">\n                    <div class=\"form-group\">\n                        <label class=\"checkbox-inline\"><input type=\"checkbox\" name=\"allow_aggregating\"\n                                                              class=\"checkbox_label\">Display in\n                            aggregated collections and search results</label>\n                    </div>\n                </div>\n\n            </div>\n            <div class=\"doc-form-section col-md-12\" id=\"urlsSection\">\n                <div class=\"col-md-9\">\n                    <h3>URLS:</h3>\n                    <div class=\"form-group offset-md-1\">\n                        <label for=\"book_name\">Meme:</label>\n                        <input type=\"text\" class=\"form-control\" name=\"Meme\" placeholder=\"Enter name\">\n                    </div>\n                    <div class=\"form-group offset-md-1\">\n                        <label for=\"book_name\">Print:</label>\n                        <input type=\"text\" class=\"form-control\" name=\"Print\" placeholder=\"Enter name\">\n                    </div>\n                    <div class=\"form-group offset-md-1\">\n                        <label for=\"book_name\">Design:</label>\n                        <input type=\"text\" class=\"form-control\" name=\"Designs\" placeholder=\"Enter name\">\n                    </div>\n                </div>\n                <div class=\"col-md-3\">\n\n                </div>\n\n            </div>\n            <div class=\"doc-form-section col-md-11\" id=\"filesSection\">\n                <h3>Files: </h3>\n                <div class=\"form-group offset-md-1 pdf-input\">\n                    <label class=\"control-label\">Pdf:</label>\n                    <input id=\"pdf-select\" name=\"pdffile\" type=\"file\" class=\"file\">\n\n                </div>\n                <div class=\"form-group epub-input\">\n                    <div class=\"field-head col-md-12\">\n                        <label class=\"control-label offset-md-1\">ePub:</label>\n                        <!--<li class=\"info-notif text-info fa fa-exclamation-triangle pull-right\">The ePup upload is not available currently!</li>-->\n                    </div>\n\n\n                    <input id=\"epub-select\" type=\"file\" name=\"epubfile\" class=\"file\">\n\n                </div>\n                <div class=\"form-group audio-input hidden\">\n                    <label class=\"control-label offset-md-1\">Audio:</label>\n                    <input id=\"audio-select\" type=\"file\" name=\"audiozipfile\" class=\"file\">\n\n                </div>\n\n                <ul class=\"error-list\">\n                    <h4 class=\"text-info\">Please correct following problems in order to proceed:</h4>\n                </ul>\n\n            </div>\n            <div class=\"doc-form-section col-md-11\" id=\"workingSection\">\n                <div class=\"working\">\n                    <div class=\"prog-container\">\n                        <img src=\"/img/prog.gif\" alt=\"\">\n                        <h2>Uploading</h2>\n                        <h4>Please be patient!</h4>\n                    </div>\n\n                    <!--<progress class=\"progress progress-primary\" id=\"pDocWorking\" value=\"40\" max=\"100\"></progress>-->\n                </div>\n                <div class=\"success\">\n                    <h2><i class=\"fa fa-smile-o\"></i> <strong>Success!</strong></h2>\n                    <h4 class=\"text-success\">Upload completed.</h4>\n\n                    <div class=\"continue-options pull-right\">\n\n                        <h4 onclick=\"docForm.restart()\"><a class=\"fa fa-upload\" href=\"#\"\n                                                           onclick=\"docForm.noopLink(event)\"> Add another document</a>\n                        </h4>\n                        <h4 class=\"to-home\"><a class=\"fa fa-home\" href=\"/app#c/index\"> Back to collection</a></h4>\n                    </div>\n                    <!--<progress class=\"progress progress-primary\" id=\"pDocWorking\" value=\"40\" max=\"100\"></progress>-->\n                </div>\n                <div class=\"failed\">\n                    <h2><i class=\"fa fa-meh-o\"></i> <strong>Failed!</strong></h2>\n                    <h4 class=\"text-danger\">Upload Failed.</h4>\n                    <!--<progress class=\"progress progress-primary\" id=\"pDocWorking\" value=\"40\" max=\"100\"></progress>-->\n\n                    <div class=\"continue-options pull-right\">\n                        <h4 onclick=\"docForm.restart()\"><a class=\"fa fa-upload\" href=\"#\"\n                                                           onclick=\"docForm.noopLink(event)\"> Try again!</a></h4>\n                        <h4 class=\"to-home\"><a class=\"fa fa-home\" href=\"/app#c/index\"> Back to collection</a></h4>\n                    </div>\n                </div>\n                <div class=\"working-log col-md-12 col-sm-12 col-xs-12 hidden-sm hidden-xs\" id=\"docWorkingLog\">\n                    <li class=\"fa fa-square-o col-md-12 col-sm-12 col-xs-12\"> Connecting to server...</li>\n                    <li class=\"fa fa-square-o col-md-12 col-sm-12 col-xs-12\"> Initializing doc...</li>\n                    <li class=\"fa fa-square-o col-md-12 col-sm-12 col-xs-12\"> Sending meta data to server...</li>\n                    <li class=\"fa fa-square-o col-md-12 col-sm-12 col-xs-12\"> Uploading files...</li>\n                    <li class=\"fa fa-check-square-o col-md-6 col-md-offset-1 col-sm-offset-1 col-sm-8 col-xs-12\"> File\n                        some_name_.pdf uploaded.\n                    </li>\n\n\n                </div>\n            </div>\n\n\n            <div class=\"control btn-group offset-md-6\">\n                <button type=\"button\" class=\"btn btn-primary back\" onclick=\"docForm.back()\">Back</button>\n                <button type=\"button\" class=\"btn btn-success next\" onclick=\"docForm.next()\">Next</button>\n                <button type=\"button\" class=\"btn btn-success upload\" onclick=\"docForm.startUpload()\">Upload</button>\n            </div>\n\n        </form>\n\n    </div>\n</div>\n\n\n<script type=\"text/javascript\">\n    /**\n     * Adding docForm alias\n     */\n    $(\".doc-form\").ready(function () {\n        window.docForm = window.pageshare.docForm;\n    });\n    $(document).ready(function () {\n//        setTimeout(window.addDummyValues,500);\n//        window.addDummyValues();\n    });\n</script>\n";
},"useData":true});

this["awr"]["app"]["templates"]["assets/modules/docReader/doc_info.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "        <a href=\"/app#c/"
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

  return "        <h2>"
    + container.escapeExpression(container.lambda(blockParams[0][1], depth0))
    + " </h2>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},depth0,{"name":"each","hash":{},"fn":container.program(5, data, 0, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "            <a href=\"/app#collect/tag/"
    + alias2(alias1(blockParams[1][1], depth0))
    + "/"
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "?current=index\">"
    + alias2(alias1((depth0 != null ? depth0.value : depth0), depth0))
    + "</a>"
    + ((stack1 = helpers.unless.call(depth0 != null ? depth0 : {},(data && data.last),{"name":"unless","hash":{},"fn":container.program(6, data, 0, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "\n            ,";
},"8":function(container,depth0,helpers,partials,data) {
    return "        <div class=\"editBook oo-ui-iconElement\">\n            <div class=\"popUnder link-element\" awr-link=\"#edit/"
    + container.escapeExpression(container.lambda((depth0 != null ? depth0.edit_id : depth0), depth0))
    + "?view=open\">\n                <span class=\"oo-ui-iconElement-icon oo-ui-icon-edit\"></span> Edit\n            </div>\n        </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<div>\n    <h2>Collections:</h2>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.collections : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + ((stack1 = helpers.each.call(alias1,((stack1 = ((stack1 = (depth0 != null ? depth0.book : depth0)) != null ? stack1.attributes : stack1)) != null ? stack1.attribute : stack1),{"name":"each","hash":{},"fn":container.program(4, data, 2, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.editable : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "\n</div>";
},"useData":true,"useBlockParams":true});

this["awr"]["app"]["templates"]["assets/modules/docReader/doc_pages.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {};

  return "        <div class=\"single-page\"  id=\"page_"
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.nr : stack1), depth0))
    + "\"\n             data-page-number=\""
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.nr : stack1), depth0))
    + "\">\n            <div class=\"tools\">\n                <!--<span class=\"fa fa-pencil edit\" awr-link=\""
    + alias2(alias1((depths[1] != null ? depths[1].edit_link : depths[1]), depth0))
    + "\" onclick=\"pageshare.docEdit.edit()\"></span>-->\n                <span class=\"fa fa-pencil edit\" awr-link=\""
    + alias2(alias1((depths[1] != null ? depths[1].edit_link : depths[1]), depth0))
    + "\"></span>\n                <span class=\"fa fa-remove remove\"\n                      onclick=\"pageshare.docRemove.confirm(pageshare.currentDoc.book)\"></span>\n            </div>\n            <div class=\"page-share\">\n                <span class=\"pagenumber\" onclick=\"pageshare.docReader.togglePageInfo(event)\">"
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.nr : stack1), depth0))
    + "</span>\n                <!--<span class=\"pagenumber\" awr-class-toggle=\"$simple:.page-share:open\">"
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.nr : stack1), depth0))
    + "</span>-->\n                <div class=\"share-part\">\n                    <div share-part-separator>\n                        <h5 class=\"url\">Pageshare: </h5>\n                        <a awr-link=\""
    + alias2(alias1((depths[1] != null ? depths[1].direct_link : depths[1]), depth0))
    + "/p"
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.nr : stack1), depth0))
    + "\" href=\""
    + alias2(alias1((depths[1] != null ? depths[1].direct_link : depths[1]), depth0))
    + "/p"
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.nr : stack1), depth0))
    + "\"\n                           class=\"direct-url\">"
    + alias2(alias1((depths[1] != null ? depths[1].direct_link_label : depths[1]), depth0))
    + "/p"
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.nr : stack1), depth0))
    + "</a>\n                        <!--<a href=\""
    + alias2(alias1((depths[1] != null ? depths[1].base_url : depths[1]), depth0))
    + alias2(alias1(((stack1 = (depths[1] != null ? depths[1].book : depths[1])) != null ? stack1.book_name_clean : stack1), depth0))
    + "/p"
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.nr : stack1), depth0))
    + "\" class=\"direct-url\">"
    + alias2(alias1((depths[1] != null ? depths[1].base_url : depths[1]), depth0))
    + alias2(alias1(((stack1 = (depths[1] != null ? depths[1].book : depths[1])) != null ? stack1.book_name_clean : stack1), depth0))
    + "/epub</a>-->\n                    </div>\n"
    + ((stack1 = helpers["with"].call(alias3,(depths[1] != null ? depths[1].book : depths[1]),{"name":"with","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias3,((stack1 = blockParams[0][0]) != null ? stack1.audio : stack1),{"name":"if","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "                    <div share-part-separator>\n"
    + ((stack1 = helpers.each.call(alias3,(depths[1] != null ? depths[1].url_links : depths[1]),{"name":"each","hash":{},"fn":container.program(12, data, 2, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "                    </div>\n                </div>\n            </div>\n"
    + ((stack1 = helpers["if"].call(alias3,((stack1 = blockParams[0][0]) != null ? stack1.url : stack1),{"name":"if","hash":{},"fn":container.program(16, data, 0, blockParams, depths),"inverse":container.program(18, data, 0, blockParams, depths),"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "        </div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "                        <div share-part-separator>\n                            <h5>Downloads: </h5>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.file_url_pdf : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.file_url_epub : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.file_url_music : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                        </div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                                <a href=\""
    + alias4(((helper = (helper = helpers.file_url_pdf || (depth0 != null ? depth0.file_url_pdf : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"file_url_pdf","hash":{},"data":data}) : helper)))
    + "\" class=\"download-pdf \"><i class=\"icon-book fa fa-book\"></i>\n                                    PDF</a>\n                                <!--onclick=\"_gaq.push([\\'_trackEvent\\', \\'eSamiszat-Shelf\\',' +-->\n                                <!--' \\'"
    + alias4(((helper = (helper = helpers.book_name || (depth0 != null ? depth0.book_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"book_name","hash":{},"data":data}) : helper)))
    + "\\', \\'download pdf\\);\"-->\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                                <a href=\""
    + alias4(((helper = (helper = helpers.file_url_epub || (depth0 != null ? depth0.file_url_epub : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"file_url_epub","hash":{},"data":data}) : helper)))
    + "\" class=\"download-epub \">\n                                    <i class=\"icon-book fa fa-book\"></i> ePub</a>\n                                <!--onclick=\"_gaq.push([\\'_trackEvent\\', \\'eSamiszat-Shelf\\', ' +-->\n                                <!--'\\'"
    + alias4(((helper = (helper = helpers.book_name || (depth0 != null ? depth0.book_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"book_name","hash":{},"data":data}) : helper)))
    + "\\', \\'download epub\\);\"-->\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                                <a href=\""
    + alias4(((helper = (helper = helpers.file_url_music || (depth0 != null ? depth0.file_url_music : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"file_url_music","hash":{},"data":data}) : helper)))
    + "\" class=\"download-music \">\n                                    <i class=\"icon-play-sign\"></i> Audio</a>\n                                <!--onclick=\"_gaq.push([\\'_trackEvent\\', \\'eSamiszat-Shelf\\', ' +-->\n                                <!--'\\'"
    + alias4(((helper = (helper = helpers.book_name || (depth0 != null ? depth0.book_name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"book_name","hash":{},"data":data}) : helper)))
    + "\\', \\'download music\\);\"-->\n";
},"9":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                        <div share-part-separator class=\"audiotrack\">\n                            <h5>\n                                "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},((stack1 = ((stack1 = blockParams[1][0]) != null ? stack1.audio : stack1)) != null ? stack1.track : stack1),{"name":"if","hash":{},"fn":container.program(10, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + alias2(alias1(((stack1 = ((stack1 = blockParams[1][0]) != null ? stack1.audio : stack1)) != null ? stack1.title : stack1), depth0))
    + "\n                            </h5>\n                            <a href=\""
    + alias2(alias1(((stack1 = ((stack1 = blockParams[1][0]) != null ? stack1.audio : stack1)) != null ? stack1.url : stack1), depth0))
    + "\" class=\"download-music\">\n                                <!--onclick=\"_gaq.push([\\'_trackEvent\\', \\'eSamiszat-Shelf\\', ' +-->\n                                <!--'\\'"
    + alias2(alias1(((stack1 = (depths[1] != null ? depths[1].book : depths[1])) != null ? stack1.book_name : stack1), depth0))
    + "\\', \\'download music\\);\"-->\n                                <i class=\"icon-music\"></i> Audio</a>\n                            <audio preload=\"metadata\" src=\""
    + alias2(alias1(((stack1 = ((stack1 = blockParams[1][0]) != null ? stack1.audio : stack1)) != null ? stack1.url : stack1), depth0))
    + "\"/>\n                        </div>\n";
},"10":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = ((stack1 = blockParams[2][0]) != null ? stack1.audio : stack1)) != null ? stack1.track : stack1), depth0))
    + ". ";
},"12":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "                            <h5>"
    + container.escapeExpression(container.lambda(blockParams[0][1], depth0))
    + ": </h5>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},depth0,{"name":"each","hash":{},"fn":container.program(13, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "");
},"13":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, alias3=depth0 != null ? depth0 : {}, alias4=helpers.helperMissing;

  return "                                <!--onclick=\"_gaq.push([\\'_trackEvent\\', \\'eSamiszat-Shelf\\', \\'"
    + alias2(alias1(((stack1 = (depths[2] != null ? depths[2].book : depths[2])) != null ? stack1.book_name : stack1), depth0))
    + "\\',\n                                    \\'"
    + alias2(alias1(blockParams[1][1], depth0))
    + "\\);\">-->\n                                <a href=\""
    + alias2(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias4),(typeof helper === "function" ? helper.call(alias3,{"name":"value","hash":{},"data":data,"blockParams":blockParams}) : helper)))
    + "\" target=\"_blank\">\n                                    "
    + ((stack1 = helpers["if"].call(alias3,(depth0 != null ? depth0.subtitle : depth0),{"name":"if","hash":{},"fn":container.program(14, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "\n                                    "
    + alias2((helpers.shorten || (depth0 && depth0.shorten) || alias4).call(alias3,(depth0 != null ? depth0.value : depth0),{"name":"shorten","hash":{},"data":data,"blockParams":blockParams}))
    + "\n                                </a>\n";
},"14":function(container,depth0,helpers,partials,data) {
    var helper;

  return container.escapeExpression(((helper = (helper = helpers.subtitle || (depth0 != null ? depth0.subtitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"subtitle","hash":{},"data":data}) : helper)))
    + ": ";
},"16":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "                <img data-original=\""
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? stack1.url : stack1), depth0))
    + "\" width=\""
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? stack1.width : stack1), depth0))
    + "\" height=\""
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? stack1.height : stack1), depth0))
    + "\"\n                     class=\"img-responsive\"/>\n";
},"18":function(container,depth0,helpers,partials,data) {
    return "                <div class=\"empty-page\">\n                    <img data-original=\"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7\"\n                         style=\"display: none;\"/>\n                </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<div class=\"open-doc "
    + container.escapeExpression(((helper = (helper = helpers.editable || (depth0 != null ? depth0.editable : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"editable","hash":{},"data":data,"blockParams":blockParams}) : helper)))
    + "\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.pages : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "\n</div>\n\n\n";
},"useData":true,"useDepths":true,"useBlockParams":true});

this["awr"]["app"]["templates"]["assets/modules/easySignup/easySignup.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"easy-signup\">\n    <div class=\"container \">\n        <div class=\"main\">\n            <div class=\"col-xs-12 col-sm-8 col-md-4\">\n                <div class=\"panel form-panel hidden\">\n                    <div class=\"panel-body\">\n                        <form role=\"form\" method=\"post\">\n                            <div class=\"row\">\n                                <div class=\"col-xs-6 col-sm-6 col-md-6\">\n                                    <div class=\"form-group\">\n                                        <input type=\"text\" name=\"first_name\" id=\"first_name\"\n                                               class=\"form-control input-sm\" placeholder=\"First Name\"\n                                               value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.values : depth0)) != null ? stack1.fName : stack1), depth0))
    + "\">\n                                        <span class=\"fa fa-remove text-danger\"></span>\n                                        <span class=\"fa fa-check text-success\"></span>\n\n                                    </div>\n                                </div>\n                                <div class=\"col-xs-6 col-sm-6 col-md-6\">\n                                    <div class=\"form-group\">\n                                        <input type=\"text\" name=\"last_name\" id=\"last_name\" class=\"form-control input-sm\"\n                                               placeholder=\"Last Name\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.values : depth0)) != null ? stack1.lName : stack1), depth0))
    + "\">\n                                        <span class=\"fa fa-remove text-danger\"></span>\n                                        <span class=\"fa fa-check text-success\"></span>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"row\">\n                                <div class=\"col-xs-12 col-sm-12 col-md-12\">\n                                    <div class=\"form-group\">\n                                        <input type=\"email\" name=\"email\" id=\"email\" class=\"form-control input-sm\"\n                                               placeholder=\"Email Address\" value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.values : depth0)) != null ? stack1.email : stack1), depth0))
    + "\">\n                                        <span class=\"fa fa-remove text-danger\"></span>\n                                        <span class=\"fa fa-check text-success\"></span>\n                                    </div>\n                                </div>\n                            </div>\n                            <div class=\"row\">\n                                <div class=\"col-xs-6 col-sm-6 col-md-6\">\n                                    <div class=\"form-group\">\n                                        <input type=\"password\" name=\"password\" id=\"password\"\n                                               class=\"form-control input-sm\" placeholder=\"Password\"\n                                               value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.values : depth0)) != null ? stack1.password : stack1), depth0))
    + "\">\n                                        <span class=\"fa fa-remove text-danger\"></span>\n                                        <span class=\"fa fa-check text-success\"></span>\n                                    </div>\n                                </div>\n                                <div class=\"col-xs-6 col-sm-6 col-md-6\">\n                                    <div class=\"form-group\">\n                                        <input type=\"password\" name=\"password_confirmation\" id=\"password_confirmation\"\n                                               class=\"form-control input-sm\" placeholder=\"Confirm Password\"\n                                               value=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.values : depth0)) != null ? stack1.passwordConfirm : stack1), depth0))
    + "\">\n                                        <span class=\"fa fa-remove text-danger\"></span>\n                                        <span class=\"fa fa-check text-success\"></span>\n                                    </div>\n                                </div>\n                            </div>\n                            <hr/>\n                            <input type=\"button\" value=\"Register\" class=\"btn btn-info btn-block\"\n                                   onclick=\"pageshare.easySignup.register()\">\n                            <div class=\"error-desc\">\n                                <strong class=\"text-info\"> Please fix the following problems:</strong>\n                                <li class=\"fa fa-remove text-danger\" name=\"emailInUse\">&nbsp;\n                                    The email is already in use by another user. Please choose another email address.\n                                </li>\n                                <li class=\"fa fa-remove text-danger\" name=\"fName\">&nbsp;The first name is required.\n                                    Please enter a string,\n                                    which is at least 3 letters long, and which does not contain any of following\n                                    special characters: ( <span class=\"text-info\">!#?=&%</span> ).\n                                    Please note that the string should not start with a period character.\n                                </li>\n                                <li class=\"fa fa-remove text-danger\" name=\"lName\">&nbsp;&nbsp;The last name is required.\n                                    Please enter a string,\n                                    which is at least 2 letters long, and which does not contain any of following\n                                    special characters: ( <span class=\"text-info\">!#?=&%</span> ).\n                                    Please note that the string should not start with a period character.\n                                </li>\n                                <li class=\"fa fa-remove text-danger\" name=\"email\">&nbsp;&nbsp;The email is required.\n                                    Please enter a valid email address.\n                                </li>\n                                <li class=\"fa fa-remove text-danger\" name=\"password\">&nbsp;The password is required.\n                                    Please choose password which is between 6-12 characters long.\n                                    The password should contain at least 1 number and 1 capital letter. The use of\n                                    special characters like <span class=\"text-info\">!#?=&%</span> are allowed, and\n                                    recommended.\n                                </li>\n                                <li class=\"fa fa-remove text-danger\" name=\"passwordConfirm\">&nbsp;The password and\n                                    password confirmation should match.\n                                </li>\n                            </div>\n                        </form>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>";
},"useData":true});

this["awr"]["app"]["templates"]["assets/modules/easySignup/easySignupLimited.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"col-xs-12 col-md-12 col-sm-12\">\n    <div class=\"panel invite-key\">\n        <div class=\"panel-body\">\n            <div class=\"\">\n                <div id=\"inviteFormLevel2\" class=\"description hidden\">\n                    <div id=\"accepted\" class=\"hidden\">\n                        <h3 class=\"text-success\">Invitation key Accepted!</h3>\n                        <div class=\"key-preview\">\n\n                            <span class=\"fa fa-check text-success \"></span>\n                        </div>\n                        <p class=\"text-info\">\n                            Congratulations, your key is accepted, and you can now\n                            continue to the registration form. Please note, that your key can be used\n                            only for registration of one account. After the successful completion of registration your\n                            key will be expired.\n                        </p>\n                        <button class=\"btn btn-success col-md-12\"> Continue to the registration </button>\n                    </div>\n                    <div id=\"rejected\" class=\"hidden\">\n                        <h3 class=\"text-danger\">The key is expired!</h3>\n                        <div class=\"key-preview\">\n\n                            <span class=\"fa fa-remove text-danger\"></span>\n                        </div>\n                        <p class=\"text-info\">\n                            Unfortunately this key is expired and it can not be used anymore. The key might be already\n                            being used for registration of an account, or it has been invalidated by the administrator. Please, contact\n                            the person who sent you this key and ask for a valid inivitation key.\n                        </p>\n                        <button class=\"btn btn-success col-md-12\"> Try another key</button>\n                    </div>\n                </div>\n                <div id=\"inviteFormLevel1\" class=\"description\">\n                    <h3 class=\"text-warning\">Invitation key required</h3>\n                    <p class=\"text-info\">\n                        Currently our registration system is open for a pre selected user group only. Please\n                        note\n                        that this restriction will be removed later, and in near future we will open\n                        the registration system for public. Right now you can register in the system,\n                        only if you are invited by one of our admin members, and you hold an unused and\n                        valid invitation key.\n                    </p>\n                    <h5 class=\"text-success\"><strong>Please insert your invitation key:</strong></h5>\n                    <div class=\"form-group activate-field\">\n                        <input type=\"text\" name=\"invite_key\" id=\"inviteKey\"\n                               onkeydown=\"pageshare.limitedSignup.validate(event)\"\n                               onpaste=\"pageshare.limitedSignup.validate(event)\"\n                               class=\"form-control input-sm\"\n                               placeholder=\"XXXX-XXXX-XXXX-XXXX\" maxlength=\"19\" value=\"\">\n                        <button class=\"btn btn-success disabled\" onclick=\"pageshare.limitedSignup.activate(event)\">Continue</button>\n                        <div class=\" text-primary loading\"><span class=\"fa fa-spinner fa-spin\"></span>&nbsp;Activating...</div>\n                        <span class=\"fa fa-remove text-danger hidden\"></span>\n                        <span class=\"fa fa-check text-success hidden\"></span>\n                    </div>\n                    <br>\n                    <span id=\"shortKeyInfoToggle\"\n                          class=\"link-element no-underline pull-right\"\n                          onclick=\"pageshare.limitedSignup.showGotShortKeyInfo()\">\n                        Got a shorter 9 characters long key?\n                    </span>\n                    <div id=\"shortKeyInfo\" class=\"hidden\">\n                        <h5 class=\"text-warning\">Please Note:</h5>\n                        <p class=\"text-info\">Registration through this page requires a 19 characters long key.\n                            If you have a shorter 9 characters long key, it means you were invited to complete\n                            your registration through a special link. In that case without using that proper\n                            link,\n                            you can not use your code and proceed to registration page. If you received the\n                            invitation by an email, the correct link for registration should be part of that\n                            email.\n                            If you can't find the correct link, please contact the person\n                            who sent the invitation, and ask for a registration link.</p>\n                    </div>\n\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n\n";
},"useData":true});

this["awr"]["app"]["templates"]["assets/modules/imgCache/imgCache.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"awrImgCache\">\n    <h1>Heloooo</h1>\n</div>";
},"useData":true});

this["awr"]["app"]["templates"]["assets/modules/inviteView/inviteKey.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id="
    + alias4(((helper = (helper = helpers.domId || (depth0 != null ? depth0.domId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"domId","hash":{},"data":data}) : helper)))
    + " class=\"panel panel-default col-md-8 col-md-offset-0 "
    + alias4(((helper = (helper = helpers.keyStatus || (depth0 != null ? depth0.keyStatus : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"keyStatus","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"panel-heading\">\n        <div class=\"panel-title\">\n            <div class=\"tools\">\n                <button class=\"btn btn-default reserve\"\n                        onclick=\"pageshare.inviteView.reserve(event)\">Reserve</button>\n                <button class=\"btn btn-default fa fa-ban invalidate\"\n                        onclick=\"pageshare.inviteView.invalidate(event)\"></button>\n                <button class=\"btn btn-default fa fa-clone hidden-xs\"\n                onclick=\"pageshare.inviteView.copyKey(event)\"></button>\n            </div>\n        </div>\n\n    </div>\n    <div class=\"panel-body\"><span class=\"key\">"
    + alias4(((helper = (helper = helpers.serialNumber || (depth0 != null ? depth0.serialNumber : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"serialNumber","hash":{},"data":data}) : helper)))
    + "</span>\n        <button class=\"btn btn-default fa fa-clone visible-xs\"\n        onclick=\"pageshare.inviteView.mobileCopyKey(event)\"></button>\n    </div>\n    <div class=\"panel-footer\">\n        <small class=\"pull-left hidden-xs\">Created by "
    + alias4(((helper = (helper = helpers.createdBy || (depth0 != null ? depth0.createdBy : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"createdBy","hash":{},"data":data}) : helper)))
    + "</small>\n        <!--<small class=\"pull-right\">Created on "
    + alias4(((helper = (helper = helpers.created || (depth0 != null ? depth0.created : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"created","hash":{},"data":data}) : helper)))
    + "</small>-->\n        <small class=\"pull-right\">Expires on "
    + alias4(((helper = (helper = helpers.expires || (depth0 != null ? depth0.expires : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"expires","hash":{},"data":data}) : helper)))
    + "</small>\n    </div>\n    <span class=\"reserved-label status-label\">Reserved</span>\n    <span class=\"valid-label status-label\">Valid</span>\n    <span class=\"seeking-label status-label\"> <span class=\"fa fa-spinner fa-spin\"></span>&nbsp;Updating...</span>\n    <span class=\"expired-label status-label\">Expired</span>\n</div>\n";
},"useData":true});

this["awr"]["app"]["templates"]["assets/modules/inviteView/inviteView.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"invite-view col-lg-offset-2 col-lg-10 col-md-12  col-sm-12 col-xs-12 col-md-offset-0 col-xs-offset-0 col-sm-offset-0\">\n    <br>\n    <div class=\"header\">\n        <div class=\"panel panel-warning col-md-8\">\n            <div class=\"panel-heading\">\n                <h3 class=\"fa fa-edit fa-3x text-success\">&nbsp;Invite people to join</h3>\n            </div>\n            <div class=\"panel-body\">\n                <p class=\"text-primary hidden-xs\">\n                    The registration is currently open for a limited group of users only. In this page\n                    you can generate invitation keys and give them for the people who you wish to become the members.\n                    Your\n                    allowed to invite new members, because your account is marked as an administrator. Please be careful\n                    with\n                    sharing these keys as anyone that hold a valid key is allowed to create a account. New users can\n                    operate\n                    as publishers and publish their uploaded documents.\n                </p>\n                <p class=\"text-primary\">\n                    Generated keys are one time keys and they will expire immediately after they are used for creating\n                    an\n                    account. Additionally, each key will automatically expire 10 days from its generation, and it can\n                    not be used anymore.\n                    If you share a key with someone and you later change your mind about it, you can\n                    still invalidate that key <span class=\"text-warning\">(only if it is not yet used)</span>.\n                </p>\n            </div>\n            <div class=\"panel-footer\">\n                <ul class=\"nav nav-tabs\">\n                    <li id=\"allKeysTab\" class=\"active\">\n                        <a href=\"#invite/index\"\n                           onclick=\"pageshare.inviteView.filterByStatus(event,'all')\">All</a>\n                    </li>\n                    <li id=\"validKeysTab\">\n                        <a href=\"#invite/index\"\n                           onclick=\"pageshare.inviteView.filterByStatus(event,'valid-key')\">Valid</a>\n                    </li>\n                    <li id=\"reservedKeysTab\">\n                        <a href=\"#invite/index\"\n                           onclick=\"pageshare.inviteView.filterByStatus(event,'reserved-key')\">Reserved</a>\n                    </li>\n                    <li id=\"expiredKeysTab\">\n                        <a href=\"#invite/index\"\n                           onclick=\"pageshare.inviteView.filterByStatus(event,'expired-key')\">Expired</a>\n                    </li>\n                    <div class=\"gen-wait\">\n                        <strong> <span class=\"fa fa-spinner fa-spin\"></span>&nbsp;Generating new keys...</strong>\n                    </div>\n                    <button class=\"btn btn-primary pull-right fa fa-cogs\"\n                            onclick=\"pageshare.inviteView.generateSet()\">&nbsp; Generate new keys\n                    </button>\n                </ul>\n\n            </div>\n        </div>\n    </div>\n    <div class=\"main col-md-12\">\n    </div>\n</div>\n";
},"useData":true});

this["awr"]["app"]["templates"]["assets/modules/mainHeader/mainHeader.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                        "
    + container.escapeExpression(((helper = (helper = helpers.bookName || (depth0 != null ? depth0.bookName : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"bookName","hash":{},"data":data}) : helper)))
    + "\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "                        PageShare\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<div class=\"navbar-fake\"></div>\n<div class=\"navbar navbar-fixed-top\">\n\n    <div class=\"navbar-inner\" id=\"top-header\">\n        <div class=\"container-fluid\">\n            <div class=\"premium-background\">\n            </div>\n            <div id=\"mainlogo\" class=\"brand oo-ui-iconElement\">\n                <!--<a id='mainLogoImg' href=\""
    + container.escapeExpression(((helper = (helper = helpers.frontPageLink || (depth0 != null ? depth0.frontPageLink : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"frontPageLink","hash":{},"data":data}) : helper)))
    + "\"></a>-->\n                <a id='mainLogoImg' awr-link=\"#c/index\"></a>\n                <div class=\"premium-logo visible-premium\">\n                    <div class=\"strong\">\n                        <div class=\"first\">Page</div>\n                        <div class=\"second\">Share</div>\n                    </div>\n                    <div class=\"band\">\n                        <small class=\"label label-primary\">Premium</small>\n                    </div>\n                </div>\n                <div class=\"text visible-freemium\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.hasBookName : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "                </div>\n                <span class=\"arrows visible-freemium\">\n                    <span class=\"oo-ui-iconElement-icon oo-ui-icon-caretDown openArrow visible-freemium\">\n                    </span>\n                    <span class=\"oo-ui-iconElement-icon oo-ui-icon-caretUp closeArrow visible-freemium\"></span>\n                </span>\n            </div>\n            <div class=\"visible-premium\">\n                <div id=\"linkBarToggle\" class=\"btn btn-default visible-xs awr-btn-group\"\n                     awr-class-remove=\"#userNav:in-search\">\n                    <div>\n                        <span class=\"fa fa-bars fa-3x\"></span>\n                        <span class=\"fa fa-bars fa-3x\"></span>\n                    </div>\n\n                </div>\n            </div>\n            <nav id=\"linkBar\" class=\"navbar-inner navbar-default visible-premium\">\n\n                <ul class=\"navbar-nav hidden-xs\">\n                    <li class=\"nav-item awr-active\">\n                        <a class=\"nav-link\" href=\"#\">Read <span class=\"sr-only\">(current)</span></a>\n                    </li>\n                    <!--<li class=\"nav-item\">-->\n                    <!--<a class=\"nav-link\" href=\"#\">Principles</a>-->\n                    <!--</li>-->\n                    <!--<li class=\"nav-item\">-->\n                    <!--<a class=\"nav-link\" href=\"#\">Free Software</a>-->\n                    <!--</li>-->\n                    <li class=\"nav-item\">\n                        <a class=\"nav-link\" href=\"#\">Collections</a>\n                    </li>\n                </ul>\n            </nav>\n            <div id=\"userNavContainer\">\n\n            </div>\n            <div id=\"sidebarToggleContainer\">\n                <div class=\"link-element no-underline\" id=\"sidebar-toggle\">\n                    <span class=\"bar\"></span>\n                    <span class=\"bar\"></span>\n                    <span class=\"bar\"></span>\n                </div>\n            </div>\n\n        </div>\n\n    </div>\n\n</div>";
},"useData":true});

this["awr"]["app"]["templates"]["assets/modules/mainMenu/mainMenu.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "                    <li class=\"c-edit\"><span class=\"fa fa-edit\"\n                                             awr-link=\"#collections/edit?view=index\">&nbsp;&nbsp;Edit collections</span>\n                    </li>\n\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "                    <li class=\"no-c-edit\"></li>\n\n";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                    <li class=\"c-item "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.isSelected : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" data-c-id=\""
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n                        <a href=\"/app#\" awr-link=\"/app#c/"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</a><span\n                            class=\"badge\">"
    + alias4(((helper = (helper = helpers.$$visibleDocCount$$ || (depth0 != null ? depth0.$$visibleDocCount$$ : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"$$visibleDocCount$$","hash":{},"data":data}) : helper)))
    + "</span></li>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "selected";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<div class=\"menu-content\">\n    <ul>\n        <li class=\"scroll_to_top\"><a href=\"/app#\" onclick=\"pageshare.mainMenu.menuAction(event,'scroll')\">Scroll to\n            top</a>\n        </li>\n        <li class=\"\"><a href=\"/app#\" onclick=\"pageshare.mainMenu.menuAction(event,'freeSoftware')\">Free software\n            (github.com)</a></li>\n        <li class=\"\"><a href=\"/app#\" onclick=\"pageshare.mainMenu.menuAction(event,'principles')\">Principles</a></li>\n        <li class=\"collections parent open\"><a href=\"/app#\"\n                                               onclick=\"pageshare.mainMenu.menuAction(event,'collections')\">Collections\n            <svg class=\"arrow\" viewBox=\"0 0 64 64\">\n                <path id=\"arrow-right\" d=\"M19.203 17.28l-0.003 29.44 25.6-14.72z\"></path>\n            </svg>\n        </a>\n            <ul class=\"c-container\">\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.userExist : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.collections : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </ul>\n            <!-- comment -->\n        </li>\n    </ul>\n</div>";
},"useData":true});

this["awr"]["app"]["templates"]["assets/modules/searchBar/searchBar.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"search-bar visible-premium\">\n    <form class=\"navbar-form\" role=\"search\">\n        <div class=\"input-group add-on\">\n            <input class=\"form-control\" placeholder=\"Search\" name=\"srch-term\" id=\"srch-term\" type=\"text\">\n            <div class=\"input-group-btn\">\n                <button class=\"btn btn-default\" type=\"submit\"><i class=\"fa fa-search\"></i></button>\n            </div>\n        </div>\n    </form>\n</div>";
},"useData":true});

this["awr"]["app"]["templates"]["assets/modules/shelfCtrl/shelf.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "editable ";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "            <div class=\"cover thumbnail "
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.isSelected : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"\n                 data-book-name=\""
    + alias2(alias1((depth0 != null ? depth0.book_name : depth0), depth0))
    + "\"\n                 data-book-id=\""
    + alias2(alias1((depth0 != null ? depth0.id : depth0), depth0))
    + "\"\n                 title=\""
    + alias2(alias1((depth0 != null ? depth0.book_name : depth0), depth0))
    + "\"\n                 awr-link=\""
    + alias2(alias1((depth0 != null ? depth0.uiLink : depth0), depth0))
    + "\">\n                <!-- The \"Cover\" -->\n                <img class=\"cover-img\" src=\""
    + alias2(alias1((depth0 != null ? depth0.file_url_cover : depth0), depth0))
    + "\" alt=\"\"/>\n                <div class=\"caption loading\">\n                    <h3 class=\"title\">"
    + alias2(alias1((depth0 != null ? depth0.book_name : depth0), depth0))
    + "</h3>\n                    <span class=\"fa fa-2x fa-eye-slash forbidden\" data-toggle=\"tooltip\" title=\"Private Document\">&nbsp;</span>\n                    <span class=\"fa fa-clock-o loading\">&nbsp;Loading...</span>\n                    <span class=\"fa fa-clock-o working\">&nbsp;Processing...</span>\n                </div>\n                <div class=\"icons\">\n                    <span class=\"fa fa-2x fa-unlock admin-only\" data-toggle=\"tooltip\" title=\"Visible for admin\">&nbsp;admin</span>\n                </div>\n            </div>\n";
},"4":function(container,depth0,helpers,partials,data) {
    return "selected ";
},"6":function(container,depth0,helpers,partials,data) {
    var helper;

  return "            <a class=\"popUnder\" href=\"#\" awr-link=\"#collection/"
    + container.escapeExpression(((helper = (helper = helpers.shelf_id || (depth0 != null ? depth0.shelf_id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"shelf_id","hash":{},"data":data}) : helper)))
    + "/add\">\n                <div class=\"cover add-book thumbnail\"><span>+</span></div>\n            </a>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<!-- Container -->\n<div>\n    <div id=\"shelf\" class=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.shelf_editable : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\" data-shelf-id=\""
    + container.escapeExpression(((helper = (helper = helpers.shelf_id || (depth0 != null ? depth0.shelf_id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"shelf_id","hash":{},"data":data}) : helper)))
    + "\">\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.docs : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.shelf_editable : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        <div class=\"coll-owner-info hidden\"><span class=\"fa fa-remove\"></span>\n            <div class=\"cont\"><span class=\"fa fa-exclamation-triangle\"></span><span>&nbsp;This collection is owned<br> by another user!</span></div></div>\n    </div>\n    <hr class=\"book-content-separator\"/>\n</div>\n\n";
},"useData":true});

this["awr"]["app"]["templates"]["assets/modules/tagSearch/resultGroup.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "        <!--<h4>result sub group</h4>-->\n        <div class=\"cover thumbnail\" data-book-name=\""
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.book_name : stack1), depth0))
    + "\" data-book-id=\""
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.id : stack1), depth0))
    + "\"\n             title=\""
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.book_name : stack1), depth0))
    + "\">\n            <!-- The \"Cover\" -->\n            <img class=\"cover-img\" src=\""
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.file_url_cover : stack1), depth0))
    + "\" alt=\"\" style=\"display: inline;\">\n            <div class=\"caption loading\" style=\"display: none;\">\n                <h3 class=\"title\">"
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? stack1.book_name : stack1), depth0))
    + "</h3>\n                <span class=\"fa fa-clock-o loading\">&nbsp;Loading...</span>\n                <span class=\"fa fa-clock-o working\">&nbsp;Processing...</span>\n            </div>\n        </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"result-group "
    + alias4(((helper = (helper = helpers.sortMode || (depth0 != null ? depth0.sortMode : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"sortMode","hash":{},"data":data,"blockParams":blockParams}) : helper)))
    + "\">\n    <h1>"
    + alias4(((helper = (helper = helpers.groupName || (depth0 != null ? depth0.groupName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"groupName","hash":{},"data":data,"blockParams":blockParams}) : helper)))
    + "</h1>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.results : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true,"useBlockParams":true});

this["awr"]["app"]["templates"]["assets/modules/tagSearch/tagSearch.hbs"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                    Search results for:\n                    <small>"
    + container.escapeExpression(((helper = (helper = helpers.searchTitle || (depth0 != null ? depth0.searchTitle : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"searchTitle","hash":{},"data":data}) : helper)))
    + "</small>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "                    Search results:\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"doc-search col-md-10 col-lg-10 col-md-offset-1\">\n    <div class=\"results-header\">\n        <div class=\"title\">\n\n            <h3 class=\"text-info\">\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.searchTitle : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "\n            </h3>\n        </div>\n        <div class=\"tools\">\n            <div class=\"icon-group lg-mode hidden-xs hidden-sm\" onclick=\"pageshare.tagSearch.resizeView('large')\">\n                <span class=\"fa fa-th-large \"></span>\n                <span class=\"fa fa-square\"></span>\n            </div>\n            <div class=\"icon-group md-mode selected\" onclick=\"pageshare.tagSearch.resizeView('medium')\">\n                <span class=\"fa fa-th\"></span>\n                <span class=\"fa fa-square half\"></span>\n            </div>\n\n        </div>\n    </div>\n\n\n    <div class=\"main\">\n        <div class=\"results-main medium\">\n            <div class=\"content\">\n\n            </div>\n        </div>\n\n        <div class=\"preview-main loading empty\">\n            <h4 class=\"wait-msg text-info\"><span class=\"fa fa-spinner fa-spin\"></span>&nbsp;Loading preview...</h4>\n            <h4 class=\"searching-msg text-info\"><span class=\"fa fa-spinner fa-spin\"></span>&nbsp;Searching...</h4>\n            <div class=\"content\"></div>\n        </div>\n    </div>\n\n</div>";
},"useData":true});

this["awr"]["app"]["templates"]["assets/modules/userNav/userNav.hbs"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div id=\"userNav\" class=\"visible-premium\">\n\n    <input type=\"text\" id=\"topSmSearchField\" placeholder=\"Search\" class=\"\">\n    <div class=\"search-btn awr-btn-group\" awr-class-toggle=\"#userNav:in-search\">\n        <spa class=\"awr-clickable fa fa-search\"></spa>\n    </div>\n    <div class=\"addons\">\n        <div class=\"notif\">\n            <div class=\"notif-btn\">\n                <spa class=\"awr-clickable fa fa-bell\"></spa>\n            </div>\n        </div>\n    </div>\n    <div class=\"nav-title fa fa-user "
    + alias4(((helper = (helper = helpers.userClass || (depth0 != null ? depth0.userClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"userClass","hash":{},"data":data}) : helper)))
    + "\" onclick=\"pageshare.userNav.toggleInfo()\">\n        <span class=\"user-name\">"
    + alias4(((helper = (helper = helpers.userName || (depth0 != null ? depth0.userName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"userName","hash":{},"data":data}) : helper)))
    + "</span>\n        <span class=\"arrow-down pull-right\"></span>\n    </div>\n    <div class=\""
    + alias4(((helper = (helper = helpers.loginClass || (depth0 != null ? depth0.loginClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"loginClass","hash":{},"data":data}) : helper)))
    + " visible-premium\">\n        <div class=\"nav-title fa fa-user\" onclick=\"pageshare.userNav.toggleInfo()\">\n            <span class=\"user-name hidden-xs hidden-sm\">Guest</span>\n            <span class=\"arrow-down pull-right\"></span>\n        </div>\n    </div>\n    <div class=\"user-info out "
    + alias4(((helper = (helper = helpers.userLevel || (depth0 != null ? depth0.userLevel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"userLevel","hash":{},"data":data}) : helper)))
    + "\" id=\"userNavInfo\">\n        <div class=\"arrow-up\"></div>\n        <div class=\""
    + alias4(((helper = (helper = helpers.loginClass || (depth0 != null ? depth0.loginClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"loginClass","hash":{},"data":data}) : helper)))
    + "\">\n            <div class=\"header\">\n                <button class=\"btn btn-default\"\n                        onclick=\"pageshare.activeLogin.login()\">Sign in\n                </button>\n                <button class=\"btn btn-default pull-right signup\"\n                        onclick=\"pageshare.easySignup.start()\">Sign up\n                </button>\n            </div>\n        </div>\n\n            <div class=\""
    + alias4(((helper = (helper = helpers.logoutClass || (depth0 != null ? depth0.logoutClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"logoutClass","hash":{},"data":data}) : helper)))
    + "\">\n\n                <div class=\"header\">\n                    <span class=\"email\">"
    + alias4(((helper = (helper = helpers.userEmail || (depth0 != null ? depth0.userEmail : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"userEmail","hash":{},"data":data}) : helper)))
    + "</span>\n                    <small class=\"user-role hidden\">Admin</small>\n                </div>\n                <div class=\"content col-md-12\">\n                    <div class=\"icon-container\">\n                        <!--<span></span>-->\n                        <span class=\"fa fa-user fa-3x\"></span>\n                        <span class=\"fa fa-4x admin hidden\">&#9819;</span>\n                    </div>\n                    <div class=\"data-container\">\n                        <span class=\"name\">"
    + alias4(((helper = (helper = helpers.fullName || (depth0 != null ? depth0.fullName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fullName","hash":{},"data":data}) : helper)))
    + " </span>\n                        <button class=\"profile btn btn-default pull-left "
    + alias4(((helper = (helper = helpers.logoutClass || (depth0 != null ? depth0.logoutClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"logoutClass","hash":{},"data":data}) : helper)))
    + "\"\n                                onclick=\"\"><span class=\"fa fa-edit\"></span> Profile\n                        </button>\n                    </div>\n\n                </div>\n                <div class=\"last-login\">\n                    <small>Last log in at "
    + alias4(((helper = (helper = helpers.lastLogin || (depth0 != null ? depth0.lastLogin : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"lastLogin","hash":{},"data":data}) : helper)))
    + ".</small>\n                </div>\n                <div class=\"footer\">\n                    <button id=\"inviteButton\" class=\"btn btn-default pull-left hidden\" awr-link=\"#invite/index\">Invite\n                    </button>\n                    <button class=\"sign-out btn btn-default pull-right "
    + alias4(((helper = (helper = helpers.logoutClass || (depth0 != null ? depth0.logoutClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"logoutClass","hash":{},"data":data}) : helper)))
    + "\"\n                            onclick=\"pageshare.activeLogin.logout()\">Sign out\n                    </button>\n                </div>\n\n\n            </div>\n\n\n    </div>\n</div>";
},"useData":true});