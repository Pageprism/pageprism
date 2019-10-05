!function (window, $) {
  'use strict';

  window.awr = window.awr || {};
  window.awr.bootQueue = window.awr.bootQueue || [];
  var console = window.console;

  function $abstract(name) {
    return awr.Q.$abstract.call(awr.Q, name);
  }

  function $app() {
    let sta = window.awr.$static;
    return sta.$app();
  }

  function $export(path, exp, opts) {
    opts = opts || {
      takeEasy: true,
      appExport: true
    };
    let sta = window.awr.$static,
        q = window.awr.Q;
    opts.appExport = true;
    opts.takeEasy = q.$booleanFalse(opts.takeEasy);
    return sta.$export(path, exp, opts);
  }

  function $import(ref) {
    let sta = window.awr.$static;
    return sta.$import(ref);
  }

  function $available(ref) {
    let sta = window.awr.$static;
    return sta.$available(ref);
  }

  function $on(eventStr, fn, listenerId) {
    let sta = window.awr.$static;
    return sta.$on(eventStr, fn, listenerId);
  }

  function $off(eventStr, fn) {
    let sta = window.awr.$static;
    return sta.$off(eventStr, fn);
  }

  function $emit(eventStr, event) {
    let sta = window.awr.$static;
    return sta.$emit(eventStr, event);
  }

  function $getTemplate(path) {
    let sta = window.awr.$static;
    return sta.$getTemplate(path);
  }

  function $exportClass(name, NewClass) {
    let sta = window.awr.$static;
    return sta.$exportClass(name, NewClass);
  }

  function $importClass(className) {
    let sta = window.awr.$static;
    return sta.$importClass(className);
  }

  function __$require__(requires, obj) {
    let sta = window.awr.$static;
    return sta.$require(requires, obj);
  }

  function __$loadErrors__(name) {
    let sta = window.awr.$static,
        isApp = true;
    return sta.$loadErrors(name, isApp);
  }

  function __$errorOut__(errors, errName, replaces) {
    let sta = window.awr.$static;
    return sta.$errorOut(errors, errName, replaces);
  }

  function __onModuleBootTimeoutError__(err) {
    window.console.error('initModule@APP@AWR:' + ' Failed to instantiate app module.' + ' \n\t + Details: Init process interrupted by timeout.' + ' \n\t + Hint: Required components were not ready' + '  before maximum wait time.');
    window.console.error(err);
  }

  function __moduleHasRequires__(requires) {
    return window.awr.Q.$arrayNotEmpty(requires) || window.awr.Q.$objectExist(requires);
  }

  function __callModuleMainFn__(mainFn, requires) {
    try {
      if (typeof mainFn === 'function') {
        if (__moduleHasRequires__(requires)) {
          window.awr.Q.$commonWaitAndProceedOperation(requires, function () {
            mainFn.call(window.awr.Q);
          }, 3000, __onModuleBootTimeoutError__);
        } else {
          mainFn.call(window.awr.Q);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  function __pushToBootQueue__(init) {
    window.awr.bootQueue.push({
      moduleName: 'basicAppModule@AWR',
      requires: ['object:awr.$$appEssentials', 'object:awr.coreTemplate', 'object:awr.ux'],
      wTime: 60 * 60000,
      init: init,
      QAsContext: true
    });
  }

  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class App extends awr.Controller {
        static get $require() {
          return {
            bootRoutines: 'service:appBootRoutines',
            globalFunctions: 'service:globalFunctions',
            remoteConfig: 'config:remoteConnection',
            router: 'service:router',
            modal: 'service:modal',
            socket: 'observable:socket'
          };
        }

        constructor(parent, data) {
          super(App.$require, parent, data);
          let {
            bootRoutines,
            globalFunctions,
            router,
            modal,
            socket,
            docEvents
          } = this,
              scope = this,
              currentState;
          this.$disableDefaultActionAutoRecompile();
          bootRoutines.init(this);
          globalFunctions.attach(this);
          scope.$bind('observable:notFound@states@router', {
            onEvent(event, preventDefault) {
              preventDefault();
              event.preventDefault();
              $emit('collection:events', {
                name: 'new-doc-selected',
                doc: null
              });
              router.$go('errors-view', {
                params: {
                  code: '404'
                },
                attrs: {}
              }, true);
            }

          });
          scope.$bind('observable:authEvents', {
            onEvent(event, preventDefault) {
              preventDefault();
              /*ignoring all auth events during the reloading*/

              if (Q.$booleanTrue(scope.reloading) || !Q.$objectExist(event)) {
                return;
              }

              if (Q.$setContainsString(['sign-in', 'sign-out'], event.type)) {
                bootRoutines.setupCurrentUser(scope);
              }
              /* giving the reloading jobs 1 sec time to properly finish
               * before accepting auth events as new requests */


              scope.reloading = true;
              setTimeout(_ => {
                scope.reloading = false;
              }, 1000);
            }

          });
        }

        openPrivacyPolicy() {
          let {
            modal
          } = this;
          modal.$enter('privacyPolicyModal', {
            modalClass: 'privacy-policy-parent'
          });
        }

      }

      $export(App);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class PassResetKeyCheck extends awr.Resolvable {
        static get $require() {
          return {
            server: 'service:serverCall',
            remoteCnf: 'config:remoteConnection'
          };
        }

        constructor() {
          super(PassResetKeyCheck.$require);
        }

        resolve(state) {
          let {
            server,
            remoteCnf
          } = this;
          return new Promise((resolve, reject) => {
            server.$post({
              url: `${remoteCnf.serverURL}/xauth/check_password_reset_key`,
              data: {
                key: state.params.key
              }
            }).then(res => {
              resolve(true);
            }, err => {
              resolve(false);
            });
          });
        }

      }

      $export(PassResetKeyCheck);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');
      /**
       * This service should be used on the appController and
       * superScope should be provided as the scope.
       */

      class AppBootRoutines extends awr.Service {
        static get $require() {
          return {
            modelManager: 'service:modelManager',
            remoteConfig: 'config:remoteConnection',
            socketClient: 'service:socketClient',
            scrollDirection: 'service:scrollDirection'
          };
        }

        constructor() {
          super(AppBootRoutines.$require);
        }

        init(scope) {
          let {
            modelManager,
            remoteConfig,
            socketClient,
            scrollDirection
          } = this;
          init(scope, modelManager, remoteConfig, socketClient, scrollDirection);
        }

        setupCurrentUser(scope) {
          let {
            remoteConfig,
            socketClient
          } = this;
          console.log(remoteConfig);
          setupCurrentUser(scope, remoteConfig, socketClient);
        }

      }

      $export(AppBootRoutines);

      function init(scope, modelManager, remoteConfig, socketClient, scrollDirection) {
        let globalHeaders = {
          'accept': 'application/json',
          'content-type': 'application/json'
        };
        /*making authorization header as a dynamic get*/

        Object.defineProperty(globalHeaders, 'authorization', {
          get: () => {
            return $import(`token:awr_app_token @decoder: base64:${remoteConfig.decoder}`);
          }
        });
        scope.serverURL = remoteConfig.serverURL;
        scope.appName = 'ps_auth_app';
        modelManager.$setGlobalPrefix(remoteConfig.apiURL);
        modelManager.$setGlobalHeaders(globalHeaders);
        /*this is shared through the app*/

        scope.setCleanUserPictureSrc = user => {
          if (user && Q.$stringExist(user.picture) && user.picture.startsWith('/')) {
            user.picture = `${scope.serverURL}${user.picture}`;
          } // user.picture = null;

        };

        setupCurrentUser(scope, remoteConfig, socketClient);
        initWindowListeners(scope);
        scrollDirection.start($import('object:awr.superScope'));
      }

      function setupCurrentUser(scope, remoteConfig, socketClient) {
        if (Q.$objectExist(remoteConfig.user) && Q.$booleanFalse(remoteConfig.isGuest)) {
          // console.log()
          scope.currentUser = remoteConfig.user;
          scope.currentNickname = Q.$stringExist(scope.currentUser.name) ? scope.currentUser.name.split(' ')[0] : 'anonymous';
          scope.isCurrentAdmin = Q.$arrayNotEmpty(scope.currentUser.roles) ? Q.$reduce(scope.currentUser.roles, nxt => nxt.name === 'moderator').length > 0 : false;

          if (Q.$functionExist(scope.setCleanUserPictureSrc)) {
            scope.setCleanUserPictureSrc(scope.currentUser);
          }

          socketClient.connect();
        } else {
          socketClient.disconnect();
          scope.isGuest = true;
          scope.currentUser = null;
          /*redirect to login view*/
        }
      }

      function initWindowListeners(scope) {
        $(window).on('scroll', function () {});
        $(window.document).on('click', function (event) {
          let onMenu = $(scope.$getDom()).find('.main-menu-expand.on'),
              mainMenuToggle = $(scope.$getDom()).find('.main-menu.menu-toggle'),
              onUserMenu = $(scope.$getDom()).find('.user-menu-expand.on'),
              openPageMenus = $(scope.$getDom()).find('.doc-page .page-menu.on'),
              openDocMenu = $(scope.$getDom()).find('.ps-header.doc-menu-open'),
              docPageActions = $(scope.$getDom()).find('.doc-page .tools .left-actions'),
              tagsSection = $(scope.$getDom()).find('.tags-section'),
              target = event.target;

          if (Q.$isEmpty($(target).closest('.main-menu-expand, .main-menu'))) {
            $(onMenu).animate({
              width: 'hide'
            }, 165, function () {
              $(onMenu).removeClass('on');
              $(mainMenuToggle).removeClass('open');
            });
          }

          if (Q.$isEmpty($(target).closest('.user-menu-expand, .user-menu'))) {
            $(onUserMenu).animate({
              height: 'hide'
            }, 165, function () {
              $(onUserMenu).removeClass('on');
            });
          }

          if (Q.$isEmpty($(target).closest('.tags-section .tag-search, .tag-subscription.search-suggestion'))) {
            $(tagsSection).removeClass('in-search');
          } else if (!Q.$isEmpty(tagsSection)) {
            $(tagsSection).addClass('in-search');
          }

          if (Q.$isEmpty($(target).closest('.doc-page .page-menu'))) {
            $(openPageMenus).removeClass('on');
          }

          if (Q.$isEmpty($(target).closest('.doc-page'))) {
            $(docPageActions).removeClass('on');
          }

          if (Q.$isEmpty($(target).closest('.ps-header .doc-menu, .ps-header .doc-menu-toggle '))) {
            $(scope.$getDom()).find('.ps-header .doc-menu').animate({
              height: 'hide'
            }, 165, function () {
              $(openDocMenu).removeClass('doc-menu-open');
            });
          }
        });
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');

      class AuthRedirector extends awr.Service {
        static get $require() {
          return {
            router: 'service:router',
            remoteCnf: 'config:remoteConnection',
            tokenExchange: 'service:tokenExchange',
            base64: 'service:uriBase64'
          };
        }

        constructor() {
          super(AuthRedirector.$require);
          Object.defineProperty(this, 'superScope', {
            get() {
              return $import('object:awr.superScope');
            }

          });
        }

        makeExternalRedirectURL(next) {
          let {
            router,
            remoteCnf,
            tokenExchange,
            superScope,
            base64
          } = this,
              itType,
              longSavedSessionToken;

          if (!Q.$stringExist(next)) {
            return Promise.reject('bad next');
          }

          next = getCleanNextUrl(next);
          longSavedSessionToken = localStorage.getItem('awr_app_token');
          itType = Q.$stringExist(longSavedSessionToken) && !Q.$stringEqual(longSavedSessionToken, 'null') ? 'long' : 'short'; // appGroup = $('meta[name="awr-app-group"]').first();

          /*passing the exchange token as the < it > value*/

          return new Promise((resolve, reject) => {
            tokenExchange.make().then(exchange => {
              resolve(`${next}it_type=${itType}&it=${base64.encode(exchange.key)}`);
            }, err => {
              console.error(err);
              reject(`${next}it_type=none&it=none`);
            });
          });
        }

        redirect(next) {
          let {
            router,
            remoteCnf,
            tokenExchange,
            superScope,
            base64
          } = this,
              appNext;

          if (!Q.$stringExist(next)) {
            return;
          }

          if (Q.$stringEqual(next, 'default') || next.startsWith('#') || next.startsWith('/#')) {
            // appNext = `/profile/#index/${base64.encode(superScope.currentUser.id)}?v=all&it=none&it_next=none&it_type=none`;
            appNext = `/#v/no_title/none/index?c=index`;
            next = `${remoteCnf.serverURL}/#in/v/no_title/none?c=index&it_next=${base64.encode(appNext)}`;
          }

          this.makeExternalRedirectURL(next).then(url => {
            // console.log('redirecting to ');
            // console.log(url);
            window.location = url;
          }, defaultUrl => {
            // console.log('default url');
            // console.log(defaultUrl);
            window.location = defaultUrl;
          });
        }

        exit(next) {
          let {
            router,
            remoteCnf,
            tokenExchange,
            superScope,
            base64
          } = this;

          if (!Q.$stringExist(next)) {
            return;
          }

          if (next.startsWith('#') || next.startsWith('/#')) {
            next = next.startsWith('/#') ? next : `/${next}`;
            router.$pushStateLink(next);
            return;
          } else if (Q.$stringEqual(next, 'default')) {
            router.$go('default', {
              attrs: {
                view: 'index'
              }
            });
            return;
          }

          window.location = next;
        }

      }

      $export(AuthRedirector);

      function getCleanNextUrl(next) {
        let parts = next.split('?');

        if (parts.length < 2 || parts.length === 2 && !Q.$stringExist(parts[1])) {
          return parts[0] + '?';
        } else if (parts.length > 1 && !parts[1].endsWith('&')) {
          return parts[0] + '?' + parts[1] + '&';
        } else if (parts.length > 1) {
          return parts[0] + '?' + parts[1];
        }

        return null;
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      // let token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImJjYjhkYzA0YWM1MTA0YWZiZGYzOGY2ZGU3ZWNmN2NkOWI4YTk0ZjU2ZWI2YzVlYWI1YzIyZmI3YzE0MDJkNWRhYjk3NmY1ZTY5MDg1OWVmIn0.eyJhdWQiOiIxIiwianRpIjoiYmNiOGRjMDRhYzUxMDRhZmJkZjM4ZjZkZTdlY2Y3Y2Q5YjhhOTRmNTZlYjZjNWVhYjVjMjJmYjdjMTQwMmQ1ZGFiOTc2ZjVlNjkwODU5ZWYiLCJpYXQiOjE1MTM2MjU4MTEsIm5iZiI6MTUxMzYyNTgxMSwiZXhwIjoxNTQ1MTYxODExLCJzdWIiOiIzMjIiLCJzY29wZXMiOltdfQ.wr5r2yPQ1_HwnW6jrcIYQgSb_D_7oqV880LO_aSeqyb53QE4KxhePi3z-OXTtp_vJeBotU30QxLOD2kn_h2T2f2UEWP5W2EhJ92kry-YbhY6s4gHsumZlhGTlLWwWxsVOp0hE_rqcUymyY5leKN5ZfJCeDCBIER4HQhJP9ENTPda5AlKhtxQZqXEyUe-KKT_5jNctWcGlTLo3wCzFkPEkABZeuariBhRvzee3KwP7h7AFwwV__JeV4eB6Cti1qVl272a4sb9CnR_byVXgD-el9Ygf6u57amm3nLS4S7b1w2Tmh797ek-vk6z0kxe6W7ODbkUt8YnLzsuZt4Sg5qliwPAzw3QPhxrskTPZ5uvqDfDPHWpJoEyMTs9QfsrQ045m9LbfGtqlXQkqhru2kk-Jvk-4fselbUJD3vhEB66WUhyKz3ofzrjUJ1yZoVcRICAT0bxP9kaFEYFUiiXbZI21eMNSY7DBl98FOdQg3HRGjG8wdODY_pQGQsP0Ye-nzEBELGbd96ugkM6dwhJBmHNtmsPv6aUNwUFgu8_BTt9KlZGo4NbhePAvFUGqEKFq9sjgYw74gNeN-6zAUt1arqHl6fqXbtaB1GHV_nqGLt2yHws18xGui90eK4OMXoFvuKpem66lXE0NK2rIy3zRgkobEyD3G8jXHrLc-Y9AIMZkN0';
      let awr = window.awr || {},
          Q = awr.Q; // window.emit = t=>{
      //     $emit('auth:events', {
      //         type: t
      //     });
      // };

      class Auth extends awr.Service {
        static get $require() {
          return {
            remoteConnCnf: 'config:remoteConnection',
            server: 'service:serverCall',
            tokenSvc: 'service:token'
          };
        }

        constructor() {
          super(Auth.$require);
        }

        register(data) {
          let {
            remoteConnCnf,
            server,
            tokenSvc
          } = this;
          return server.$post({
            url: `${remoteConnCnf.authURL}/user`,
            data: data
          });
        }

        signOut() {
          let {
            remoteConnCnf,
            server,
            tokenSvc
          } = this,
              token = $import(`token:awr_app_token @decoder: base64:${remoteConnCnf.decoder}`);
          $export('token:awr_app_token', null);
          $export('token:awr_exchange_token', null);
          remoteConnCnf.user = null;
          remoteConnCnf.isGuest = true;
          $emit('auth:events', {
            type: 'sign-out'
          });
          return new Promise((resolve, reject) => {
            tokenSvc.destroyToken(token).then(res => {
              setTimeout(_ => {
                resolve('success');
              }, 250);
            }, err => {
              console.error(err);
              /*no matter what always allow the app to sign out!*/

              setTimeout(_ => {
                resolve(`failed ${err}`);
              }, 250);
            });
          });
        }

        signIn({
          email,
          password,
          remember = false
        }) {
          let {
            remoteConnCnf,
            server,
            tokenSvc
          } = this,
              encoder = remoteConnCnf.encoder;

          let trustVal = '',
              _auth = this,
              token,
              exchangeToken;

          if (!Q.$stringExist(email)) {
            return Promise.reject('Email is required!');
          }

          if (!Q.$stringExist(password)) {
            return Promise.reject('Password is required!');
          }

          if (Q.$booleanTrue(remember)) {
            trustVal = '@remember';
          }

          return new Promise((resolve, reject) => {
            tokenSvc.getNewAccessToken(email, password).then(tokenResult => {
              tokenResult.token_type = Q.$stringExist(tokenResult.token_type) ? tokenResult.token_type : 'Bearer';
              token = `${tokenResult.token_type} ${tokenResult.access_token}`;
              exchangeToken = tokenResult.exchange;
              $export('token:awr_app_token', `${token} ${trustVal} @encoder: base64:${encoder}`); // $export('token:awr_app_token', null);

              if (Q.$stringExist(exchangeToken)) {
                /*saving the exchange tokens always in session storage
                * note: Each exchange token can be used max 1 time
                * so remember remove it always after the first usage*/
                $export('token:awr_exchange_token', `${exchangeToken} @encoder: base64:${encoder}`);
              }

              tokenSvc.getTokenUser(token).then(userResult => {
                remoteConnCnf.user = userResult;
                remoteConnCnf.isGuest = false;
                $emit('auth:events', {
                  type: 'sign-in',
                  user: userResult
                }); // setTimeout(_ => {

                resolve(userResult); // }, 250);
              }, err => {
                if (err.responseJSON) {
                  err = err.responseJSON;
                  err = err.message ? err.message : err;
                }

                reject(err);
              });
            }, err => {
              if (err.responseJSON) {
                err = err.responseJSON;
                err = err.message ? convertGetTokenErrMsg(err.message) : err; // console.log(err);
              }

              reject(err);
            });
          });
        }

      }

      $export(Auth);

      function convertGetTokenErrMsg(msg) {
        let typical1 = "The request is missing a required parameter, includes an invalid parameter value, " + "includes a parameter more than once, or is otherwise malformed.";

        if (msg && msg.indexOf(typical1) >= 0) {
          return "Authorization failed due to missing / bad required email and password fields";
        }

        return msg;
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery'),
          modalEnterTime = 0;
      /**
       * This service creates and attach set of functions meant to be global to the provided scope.
       * Here the ideas that the this is called from the appController and
       * superScope should be provided as the scope.
       */

      class GlobalFunctions extends awr.Service {
        static get $require() {
          return {
            remoteConfig: 'config:remoteConnection',
            router: 'service:router',
            base64: 'service:uriBase64',
            modal: 'service:modal',
            collectionFetcher: 'service:collectionFetcher',
            helper: 'service:globalFnHelper'
          };
        }

        constructor() {
          super(GlobalFunctions.$require);
        }

        attach(scope) {
          attach(scope, this);
        }

      }

      $export(GlobalFunctions);

      function attach(scope, svcContext) {
        let {
          remoteConfig,
          router,
          base64,
          modal,
          collectionFetcher,
          helper
        } = svcContext,

        /*production route config does not use hash but history*/
        hashPrefix = remoteConfig.isDevPort ? '/#' : '/';
        /*we need the return type for these ones*/

        scope.isCollectionMyShelf = collId => {
          if (Q.$functionExist(scope.$preventDefault)) {
            scope.$preventDefault();
          }

          let currentUser = scope.currentUser;
          currentUser.main_series = currentUser && !Q.$isEmpty(currentUser.main_series) ? Q.$asCollection(currentUser.main_series) : Q.$asCollection([]);
          return currentUser.main_series.$count(nxt => nxt.type === 'my_shelf' && nxt.series_id == collId) > 0;
        };
        /*no return type available with these ones*/


        scope.$fn({
          scrollToTop() {
            scope.$preventDefault();
            window.scrollTo(0, 0);
          },

          redirectToAuth(view) {
            scope.$preventDefault();
            let state = router.$getCurrentState(),
                next = state.attrs && Q.$stringExist(state.attrs.next) ? state.attrs.next : 'default';
            view = Q.$stringExist(view) && view === 'signUp' ? 'signup' : 'default';

            if (state.name === 'default' && view === state.attrs.view) {
              return;
            }

            router.$go('default', {
              params: {},
              attrs: {
                next,
                view
              }
            }, true);
          },

          forgotPassword() {
            scope.$preventDefault();
            router.$go('forgot-password-view', {
              params: {},
              attrs: {}
            }, true);
          },

          signOut() {
            scope.$preventDefault();
            router.$destroyAuthSession({
              connectionConfig: $import('config:remoteConnection'),

              onEnterBusyMode(msg) {
                let now = new Date().getTime();
                modalEnterTime = new Date().getTime() + 1000;
                modal.$enter('smallNotifModal', {
                  icon: 'fas fa-circle-notch fa-spin',
                  message: msg
                });
              },

              onExitBusyMode() {
                let now = new Date().getTime();
                setTimeout(_ => {
                  modal.$exit();
                }, now < modalEnterTime ? 500 : 0);
                setTimeout(_ => {
                  router.$reloadCurrentState();
                }, 500);
              }

            });
          },

          openMyShelf() {
            scope.$preventDefault();
            let pivot = null;

            if (this.currentUser && !Q.$isEmpty(this.currentUser.main_series)) {
              pivot = Q.$asCollection(this.currentUser.main_series).$reduce(nxt => nxt.type === 'my_shelf').$first();
            }

            if (Q.$objectExist(pivot)) {
              this.openCollection(pivot.series_id);
            } else {
              modal.$enter('smallNotifModal', {
                icon: 'fa fa-exclamation-triangle text-warning',
                message: 'My Shelf is not available. Please set your main collection first.',
                showRemove: true
              });
            }
          },

          openCollection(collId) {
            scope.$preventDefault();
            let current,
                currentUser = scope.currentUser,
                link;
            current = collectionFetcher.getCurrent();

            if (!Q.$exist(collId)) {
              return;
            }

            if (Q.$objectExist(currentUser) && !currentUser.is_email_confirmed) {
              modal.$enter('smallNotifModal', {
                icon: 'fa fa-exclamation-triangle text-warning',
                message: 'Please confirm your email first.',
                showRemove: true
              });
              return;
            }

            helper.firstDocDataInCollection(collId).then(data => {
              link = `${remoteConfig.serverURL}${hashPrefix}v/${data.docTitle}/${data.docId}?c=index`;
              window.location = link;
            }, err => {
              if (Q.$stringExist(err) && err === 'empty') {
                console.error('Collection is empty');
                link = `${remoteConfig.serverURL}${hashPrefix}errors/e1`;
                window.location = link;
              } else {
                console.error('PS: Failed to open collection');
                console.error(err);
              }
            });
          },

          openMyCollections() {
            scope.$preventDefault();
            let {
              remoteConfig
            } = this,
                currentUser = scope.currentUser;

            if (Q.$objectExist(currentUser) && !currentUser.is_email_confirmed) {
              modal.$enter('smallNotifModal', {
                icon: 'fa fa-exclamation-triangle text-warning',
                message: 'Please confirm your email first.',
                showRemove: true
              });
              return;
            }

            window.location = `${remoteConfig.serverURL}${hashPrefix}my_collections/index`;
          },

          openControls() {
            scope.$preventDefault();
            let {
              remoteConfig
            } = this,
                currentUser = scope.currentUser;

            if (Q.$objectExist(currentUser) && !currentUser.is_email_confirmed) {
              modal.$enter('smallNotifModal', {
                icon: 'fa fa-exclamation-triangle text-warning',
                message: 'Please confirm your email first.',
                showRemove: true
              });
              return;
            }

            window.location = `${remoteConfig.serverURL}${hashPrefix}controls/bookmarks`;
          },

          openPrinciples() {
            scope.$preventDefault();
            helper.findPrinciplesCollId().then(id => {
              this.openCollection(id);
            }, err => {
              console.error(err);
            });
          }

        });
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');

      class TokenExchange extends awr.Service {
        static get $require() {
          return {
            server: 'service:serverCall',
            remoteCnf: 'config:remoteConnectionConfig'
          };
        }

        constructor() {
          super(TokenExchange.$require);
        }

        make() {
          let {
            server,
            remoteCnf
          } = this,
              it,
              appGroup;
          /*passing the exchange token as the < it > value*/
          // it = encodeURIComponent(btoa($import(`token:awr_exchange_token @decoder: base64:${remoteCnf.decoder}`)));

          it = $import(`token:awr_exchange_token @decoder: base64:${remoteCnf.decoder}`);
          /*forgetting it immediately each time after the first use */

          $export(`token:awr_exchange_token`, null);
          /*did user trusted this device for saving the access_token in localStorage?*/

          if (Q.$stringExist(it)) {
            return Promise.resolve({
              key: it,
              expires: 'never'
            });
          }

          appGroup = $('meta[name="awr-app-group"]').first();
          return server.$post({
            url: `${remoteCnf.authURL}/make_exchange`,
            headers: {
              authorization: $import(`token:awr_app_token @decoder: base64:${remoteCnf.decoder}`)
            },
            data: {
              app_group: Q.$arrayNotEmpty(appGroup) ? $(appGroup).attr('content') : 'default'
            }
          });
        }

      }

      $export(TokenExchange); // $export('service:tokenExchange', ['service:serverCall', 'config:remoteConnectionConfig',
      //     function tokenExchangeSvc(server, remoteCnf) {
      //
      //         return {
      //             make() {
      //                 let it, appGroup;
      //
      //                 /*passing the exchange token as the < it > value*/
      //                 // it = encodeURIComponent(btoa($import(`token:awr_exchange_token @decoder: base64:${remoteCnf.decoder}`)));
      //                 it = $import(`token:awr_exchange_token @decoder: base64:${remoteCnf.decoder}`);
      //                 /*forgetting it immediately each time after the first use */
      //                 $export(`token:awr_exchange_token`,null);
      //                 /*did user trusted this device for saving the access_token in localStorage?*/
      //                 if (Q.$stringExist(it)) {
      //                     return Promise.resolve({key: it, expires: 'never'});
      //                 }
      //                 appGroup = $('meta[name="awr-app-group"]').first();
      //                 return server.$post({
      //                     url: `${remoteCnf.authURL}/make_exchange`,
      //                     headers:{
      //                         authorization: $import(`token:awr_app_token @decoder: base64:${remoteCnf.decoder}`)
      //                     },
      //                     data: {
      //                         app_group: Q.$arrayNotEmpty(appGroup) ? $(appGroup).attr('content') : 'default'
      //                     }
      //                 });
      //             }
      //         };
      //     }]);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;
      /**
       *  Documentation here:
       *
       *  Help your teammates to fast learn about your valuable work in here by
       *  providing some useful instruction about your work. For instance, say "why" this module exist
       *  and how it should be used! Documenting your work does not mean writing your code again in English,
       *  they also understand code just like you do!
       */

      class AcceptTerms extends awr.Validator {
        static get $require() {
          return {};
        }

        constructor() {
          super(AcceptTerms.$require);
        }

        isValid(val, elem) {
          return Q.$booleanTrue(val) || parseInt(val) === 1;
        }

      }

      $export(AcceptTerms);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class OptionalPhone extends awr.Validator {
        static get $require() {
          return {
            validator: 'validator:phone'
          };
        }

        constructor() {
          super(OptionalPhone.$require);
        }

        isValid(val, elem) {
          let {
            validator
          } = this;
          return !Q.$stringExist(val) || validator.isValid(val, elem);
        }

      }

      $export(OptionalPhone);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;
      $export('component:passStrength', {
        requires: [],
        template: 'app/components/pass-strength/pass-strength.hbs',
        controller: 'PassStrengthController'
      });

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');
      $export('controller:PassStrengthController', ['service:modal', function passStrengthCtrl(modal) {
        let scope = this;
        scope.$fn({
          showPasswordTip() {
            scope.$preventDefault();
            modal.$enter('passwordInfo');
          }

        });
        scope.$ready(_ => {
          $(scope.$getDom()).addClass('pass-strength-parent');
        });
        scope.$addRecompileListener(_ => {
          $(scope.$getDom()).addClass('pass-strength-parent');
        });
        scope.$getParent().$addValidationListener(v => {
          let degree = 0,
              degElements = $(scope.$getDom()).find('.pass-strength .deg');

          if (!Q.$stringEqual(v.key, 'password')) {
            return;
          }

          $(degElements).addClass('on');
          setTimeout(_ => {
            $(degElements).removeClass('on');
            degree = computeStrength(v.value);

            if (!Q.$booleanTrue(v.isValid)) {
              degree = 0;
            }

            Q.$forEachIndex($(degElements), (el, idx) => {
              if (idx <= degree) {
                $(el).addClass('on');
              }
            });
          }, 150);
        });
      }]);

      function computeStrength(str) {
        /*
        * all credits for th e regex goes to https://dzone.com/articles/use-regex-test-password
        * */
        let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"),
            mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
        /*the result represents max index in deg array */

        return strongRegex.test(str) && str.length >= 15 ? 5 : strongRegex.test(str) && str.length > 10 ? 4 : strongRegex.test(str) ? 3 : mediumRegex.test(str) ? 2 : 1;
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;
      $export('component:passwordInfo', {
        requires: [],
        template: 'app/components/password-info/password-info.hbs',
        controller: 'PasswordInfoController'
      });

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;
      $export('controller:PasswordInfoController', [function passwordInfoCtrl() {
        let scope = this;
      }]);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;
      /**
       *  Documentation here:
       *
       *  Help your teammates to fast learn about your valuable work in here by
       *  providing some useful instruction about your work. For instance, say "why" this module exist
       *  and how it should be used! Documenting your work does not mean writing your code again in English,
       *  they also understand code just like you do!
       */

      class ChangePasswordForm extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(ChangePasswordForm.$require);
          this.template = 'app/forms/change-password-form/change-password-form.hbs';
          this.controller = 'ChangePasswordForm';
        }

      }

      $export(ChangePasswordForm);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, $abstract, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class ChangePasswordForm extends awr.Controller {
        static get $require() {
          return {
            formActivator: 'service:formViewActivator',
            server: 'service:serverCall',
            remoteConfig: 'config:remoteConnectionConfig',
            router: 'service:router'
          };
        }

        constructor(data, parent) {
          super(ChangePasswordForm.$require, data, parent);
          let {
            formActivator,
            server,
            remoteConfig,
            router
          } = this,
              scope = this;
          this.changePasswordFormContext = {};
          Object.defineProperty(this, 'key', {
            get() {
              let state = router.$getCurrentState();
              return state && state.params && state.params.key ? state.params.key : 'none';
            }

          });
          Object.defineProperty(this, 'linkExpired', {
            get() {
              return Q.$objectExist(this.response) && Q.$booleanFalse(this.response.reset_key_accepted);
            }

          });
          formActivator.activate({
            scope,
            form: 'change-password-form',

            /*The selector depends on how the parent input path is.*/
            formInputSelector: '.change-password-form input',

            beforeSetup() {},

            /*
            * context is also available as arg while using
            * scope.changePasswordFormContext is equally fine!
            * */
            onSubmit(changePasswordFormContext) {
              /*
              * The submit is usually what goes towards server
              * Remember to resolve / reject it in order
              * to properly update the view variables.
              * */
              return doPasswordReset({
                scope,
                server,
                remoteConfig,
                formData: changePasswordFormContext,
                key: scope.key
              });
            }

          });
          scope.stepsValidation = [];
          /*
          * The extension will provides set of useful variables and functions
          * which can be used in the controller and in the html template:
          *
          * Helper variables:
          *
          *  step, mode, maxSteps, stepPlus, maxStepPlus, inWorkingMode, inFailMode, inSuccessMode, inDefaultMode
          *
          * Helper functions:
          *
          *  nextStep, backStep, restart, submit, fieldInCurrentStep
          *
          * Note, variable maxSteps is what should be set in the form json file, if this
          * is not set the default maxSteps will be equal to the value of JavaScripts
          * Number.MAX_SAFE_INTEGER
          */
        }

      }

      $export(ChangePasswordForm);

      function doPasswordReset({
        scope,
        server,
        remoteConfig,
        formData,
        key
      }) {
        // resolve('good');
        return new Promise((resolve, reject) => {
          setTimeout(_ => {
            server.$post({
              url: `${remoteConfig.serverURL}/xauth/password_reset`,
              data: {
                key: key,
                new_password: formData.password,
                password_confirm: formData.passwordConfirm
              },
              headers: {
                authorization: $import(`token:awr_app_token @decoder: base64:${remoteConfig.decoder}`)
              }
            }).then(res => {
              scope.response = res;
              resolve(res);
            }, err => {
              if (err && err.responseJSON) {
                err = err.responseJSON;
              }

              scope.response = err;
              reject(err);
            });
          }, 250);
        });
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class SignInForm extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(SignInForm.$require);
          this.template = 'app/forms/sign-in-form/sign-in-form.hbs';
          this.controller = 'SignInForm';
        }

      }

      $export(SignInForm);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, $abstract, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class SignInForm extends awr.Controller {
        static get $require() {
          return {
            formActivator: 'service:formViewActivator',
            authRedirector: 'service:authRedirector',
            authService: 'service:authService',
            router: 'service:router'
          };
        }

        constructor(data, parent) {
          super(SignInForm.$require, data, parent);
          let {
            formActivator,
            authService,
            authRedirector,
            router
          } = this,
              scope = this;
          this.signInFormContext = {};
          formActivator.activate({
            scope,

            /*The should be equal to what the form.json file name property specifies.*/
            form: 'sign-in-form',

            /*The selector depends on how the parent input path is.*/
            formInputSelector: '.sign-in-form input',

            beforeSetup() {},

            /*
            * context is also available as arg while using
            * scope.signInFormContext is equally fine!
            * */
            onSubmit(signInFormContext) {
              /*
              * The submit is usually what goes towards server
              * Remember to resolve / reject it in order
              * to properly update the view variables.
              * */
              return proceedWithSignIn({
                scope,
                authService,
                authRedirector,
                router
              });
            }

          });
          this.stepsValidation = [];
        }

      }

      $export(SignInForm);

      function proceedWithSignIn({
        scope,
        authService,
        authRedirector,
        router
      }) {
        return new Promise((resolve, reject) => {
          authService.signIn({
            email: scope.signInFormContext.email,
            password: scope.signInFormContext.password,
            remember: scope.signInFormContext.remember
          }).then(tokenUser => {
            scope.signInBusy = false;
            scope.signInFailed = false;
            scope.signInError = '';
            scope.auth = {};
            setTimeout(_ => {
              router.$reloadCurrentState();
            }, 250);
            resolve('success');
          }, error => {
            scope.signInBusy = false;
            scope.signInFailed = true;
            scope.signInError = `${error}`;
            console.log(error);
            reject(error);
          });
        });
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;
      /**
       *  Documentation here:
       *
       *  Help your teammates to fast learn about your valuable work in here by
       *  providing some useful instruction about your work. For instance, say "why" this module exist
       *  and how it should be used! Documenting your work does not mean writing your code again in English,
       *  they also understand code just like you do!
       */

      class SignUpForm extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(SignUpForm.$require);
          this.template = 'app/forms/sign-up-form/sign-up-form.hbs';
          this.controller = 'SignUpForm';
        }

      }

      $export(SignUpForm);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, $abstract, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');

      class SignUpForm extends awr.Controller {
        static get $require() {
          return {
            formActivator: 'service:formViewActivator',
            authRedirector: 'service:authRedirector',
            authService: 'service:authService',
            router: 'service:router'
          };
        }

        constructor(data, parent) {
          super(SignUpForm.$require, data, parent);
          let {
            formActivator,
            authService,
            authRedirector,
            router
          } = this,
              scope = this;
          this.signUpFormContext = {// name: 'Qoli Khan',
            // email: 'qoli.loo@example.com',
            // password: '.leopStart6384',
            // passwordConfirm: '.leopStart6384',
            // // acceptTerms: true
          };
          formActivator.activate({
            scope,

            /*The should be equal to what the form.json file name property specifies.*/
            form: 'sign-up-form',

            /*The selector depends on how the parent input path is.*/
            formInputSelector: '.sign-up-form input',

            beforeSetup() {},

            onSubmit(signUpFormContext) {
              /*
              * The submit is usually what goes towards server
              * Remember to resolve / reject it in order
              * to properly update the view variables.
              * */
              return new Promise((resolve, reject) => {
                authService.register(signUpFormContext).then(res => {
                  setTimeout(_ => {
                    proceedWithSignIn({
                      scope,
                      authRedirector,
                      authService,
                      router
                    });
                  }, 500);
                  resolve(res);
                }, err => {
                  reject(err);
                });
              });
            }

          });
          this.stepsValidation = [];
          /*
          * The extension will provides set of useful variables and functions
          * which can be used in the controller and in the html template:
          *
          * Helper variables:
          *
          *  step, mode, maxSteps, stepPlus, maxStepPlus, inWorkingMode, inFailMode, inSuccessMode, inDefaultMode
          *
          * Helper functions:
          *
          *  nextStep, backStep, restart, submit, fieldInCurrentStep
          *
          * Note, variable maxSteps is what should be set in the form json file, if this
          * is not set the default maxSteps will be equal to the value of JavaScripts
          * Number.MAX_SAFE_INTEGER
          */

          this.$addValidationListener(v => {
            if (v.key === 'acceptTerms') {
              $(this.$getDom()).find('.terms-notice').toggleClass('hidden', v.isValid);
            }
          }, 'sign-up-form-v-watcher');
        }

      }

      $export(SignUpForm);

      function proceedWithSignIn({
        scope,
        authService,
        authRedirector,
        router
      }) {
        scope.signInBusy = true;
        scope.signInFailed = false;
        scope.signInError = '';
        return new Promise((resolve, reject) => {
          authService.signIn({
            email: scope.signUpFormContext.email,
            password: scope.signUpFormContext.password,
            remember: true
          }).then(tokenUser => {
            scope.signInBusy = false;
            scope.signInFailed = false;
            scope.signInError = '';
            scope.auth = {};
            setTimeout(_ => {
              router.$reloadCurrentState();
            }, 250);
            resolve('success');
          }, error => {
            scope.signInBusy = false;
            scope.signInFailed = true;
            scope.signInError = `${error}`;
            console.log(error);
            reject(error);
          });
        });
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');

      class AuthView extends awr.Controller {
        static get $require() {
          return {
            router: 'service:router',
            superScope: 'object:awr.superScope',
            authRedirector: 'service:authRedirector',
            base64: 'service:uriBase64'
          };
        }

        constructor(data, parent) {
          super(AuthView.$require, data, parent);
          let {
            router,
            superScope,
            authRedirector,
            base64
          } = this,
              scope = this;
          Object.defineProperty(this, 'isRedirect', {
            get() {
              return Q.$objectExist(superScope.currentUser);
            }

          });
          Object.defineProperty(this, 'isSignIn', {
            get() {
              return !this.isRedirect && Q.$setContainsString(['default', 'signin'], this.$state.attrs.view);
            }

          });
          Object.defineProperty(this, 'isSignUp', {
            get() {
              return !(this.isRedirect || this.isSignIn);
            }

          });
          this.$ready(_ => {
            if (!this.isRedirect) {
              return;
            }

            let next = this.$state.attrs.next;
            next = Q.$stringExist(next) && next !== 'default' ? base64.decode(next) : 'default';
            /*make sure that next is not the logout-view!!*/

            next = next.startsWith('#exit') || next.startsWith('/#exit') ? 'default' : next; // superScope.currentUser.is_email_confirmed = false;

            if (!Q.$booleanTrue(superScope.currentUser.is_email_confirmed)) {
              router.$go('email-confirm-view', {
                params: {},
                attrs: {
                  next: base64.encode(next)
                }
              }, true);
            } else {
              authRedirector.redirect(next);
            }
          });
          this.$init(_ => {
            window.scrollTo(0, 0);
          });
        }

        changeView(name) {
          this.$preventDefault();
          let {
            router
          } = this,
              state = this.$state;

          if (name === 'signup') {
            state.attrs.view = 'signup';
          } else {
            state.attrs.view = 'signin';
          }

          router.$go(state.name, state, true);
        }

      }

      $export(AuthView);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class Default extends awr.Route {
        static get $require() {
          return {};
        }

        constructor() {
          super(Default.$require);
          this.link = 'auth?:view&:next';
          this.template = "app/views/auth-view/auth-view-index.hbs";
          this.controller = 'AuthView';
          this.defaults = {
            params: {},
            attrs: {
              view: 'default',
              next: 'default'
            }
          };
          this.resolve = {};
        }

      }

      $export(Default);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');

      class EmailConfirmView extends awr.Controller {
        static get $require() {
          return {
            tokenSvc: 'service:tokenService',
            remoteConnCnf: 'config:remoteConnectionConfig',
            superScope: 'object:awr.superScope',
            authRedirector: 'service:authRedirector'
          };
        }

        constructor(data, parent) {
          super(EmailConfirmView.$require, data, parent);
          let {
            remoteConnCnf
          } = this;
          Object.defineProperty(this, 'token', {
            get() {
              return $import(`token:awr_app_token @decoder: base64:${remoteConnCnf.decoder}`);
            }

          });
        }

        continueToNext() {
          this.$preventDefault();
          let {
            tokenSvc,
            superScope,
            authRedirector,
            token
          } = this,
              next = this.$state.attrs.next && this.$state.attrs.next !== 'default' ? decURIComp(this.$state.attrs.next) : 'default';
          $(this.$getDom()).find('.just-confirmed').addClass('busy');
          $(this.$getDom()).find('.just-confirmed').removeClass('has-note');
          tokenSvc.getTokenUser(token).then(tokenUser => {
            superScope.currentUser = tokenUser;
            setTimeout(_ => {
              $(this.$getDom()).find('.just-confirmed').removeClass('busy');

              if (!Q.$booleanTrue(tokenUser.is_email_confirmed)) {
                $(this.$getDom()).find('.just-confirmed').addClass('has-note');
                $(this.$getDom()).find('.just-confirmed .note .msg').text('According to our server ' + 'your email is not yet confirmed!');
              } else {
                authRedirector.redirect(next);
              }
            }, 500);
          }, err => {
            console.error(err);
            $(this.$getDom()).find('.just-confirmed').addClass('has-note');
            $(this.$getDom()).find('.just-confirmed .note .msg').text('Something went wrong, please try again later!');
          });
          setTimeout(_ => {
            $(this.$getDom()).find('.just-confirmed').removeClass('busy');
            $(this.$getDom()).find('.just-confirmed').addClass('has-note');
          }, 2000);
        }

        sendConfirmLink() {
          this.$preventDefault();
          let {
            tokenSvc,
            token
          } = this;
          $(this.$getDom()).find('.send-again').addClass('busy');
          $(this.$getDom()).find('.send-again').removeClass('has-note');
          tokenSvc.newEmailConfirmLink(token).then(res => {
            setTimeout(_ => {
              $(this.$getDom()).find('.send-again').removeClass('busy');
              $(this.$getDom()).find('.send-again').addClass('has-note');
              setTimeout(_ => {
                $(this.$getDom()).find('.send-again').removeClass('has-note');
              }, 30000);
            }, 500);
          }, err => {
            console.error(err);
          });
        }

      }

      $export(EmailConfirmView);

      function decURIComp(cmp) {
        let base64 = $import('service:uriBase64');
        return base64.decode(cmp); // return window.atob(window.decodeURIComponent(cmp));
      }

      function encURIComp(cmp) {
        let base64 = $import('service:uriBase64');
        return base64.encode(cmp); // return window.encodeURIComponent(window.btoa(cmp));
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class EmailConfirmView extends awr.Route {
        static get $require() {
          return {};
        }

        constructor() {
          super(EmailConfirmView.$require);
          this.link = "email-confirm?:next";
          this.template = "app/views/email-confirm-view/email-confirm-view-index.hbs";
          this.controller = 'EmailConfirmView';
          this.defaults = {
            params: {},
            attrs: {
              next: 'default'
            }
          };
          this.resolve = {};
        }

      }

      $export(EmailConfirmView);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class ForgotPasswordView extends awr.Controller {
        static get $require() {
          return {
            formActivator: 'service:formViewActivator',
            server: 'service:serverCall',
            remoteConfig: 'config:remoteConnectionConfig',
            router: 'service:router'
          };
        }

        constructor(data, parent) {
          super(ForgotPasswordView.$require, data, parent);
          let {
            formActivator,
            server,
            remoteConfig,
            router
          } = this,
              scope = this;
          this.badEmail = false;
          formActivator.activate({
            scope,
            form: 'forgotPassword',
            formInputSelector: '.forgot-password-view input',

            onSubmit(formData) {
              return new Promise((resolve, reject) => {
                setTimeout(_ => {
                  server.$post({
                    url: `${remoteConfig.serverURL}/xauth/password_reset_link`,
                    data: {
                      email: formData.email
                    }
                  }).then(res => {
                    scope.badEmail = false;
                    resolve('ok');
                  }, err => {
                    if (err && err.responseJSON) {
                      err = err.responseJSON;
                    }

                    scope.badEmail = err && Q.$booleanFalse(err.email_found);
                    reject('failed');
                  });
                }, 250);
              });
            }

          });
          this.$addRecompileListener(_ => {
            /*making sure the vars are rest to default after recompile*/
            scope.badEmail = false;
          });
        }

        signIn() {
          this.$preventDefault();
          let {
            router
          } = this;
          router.$go('default', {
            params: {},
            attrs: {
              view: 'default',
              next: 'default'
            }
          }, true);
        }

      }

      $export(ForgotPasswordView);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;
      /**
       *  Documentation here:
       *
       *  Help your teammates to fast learn about your valuable work in here by
       *  providing some useful instruction about your work. For instance, say "why" this module exist
       *  and how it should be used! Documenting your work does not mean writing your code again in English,
       *  they also understand code just like you do!
       */

      class ForgotPasswordView extends awr.Route {
        static get $require() {
          return {};
        }

        constructor() {
          super(ForgotPasswordView.$require);
          this.link = "forgot/password?";
          this.template = "app/views/forgot-password-view/forgot-password-view-index.hbs";
          this.controller = 'ForgotPasswordView';
          this.defaults = {
            params: {},
            attrs: {}
          };
          this.resolve = {};
        }

      }

      $export(ForgotPasswordView);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class ResetPasswordView extends awr.Controller {
        static get $require() {
          return {};
        }

        constructor(data, parent) {
          super(ResetPasswordView.$require, data, parent);
          let scope = this;
        }

      }

      $export(ResetPasswordView);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;
      /**
       *  Documentation here:
       *
       *  Help your teammates to fast learn about your valuable work in here by
       *  providing some useful instruction about your work. For instance, say "why" this module exist
       *  and how it should be used! Documenting your work does not mean writing your code again in English,
       *  they also understand code just like you do!
       */

      class ResetPasswordView extends awr.Route {
        static get $require() {
          return {};
        }

        constructor() {
          super(ResetPasswordView.$require);
          this.link = "resets/password/:key?";
          this.template = "app/views/reset-password-view/reset-password-view-index.hbs";
          this.controller = 'ResetPasswordView';
          this.defaults = {
            params: {
              key: 'none'
            },
            attrs: {}
          };
          this.resolve = {
            isResetKeyValid: 'passResetKeyCheck'
          };
        }

      }

      $export(ResetPasswordView);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let encoder = "CmxldCBwYXJ0TGVuZ3RoID0gcGFyc2VJbnQoc3RyLmxlbmd0aCAvIDQpLCBhcnIgPSBbXSwKICAgICAgICBueHQsCiAgICAgICAgc3RhcnQgPSAwLAogICAgICAgIGVuZCA9IHBhcnRMZW5ndGgsCiAgICAgICAga2V5ID0gYnAgJiYgdHlwZW9mIGJwLmdlbmVyYXRlT25lID09PSAnZnVuY3Rpb24nID8gYnAuZ2VuZXJhdGVPbmUoKSA6IG51bGw7CiAgICBpZigha2V5KXsKICAgICAgICByZXR1cm4gbnVsbDsKICAgIH0KICAgIGtleSA9IGtleS5zcGxpdCgnLScpOwogICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHsKICAgICAgICBpZiAoaSA8IDMpIHsKICAgICAgICAgICAgbnh0ID0ga2V5W2ldK3dpbmRvdy5idG9hKHN0ci5zdWJzdHJpbmcoc3RhcnQsIGVuZCkpOwogICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgIG54dCA9IGtleVtpXSt3aW5kb3cuYnRvYShzdHIuc3Vic3RyaW5nKHN0YXJ0KSk7CiAgICAgICAgfQogICAgICAgIGFyci5wdXNoKG54dCk7CiAgICAgICAgc3RhcnQgPSBlbmQ7CiAgICAgICAgZW5kICs9IHBhcnRMZW5ndGg7CiAgICB9CiAgICByZXR1cm4gd2luZG93LmJ0b2EoSlNPTi5zdHJpbmdpZnkoYXJyLnJldmVyc2UoKSkpICsgJyRhV3QnOwo=";
      let decoder = "CiAgbGV0IGFyciA9IEpTT04ucGFyc2Uod2luZG93LmF0b2Ioc3RyLnN1YnN0cmluZygwLCBzdHIubGVuZ3RoIC0gNCkpKSwga2V5ID0gW107CiAgICBpZiAoIVEuJGFycmF5Tm90RW1wdHkoYXJyKSkgewogICAgICAgIHJldHVybiBudWxsOwogICAgfQogICAgYXJyID0gYXJyLnJldmVyc2UoKTsKICAgIGFyciA9IFEuJG1hcChhcnIsIG54dCA9PiB7CiAgICAgICAga2V5LnB1c2gobnh0LnN1YnN0cmluZygwLCA0KSk7CiAgICAgICAgcmV0dXJuIHdpbmRvdy5hdG9iKG54dC5zdWJzdHJpbmcoNCkpOwogICAgfSk7CiAgICBrZXkgPSBrZXkuam9pbignLScpOwogICAgaWYgKGJwICYmIHR5cGVvZiBicC5jaGVjayA9PT0gJ2Z1bmN0aW9uJyAmJiBicC5jaGVjayhrZXkpKSB7CiAgICAgICAgcmV0dXJuIGFyci5qb2luKCcnKTsKICAgIH0KICAgIHJldHVybiBudWxsOw==";
      let awr = window.awr || {},
          Q = awr.Q,
          loc = window.location,
          serial = $import('service:serial'),
          currentUser = null,

      /*keeping 8080 as special app dev port that redirects api and xauth to the root*/
      devServerPort = loc.host && (loc.host.endsWith(':8080') || loc.host.endsWith(':9090')),
          hostname = devServerPort ? loc.hostname : loc.host,
          server = $import('service:serverCall'),
          serverRoot = `${loc.protocol}//${hostname}`,
          api = `${serverRoot}/api`,
          authRoot = `${serverRoot}/xauth`,
          token = $import(`token:awr_app_token @decoder: base64:${decoder}`);

      class RemoteConnection extends awr.Config {
        static get $require() {
          return {};
        }

        constructor(name) {
          super(RemoteConnection.$require, name);
          let blog_app_session,
              device_blog_app_session,
              remoteCnf = this;
          this.user = currentUser;
          this.apiURL = api;
          this.authURL = authRoot;
          this.serverURL = serverRoot;
          this.isGuest = !Q.$objectExist(currentUser);
          this.encoder = encoder;
          this.decoder = decoder;
          this.sessionIdTag = 'ba_session';
          this.deviceSessionIdTag = 'd_ba_session';
          this.isDevPort = devServerPort;
          blog_app_session = sessionStorage.getItem(this.sessionIdTag);
          device_blog_app_session = localStorage.getItem(this.deviceSessionIdTag);

          if (!Q.$stringExist(blog_app_session)) {
            sessionStorage.setItem(this.sessionIdTag, `${serial.basicPrime.generateOne()}@${new Date().getTime()}`);
          }

          if (!Q.$stringExist(device_blog_app_session)) {
            localStorage.setItem(this.deviceSessionIdTag, `${serial.basicPrime.generateOne()}@${new Date().getTime()}`);
          }

          Object.defineProperty(this, 'sessionId', {
            get() {
              return sessionStorage.getItem(remoteCnf.sessionIdTag);
            }

          });
          Object.defineProperty(this, 'deviceSessionId', {
            get() {
              return localStorage.getItem(remoteCnf.deviceSessionIdTag);
            }

          });
        }

      }
      /*exporting only after getting current user (or setting current use to null)!*/


      server.$get({
        url: `${authRoot}/token_user`,
        headers: {
          'authorization': token
        }
      }).then(res => {
        currentUser = res;
        $export(RemoteConnection);
      }, err => {
        console.error(err);
        $export(RemoteConnection);
      });

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class SocketConnection extends awr.Config {
        static get $require() {
          return {
            remoteCnf: 'config:remoteConnection'
          };
        }

        constructor(name) {
          super(SocketConnection.$require, name);
          let {
            remoteCnf
          } = this,
              location = window.location,

          /*!important use hostname and not host as the host value contains the port number!*/
          host = location.hostname;
          /*
          * @clientType: io or WebSocket as driver
          * default: look for io driver if not found fallback to WebSocket by showing a warning
          **/
          // this.clientType = 'WebSocket';
          // this.url = `wss://${host}:8890`;

          this.url = Q.$setContainsString(['www.pageshare.fi', 'pageshare.fi'], host) || host.indexOf('awiar.net') > 0 || host.indexOf('awiarsolutions.com') > 0 ? `wss://${host}` : `ws://${host}:8890`;
          /*
          * @channels: message channels which client must listen
          **/

          this.channels = ['notification', 'hint@notification', 'broadcast@notification'];
          Object.defineProperty(this, 'socketToken', {
            get() {
              remoteCnf = $import('config:remoteConnectionConfig');
              /*The socketClient service can expect the socket_token as a Promise instance!*/

              if (remoteCnf && Q.$objectExist(remoteCnf.user) && Q.$stringExist(remoteCnf.user.socket_token)) {
                return remoteCnf.user.socket_token;
              }

              return null;
            }

          });
        }

      }

      $export(SocketConnection);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class Collection extends awr.Model {
        static get $require() {
          return {};
        }

        constructor() {
          super(Collection.$require);
          this.url = '/ps_collection/';
          this.headers = {};
        }

      }

      $export(Collection);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class Doc extends awr.Model {
        static get $require() {
          return {};
        }

        constructor() {
          super(Doc.$require);
          this.url = '/ps_doc/';
          this.headers = {};
        }

      }

      $export(Doc);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class MyCollection extends awr.Model {
        static get $require() {
          return {};
        }

        constructor() {
          super(MyCollection.$require);
          this.url = '/my_ps_collection/';
          this.headers = {};
        }

      }

      $export(MyCollection);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class MyDoc extends awr.Model {
        static get $require() {
          return {};
        }

        constructor() {
          super(MyDoc.$require);
          this.url = '/my_ps_doc/';
          this.headers = {};
        }

      }

      $export(MyDoc);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class PsPublisher extends awr.Model {
        static get $require() {
          return {};
        }

        constructor() {
          super(PsPublisher.$require);
          this.url = '/ps_publisher/';
          this.headers = {};
        }

      }

      $export(PsPublisher);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class PsUser extends awr.Model {
        static get $require() {
          return {};
        }

        constructor() {
          super(PsUser.$require);
          this.url = '/ps_user/';
          this.headers = {};
        }

      }

      $export(PsUser);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class PublisherRole extends awr.Model {
        static get $require() {
          return {};
        }

        constructor() {
          super(PublisherRole.$require);
          this.url = '/ps_publisher_role/';
          this.headers = {};
        }

      }

      $export(PublisherRole);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class Role extends awr.Model {
        static get $require() {
          return {};
        }

        constructor() {
          super(Role.$require);
          this.url = '/role/';
          this.headers = {};
        }

      }

      $export(Role);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class TagSubscription extends awr.Model {
        static get $require() {
          return {};
        }

        constructor() {
          super(TagSubscription.$require);
          this.url = '/tag_subscription/';
          this.headers = {};
        }

      }

      $export(TagSubscription);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          observerCount = 0,
          Observable = $import('class:Observable@event');

      class CollectionEvents extends awr.Observable {
        static get $require() {
          return {};
        }

        constructor() {
          super(CollectionEvents.$require);
        }

        makeSubscriber() {
          return observer => {
            observerCount++;
            let observerId = `collection-events-observer-${observerCount}`;
            $on('collection:events', event => {
              observer.next(event);
            }, observerId);
            return () => {
              /*cleanup code*/
              $off('collection:events', observerId);
            };
          };
        }

      }

      $export(CollectionEvents);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class PsDocEvents extends awr.ObservableTransform {
        static get $require() {
          return {
            socket: 'observable:socket'
          };
        }

        constructor() {
          super(PsDocEvents.$require);
        }

        transform() {
          /*Drive a new observable from an existing one!*/
          let {
            socket
          } = this;
          return socket.$filter(event => {
            return event && Q.$stringExist(event.name) && event.name.startsWith('ps-doc:');
          });
        }

      }

      $export(PsDocEvents);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class BookImgSrc extends awr.Pipe {
        static get $require() {
          return {
            remoteCnf: 'config:remoteConnectionConfig'
          };
        }

        constructor() {
          super(BookImgSrc.$require);
        }

        transform(img, ...args) {
          let {
            remoteCnf
          } = this; // console.log(img);

          if (Q.$stringExist(img)) {
            return `${remoteCnf.serverURL}${img}`;
          }

          return Q.$objectExist(img) && Q.$stringExist(img.src) ? `${remoteCnf.serverURL}${img.src}` : '';
        }

      }

      $export(BookImgSrc);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class Collections extends awr.Resolvable {
        static get $require() {
          return {
            collFetcher: 'service:collectionFetcher'
          };
        }

        constructor() {
          super(Collections.$require);
          this.$importSuperScope();
        }

        resolve(state) {
          return resolveFn(state, this, false);
        }

        resolveLater(state) {
          return resolveFn(state, this, true);
        }

      }

      $export(Collections);

      function resolveFn(state, self, network = false) {
        let {
          superScope,
          collFetcher
        } = self,
            loc = collFetcher.getLocalAll();

        if (!Q.$isEmpty(loc)) {
          superScope.cachedCollsReady = true;
          return Promise.resolve(loc);
        }

        if (!network) {
          superScope.cachedCollsReady = false;
          return Promise.resolve(Q.$asCollection([]));
        }

        return new Promise((resolve, reject) => {
          collFetcher.findAll().then(res => {
            superScope.cachedCollsReady = true;
            resolve(Q.$asCollection(res));
          }, err => {
            console.error(err);
            reject(err);
          });
        });
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          lastFromCache = false;

      class CtrPublishers extends awr.Resolvable {
        static get $require() {
          return {
            model: 'model:PsPublisher'
          };
        }

        constructor() {
          super(CtrPublishers.$require);
          this.$importSuperScope();
        }

        resolve(state) {
          return resolveFn(state, this, false);
        }

        resolveLater(state) {
          return resolveFn(state, this, true);
        }

      }

      $export(CtrPublishers);

      function resolveFn(state, self, network = false) {
        let {
          superScope,
          model
        } = self,
            currentUser = superScope.currentUser;

        if (!Q.$objectExist(currentUser)) {
          superScope.cachedPublishersReady = true;
          return Promise.resolve(Q.$asCollection([]));
        }

        if (Q.$arrayExists(superScope.cachedPublishers) && superScope.cachedPublishersReady) {
          lastFromCache = true;
          return Promise.resolve(superScope.cachedPublishers);
        }

        lastFromCache = false;

        if (!network) {
          superScope.cachedPublishersReady = false;
          return Promise.resolve(Q.$asCollection([]));
        }

        return new Promise((resolve, reject) => {
          model.$findAll().then(res => {
            superScope.cachedPublishersReady = true;
            superScope.cachedPublishers = Q.$asCollection(res);
            resolve(Q.$asCollection(res));
          }, err => {
            console.error(err);
            reject(err);
          });
        });
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class CtrTags extends awr.Resolvable {
        static get $require() {
          return {
            model: 'model:TagSubscription'
          };
        }

        constructor() {
          super(CtrTags.$require);
          this.$importSuperScope();
        }

        resolve(state) {
          return resolveFn(state, this, false);
        }

        resolveLater(state) {
          return resolveFn(state, this, true);
        }

      }

      $export(CtrTags);

      function resolveFn(state, self, network = false) {
        let {
          superScope,
          model
        } = self,
            currentUser = superScope.currentUser;

        if (!Q.$objectExist(currentUser)) {
          superScope.cachedTagsReady = false;
          return Promise.resolve(Q.$asCollection([]));
        }

        if (Q.$arrayExists(superScope.cachedTags) && superScope.cachedTagsReady) {
          return Promise.resolve(superScope.cachedTags);
        }

        if (!network) {
          superScope.cachedTagsReady = false;
          return Promise.resolve(Q.$asCollection([]));
        }

        return new Promise((resolve, reject) => {
          model.$findAll().then(res => {
            superScope.cachedTagsReady = true;
            superScope.cachedTags = Q.$asCollection(res);
            resolve(Q.$asCollection(res));
          }, err => {
            console.error(err);
            reject(err);
          });
        });
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          lastFromCache = false;

      class CtrUsers extends awr.Resolvable {
        static get $require() {
          return {
            model: 'model:PsUser'
          };
        }

        constructor() {
          super(CtrUsers.$require);
          this.$importSuperScope();
        }

        resolve(state) {
          return resolveFn(state, this, false);
        }

        resolveLater(state) {
          return resolveFn(state, this, true);
        }

        resolveRest(state) {
          let currentUser = this.superScope.currentUser;

          if (!Q.$objectExist(currentUser)) {
            return Promise.resolve(Q.$asCollection([]));
          }

          if (lastFromCache) {
            return Promise.resolve([]);
          }

          return this.model.$findAll('?skip=40');
        }

      }

      $export(CtrUsers);

      function resolveFn(state, self, network = false) {
        let {
          superScope,
          model
        } = self,
            currentUser = superScope.currentUser;

        if (!Q.$objectExist(currentUser)) {
          superScope.cachedUsersReady = false;
          return Promise.resolve(Q.$asCollection([]));
        }

        if (Q.$arrayExists(superScope.cachedUsers) && superScope.cachedUsersReady) {
          lastFromCache = true;
          return Promise.resolve(superScope.cachedUsers);
        }

        lastFromCache = false;

        if (!network) {
          superScope.cachedUsersReady = false;
          return Promise.resolve(Q.$asCollection([]));
        }

        return new Promise((resolve, reject) => {
          model.$findAll('?take=40').then(res => {
            superScope.cachedUsersReady = true;
            superScope.cachedUsers = Q.$asCollection(res);
            resolve(Q.$asCollection(res));
          }, err => {
            console.error(err);
            reject(err);
          });
        });
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class Doc extends awr.Resolvable {
        static get $require() {
          return {
            docModel: 'model:MyDoc',
            base64: 'service:uriBase64'
          };
        }

        constructor() {
          super(Doc.$require);
        }

        resolve(state) {
          return Promise.resolve({
            isPlaceholder: true
          });
        }

        resolveLater(state) {
          let {
            base64,
            docModel
          } = this,
              docId = state.params.docId;
          return docModel.$findOne(base64.decode(docId));
        }

      }

      $export(Doc);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class MyCollections extends awr.Resolvable {
        static get $require() {
          return {
            model: 'model:MyCollection'
          };
        }

        constructor() {
          super(MyCollections.$require);
          this.$importSuperScope();
        }

        resolve(state) {
          return resolveFn(state, this, false);
        }

        resolveLater(state) {
          return resolveFn(state, this, true);
        }

      }

      $export(MyCollections);

      function resolveFn(state, self, network = false) {
        let {
          superScope,
          model
        } = self,
            currentUser = superScope.currentUser;

        if (!Q.$objectExist(currentUser)) {
          superScope.cachedMyCollsReady = false;
          return Promise.resolve(Q.$asCollection([]));
        }

        if (Q.$arrayExists(superScope.cachedMyColls) && superScope.cachedMyCollsReady) {
          return Promise.resolve(superScope.cachedMyColls);
        }

        if (!network) {
          superScope.cachedMyCollsReady = false;
          return Promise.resolve(Q.$asCollection([]));
        }

        return new Promise((resolve, reject) => {
          model.$findAll().then(res => {
            superScope.cachedMyCollsReady = true;
            superScope.cachedMyColls = Q.$asCollection(res);
            resolve(Q.$asCollection(res));
          }, err => {
            console.error(err);
            reject(err);
          });
        });
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class VDoc extends awr.Resolvable {
        static get $require() {
          return {
            docModel: 'model:Doc',
            myDocModel: 'model:MyDoc',
            base64: 'service:uriBase64',
            collFetcher: 'service:collectionFetcher'
          };
        }

        constructor() {
          super(VDoc.$require);
          this.$importSuperScope();
        }

        resolve(state) {
          return resolveFn(state, this, false);
        }

        resolveLater(state) {
          return resolveFn(state, this, true);
        }

      }

      $export(VDoc);

      function resolveFn(state, self, network = false) {
        let {
          base64,
          docModel,
          myDocModel,
          collFetcher,
          superScope
        } = self,
            docId = state.params.docId,
            lsAll,
            model,
            currentColl;

        if (!network) {
          return Promise.resolve({
            isPlaceholder: true
          });
        }

        model = Q.$objectExist(superScope.currentUser) ? myDocModel : docModel;

        if (!Q.$stringExist(docId) || docId === 'none') {
          return new Promise((resolve, reject) => {
            collFetcher.findAll().then(res => {
              currentColl = collFetcher.getCurrent();

              if (!Q.$objectExist(currentColl) || Q.$isEmpty(currentColl.stories)) {
                lsAll = collFetcher.getLocalAll();
                currentColl = lsAll.$reduce(nxt => !Q.$isEmpty(nxt.stories)).$first();
              }

              if (!Q.$objectExist(currentColl) || Q.$isEmpty(currentColl.stories)) {
                reject('Failed to load doc from default collection. No default Collection!');
              }

              collFetcher.setCurrent(currentColl.id);
              docId = !Q.$isEmpty(currentColl.stories) ? currentColl.stories[0].id : null;

              if (!Q.$exist(docId)) {
                reject('Failed to load doc from default collection. Bad docId for first collection member!');
              }

              model.$findOne(docId).then(doc => {
                resolve(doc);
              }, err => {
                reject(err);
              });
            }, err => {
              reject(err);
            });
          });
        }

        return model.$findOne(base64.decode(docId));
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;
      $export('service:appDemoAuthorizer', ['service:serial', function demoAuthorizerCtrl(serial) {
        const sessionTime = 15 * 60000;
        let passRoots = ["SRQP-2570", "XHVJ-1329", "KLBW-9305", "CWKS-3480", "ZQSN-6391", "KQYL-8150", "QMEO-1768", "DAFW-1897", "BFOT-4935", "MHSR-8706"]; //2822-022R
        //3620-222J
        //7796-097L
        //2096-032W
        //5627-136S
        //4282-084Q
        //6589-175E
        //2918-189F
        //1167-357B
        //1878-081H

        return {
          authorize(a, b) {
            //a as the epsilon of BasicPrime
            //b as the result of BasicPrime
            let hasMatch = false;
            return new Promise(function (resolve, reject) {
              setTimeout(() => {
                Q.$forEachIndex(passRoots, (val, index) => {
                  try {
                    b = b.toUpperCase();
                    let nxt = serial.basicPrime.generateOne({
                      alpha: val.split('-')[0],
                      delta: val.split('-')[1]
                    });

                    if (nxt.endsWith(`${a}-${b}`)) {
                      hasMatch = true;
                    }
                  } catch (e) {}
                });

                if (Q.$booleanTrue(hasMatch)) {
                  resolve(true);
                } else {
                  reject(false);
                }
              }, 1000);
            });
          }

        };
      }]);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class AuthNextBuilder extends awr.Service {
        static get $require() {
          return {
            router: 'service:router',
            remoteConfig: 'config:remoteConnection'
          };
        }

        constructor() {
          super(AuthNextBuilder.$require);
        }

        getAppNextLink() {
          let {
            router
          } = this;
          return router.$getAppNextLink();
        }

        getCleanAuthNext(appNext) {
          let {
            remoteConfig,
            router
          } = this;
          return router.$makeAuthNext({
            connectionConfig: remoteConfig,
            appNext
          });
        }

        getURIEncoder() {
          let {
            router
          } = this;
          return router.$authNextEncoder;
        }

      }

      $export(AuthNextBuilder);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;
      const cacheName = "autocomplete@cache";

      class Autocomplete extends awr.Service {
        static get $require() {
          return {
            searchCache: 'service:searchCache',
            server: 'service:serverCall',
            remoteCnf: 'config:remoteConnection'
          };
        }

        constructor() {
          super(Autocomplete.$require);
          /*services should not dependent by wait on any scope!*/

          Object.defineProperty(this, 'superScope', {
            get() {
              return $import('object:awr.superScope');
            }

          });
        }

        search(query, {
          type = null,
          key = null,
          take = 20
        } = {}) {
          let {
            server,
            remoteCnf,
            superScope,
            searchCache
          } = this,
              url = `${remoteCnf.serverURL}/api/ps_autocomplete?query=${encodeURIComponent(query)}`,
              devId = remoteCnf.deviceSessionId,
              user_id = Q.$objectExist(superScope.currentUser) ? superScope.currentUser.id : null,
              cachedResult;

          if (!Q.$stringExist(query)) {
            return Promise.reject('no query!');
          }

          if (searchCache.inCache(cacheName, query)) {
            cachedResult = searchCache.getFromCache(cacheName, query);
            $emit('search:autocomplete', {
              results: cachedResult,
              query: query
            });
            cachedResult = Q.$asCollection(Q.$isEmpty(cachedResult) ? [] : cachedResult);
            return Promise.resolve(cachedResult);
          }

          if (Q.$stringExist(type)) {
            url += `&type=${encodeURIComponent(type)}`;
          }

          if (Q.$stringExist(key)) {
            url += `&key=${encodeURIComponent(key)}`;
          }

          if (Q.$exist(user_id)) {
            url += `&user_id=${user_id}`;
          }

          if (Q.$stringExist(devId)) {
            url += `&device_session_id=${devId}`;
          }

          return new Promise((resolve, reject) => {
            server.$get({
              url: url
            }).then(res => {
              let results = Q.$asCollection(Q.$isEmpty(res) ? [] : res);

              if (Q.$numberExist(take)) {
                results = results.$take(take);
              }

              searchCache.putInCache(cacheName, query, results);
              $emit('search:autocomplete', {
                results,
                query: query
              });
              resolve(results);
            }, err => {
              console.error(err);
            });
          });
        }

      }

      $export(Autocomplete);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;
      let cachedSet, current, cTime, freshCurrent, aggregated, onGoingCall;

      class CollectionFetcher extends awr.Service {
        static get $require() {
          return {
            collModel: 'model:Collection',
            myCollModel: 'model:MyCollection',
            remoteCnf: 'config:remoteConnection'
          };
        }

        constructor() {
          super(CollectionFetcher.$require);
          let {
            collModel
          } = this;
          Object.defineProperty(this, 'superScope', {
            get() {
              return $import('object:awr.superScope');
            }

          });
          aggregated = makeAggregatedCollection(collModel, Q.$asCollection([]));
        }

        findAll(query, refresh = null) {
          let {
            collModel,
            myCollModel,
            superScope
          } = this,
              model = Q.$objectExist(superScope.currentUser) ? myCollModel : collModel; // let model;

          if (!Q.$exist(refresh) && (Q.$booleanFalse(query) || Q.$booleanTrue(query))) {
            refresh = query;
            query = null;
          }

          if (Q.$stringExist(query)) {
            return model.$findAll(query);
          }

          refresh = Q.$booleanFalse(refresh) || Q.$booleanTrue(refresh) ? refresh : false;

          if (Q.$booleanTrue(refresh) || !Q.$numberExist(cTime) || new Date().getTime() > cTime + 60000) {
            cTime = null;
            cachedSet = null;
          }

          if (!Q.$isEmpty(cachedSet)) {
            return Promise.resolve(cachedSet);
          }

          if (Q.$objectExists(onGoingCall)) {
            return onGoingCall;
          }

          onGoingCall = new Promise((resolve, reject) => {
            model.$findAll().then(res => {
              onGoingCall = null;
              cachedSet = res;
              cTime = new Date().getTime();

              if (Q.$objectExist(current)) {
                freshCurrent = res.$find(nxt => nxt.id == current.id);
                current = Q.$objectExist(freshCurrent) ? freshCurrent : null;
              }

              resolve(res);
            }, err => {
              onGoingCall = null;
              console.error(err);
              reject(err);
            });
          });
          return onGoingCall;
        }

        getLocalAll() {
          return !Q.$isEmpty(cachedSet) ? Q.$asCollection(cachedSet) : Q.$asCollection([]);
        }

        getDocCollections(docId) {
          if (Q.$isEmpty(cachedSet) || !Q.$exist(docId)) {
            return Q.$asCollection([]);
          }

          return cachedSet.$reduce(nxt => {
            return !Q.$isEmpty(nxt.stories) && Q.$count(nxt.stories, nxtDoc => nxtDoc.id == docId) > 0;
          });
        }

        removeDocFromCache(collId, docId) {
          if (Q.$isEmpty(cachedSet) || !Q.$exist(docId)) {
            return;
          }

          cachedSet.$each(col => {
            if (col.id !== collId) {
              return;
            }

            col.stories = Q.$reduce(col.stories, nxt => nxt.id !== docId);
          });
        }

        addDocIntoCache(collId, doc) {
          if (Q.$isEmpty(cachedSet) || !Q.$objectExist(doc)) {
            return;
          }

          cachedSet.$each(col => {
            if (col.id !== collId) {
              return;
            }

            if (!Q.$arrayExist(col.stories)) {
              col.stories = Q.$asCollection([]);
            }

            if (Q.$count(col.stories, nxt => nxt.id === doc.id) < 1) {
              col.stories.push(doc);
            }
          });
        }

        getOneLocal(cId) {
          if (cId === 'agr') {
            return aggregated;
          }

          return this.getLocalAll().$reduce(nxt => Q.$numberExist(parseInt(nxt.id)) && parseInt(cId) === parseInt(nxt.id)).$first();
        }

        getCurrent() {
          let savedItemId = parseInt(sessionStorage.getItem('ps-cr-cl')),
              inCache;

          if (!Q.$objectExist(current) && Q.$numberExist(savedItemId) && !Q.$isEmpty(cachedSet)) {
            inCache = cachedSet.$find('id', savedItemId);
            return Q.$objectExist(inCache) ? inCache : cachedSet.$first();
          }

          return Q.$objectExist(current) ? current : !Q.$isEmpty(cachedSet) ? cachedSet.$first() : null;
        }

        setCurrent(id) {
          let orig = current;

          if (id !== 'agr' && (Q.$isEmpty(cachedSet) || !Q.$exist(id))) {
            return false;
          }

          current = id === 'agr' ? aggregated : cachedSet.$find('id', id);

          if (!Q.$objectExist(current)) {
            current = orig;
            return false;
          }

          sessionStorage.setItem('ps-cr-cl', id);
          $emit('collection:events', {
            name: 'new-current',
            collection: current
          });
          return true;
        }

        aggregate(stories) {
          let {
            collModel
          } = this;
          aggregated = makeAggregatedCollection(collModel, stories);
          return aggregated.id;
        }

      }

      $export(CollectionFetcher);

      function makeAggregatedCollection(model, stories) {
        return model.$template({
          id: 'agr',
          name: 'aggregated',
          status: 'published',
          user_id: 'agr-user',
          type: 'ps/collection',
          stories: stories
        });
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class FileUploader extends awr.Service {
        static get $require() {
          return {
            uploadManager: 'service:uploadManager',
            remoteCnf: 'config:remoteConnection'
          };
        }

        constructor() {
          super(FileUploader.$require);
        }

        upload({
          path,
          fileKey,
          files
        }) {
          let {
            uploadManager,
            remoteCnf
          } = this;
          return uploadManager.upload({
            url: `${remoteCnf.serverURL}/${path}`,
            token: $import(`token:awr_app_token @decoder: base64:${remoteCnf.decoder}`),
            fileKey,
            files
          });
        }

      }

      $export(FileUploader);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class GlobalFnHelper extends awr.Service {
        static get $require() {
          return {
            collectionFetcher: 'service:collectionFetcher',
            base64: 'service:uriBase64',
            modal: 'service:modal'
          };
        }

        constructor() {
          super(GlobalFnHelper.$require);
        }

        firstDocDataInCollection(collId) {
          let {
            base64,
            modal,
            collectionFetcher
          } = this;
          let coll, docs, first, docTitle, docId;
          return new Promise((resolve, reject) => {
            collectionFetcher.findAll().then(res => {
              coll = res.$find('id', collId);
              docs = Q.$objectExist(coll) && !Q.$isEmpty(coll.stories) ? Q.$asCollection(coll.stories) : Q.$asCollection([]);
              first = docs.$first();

              if (Q.$objectExist(coll)) {
                collectionFetcher.setCurrent(coll.id);
              }

              if (!Q.$objectExist(first)) {
                reject('empty');
                return;
              }

              docTitle = Q.$stringExist(first.title) ? encodeURIComponent(first.title.toLowerCase().replace(/\s/g, '_')) : 'no_title';
              docId = base64.encode(first.id);
              resolve({
                docTitle,
                docId
              });
            }, err => {
              reject(err);
            });
          });
        }

        findPrinciplesCollId() {
          let {
            modal,
            collectionFetcher
          } = this,
              principles;
          return new Promise((resolve, reject) => {
            collectionFetcher.findAll().then(res => {
              principles = res.$reduce(nxt => nxt.name && nxt.name.toLowerCase() === 'principles').$first();

              if (Q.$objectExist(principles)) {
                resolve(principles.id);
              } else {
                modal.$enter('smallNotifModal', {
                  icon: 'fa fa-exclamation-triangle text-warning',
                  message: 'Sorry, Principles is not available at the moment. ' + 'Please try again later',
                  showRemove: true
                });
                reject('Principles not available');
              }
            }, err => {
              reject(err);
            });
          });
        }

      }

      $export(GlobalFnHelper);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;
      const cacheName = "doc-search@cache";

      class PsDocSearch extends awr.Service {
        static get $require() {
          return {
            searchCache: 'service:searchCache',
            server: 'service:serverCall',
            remoteCnf: 'config:remoteConnection'
          };
        }

        constructor() {
          super(PsDocSearch.$require);
          /*services should not dependent by wait on any scope!*/

          Object.defineProperty(this, 'superScope', {
            get() {
              return $import('object:awr.superScope');
            }

          });
        }

        search(query, {
          type = null,
          key = null,
          take = 20
        } = {}) {
          let {
            server,
            remoteCnf,
            superScope,
            searchCache
          } = this,
              url = `${remoteCnf.serverURL}/api/ps_story_search?query=${encodeURIComponent(query)}`,
              devId = remoteCnf.deviceSessionId,
              user_id = Q.$objectExist(superScope.currentUser) ? superScope.currentUser.id : null,
              cachedResult;

          if (!Q.$stringExist(query)) {
            return Promise.reject('no query!');
          }

          if (searchCache.inCache(cacheName, query)) {
            cachedResult = searchCache.getFromCache(cacheName, query);
            $emit('search:ps-doc', {
              results: cachedResult,
              query: query
            });
            cachedResult = Q.$asCollection(Q.$isEmpty(cachedResult) ? [] : cachedResult);
            return Promise.resolve(cachedResult);
          }

          if (Q.$stringExist(type)) {
            url += `&type=${encodeURIComponent(type)}`;
          }

          if (Q.$stringExist(key)) {
            url += `&key=${encodeURIComponent(key)}`;
          }

          if (Q.$exist(user_id)) {
            url += `&user_id=${user_id}`;
          }

          if (Q.$stringExist(devId)) {
            url += `&device_session_id=${devId}`;
          }

          return new Promise((resolve, reject) => {
            server.$get({
              url: url
            }).then(res => {
              let results = Q.$asCollection(Q.$isEmpty(res) ? [] : res);

              if (Q.$numberExist(take)) {
                results = results.$take(take);
              }

              searchCache.putInCache(cacheName, query, results);
              $emit('search:ps-doc', {
                results,
                query: query
              });
              resolve(results);
            }, err => {
              console.error(err);
            });
          });
        }

      }

      $export(PsDocSearch);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;
      const adminRoleNames = ['admin@pageshare', 'moderator', 'super'];

      class RoleHelper extends awr.Service {
        static get $require() {
          return {};
        }

        constructor() {
          super(RoleHelper.$require);
        }

        isAdminInPublisher(publisher, userId) {
          return this.hasRoleInPublisher(publisher, userId, 'publisher') || this.hasRoleInPublisher(publisher, userId, 'moderator');
        } // noinspection JSMethodCanBeStatic


        canOwnPersonalCollections(user) {
          if (!Q.$objectExist(user)) {
            return false;
          }

          return hasOneRole(!Q.$isEmpty(user.roles) ? user.roles : [], ['author@pageshare', 'admin@pageshare', 'moderator', 'super']);
        }

        canEditDoc(user, doc, collection, publishers) {
          if (!(Q.$objectExist(user) && Q.$objectExist(doc) && Q.$numberExist(parseInt(doc.user_id)))) {
            return false;
          }

          if (parseInt(doc.user_id) === parseInt(user.id)) {
            return true;
          }

          return this.canEditDocsInCollection(user, collection, publishers);
        }

        canEditDocsInCollection(user, collection, publishers) {
          if (!this.canCreateDocsInCollection(user, collection, publishers)) {
            return false;
          }

          let pub = Q.$reduce(publishers, nxt => parseInt(nxt.id) === parseInt(collection.publisher_id)).$first();
          return this.hasRoleInPublisher(pub, user.id, 'publisher') || this.hasRoleInPublisher(pub, user.id, 'moderator');
        }

        canCreateDocsInCollection(user, collection, publishers) {
          if (!(Q.$objectExist(user) && Q.$objectExist(collection) && Q.$numberExist(parseInt(collection.user_id)))) {
            return false;
          }

          if (parseInt(collection.user_id) === parseInt(user.id)) {
            return true;
          }

          if (!Q.$numberExist(parseInt(collection.publisher_id))) {
            return false;
          }

          let pub = Q.$reduce(publishers, nxt => parseInt(nxt.id) === parseInt(collection.publisher_id)).$first();

          if (!Q.$objectExist(pub)) {
            return false;
          }

          return this.hasRoleInPublisher(pub, user.id, 'any');
        }

        hasRoleInPublisher(publisher, userId, roleName) {
          if (!(Q.$objectExist(publisher) && Q.$exist(userId) && Q.$stringExist(roleName))) {
            return false;
          }

          let {
            moderators,
            creators
          } = publisher,
              isModerator = !Q.$isEmpty(moderators) && Q.$count(moderators, nxt => Q.$idEqual(nxt.id, userId)) > 0,
              isCreator = !Q.$isEmpty(creators) && Q.$count(creators, nxt => Q.$idEqual(nxt.id, userId)) > 0,
              isPublisher = Q.$idEqual(publisher.user_id, userId);
          roleName = roleName.toLowerCase();
          return roleName === 'any' ? isPublisher || isModerator || isCreator : roleName === 'moderator' ? isModerator : roleName === 'creator' ? isCreator : isPublisher;
        }

        hasPSAdminRoleOrHigher(user) {
          return Q.$objectExist(user) && !Q.$isEmpty(user.roles) && Q.$count(user.roles, nxt => {
            return nxt.name && Q.$setContainsString(['super', 'admin@pageshare', 'moderator'], nxt.name.toLowerCase());
          }) > 0;
        }

        isPSAdminOrHigher(scope, userId) {
          return this.hasRole(scope, userId, 'admin') || this.hasRole(scope, userId, 'super');
        }

        hasRole(scope, userId, roleName) {
          if (!(Q.$stringExist(roleName) && Q.$exist(userId))) {
            return false;
          }

          scope = Q.$objectExist(scope) ? scope : {};
          let {
            publishers,
            users
          } = scope,
              roleFound = false;

          if (Q.$setContainsString(['moderator', 'publisher', 'creator'], roleName) && Q.$isEmpty(publishers)) {
            return false;
          }

          if (roleName === 'publisher') {
            roleFound = publishers.$count(nxt => nxt && Q.$idEqual(nxt.user_id, userId)) > 0;
          } else if (roleName === 'moderator') {
            publishers.$each(nxt => {
              if (!Q.$isEmpty(nxt.moderators) && Q.$count(nxt.moderators, moder => moder && Q.$idEqual(moder.id, userId))) {
                roleFound = true;
              }
            });
          } else if (roleName === 'creator') {
            publishers.$each(nxt => {
              if (!Q.$isEmpty(nxt.creators) && Q.$count(nxt.creators, creator => creator && Q.$idEqual(creator.id, userId))) {
                roleFound = true;
              }
            });
          } else if (!Q.$isEmpty(users)) {
            roleName = roleName === 'admin' || roleName === 'author' ? `${roleName}@pageshare` : roleName;
            users.$each(nxtUsr => {
              if (Q.$idEqual(nxtUsr.id, userId) && hasRole(nxtUsr.roles, roleName)) {
                roleFound = true;
              }
            });
          }

          return roleName === 'reader' || roleFound;
        } // noinspection JSMethodCanBeStatic


        rolesInclude(user, roleName) {
          if (!Q.$objectExist(user)) {
            return false;
          }

          return hasRole(user.roles, roleName);
        }

      }

      $export(RoleHelper);

      function hasOneRole(roles, options) {
        let result = false;

        if (Q.$isEmpty(roles) || Q.$isEmpty(options)) {
          return result;
        }

        Q.$each(options, nxt => {
          if (hasRole(roles, nxt)) {
            result = true;
          }
        });
        return result;
      }

      function hasRole(roles, roleName) {
        return !Q.$isEmpty(roles) && Q.$stringExist(roleName) && Q.$count(roles, r => {
          if (roleName === 'admin@pageshare') {
            return Q.$setContainsString(adminRoleNames, r.name);
          }

          return r && r.name === roleName;
        }) > 0;
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');
      let savedVal = 0,
          current,
          body = 'body';

      class ScrollDirection extends awr.Service {
        static get $require() {
          return {};
        }

        constructor() {
          super(ScrollDirection.$require);
        }

        start(superScope) {
          // let {superScope} = this;
          $(window).on('scroll', event => {
            if (Q.$booleanTrue(superScope.dontCheckTheScroll)) {
              return;
            }

            current = $(window).scrollTop();
            $(body).toggleClass('has-some-scroll', current >= 10 && current < 65);
            $(body).toggleClass('has-scroll', current >= 65);

            if (current < savedVal) {
              savedVal = current;
              $(body).removeClass('down-scroll');
              $(body).addClass('up-scroll');
            } else if (current > savedVal && current >= 65) {
              savedVal = current;
              $(body).removeClass('up-scroll');
              $(body).addClass('down-scroll');
            }
          });
        }

      }

      $export(ScrollDirection);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          cache = {};

      class SearchCache extends awr.Service {
        static get $require() {
          return {};
        }

        constructor() {
          super(SearchCache.$require);
        }

        putInCache(cacheName, query, results) {
          if (!(Q.$stringExist(cacheName) && Q.$stringExist(query))) {
            return false;
          }

          createCacheIfNotExists(cacheName);
          let queryCache = cache[cacheName];
          queryCache = Q.$reduce(queryCache, nxt => {
            return !(Q.$stringEqual(nxt.query, query) || nxt.expires.getTime() <= new Date().getTime());
          });
          queryCache.push({
            query: query,
            expires: new Date(new Date().getTime() + 60000),
            results: results
          });
          queryCache = Q.$descendingDate(queryCache, 'expires');
          queryCache = Q.$limit(queryCache, 200);
          cache[cacheName] = queryCache;
        }

        inCache(cacheName, query) {
          if (!(Q.$stringExist(cacheName) && Q.$stringExist(query))) {
            return false;
          }

          createCacheIfNotExists(cacheName);
          let queryCache = cache[cacheName];
          queryCache = Q.$reduce(queryCache, nxt => {
            return nxt.expires.getTime() > new Date().getTime();
          });
          return Q.$count(queryCache, nxt => Q.$stringEqual(nxt.query, query)) > 0;
        }

        getFromCache(cacheName, query) {
          if (!(Q.$stringExist(cacheName) && Q.$stringExist(query))) {
            return Q.$asCollection([]);
          }

          createCacheIfNotExists(cacheName);
          let queryCache = cache[cacheName];
          return this.inCache(cacheName, query) ? Q.$collect(queryCache, (collected, nxt) => {
            return Q.$stringEqual(nxt.query, query) ? nxt.results : collected;
          }) : null;
        }

      }

      $export(SearchCache);

      function createCacheIfNotExists(cacheName) {
        if (!(cache.hasOwnProperty(cacheName) && Q.$arrayNotEmpty(cache[cacheName]))) {
          cache[cacheName] = Q.$asCollection([]);
        }
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;
      const cacheName = "saerch@cache";

      class Search extends awr.Service {
        static get $require() {
          return {
            searchCache: 'service:searchCache',
            server: 'service:serverCall',
            remoteCnf: 'config:remoteConnection'
          };
        }

        constructor() {
          super(Search.$require);
          /*services should not dependent by wait on any scope!*/

          Object.defineProperty(this, 'superScope', {
            get() {
              return $import('object:awr.superScope');
            }

          });
        }

        search(query, limit, target) {
          let {
            server,
            remoteCnf,
            superScope,
            searchCache
          } = this;
          let user_id = Q.$objectExist(superScope.currentUser) ? superScope.currentUser.id : null,
              devId = remoteCnf.deviceSessionId,
              cachedResult,
              url = `${remoteCnf.serverURL}/api/search?query=${encodeURIComponent(query)}`;

          if (!Q.$stringExist(query)) {
            return Promise.reject('no query!');
          }

          if (limit < 15 && searchCache.inCache(cacheName, query)) {
            cachedResult = searchCache.getFromCache(cacheName, query);
            $emit('search:story-search', {
              results: cachedResult,
              query: query,
              target: target
            });
            return Promise.resolve({
              results: cachedResult,
              query: query
            });
          }

          if (Q.$exist(limit)) {
            url += `&limit=${limit}`;
          }

          if (Q.$exist(user_id)) {
            url += `&user_id=${user_id}`;
          }

          if (Q.$stringExist(devId)) {
            url += `&device_session_id=${devId}`;
          }

          return new Promise((resolve, reject) => {
            server.$get({
              url: url
            }).then(res => {
              let results = {
                stories: Q.$asCollection(res && Q.$arrayNotEmpty(res.stories) ? res.stories : []).$map(nxt => {
                  nxt.resultType = 'story';
                  return nxt;
                }),
                profiles: Q.$asCollection(res && Q.$arrayNotEmpty(res.profiles) ? res.profiles : []).$map(nxt => {
                  nxt.resultType = 'profile';
                  return nxt;
                })
              };
              $emit('search:story-search', {
                results,
                query: query,
                target: target
              });
              resolve({
                items: results,
                query: query
              });

              if (limit < 15) {
                searchCache.putInCache(cacheName, query, res);
              }
            }, err => {
              console.error(err);
            });
          });
        }

      }

      $export(Search);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');

      class ShelfViewUpdater extends awr.Service {
        static get $require() {
          return {
            collFetcher: 'service:collectionFetcher',
            remoteCnf: 'config:remoteConnectionConfig',
            router: 'service:router',
            roleHelper: 'service:roleHelper',
            myDocModel: 'model:MyDoc',
            docModel: 'model:Doc'
          };
        }

        constructor() {
          super(ShelfViewUpdater.$require);
          /*services should not depend, by wait, on any scope!*/

          Object.defineProperty(this, 'superScope', {
            get() {
              return $import('object:awr.superScope');
            }

          });
        }

        update(scope) {
          let {
            collFetcher,
            remoteCnf,
            roleHelper,
            router,
            superScope
          } = this;
          updateView({
            scope,
            collFetcher,
            router,
            remoteCnf,
            roleHelper,
            superScope
          });
        }

        setScopeItems(scope, coll) {
          let {
            superScope,
            remoteCnf
          } = this;
          setScopeItems(scope, coll, remoteCnf, superScope);
        }

        addItem(scope, itemId) {
          let {
            myDocModel,
            docModel,
            superScope,
            collFetcher,
            remoteCnf
          } = this,
              model = Q.$objectExist(superScope.currentUser) ? myDocModel : docModel;
          model.$findOne(itemId).then(docInstance => {
            collFetcher.addDocIntoCache(scope.coll.id, docInstance);

            if (Q.$count(scope.coll.stories, nd => nd.id === docInstance.id) < 1) {
              scope.coll.stories.push(docInstance);
            }

            setScopeItems(scope, scope.coll, remoteCnf, superScope); // scope.$recompile();

            scope.$append({
              selector: '.shelf .inner .s-items',
              segment: 'shelfItem',
              dataContext: docInstance
            });
          }, err => {
            console.error(err);
          });
        }

        removeItem(scope, itemId) {
          if (!Q.$numberExist(parseInt(itemId))) {
            return;
          }

          itemId = parseInt(itemId);
          let {
            collFetcher,
            remoteCnf,
            superScope
          } = this;
          scope.coll.stories = scope.coll.stories.$reduce(nxt => nxt.id !== itemId);
          collFetcher.removeDocFromCache(scope.coll.id, itemId);
          setScopeItems(scope, scope.coll, remoteCnf, superScope);
          scope.$getAllSegments().$each(nxt => {
            if (parseInt(nxt.dataContext.id) === itemId) {
              nxt.$remove();
            }
          });
        }

        removeItemIfNotAvailable(scope, itemId) {
          if (!Q.$exist(itemId)) {
            return;
          }

          let {
            myDocModel,
            docModel,
            superScope
          } = this,
              model = Q.$objectExist(superScope.currentUser) ? myDocModel : docModel;
          model.$findOne(itemId).then(docInstance => {//do nothing if available
          }, err => {
            this.removeItem(scope, itemId);
          });
        }

        handleItemBusyModes(scope, event) {
          let {
            collFetcher,
            remoteCnf,
            superScope
          } = this,
              item = $(scope.$getDom()).find(`.shelf-item[data-doc-id="${event.target_id}"]`);

          if (Q.$isEmpty(item) || scope.inControls) {
            return;
          }

          if (event.name.endsWith('start-processing')) {
            $(item).removeClass('loading');
            $(item).addClass('processing');
          } else if (event.name.endsWith('end-processing')) {
            $(item).removeClass('processing');
            scope.coll.stories = Q.$map(scope.coll.stories, nxt => {
              if (nxt.id == event.target_id) {
                event.target.is_busy = false;
                return event.target;
              }

              return nxt;
            });
            setScopeItems(scope, scope.coll, remoteCnf, superScope);
            scope.$getAllSegments().$each(nxt => {
              if (parseInt(nxt.dataContext.id) === parseInt(event.target_id)) {
                nxt.$upgrade(event.target);
              }
            });
          }
        }

      }

      $export(ShelfViewUpdater);

      function updateView({
        scope,
        collFetcher,
        router,
        roleHelper,
        remoteCnf,
        superScope
      }) {
        getData({
          collFetcher,
          superScope,
          router
        }).then(({
          collections,
          publishers,
          currentCollection,
          currentUser
        }) => {
          delete scope.canUserCreateDocs;
          Object.defineProperty(scope, 'canUserCreateDocs', {
            get() {
              if (Q.$objectExist(currentCollection) && currentCollection.id === 'agr') {
                return false;
              }

              return roleHelper.canCreateDocsInCollection(currentUser, currentCollection, publishers);
            },

            configurable: true
          });

          if (!Q.$objectExist(currentCollection)) {
            return;
          }

          if (currentCollection.id === 'agr' || !Q.$objectExist(scope.coll) || currentCollection.id !== scope.coll.id) {
            setScopeItems(scope, collFetcher.getCurrent(), remoteCnf, superScope);
            scope.$recompile();
          }
        }, err => {});
      }

      async function getData({
        collFetcher,
        superScope,
        router
      }) {
        let current = collFetcher.getCurrent();
        let pubResolvable = $import('resolvable:ctrPublishers');
        let collections = current && current.id === 'agr' ? Q.$asCollection([]) : await collFetcher.findAll();
        let publishers = await pubResolvable.resolve(router.$getCurrentState());
        superScope.cachedPublishers = publishers;
        return {
          collections,
          publishers,
          currentCollection: collFetcher.getCurrent(),
          currentUser: superScope.currentUser
        };
      }

      function setScopeItems(scope, coll, remoteCnf, superScope) {
        if (!Q.$objectExist(coll)) {
          scope.coll = {};
          scope.stories = Q.$asCollection([]);
          return;
        }

        scope.coll = coll;
        scope.stories = Q.$isEmpty(coll.stories) ? Q.$asCollection([]) : Q.$asCollection(coll.stories).$map(nxt => {
          // nxt.coverImg = nxt.cover ? `${remoteCnf.serverURL}${nxt.cover.src}` : '';
          nxt.isSelected = Q.$objectExist(superScope.currentDoc) && nxt.id == superScope.currentDoc.id;
          return nxt;
        });
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');

      class TokenService extends awr.Service {
        static get $require() {
          return {
            remoteConnCnf: 'config:remoteConnection',
            server: 'service:serverCall'
          };
        }

        constructor() {
          super(TokenService.$require);
        }

        getNewAccessToken(username, password) {
          let appGroup;
          let {
            remoteConnCnf,
            server
          } = this;

          if (Q.$numberExist(password)) {
            password = `${password}`;
          }

          if (!(Q.$stringExist(username) && Q.$stringExist(password))) {
            return Promise.reject('Bad credentials');
          }

          appGroup = $('meta[name="awr-app-group"]').first();
          return server.$post({
            url: `${remoteConnCnf.authURL}/token`,
            data: {
              app_group: Q.$arrayNotEmpty(appGroup) ? $(appGroup).attr('content') : 'default',
              grant_type: "password",
              username: username,
              password: password,
              scope: '*'
            }
          });
        }

        newEmailConfirmLink(token) {
          if (!Q.$stringExist(token)) {
            return Promise.reject('Get token user: Bad token!');
          }

          let {
            remoteConnCnf,
            server
          } = this;
          return server.$post({
            url: `${remoteConnCnf.serverURL}/api/email_confirm_link`,
            headers: {
              'authorization': token
            }
          });
        }

        destroyToken(token) {
          let {
            remoteConnCnf,
            server
          } = this;

          if (!Q.$stringExist(token)) {
            return Promise.reject('Destroy token: Bad token!');
          }

          return server.$delete({
            url: `${remoteConnCnf.authURL}/token`,
            headers: {
              'authorization': token
            }
          });
        }

        getTokenUser(token) {
          let {
            remoteConnCnf,
            server
          } = this;

          if (!Q.$stringExist(token)) {
            return Promise.reject('Get token user: Bad token!');
          }

          return server.$get({
            url: `${remoteConnCnf.authURL}/token_user`,
            headers: {
              'authorization': token
            }
          });
        }

        exchangeToken(exchange) {
          let {
            remoteConnCnf,
            server
          } = this;
          return server.$post({
            url: `${remoteConnCnf.serverURL}/xauth/token_exchange`,
            data: {
              key: exchange
            }
          });
        }

      }

      $export(TokenService);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;
      /*
       |  Documentation here:
       |
       |  Help your teammates to fast learn about your valuable work in here by
       |  providing some useful instruction about your work. For instance, say "why" this module exist
       |  and how it should be used! Documenting your work does not mean writing your code again in English,
       |  they also understand code just like you do!
       */

      class CookieBanner extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(CookieBanner.$require);
          this.template = 'app/shared/components/cookie-banner/cookie-banner.hbs';
          this.controller = 'CookieBanner';
        }

      }

      $export(CookieBanner);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');
      const cookiePolicyKeyPrefix = 'ps_acp_';

      class CookieBanner extends awr.Controller {
        static get $require() {
          return {
            remoteCnf: 'config:remoteConnectionConfig',
            superScope: 'object:awr.superScope',
            base64: 'service:uriBase64'
          };
        }

        constructor(data, parent) {
          super(CookieBanner.$require, data, parent);
          let {
            superScope,
            base64
          } = this,
              scope = this,
              status;
          this.$init(_ => {
            status = getAcceptCookieValue(superScope.currentUser, base64);
            $(this.$getDom()).find('.cookie-banner').toggleClass('on', !(Q.$stringExists(status) && status === 'true'));
          });
        }

        accept() {
          let {
            superScope,
            base64
          } = this;
          setAcceptCookieValue(superScope.currentUser, base64);
        }

      }

      $export(CookieBanner);

      function getAcceptCookieValue(user, base64) {
        return localStorage.getItem(`${cookiePolicyKeyPrefix}${Q.$exists(user) ? base64.encode(user.id).toLowerCase() : 'null'}`);
      }

      function setAcceptCookieValue(user, base64) {
        return localStorage.setItem(`${cookiePolicyKeyPrefix}${Q.$exists(user) ? base64.encode(user.id).toLowerCase() : 'null'}`, 'true');
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class DocMenu extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(DocMenu.$require);
          this.controller = 'DocMenu';
          this.template = 'app/shared/components/doc-menu/doc-menu.hbs';
          this.scope = {
            currentDoc: '='
          };
        }

      }

      $export(DocMenu);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery'),
          labels = ['collections', 'languages', 'authors', 'categories', 'year'];

      class DocMenu extends awr.Controller {
        static get $require() {
          return {
            collFetcher: 'service:collectionFetcher',
            superScope: 'object:awr.superScope',
            roleHelper: 'service:roleHelper',
            docSearch: 'service:psDocSearch'
          };
        }

        constructor(data, parent) {
          super(DocMenu.$require, data, parent);
          let {
            collFetcher,
            superScope,
            roleHelper
          } = this,
              scope = this;
          setupScopeItems(scope, labels, collFetcher, superScope);
          Object.defineProperty(this, 'userCanEditDoc', {
            get() {
              if (!Q.$objectExist(superScope.currentDoc)) {
                return false;
              }

              let coll = collFetcher.getDocCollections(superScope.currentDoc.id);
              coll = !Q.$isEmpty(coll) ? coll[0] : null;
              return roleHelper.canEditDoc(superScope.currentUser, superScope.currentDoc, coll, superScope.cachedPublishers || Q.$asCollection([]));
            }

          });
          scope.$bind('observable:collectionEvents', {
            onEvent(event, preventDefault) {
              preventDefault();

              if (event.name === 'new-doc-selected') {
                setupScopeItems(scope, labels, collFetcher, superScope);
                scope.$recompile();
              }
            }

          });
        }

        handle(group, searchId, value) {
          this.$preventDefault();
          let {
            docSearch,
            collFetcher
          } = this,
              agrId;

          if (group === 'collections') {
            return;
          }

          docSearch.search(searchId).then(stories => {
            agrId = collFetcher.aggregate(stories);
            collFetcher.setCurrent(agrId);
          }, err => {
            console.error(err);
          });
        }

      }

      $export(DocMenu);

      function setupScopeItems(scope, groups, collFetcher, superScope) {
        let currentDoc = superScope.currentDoc;
        groups = !Q.$isEmpty(groups) ? Q.$asCollection(groups) : Q.$asCollection([]);

        if (!Q.$objectExist(currentDoc)) {
          scope.items = Q.$asCollection([]);
          return;
        }

        scope.docId = currentDoc.id;
        scope.items = Q.$asCollection(groups).$map(nxtGrp => {
          let values = Q.$asCollection([]);
          currentDoc.meta = Q.$isEmpty(currentDoc.meta) ? Q.$asCollection([]) : Q.$asCollection(currentDoc.meta);

          if (nxtGrp === 'collections') {
            values = collFetcher.getDocCollections(currentDoc.id).$map(nxtC => {
              nxtC.value = nxtC.name;
              nxtC.searchId = nxtC.id;
              return nxtC;
            });
          } else {
            values = groups.$reduce(nxtG => nxtG !== 'collections' && nxtG === nxtGrp).$map(nxtG => {
              return currentDoc.meta.$reduce(nxtM => nxtM.key === nxtGrp).$map(nxtM => {
                return {
                  value: Q.$setContainsString(['authors', 'languages'], nxtM) ? Q.$capitalizeName(nxtM.value) : nxtM.value,
                  searchId: nxtM.value
                };
              });
            }).$flatten();
          }

          return {
            icon: getIcon(nxtGrp),
            group: nxtGrp,
            label: nxtGrp === 'year' ? 'Year of publication' : Q.$capitalizeFirstLetter(nxtGrp) + ':',
            values: values
          };
        }).$reduce(nxt => !Q.$isEmpty(nxt.values));

        if (Q.$isEmpty(currentDoc.tags)) {
          return;
        }

        scope.items.push({
          icon: getIcon('categories'),
          group: 'tags',
          label: 'Tags',
          values: Q.$map(currentDoc.tags, nxt => {
            return {
              value: nxt.name,
              searchId: nxt.name
            };
          })
        });
      }

      function getIcon(group) {
        let gr = group.toLowerCase();

        if (gr === 'collections') {
          return 'fas fa-sitemap';
        } else if (gr === 'authors') {
          return 'fas fa-pen-nib';
        } else if (gr === 'year') {
          return 'fas fa-calendar';
        } else if (gr === 'categories') {
          return 'fas fa-hashtag';
        } else if (gr === 'languages') {
          return 'fas fa-globe';
        }

        return '';
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class MainMenu extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(MainMenu.$require);
          this.controller = 'MainMenu';
          this.template = 'app/shared/components/main-menu/main-menu.hbs';
          this.scope = {};
        }

      }

      $export(MainMenu);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');

      class MainMenu extends awr.Controller {
        static get $require() {
          return {
            superScope: 'object:awr.superScope',
            remoteCnf: 'config:remoteConnectionConfig',
            roleHelper: 'service:roleHelper'
          };
        }

        constructor(data, parent) {
          super(MainMenu.$require, data, parent);
          let {
            superScope,
            remoteCnf
          } = this,
              scope = this;
          scope.$importProperty('currentUser');
          Object.defineProperty(this, 'publishers', {
            get() {
              return Q.$asCollection(Q.$arrayExists(superScope.cachedPublishers) ? superScope.cachedPublishers : []);
            }

          });
          setupMenuItems(scope);
          scope.$bind('observable:authEvents', {
            onEvent(event, preventDefault) {
              preventDefault();

              if (!Q.$objectExist(event)) {
                return;
              }

              if (!Q.$setContainsString(['sign-in', 'sign-out'], event.type)) {
                return;
              }

              if (event.type === 'sign-in') {
                scope.currentUser = event.user;
                setupMenuItems(scope);
              } else if (event.type === 'sign-out') {
                scope.currentUser = null;
                setupMenuItems(scope);
              }

              setTimeout(_ => {
                scope.$recompile();
              }, 0);
            }

          });
        }

        toggleMenu() {
          this.$preventDefault();
          let scope = this,
              menu = $(scope.$getDom()).find('.main-menu-expand'),
              toggle = $(scope.$getDom()).find('.main-menu.menu-toggle');
          $(menu).animate({
            width: 'toggle'
          }, 165, function () {
            if ($(menu).hasClass('on')) {
              $(menu).removeClass('on');
              $(toggle).removeClass('open');
            } else {
              $(menu).addClass('on');
              $(toggle).addClass('open');
            }
          });
        }

        action(id) {
          this.$preventDefault();
          let {
            superScope
          } = this,
              collsGroup;

          if (Q.$setContainsString(['signIn', 'signUp'], id)) {
            if (Q.$functionExist(superScope.redirectToAuth)) {
              superScope.redirectToAuth.call(superScope, id);
            }
          } else if (id === 'scrollTop') {
            superScope.scrollToTop();
          } else if (id === 'myShelf') {
            superScope.openMyShelf();
          } else if (id === 'myCollections') {
            superScope.openMyCollections();
          } else if (id === 'principles') {
            superScope.openPrinciples();
          } else if (id === 'github') {
            window.open('https://github.com/Pageprism/pageprism', '_blank');
          } else if (id === 'controls') {
            superScope.openControls();
          } else if (id === 'colls') {
            collsGroup = $(this.$getDom()).find('.mv-item-container.colls-parent');
            $(collsGroup).toggleClass('open', !$(collsGroup).hasClass('open'));
          }
        }

      }

      $export(MainMenu);

      function setupMenuItems(scope) {
        let {
          superScope,
          roleHelper
        } = scope;
        scope.items = getScopeItems();

        if (Q.$objectExist(scope.currentUser)) {
          scope.items = scope.items.$reduce(nxt => !Q.$setContainsString(['signIn', 'signUp'], nxt.id));

          if (!(roleHelper.canOwnPersonalCollections(scope.currentUser) || roleHelper.hasRole(scope, scope.currentUser.id, 'creator') || roleHelper.hasRole(scope, scope.currentUser.id, 'moderator') || roleHelper.hasRole(scope, scope.currentUser.id, 'publisher'))) {
            scope.items = scope.items.$reduce(nxt => !Q.$setContainsString(['myShelf'], nxt.id));
          }
        } else {
          scope.items = scope.items.$reduce(nxt => !Q.$setContainsString(['controls', 'myShelf', 'myCollections'], nxt.id));
        }
      }

      function getScopeItems() {
        let set = [{
          name: 'Scroll to top',
          id: 'scrollTop',
          icon: 'fa fa-arrow-circle-up',
          class: 'scroll-top'
        }, {
          name: 'Code',
          id: 'github',
          icon: 'fab fa-github'
        }, {
          name: 'principles',
          id: 'principles',
          icon: 'far fa-lightbulb'
        }, {
          name: 'collections',
          id: 'colls',
          icon: 'fa fa-sitemap',
          isCollections: true
        }, {
          name: 'Sign in',
          id: 'signIn',
          icon: 'fas fa-sign-in-alt'
        }, {
          name: 'Register',
          id: 'signUp',
          icon: 'fas fa-user-plus'
        }, {
          name: 'My Shelf',
          id: 'myShelf',
          icon: 'fa fa-book-open'
        }, {
          name: 'My Collections',
          id: 'myCollections',
          icon: 'fas fa-boxes'
        }, {
          name: 'Controls',
          id: 'controls',
          icon: 'fa fa-wrench'
        }];
        return Q.$asCollection(set);
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class MenuCollections extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(MenuCollections.$require);
          this.controller = 'MenuCollections';
          this.template = 'app/shared/components/menu-collections/menu-collections.hbs';
          this.scope = {};
        }

      }

      $export(MenuCollections);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');

      class MenuCollections extends awr.Controller {
        static get $require() {
          return {
            collFetcher: 'service:collectionFetcher',
            superScope: 'object:awr.superScope',
            router: 'service:router'
          };
        }

        constructor(data, parent) {
          super(MenuCollections.$require, data, parent);
          let {
            collFetcher,
            superScope,
            router,
            screen
          } = this,
              scope = this;
          updateView(scope, collFetcher, false, false);
          this.$bind('observable:collectionEvents', {
            onEvent(event, preventDefault) {
              preventDefault();

              if (event.name === 'new-current') {
                updateView(scope, collFetcher, false, false);
              }
            }

          });
          this.$bind('model:MyCollection', {
            onEvent(event, preventDefault) {
              preventDefault();

              if (Q.$setContainsString(['remove', 'create', 'save'], event.requestType)) {
                updateView(scope, collFetcher, true, true);
              }
            }

          });
          this.$init(_ => {
            let bodyHeight = $('body').height(),
                maxHeight = Math.min(600, Math.max(200, bodyHeight - 238));
            $(this.$getDom()).find('.item-container').css('maxHeight', `${maxHeight}px`);
          });
        }

        openCollection(event, collId) {
          this.$preventDefault();
          let {
            superScope
          } = this;
          $(this.$getDom()).find('.coll-item').removeClass('selected');
          $(this.$getDom()).find(`.coll-item[data-cl-id='${collId}']`).addClass('selected');
          superScope.openCollection(collId);
        }

        editColls() {
          this.$preventDefault();
          let {
            router
          } = this;
          router.$go('my-collections-view', {
            params: {
              cId: 'index'
            },
            attrs: {}
          }, true);
        }

      }

      $export(MenuCollections);

      function updateView(scope, collFetcher, refresh = false, isSave = false) {
        let cr,
            newHash,
            now,
            time = new Date().getTime() + 500;
        scope.colls = Q.$asCollection([]);
        collFetcher.findAll(refresh).then(res => {
          scope.colls = res.$map(nxt => {
            // nxt.name += nxt.name + nxt.name + nxt.name;
            cr = collFetcher.getCurrent();
            nxt.isCurrent = cr && Q.$idEqual(cr.id, nxt.id);
            return nxt;
          }).$reduce(nxt => nxt.name && nxt.name.toLowerCase() !== 'principles');
          newHash = scope.colls.map(nxt => nxt.id).join('-');

          if (isSave || !Q.$stringExist(newHash) || scope.hash !== newHash) {
            scope.hash = newHash;
            now = new Date().getTime();

            if (now < time) {
              setTimeout(_ => {
                scope.$recompile();
              }, 500);
            } else {
              scope.$recompile();
            }
          }
        }, err => {});
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class PrivacyPolicyModal extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(PrivacyPolicyModal.$require);
          this.template = 'app/shared/components/privacy-policy-modal/privacy-policy-modal.hbs';
          this.controller = 'PrivacyPolicyModal';
        }

      }

      $export(PrivacyPolicyModal);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');

      class PrivacyPolicyModal extends awr.Controller {
        static get $require() {
          return {
            modal: 'service:modal',
            superScope: 'object:awr.superScope'
          };
        }

        constructor(data, parent) {
          super(PrivacyPolicyModal.$require, data, parent);
          let scope = this;
          this.$disableDefaultActionAutoRecompile();
        }

        agree() {
          let {
            modal,
            superScope
          } = this;
          $(superScope.$getDom()).find('input[type="checkbox"]').each((idx, elem) => {
            if ($(elem).attr('name') === 'acceptTerms' && !$(elem).prop('checked')) {
              $(elem).trigger('click');
            }
          });
          setTimeout(_ => {
            modal.$exit();
          }, 0);
        }

      }

      $export(PrivacyPolicyModal);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class PsHeader extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(PsHeader.$require);
          this.controller = 'PsHeader';
          this.template = 'app/shared/components/ps-header/ps-header.hbs';
          this.scope = {};
        }

      }

      $export(PsHeader);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');

      class PsHeader extends awr.Controller {
        static get $require() {
          return {
            superScope: 'object:awr.superScope',
            router: 'service:router'
          };
        }

        constructor(data, parent) {
          super(PsHeader.$require, data, parent);
          let {
            superScope
          } = this,
              scope = this;
          scope.brandText = Q.$objectExist(superScope.currentDoc) && Q.$stringExist(superScope.currentDoc.title) ? superScope.currentDoc.title : 'Pageshare';
          scope.hasDocMenu = Q.$objectExist(superScope.currentDoc);
          scope.$bind('observable:start@states@router', {
            onEvent(event, preventDefault) {
              preventDefault();
              scope.brandText = 'Pageshare';
              scope.hasDocMenu = false;
              $(scope.$getDom()).find('.navbar-brand .text').text(scope.brandText);
              $(scope.$getDom()).find('.ps-header').toggleClass('has-doc-menu', scope.hasDocMenu);
            }

          });
          scope.$bind('observable:collectionEvents', {
            onEvent(event, preventDefault) {
              preventDefault();

              if (event.name === 'new-doc-selected') {
                if (event.doc && Q.$stringExist(event.doc.title)) {
                  scope.brandText = event.doc.title;
                } else {
                  scope.brandText = 'Pageshare';
                }

                scope.hasDocMenu = Q.$objectExist(superScope.currentDoc);
                $(scope.$getDom()).find('.navbar-brand .text').text(scope.brandText);
                $(scope.$getDom()).find('.ps-header').toggleClass('has-doc-menu', scope.hasDocMenu);
              }
            }

          });
        }

        brandClick() {
          this.$preventDefault();
          let {
            router
          } = this;
          router.$goDefault();
        }

        toggleDocMenu() {
          this.$preventDefault();
          let menu = $(this.$getDom()).find('.ps-header .doc-menu'),
              parent = $(this.$getDom()).find('.ps-header');
          $(menu).animate({
            height: 'toggle'
          }, 165, function () {
            if ($(parent).hasClass('doc-menu-open')) {
              $(parent).removeClass('doc-menu-open');
            } else {
              $(parent).addClass('doc-menu-open');
            }
          });
        }

      }

      $export(PsHeader);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class Shelf extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(Shelf.$require);
          this.controller = 'Shelf';
          this.template = 'app/shared/components/shelf/shelf.hbs';
          this.scope = {};
        }

      }

      $export(Shelf);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');

      class Shelf extends awr.Controller {
        static get $require() {
          return {
            remoteCnf: 'config:remoteConnectionConfig',
            superScope: 'object:awr.superScope',
            router: 'service:router',
            viewUpdater: 'service:shelfViewUpdater',
            psDocEvents: 'observable:psDocEvents'
          };
        }

        constructor(data, parent) {
          super(Shelf.$require, data, parent);
          let {
            superScope,
            router,
            viewUpdater,
            psDocEvents
          } = this;
          let scope = this,
              currentLeftScroll = 0,
              inControls,
              sectionName,
              state = router.$getCurrentState(),
              ctrEnv = getCtrEnv(state);
          viewUpdater.setScopeItems(this, null);
          viewUpdater.update(this);
          this.isShelf = true;
          this.inControls = ctrEnv.inControls;
          this.sectionName = ctrEnv.sectionName;
          this.cSections = getCSectionItems();
          inControls = this.inControls;
          sectionName = this.sectionName;
          this.$bind(psDocEvents, {
            onEvent(event, preventDefault) {
              preventDefault();

              if (Q.$setContainsString(['ps-doc:start-processing', 'ps-doc:end-processing'], event.name)) {
                viewUpdater.handleItemBusyModes(scope, event);
                return;
              }

              if (!(Q.$objectExist(event.target) && Q.$objectExist(scope.coll) && Q.$setContainsNumber(event.target.collection_membership, scope.coll.id))) {
                return;
              }

              if (!docInShelf(scope, {
                modelInstance: event.target
              }) && (event.name.endsWith('new') || event.name === 'ps-doc:publish')) {
                scope.coll.stories.push(event.target);
                viewUpdater.addItem(scope, event.target_id); // scope.stories.push(event.target);
              } else if (event.name.endsWith('remove') && docInShelf(scope, {
                modelInstance: event.target
              })) {
                viewUpdater.removeItem(scope, event.target_id);
              } else if (event.name.endsWith('unpublish') && docInShelf(scope, {
                modelInstance: event.target
              })) {
                viewUpdater.removeItemIfNotAvailable(scope, event.target_id);
              }
            }

          });
          this.$bind('observable:collectionEvents', {
            onEvent(event, preventDefault) {
              preventDefault();

              if (event.name === 'new-current') {
                viewUpdater.update(scope);
              } else if (event.name === 'new-doc-selected' && !Q.$isEmpty(scope.stories)) {
                /**
                 * The event arrives sometime as reset signal without any doc.
                 * In such case we only have to remove the selected class.
                 * Example for such situation is when app ends up in a doc-not-found
                 * state with shelf being visible! So it would be stupid to keep
                 * previously selected doc as selected at this point!
                 * */
                $(scope.$getDom()).find('.shelf-item').removeClass('selected');

                if (Q.$objectExist(event.doc) && scope.stories.$count(nxt => event.doc && nxt.id == event.doc.id) > 0) {
                  $(scope.$getDom()).find(`.shelf-item[data-doc-id='${event.doc.id}']`).addClass('selected');
                  viewUpdater.setScopeItems(scope, scope.coll);
                }
              }
            }

          });
          this.$bind('model:Collection', {
            onEvent(event, preventDefault) {
              preventDefault();

              if (scope.inControls) {
                return;
              }

              if (event.requestType === 'findAll') {
                viewUpdater.update(scope);
              }
            }

          });
          this.$bind('observable:start@states@router', {
            onEvent(event, preventDefault) {
              preventDefault();
              currentLeftScroll = $(this.$getDom()).find('.shelf').scrollLeft();
            }

          });
          this.$bind('observable:success@states@router', {
            onEvent(event, preventDefault) {
              preventDefault();
              let ctrEnv = getCtrEnv(event.to);
              inControls = ctrEnv.inControls;
              sectionName = ctrEnv.sectionName;

              if (!(inControls || scope.inControls)) {
                return;
              }

              if (!(scope.inControls === inControls && Q.$stringExist(scope.sectionName) && scope.sectionName === sectionName)) {
                scope.inControls = inControls;
                scope.sectionName = sectionName;
                scope.$recompile();
              }
            }

          });
          this.$init(_ => {
            Q.$each(this.stories, nxt => {
              let item = $(scope.$getDom()).find(`.shelf-item[data-doc-id="${nxt.id}"]`);

              if (Q.$booleanTrue(nxt.is_busy)) {
                $(item).removeClass('loading');
                $(item).addClass('processing');
              }
            });
            $(this.$getDom()).find('.shelf').scrollLeft(currentLeftScroll);
          });
          this.$bind('observable:authEvents', {
            onEvent(event, preventDefault) {
              preventDefault();

              if (event.type === 'sign-in') {} else if (event.type === 'sign-out') {
                $(scope.$getDom()).find('.shelf-item.add-doc').removeClass('on');
              }
            }

          });
        }

        openCSection(id) {
          this.$preventDefault();
          let {
            router
          } = this,
              state = router.$getCurrentState();

          if (state.name === 'controls-view' && state.params.section === id) {
            return;
          }

          if (Q.$setContainsString(['users', 'bookmarks', 'tags', 'invite', 'my-publisher'], id)) {
            router.$go(`${id}-view`, {
              params: {}
            }, true);
          }
        }

        openDoc(docId, title) {
          let {
            superScope
          } = this,
              scope = this;
          scope.$preventDefault();

          if (!Q.$exist(docId)) {
            return;
          }

          $(scope.$getDom()).find('.shelf-item').removeClass('selected');
          $(scope.$getDom()).find(`.shelf-item[data-doc-id='${docId}']`).addClass('selected');
          superScope.openDoc(docId, title);
        }

        coverLoaded(docId) {
          let scope = this;
          scope.$preventDefault();

          if (!Q.$exist(docId)) {
            return;
          }

          $(scope.$getDom()).find(`.shelf-item[data-doc-id='${docId}']`).removeClass('loading');
        }

      }

      $export(Shelf);

      function getCtrEnv(state) {
        let inControls = state && Q.$setContainsString(['tags-view', 'users-view', 'bookmarks-view', 'invite-view', 'my-publisher-view'], state.name),
            sectionName = inControls ? state.name.replace('-view', '') : null;
        return {
          inControls,
          sectionName
        };
      }

      function docInShelf(scope, event) {
        return Q.$objectExist(event.modelInstance) && !Q.$isEmpty(scope.stories) && scope.stories.$count(nxt => {
          return parseInt(nxt.id) === parseInt(event.modelInstance.id);
        }) > 0;
      }

      function getCSectionItems() {
        return [{
          name: 'saved',
          id: 'bookmarks',
          icon: 'fas fa-bookmark'
        }, {
          name: 'tags',
          id: 'tags',
          icon: 'fas fa-hashtag'
        }, {
          name: 'users',
          id: 'users',
          icon: 'fas fa-user-friends'
        }, {
          name: 'My Publisher',
          id: 'my-publisher',
          icon: 'fas fa-cloud-upload-alt'
        }, {
          name: 'invite',
          id: 'invite',
          icon: 'fas fa-plus'
        }];
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class SmallNotifModal extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(SmallNotifModal.$require);
          this.controller = 'SmallNotifModal';
          this.template = 'app/shared/components/small-notif-modal/small-notif-modal.hbs';
          this.scope = {};
        }

      }

      $export(SmallNotifModal);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');

      class SmallNotifModal extends awr.Controller {
        static get $require() {
          return {};
        }

        constructor(data, parent) {
          super(SmallNotifModal.$require, data, parent);
          let scope = this,
              parentScope = this.$getParent();
          scope.body = Q.$objectExist(parentScope.scopeBody) ? parentScope.scopeBody : {};
          scope.$ready(_ => {
            let parentScopeReadyDom = $(scope.$getDom()).parent().parent();

            if (!scope.body.showRemove && Q.$arrayNotEmpty(parentScopeReadyDom)) {
              $(parentScopeReadyDom).find('#awrModalRmBtn').addClass('hidden');
            }

            $(scope.$getDom()).find('p.msg-p').removeClass('hidden');
          });
        }

      }

      $export(SmallNotifModal);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class UserMenu extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(UserMenu.$require);
          this.controller = 'UserMenu';
          this.template = 'app/shared/components/user-menu/user-menu.hbs';
          this.scope = {};
        }

      }

      $export(UserMenu);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');

      class UserMenu extends awr.Controller {
        static get $require() {
          return {
            superScope: 'object:awr.superScope',
            remoteCnf: 'config:remoteConnectionConfig'
          };
        }

        constructor(data, parent) {
          super(UserMenu.$require, data, parent);
          let {
            superScope,
            remoteCnf
          } = this;
          let scope = this;
          scope.$importProperty('currentUser');
          setupScopeUser(scope);
          scope.$bind('observable:authEvents', {
            onEvent(event, preventDefault) {
              preventDefault();

              if (!Q.$objectExist(event)) {
                return;
              }

              if (!Q.$setContainsString(['sign-in', 'sign-out'], event.type)) {
                return;
              }

              if (event.type === 'sign-in') {
                scope.currentUser = event.user;
                setupScopeUser(scope);
              } else if (event.type === 'sign-out') {
                scope.currentUser = null;
                setupScopeUser(scope);
              }

              scope.$recompile();
            }

          });
        }

        toggleUserMenu() {
          this.$preventDefault();
          let scope = this,
              menu = $(scope.$getDom()).find('.user-menu-expand');
          $(menu).animate({
            height: 'toggle'
          }, 165, function () {
            if ($(menu).hasClass('on')) {
              $(menu).removeClass('on');
            } else {
              $(menu).addClass('on');
            }
          });
        }

      }

      $export(UserMenu);

      function setupScopeUser(scope) {
        let current = scope.currentUser;

        if (!Q.$objectExist(current)) {
          scope.user = null;
          return;
        }

        scope.user = {};
        scope.user.fullName = Q.$capitalizeName(current.name);
        scope.user.nickname = Q.$stringExist(scope.user.fullName) ? current.name.split(' ')[0] : '';
        scope.user.email = Q.$stringExist(current.email) ? current.email : '';
        scope.user.isAdmin = false;

        if (!Q.$isEmpty(current.roles)) {
          scope.user.isAdmin = Q.$asCollection(current.roles).$count(nxt => nxt.name === 'admin@pageshare') > 0;
        }
      }

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class ShelfItem extends awr.Segment {
        static get $require() {
          return {};
        }

        constructor() {
          super(ShelfItem.$require);
          this.itemAs = 'item';
          this.template = 'app/shared/segments/shelf-item/shelf-item.hbs';
          this.bind = '';
          this.bindOptions = {};
        }

        setup() {
          /*@hint let {context, scope} = this*/
        }

        start() {
          /*@hint let {context, scope} = this*/
        }

        ready() {
          /*@hint let {dom, context, scope} = this*/
        }

      }

      $export(ShelfItem);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class ConfirmModal extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(ConfirmModal.$require);
          this.controller = 'ConfirmModal';
          this.template = 'app/shared/components/confirm-modal/confirm-modal.hbs';
          this.scope = {};
        }

      }

      $export(ConfirmModal);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class ConfirmModal extends awr.Controller {
        static get $require() {
          return {};
        }

        constructor(data, parent) {
          super(ConfirmModal.$require, data, parent);
          let scope = this,
              parentScope = scope.$getParent();
          let {
            title,
            message,
            confirmText,
            cancelText,
            confirmBtnClass,
            cancelBtnClass,
            confirmBeforeIcon,
            confirmAfterIcon,
            mainIcon,
            onConfirm,
            icon
          } = Q.$objectExist(parentScope.scopeBody) ? parentScope.scopeBody : {};
          this.body = {
            icon,
            title,
            message,
            confirmText,
            cancelText,
            confirmBtnClass,
            cancelBtnClass,
            confirmBeforeIcon,
            confirmAfterIcon,
            mainIcon,
            onConfirm
          };

          if (!Q.$stringExist(cancelText)) {
            this.body.cancelBtnClass = 'hidden';
          } // scope.body.title = Q.$stringExist(scope.body.title) ? scope.body.title : '';
          // scope.body.message = Q.$stringExist(scope.body.message) ? scope.body.message : '';
          // scope.body.confirmText = Q.$stringExist(scope.body.confirmText) ? scope.body.confirmText : 'Confirm';
          // scope.body.cancelText = Q.$stringExist(scope.body.cancelText) ? scope.body.cancelText : 'Cancel';
          // scope.body.confirmBtnClass = Q.$stringExist(scope.body.confirmBtnClass) ? scope.body.confirmBtnClass : 'btn btn-primary';
          // scope.body.cancelBtnClass = Q.$stringExist(scope.body.cancelBtnClass) ? scope.body.cancelBtnClass : 'btn btn-default';

        }

        confirm() {
          this.$preventDefault();
          let {
            onConfirm
          } = this.body,
              parentScope = this.$getParent();
          parentScope.modalOff();

          if (Q.$functionExist(onConfirm)) {
            try {
              onConfirm();
            } catch (e) {
              console.error('Confirm Error: onConfirm callback ended by an error.');
              console.error(e);
            }
          }
        }

        cancel() {
          this.$preventDefault();
          let parentScope = this.$getParent();
          parentScope.modalOff();
        }

      }

      $export(ConfirmModal);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;

      class Errors extends awr.Controller {
        static get $require() {
          return {
            superScope: 'object:awr.superScope'
          };
        }

        constructor(data, parent) {
          super(Errors.$require, data, parent);
          let {
            $state,
            superScope
          } = this;
          this.code = $state.params.code;

          if (Q.$objectExist(superScope.currentUser) && this.code === 'e2') {
            this.code = '404';
          }
        }

      }

      $export(Errors); //hayden24@example.com

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q;
      let router = $import('service:router');
      router.$route({
        name: "errors-view",
        link: "errors/:code?",
        template: "app/shared/views/errors/errors_index.hbs",
        defaults: {
          params: {
            code: '404'
          },
          attrs: {}
        },
        resolve: {},
        controller: 'ErrorsController'
      });

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
  !function () {
    'use strict';
    /*globals $, console, __pushToBootQueue__,__callModuleMainFn__,__$require__,__$errorOut__,__$loadErrors__,__moduleHasRequires__,__onModuleBootTimeoutError__ */

    var __$$requires$$__ = [],
        __$$errors$$__ = null;

    function $errorOut(errName, replaces) {
      return __$errorOut__(__$$errors$$__, errName, replaces);
    }

    function $loadErrors(name) {
      __$$errors$$__ = __$loadErrors__(name);
      return __$$errors$$__;
    }

    function $require(obj) {
      return __$require__(__$$requires$$__, obj);
    }

    __pushToBootQueue__(function __$init$__() {
      !function (global) {
        /*AWIAR TPL*/
        global.emptyTpls = global.emptyTpls || 0;
        global.emptyTpls++;
      }(window);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
}(window, jQuery);