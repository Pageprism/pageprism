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
      /*globals $, console, $require, $main, $export, $import, $available, $errorOut, $loadErrors*/
      $require('config:routeConfig');
      let awr = window.awr || {},
          Q = awr.Q;

      class AuthApp extends awr.App {
        static get $require() {
          return {
            appConfig: 'config:app',
            router: 'service:router'
          };
        }

        constructor() {
          super(AuthApp.$require, AuthApp.name);
          this.controller = 'App';
          this.router.$watch();
          this.$start();
        }

      }

      $export(AuthApp);

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
      /*globals $, $abstract, console, $require, $main, $export, $import, $available, $errorOut, $loadErrors*/
      let awr = window.awr || {},
          Q = awr.Q,
          time = 0;

      class App extends awr.Config {
        static get $require() {
          return {
            router: 'service:router',
            modal: 'service:modal',
            remoteCnf: 'config:remoteConnection'
          };
        }

        constructor() {
          super(App.$require);
          let {
            router,
            modal,
            remoteCnf
          } = this,
              rejectedNext = null;

          if (remoteCnf.isDevPort) {
            router.$config({
              mode: 'hash',
              prefix: ''
            });
          } else {
            router.$config({
              mode: 'history',
              prefix: 'insider'
            });
          }

          router.$authorize({
            routes: ['email-confirm-view'],
            authorizer: ['object:awr.superScope', '$state', function (superScope, state) {
              rejectedNext = state.attrs.next;
              return Q.$objectExist(superScope.currentUser);
            }],

            onReject(rejectedLink) {
              router.$go('default', {
                params: {},
                attrs: {
                  next: Q.$stringExist(rejectedNext) ? rejectedNext : 'default'
                }
              }, true);
            }

          }); // let authSetting = {
          //     onEnterBusyMode(msg) {
          //         let now = new Date().getTime();
          //         setTimeout(_ => {
          //             time = new Date().getTime() + 1000;
          //             modal.$enter('smallNotifModal', {
          //                 icon: 'fas fa-circle-notch fa-spin',
          //                 message: msg
          //             });
          //         }, now < time ? 1000 : 500);
          //     },
          //     onExitBusyMode() {
          //         let now = new Date().getTime();
          //         setTimeout(_ => {
          //             modal.$exit();
          //         }, now < time ? 2000 : 1000);
          //     }
          // };
          //
          // Object.defineProperty(authSetting, 'connectionConfig', {
          //     get() {
          //         return $import('config:remoteConnection');
          //     }
          // });
          // router.$enableAuthSession(authSetting);

          this.router.$onRouteEvent("onStateBusy", function hideUI() {//do something wherever the router enters a busy state
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
      !function (global) {
        /*AWIAR TPL*/
        global.emptyTpls = global.emptyTpls || 0;
        global.emptyTpls++;
      }(window);

      __callModuleMainFn__(typeof $main === "function" ? $main : null, __$$requires$$__);
    });
  }();
}(window, jQuery);