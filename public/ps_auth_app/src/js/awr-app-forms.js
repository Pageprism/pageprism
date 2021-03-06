!(function (window, $) {
   'use strict';

   window.awr = window.awr || {};
   window.awr.bootQueue = window.awr.bootQueue || [];
   window.awr.$appFormRegistry = [{
  "name": "change-password-form",
  "contextName": "changePasswordFormContext",
  "setName": "changePasswordFormFields",
  "maxSteps": 0,
  "fields": [
    {
      "title":"Change your password",
      "type": "input",
      "icon": "fas fa-key",
      "validationMessage": "Password is too weak and can't be accepted",
      "key": "password",
      "elementAttrs": "type=password min=6",
      "validator": "password",
      "placeholder": "enter password",
      "label": "password",
      "step": 0
    },
    {
      "type": "input",
      "icon": "fas fa-key",
      "validationMessage": "New password should match with the password confirm",
      "key": "passwordConfirm",
      "elementAttrs": "type=password min=6",
      "validator": "passwordConfirm",
      "placeholder": "confirm password",
      "label": "confirm password",
      "step": 0
    }
  ]
},
{
  "name": "sign-in-form",
  "contextName": "signInFormContext",
  "setName": "signInFormFields",
  "maxSteps": 0,
  "fields": [
    {
      "title":"Sign in",
      "description":"Use your Pageshare account",
      "type": "input",
      "key": "email",
      "label":"",
      "icon": "fas fa-envelope-open",
      "cssClass": "",
      "parentCssClass": "",
      "validationMessage": "The email is required. (some@example.com)",
      "elementAttrs": "type=email",
      "validator": "email",
      "placeholder": "Email",
      "step": 0
    },
    {
      "type": "password",
      "key": "password",
      "label":"",
      "icon": "fas fa-key",
      "cssClass": "",
      "parentCssClass": "",
      "validationMessage": "The password is required.",
      "elementAttrs": "type=text",
      "validator": "",
      "placeholder": "Password",
      "step": 0
    },
    {
      "type": "checkbox",
      "key": "remember",
      "label": "Trust this device",
      "icon": "",
      "cssClass": "",
      "validationMessage": "",
      "elementAttrs": "",
      "step": 0
    }
  ]
},
{
  "name": "sign-up-form",
  "contextName": "signUpFormContext",
  "setName": "signUpFormFields",
  "maxSteps": 0,
  "fields": [
    {
      "title": "Sign up",
      "description": "Create a Pageshare account",
      "type": "input",
      "icon": "fas fa-user",
      "validationMessage": "The name is required. (length > 2)",
      "key": "name",
      "elementAttrs": "type=text min=3",
      "validator": "string",
      "placeholder": "Name *",
      "step": 0
    },
    {
      "type": "input",
      "key": "email",
      "label": "",
      "icon": "fas fa-envelope-open",
      "cssClass": "",
      "parentCssClass": "",
      "validationMessage": "The email is required. (some@example.com)",
      "elementAttrs": "type=email",
      "validator": "email",
      "placeholder": "Email *",
      "step": 0
    },
    {
      "type": "input",
      "icon": "fas fa-phone",
      "validationMessage": "Valid format is required. (ex. +358-4398123)",
      "key": "phone",
      "elementAttrs": "type=text",
      "validator": "optionalPhone",
      "placeholder": "phone ( optional ) ",
      "step": 0
    },
    {
      "type": "password",
      "key": "password",
      "label": "",
      "icon": "fas fa-key",
      "cssClass": "",
      "parentCssClass": "",
      "validationMessage": "The password is required.",
      "elementAttrs": "type=text",
      "validator": "password",
      "placeholder": "Password *",
      "step": 0
    },
    {
      "type": "input",
      "icon": "fas fa-key",
      "validationMessage": "Password should match with the password confirm",
      "key": "passwordConfirm",
      "elementAttrs": "type=password",
      "validator": "passwordConfirm",
      "placeholder": "confirm password *",
      "step": 0
    },
    {
      "type": "checkbox",
      "key": "acceptTerms",
      "title": "Do you agree to our terms?",
      "description": "Please make sure that you read our terms of services carefully.",
      "label": "I agree to the $terms of services",
      "icon": "",
      "cssClass": "",
      "validationMessage": "Terms must be accepted",
      "validator":"acceptTerms",
      "elementAttrs": "",
      "step": 0,
      "labelLinks": [
        {
          "key": "$terms",
          "value": "terms",
          "link": "action:openPrivacyPolicy"
        }
      ]
    }
  ]
},
{
  "name": "forgotPassword",
  "contextName": "forgotPass",
  "setName": "forgotPassFields",
  "fields": [
    {
      "type": "input",
      "icon": "far fa-envelope-open",
      "validationMessage": "A valid email address is required.",
      "key": "email",
      "elementAttrs": "type=email",
      "validator": "email",
      "placeholder": "email"
    }
  ]
},
{
  "$$name$$":"__$$null_placeholder$$__"
},{"$$name$$":"$$null$$"}];

})(window, jQuery);