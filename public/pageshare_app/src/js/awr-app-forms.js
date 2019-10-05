!(function (window, $) {
   'use strict';

   window.awr = window.awr || {};
   window.awr.bootQueue = window.awr.bootQueue || [];
   window.awr.$appFormRegistry = [{
  "name": "doc_form",
  "contextName": "doc",
  "setName": "docFormFields",
  "maxSteps": 2,
  "fields": [
    {
      "type": "input",
      "label": "title",
      "icon": "",
      "cssClass": "",
      "validationMessage": "The title is required. (length > 4)",
      "key": "title",
      "elementAttrs": "type=text min=4",
      "validator": "string",
      "placeholder": "Enter title",
      "step": 0
    },
    {
      "title": "Details",
      "type": "textarea",
      "label": "summary",
      "icon": "",
      "cssClass": "",
      "parentCssClass": "summary-parent",
      "validationMessage": "",
      "key": "summary",
      "elementAttrs": "",
      "validator": "",
      "placeholder": "Enter summary ( optional )",
      "step": 0
    },
    {
      "type": "tag-field",
      "icon": "",
      "label": "Authors:",
      "cssClass": "",
      "validationMessage": "At least one author is required",
      "key": "authors",
      "elementAttrs": "",
      "validator": "",
      "placeholder": "Add author",
      "step": 0
    },
    {
      "type": "tag-field",
      "icon": "",
      "label": "Languages:",
      "cssClass": "",
      "parentCssClass": "lang-parent",
      "validationMessage": "At least one language is required",
      "key": "languages",
      "elementAttrs": "",
      "validator": "",
      "placeholder": "Add language",
      "step": 0
    },
    {
      "type": "select",
      "label": "Year of publication:",
      "icon": "",
      "cssClass": "",
      "parentCssClass": "year-parent",
      "validationMessage": "Year of publication is required",
      "key": "year",
      "elementAttrs": "",
      "validator": "",
      "placeholder": "",
      "step": 0,
      "options": []
    },
    {
      "type": "tag-field",
      "icon": "",
      "label": "tags:",
      "cssClass": "",
      "parentCssClass": "tags-parent",
      "validationMessage": "",
      "key": "tags",
      "elementAttrs": "",
      "validator": "",
      "placeholder": "Add tag",
      "step": 0
    },
    {
      "type": "tag-field",
      "icon": "",
      "label": "Categories:",
      "cssClass": "",
      "validationMessage": "",
      "key": "categories",
      "elementAttrs": "",
      "validator": "",
      "placeholder": "Add category",
      "step": 0
    },
    {
      "title": "Publication options",
      "type": "checkbox",
      "label": "public",
      "icon": "",
      "cssClass": "",
      "key": "status",
      "elementAttrs": "",
      "validator": "",
      "step": 1
    },
    {
      "type": "checkbox",
      "label": "Display in aggregated collections and search results",
      "icon": "",
      "cssClass": "",
      "key": "allow_aggregating",
      "elementAttrs": "",
      "validator": "",
      "step": 1
    },
    {
      "title": "URLs",
      "type": "input",
      "label": "meme:",
      "icon": "",
      "cssClass": "",
      "parentCssClass": "urls-parent",
      "validationMessage": "A valid URL is required",
      "key": "meme",
      "elementAttrs": "",
      "validator": "optionalUrlValidator",
      "placeholder": "Enter URL",
      "step": 1
    },
    {
      "type": "input",
      "label": "print:",
      "icon": "",
      "cssClass": "",
      "validationMessage": "A valid URL is required",
      "key": "print",
      "elementAttrs": "",
      "validator": "optionalUrlValidator",
      "placeholder": "Enter URL",
      "step": 1
    },
    {
      "type": "input",
      "label": "designs:",
      "icon": "",
      "cssClass": "",
      "validationMessage": "A valid URL is required",
      "key": "designs",
      "elementAttrs": "",
      "validator": "optionalUrlValidator",
      "placeholder": "Enter URL",
      "step": 1
    },
    {
      "title": "Files",
      "type": "pretty-file",
      "icon": "",
      "cssClass": "",
      "validationMessage": "A PDF file is required.",
      "key": "pdf",
      "elementAttrs": "",
      "validator": "pdfValidator",
      "placeholder": "",
      "step": 2,
      "showFileSize": true,
      "label": "PDF:"
    },
    {
      "type": "pretty-file",
      "icon": "",
      "cssClass": "",
      "parentCssClass": "epub-parent",
      "validationMessage": "An ePub file is required.",
      "key": "epub",
      "elementAttrs": "",
      "validator": "epubValidator",
      "showFileSize": true,
      "placeholder": "",
      "step": 2,
      "label": "ePub:"
    }
  ]
},
{
  "name": "invite-form",
  "contextName": "inviteFormContext",
  "setName": "inviteFormFields",
  "maxSteps": 0,
  "fields": [
    {
      "type": "input",
      "key": "name",
      "icon": "",
      "cssClass": "",
      "validationMessage": "The name is required. ( length >= 3 )",
      "elementAttrs": "type=text min=3",
      "validator": "string",
      "placeholder": "Name",
      "step": 0
    },
    {
      "type": "input",
      "key": "email",
      "icon": "",
      "cssClass": "",
      "parentCssClass": "",
      "validationMessage": "The email is required. ( person@example.com )",
      "elementAttrs": "type=email",
      "validator": "email",
      "placeholder": "Email",
      "step": 0
    },
    {
      "type": "textarea",
      "key": "invite_text",
      "icon": "",
      "cssClass": "",
      "parentCssClass": "",
      "elementAttrs": "",
      "validationMessage": "",
      "validator": "",
      "placeholder": "Send a message with your invitation...",
      "step": 0
    }
  ]
},
{
  "name": "edit_form",
  "contextName": "doc",
  "setName": "editFormFields",
  "maxSteps":0,
  "fields": [
    {
      "type": "textarea",
      "label": "",
      "icon": "",
      "cssClass": "",
      "validationMessage": "The title is required. (length > 4)",
      "key": "title",
      "elementAttrs": "type=text min=4",
      "validator": "string",
      "placeholder": "Enter title",
      "step": 0
    },
    {
      "title": "Details",
      "type": "textarea",
      "label": "summary",
      "icon": "",
      "cssClass": "",
      "parentCssClass": "summary-parent",
      "validationMessage": "",
      "key": "summary",
      "elementAttrs": "",
      "validator": "",
      "placeholder": "Enter summary ( optional )",
      "step": 0
    },
    {
      "type": "tag-field",
      "icon": "",
      "label": "Authors",
      "cssClass": "",
      "validationMessage": "At least one author is required",
      "key": "authors",
      "elementAttrs": "",
      "validator": "",
      "placeholder": "Add author",
      "step": 0
    },
    {
      "type": "tag-field",
      "icon": "",
      "label": "Languages",
      "cssClass": "",
      "parentCssClass": "lang-parent",
      "validationMessage": "At least one language is required",
      "key": "languages",
      "elementAttrs": "",
      "validator": "",
      "placeholder": "Add language",
      "step": 0
    },
    {
      "type": "select",
      "label": "Year of publication",
      "icon": "",
      "cssClass": "",
      "parentCssClass": "year-parent",
      "validationMessage": "Year of publication is required",
      "key": "year",
      "elementAttrs": "",
      "validator": "",
      "placeholder": "",
      "step": 0,
      "options": []
    },
    {
      "type": "tag-field",
      "icon": "",
      "label": "tags",
      "cssClass": "",
      "parentCssClass": "tags-parent",
      "validationMessage": "",
      "key": "tags",
      "elementAttrs": "",
      "validator": "",
      "placeholder": "Add tag",
      "step": 0
    },
    {
      "type": "tag-field",
      "icon": "",
      "label": "Categories",
      "cssClass": "",
      "validationMessage": "",
      "key": "categories",
      "elementAttrs": "",
      "validator": "",
      "placeholder": "Add category",
      "step": 0
    },
    {
      "title": "Publication options",
      "type": "checkbox",
      "label": "public",
      "icon": "",
      "cssClass": "",
      "key": "status",
      "elementAttrs": "",
      "validator": "",
      "step": 0
    },
    {
      "type": "checkbox",
      "label": "Display in aggregated collections and search results",
      "icon": "",
      "cssClass": "",
      "key": "allow_aggregating",
      "elementAttrs": "",
      "validator": "",
      "step": 0
    },
    {
      "title": "URLs",
      "type": "input",
      "label": "meme",
      "icon": "",
      "cssClass": "",
      "parentCssClass": "urls-parent",
      "validationMessage": "A valid URL is required",
      "key": "meme",
      "elementAttrs": "",
      "validator": "optionalUrl",
      "placeholder": "Enter URL",
      "step": 0
    },
    {
      "type": "input",
      "label": "print",
      "icon": "",
      "cssClass": "",
      "parentCssClass": "urls-parent",
      "validationMessage": "A valid URL is required",
      "key": "print",
      "elementAttrs": "",
      "validator": "optionalUrl",
      "placeholder": "Enter URL",
      "step": 0
    },
    {
      "type": "input",
      "label": "designs",
      "icon": "",
      "cssClass": "",
      "parentCssClass": "urls-parent",
      "validationMessage": "A valid URL is required",
      "key": "designs",
      "elementAttrs": "",
      "validator": "optionalUrl",
      "placeholder": "Enter URL",
      "step": 0
    },
    {
      "title": "Files",
      "type": "pretty-file",
      "icon": "",
      "cssClass": "",
      "validationMessage": "A PDF file is required.",
      "key": "pdf",
      "elementAttrs": "",
      "validator": "pdf",
      "placeholder": "",
      "step": 0,
      "showFileSize": true,
      "label": "PDF"
    },
    {
      "type": "pretty-file",
      "icon": "",
      "cssClass": "",
      "parentCssClass": "epub-parent",
      "validationMessage": "An ePub file is required.",
      "key": "epub",
      "elementAttrs": "",
      "validator": "epub",
      "showFileSize": true,
      "placeholder": "",
      "step": 0,
      "label": "ePub"
    }
  ]
},
{
  "name": "publisher-form",
  "contextName": "publisherFormContext",
  "setName": "publisherFormFields",
  "maxSteps": 0,
  "fields": [
    {
      "type": "input",
      "key": "name",
      "title":"Create a new publisher",
      "label":"Publisher name:",
      "icon": "fas fa-building",
      "cssClass": "",
      "validationMessage": "The title is required. (length > 6)",
      "elementAttrs": "type=text min=6",
      "validator": "string",
      "placeholder": "Enter name",
      "step": 0
    },
    {
      "type": "textarea",
      "key": "description",
      "label": "Publisher description:",
      "icon": "",
      "cssClass": "",
      "parentCssClass": "",
      "elementAttrs": "",
      "validationMessage": "",
      "validator": "",
      "placeholder": "Enter text",
      "step": 0
    }
  ]
},
{
  "$$name$$":"__$$null_placeholder$$__"
},{"$$name$$":"$$null$$"}];

})(window, jQuery);