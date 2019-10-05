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
      /*globals $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');
      /*extending jquery*/

      $.fn.isInViewportLegacy = function () {
        let elementTop = $(this).offset().top,
            elementBottom = elementTop + $(this).outerHeight(),
            viewportTop = $(window).scrollTop(),
            viewportBottom = viewportTop + $(window).height();
        return elementBottom > viewportTop && elementTop < viewportBottom;
      };
      /*extending jquery*/


      $.fn.isInViewport = function (extraTopOffset, viewPort = window) {
        let res = false;

        if (!Q.$exist(this)) {
          return res;
        }

        try {
          // noinspection JSValidateTypes
          let elementTop = $(this).offset().top,
              elementBottom = elementTop + $(this).outerHeight(),
              viewportTop = $(viewPort).scrollTop(),
              viewportBottom = viewportTop + $(viewPort).height();
          res = elementBottom > viewportTop && elementTop < viewportBottom;

          if (Q.$numberExist(extraTopOffset)) {
            res = elementBottom > viewportTop && elementTop < viewportBottom + extraTopOffset;
          }
        } catch (err) {
          res = false;
        }

        return res;
      };

      $.fn.isScrollInBottom = function (win) {
        if (!Q.$objectExist(win)) {
          win = window;
        } // noinspection JSValidateTypes


        return $(win).scrollTop() + $(win).height() === $(document).height();
      };

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

        constructor(data, parent) {
          super(App.$require, data, parent);
          let {
            bootRoutines,
            globalFunctions,
            router,
            modal,
            socket,
            docEvents
          } = this,
              location = window.location;
          this.$disableDefaultActionAutoRecompile();
          /*Note: AppController's scope is equal to awr.superScope*/

          let scope = this,
              currentState;
          bootRoutines.init(scope);
          globalFunctions.attach(scope); // noinspection EqualityComparisonWithCoercionJS

          this.skipDemoSession = Q.$setContainsString(['pageshare.fi', 'www.pageshare.fi'], location.host) || Q.$setContainsString(['8000', '8080'], `${location.port}`);
          this.$bind('observable:notFound@states@router', {
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
          this.$bind('observable:start@states@router', {
            onEvent(event, preventDefault) {
              preventDefault(); // $(this.$getDom()).find('.view-busy-notif').removeClass('hidden');

              if (event.to.name !== 'default') {
                $('body').removeClass('reader-mode');
              }
            }

          });
          this.$bind('observable:success@states@router', {
            onEvent(event, preventDefault) {
              preventDefault();
              $('body').toggleClass('reader-mode', event.to.name === 'default');
            }

          });
          this.$bind('observable:error@states@router', {
            onEvent(event, preventDefault) {
              preventDefault(); // $(this.$getDom()).find('.view-busy-notif').addClass('hidden');

              if (event && event.errorMessage && event.errorMessage.toLowerCase().indexOf('failed to resolve required data') >= 0) {
                currentState = router.$getCurrentState();

                if (currentState && currentState.name === 'default') {
                  scope.currentDoc = null;
                  $emit('collection:events', {
                    name: 'new-doc-selected',
                    doc: null
                  });
                } // console.log(event);


                if (Q.$booleanTrue(event.isAuthFailed)) {
                  return;
                }

                if (Q.$functionExist(event.preventDefault)) {
                  event.preventDefault();
                }

                router.$go('errors-view', {
                  params: {
                    code: '404'
                  },
                  attrs: {}
                }, true);
              }
            }

          });
          this.$bind('observable:authEvents', {
            onEvent(event, preventDefault) {
              preventDefault();
              /*ignoring all auth events during the reloading*/

              if (Q.$booleanTrue(scope.reloading) || !Q.$objectExist(event)) {
                return;
              }

              if (event.type === 'sign-in') {
                bootRoutines.setupCurrentUser(scope);
              } else if (event.type === 'sign-out') {
                // modal.$enter('smallNotifModal', {
                //     icon: 'fas fa-circle-notch fa-spin',
                //     message: 'Signing out'
                // });
                bootRoutines.setupCurrentUser(scope);
                setTimeout(_ => {
                  router.$reloadCurrentState(); // setTimeout(_ => {
                  //     modal.$exit();
                  // }, 250);
                }, 250);
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
      $require(['class:DataFetcher@AWRType']);
      /*
       | An explicit wait ( $require & $main block) will be needed. This is the requirement 
       | whenever a custom super type is going to be extended. Custom super types are types 
       | introduced in the app or by an extension.   
       */

      function $main() {
        class Bookmarks extends awr.$.DataFetcher {
          static get $require() {
            return {
              bookmarksResolver: 'resolvable:bookmarks'
            };
          }

          constructor() {
            super(Bookmarks.$require);
            this.listenerIdSuffix = 'BookmarksDataFetcher';
            this.recompileOnResolve = true;
            Object.defineProperty(this, 'superScope', {
              get() {
                return $import('object:awr.superScope');
              }

            });
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param state
           * @return {boolean}
           */


          isDataFetchReady(scope, state) {
            let {
              superScope
            } = this,
                {
              bookmarks
            } = scope;
            return superScope.cachedBookmarksReady && Q.$arrayExists(bookmarks);
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param state
           * @return {Promise<[any, any, any, any]>}
           */


          fetch(scope, state) {
            let {
              bookmarksResolver
            } = this;
            return bookmarksResolver.resolveLater(state);
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param res
           */


          onResolve(scope, res) {
            scope.bookmarks = res;
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param err
           */


          onReject(scope, err) {
            console.error(err);
          }

        }

        $export(Bookmarks);
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
      $require(['class:DataFetcher@AWRType']);
      /*
       | An explicit wait ( $require & $main block) will be needed. This is the requirement 
       | whenever a custom super type is going to be extended. Custom super types are types 
       | introduced in the app or by an extension.   
       */

      function $main() {
        class EditView extends awr.$.DataFetcher {
          static get $require() {
            return {
              docResolver: 'resolvable:doc',
              collectionsResolver: 'resolvable:collections',
              publishersResolver: 'resolvable:ctrPublishers'
            };
          }

          constructor() {
            super(EditView.$require);
            this.listenerIdSuffix = 'EditViewDataFetcher';
            this.recompileOnResolve = true;
            Object.defineProperty(this, 'superScope', {
              get() {
                return $import('object:awr.superScope');
              }

            });
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param state
           * @return {boolean}
           */


          isDataFetchReady(scope, state) {
            let {
              superScope
            } = this,
                {
              doc,
              collections,
              publishers
            } = scope;
            return superScope.cachedCollsReady && superScope.cachedPublishersReady && Q.$arrayExists(collections) && Q.$arrayExists(publishers) && Q.$objectExists(doc) && !doc.isPlaceholder;
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param state
           * @return {Promise<[any, any, any, any]>}
           */


          fetch(scope, state) {
            let {
              docResolver,
              collectionsResolver,
              publishersResolver
            } = this;
            return Promise.all([docResolver.resolveLater(state), collectionsResolver.resolveLater(state), publishersResolver.resolveLater(state)]);
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param res
           */


          onResolve(scope, res) {
            scope.doc = res[0];
            scope.collections = res[1];
            scope.publishers = res[2];
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param err
           */


          onReject(scope, err) {
            console.error(err);
          }

        }

        $export(EditView);
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
      $require(['class:DataFetcher@AWRType']);
      /*
       | An explicit wait ( $require & $main block) will be needed. This is the requirement 
       | whenever a custom super type is going to be extended. Custom super types are types 
       | introduced in the app or by an extension.   
       */

      function $main() {
        class InvitesView extends awr.$.DataFetcher {
          static get $require() {
            return {
              invitesResolver: 'resolvable:invites'
            };
          }

          constructor() {
            super(InvitesView.$require);
            this.listenerIdSuffix = 'InvitesViewDataFetcher';
            this.recompileOnResolve = true;
            Object.defineProperty(this, 'superScope', {
              get() {
                return $import('object:awr.superScope');
              }

            });
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param state
           * @return {boolean}
           */


          isDataFetchReady(scope, state) {
            let {
              superScope
            } = this,
                {
              invites
            } = scope;
            return superScope.cachedInvitesReady && Q.$arrayExists(invites);
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param state
           * @return {Promise<[any, any, any, any]>}
           */


          fetch(scope, state) {
            let {
              invitesResolver
            } = this;
            return invitesResolver.resolveLater(state);
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param res
           */


          onResolve(scope, res) {
            scope.invites = res;
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param err
           */


          onReject(scope, err) {
            console.error(err);
          }

        }

        $export(InvitesView);
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
      $require(['class:DataFetcher@AWRType']);
      /*
       | An explicit wait ( $require & $main block) will be needed. This is the requirement 
       | whenever a custom super type is going to be extended. Custom super types are types 
       | introduced in the app or by an extension.   
       */

      function $main() {
        class MyCollections extends awr.$.DataFetcher {
          static get $require() {
            return {
              collectionsResolver: 'resolvable:myCollections',
              publishersResolver: 'resolvable:ctrPublishers'
            };
          }

          constructor() {
            super(MyCollections.$require);
            this.listenerIdSuffix = 'MyCollectionsDataFetcher';
            this.recompileOnResolve = true;
            Object.defineProperty(this, 'superScope', {
              get() {
                return $import('object:awr.superScope');
              }

            });
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param state
           * @return {boolean}
           */


          isDataFetchReady(scope, state) {
            let {
              superScope
            } = this,
                {
              collections,
              publishers
            } = scope;
            return superScope.cachedMyCollsReady && superScope.cachedPublishersReady && Q.$arrayExists(collections) && Q.$arrayExists(publishers);
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param state
           * @return {Promise<[any, any, any, any]>}
           */


          fetch(scope, state) {
            let {
              collectionsResolver,
              publishersResolver
            } = this;
            return Promise.all([collectionsResolver.resolveLater(state), publishersResolver.resolveLater(state)]);
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param res
           */


          onResolve(scope, res) {
            scope.collections = res[0];
            scope.publishers = res[1];
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param err
           */


          onReject(scope, err) {
            console.error(err);
          }
          /**
           * @param scope
           */


          scopeBinds(scope) {
            let {
              superScope
            } = this;
            scope.$bind('model:MyCollection', {
              onEvent(event, preventDefault) {
                preventDefault();

                if (event.requestType === 'remove') {
                  scope.collections = Q.$reduce(scope.collections, nxt => !Q.$idEqual(nxt.id, event.requestId));
                  superScope.cachedMyColls = scope.collections;
                } else if (event.requestType === 'create') {
                  if (Q.$count(scope.collections, nxt => Q.$idEqual(nxt.id, event.requestId)) < 1) {
                    scope.collections.push(event.modelInstance);
                    superScope.cachedMyColls = scope.collections;
                  }
                }
              }

            });
          }

        }

        $export(MyCollections);
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
      $require(['class:DataFetcher@AWRType']);
      /*
       | An explicit wait ( $require & $main block) will be needed. This is the requirement 
       | whenever a custom super type is going to be extended. Custom super types are types 
       | introduced in the app or by an extension.   
       */

      function $main() {
        class Tags extends awr.$.DataFetcher {
          static get $require() {
            return {
              tagsResolver: 'resolvable:ctrTags'
            };
          }

          constructor() {
            super(Tags.$require);
            this.listenerIdSuffix = 'TagsDataFetcher';
            this.recompileOnResolve = true;
            Object.defineProperty(this, 'superScope', {
              get() {
                return $import('object:awr.superScope');
              }

            });
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param state
           * @return {boolean}
           */


          isDataFetchReady(scope, state) {
            let {
              superScope
            } = this,
                {
              tags
            } = scope;
            return superScope.cachedTagsReady && Q.$arrayExists(tags);
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param state
           * @return {Promise<[any, any, any, any]>}
           */


          fetch(scope, state) {
            let {
              tagsResolver
            } = this;
            return tagsResolver.resolveLater(state);
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param res
           */


          onResolve(scope, res) {
            scope.tags = res;
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param err
           */


          onReject(scope, err) {
            console.error(err);
          }

        }

        $export(Tags);
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
      $require(['class:DataFetcher@AWRType']);
      /*
       | An explicit wait ( $require & $main block) will be needed. This is the requirement 
       | whenever a custom super type is going to be extended. Custom super types are types 
       | introduced in the app or by an extension.   
       */

      function $main() {
        class UploadView extends awr.$.DataFetcher {
          static get $require() {
            return {
              collectionsResolver: 'resolvable:myCollections',
              publishersResolver: 'resolvable:ctrPublishers'
            };
          }

          constructor() {
            super(UploadView.$require);
            this.listenerIdSuffix = 'UploadViewDataFetcher';
            this.recompileOnResolve = true;
            Object.defineProperty(this, 'superScope', {
              get() {
                return $import('object:awr.superScope');
              }

            });
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param state
           * @return {boolean}
           */


          isDataFetchReady(scope, state) {
            let {
              superScope
            } = this,
                {
              collections,
              publishers
            } = scope;
            return superScope.cachedMyCollsReady && superScope.cachedPublishersReady && Q.$arrayExists(collections) && Q.$arrayExists(publishers);
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param state
           * @return {Promise<[any, any, any, any]>}
           */


          fetch(scope, state) {
            let {
              collectionsResolver,
              publishersResolver
            } = this;
            return Promise.all([collectionsResolver.resolveLater(state), publishersResolver.resolveLater(state)]);
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param res
           */


          onResolve(scope, res) {
            scope.collections = res[0];
            scope.publishers = res[1];
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param err
           */


          onReject(scope, err) {
            console.error(err);
          }

        }

        $export(UploadView);
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
      $require(['class:DataFetcher@AWRType']);
      /*
       | An explicit wait ( $require & $main block) will be needed. This is the requirement 
       | whenever a custom super type is going to be extended. Custom super types are types 
       | introduced in the app or by an extension.   
       */

      function $main() {
        class UsersView extends awr.$.DataFetcher {
          static get $require() {
            return {
              usersResolver: 'resolvable:ctrUsers',
              publishersResolver: 'resolvable:ctrPublishers'
            };
          }

          constructor() {
            super(UsersView.$require);
            this.listenerIdSuffix = 'UsersViewDataFetcher';
            this.recompileOnResolve = true;
            Object.defineProperty(this, 'superScope', {
              get() {
                return $import('object:awr.superScope');
              }

            });
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param state
           * @return {boolean}
           */


          isDataFetchReady(scope, state) {
            let {
              superScope
            } = this,
                {
              users,
              publishers
            } = scope;
            return superScope.cachedUsersReady && superScope.cachedPublishersReady && Q.$arrayExists(users) && Q.$arrayExists(publishers);
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param state
           * @return {Promise<[any, any, any, any]>}
           */


          fetch(scope, state) {
            let {
              usersResolver,
              publishersResolver
            } = this;
            return Promise.all([usersResolver.resolveLater(state), publishersResolver.resolveLater(state)]);
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param res
           */


          onResolve(scope, res) {
            scope.users = res[0];
            scope.publishers = res[1];
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param err
           */


          onReject(scope, err) {
            console.error(err);
          }

        }

        $export(UsersView);
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
      $require(['class:DataFetcher@AWRType']);
      /*
       | An explicit wait ( $require & $main block) will be needed. This is the requirement 
       | whenever a custom super type is going to be extended. Custom super types are types 
       | introduced in the app or by an extension.   
       */

      function $main() {
        class VView extends awr.$.DataFetcher {
          static get $require() {
            return {
              vDocResolver: 'resolvable:vDoc',
              collectionsResolver: 'resolvable:collections',
              publishersResolver: 'resolvable:ctrPublishers',
              bookmarksResolver: 'resolvable:bookmarks'
            };
          }

          constructor() {
            super(VView.$require);
            this.listenerIdSuffix = 'VViewDataFetcher';
            this.recompileOnResolve = true;
            Object.defineProperty(this, 'superScope', {
              get() {
                return $import('object:awr.superScope');
              }

            });
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param state
           * @return {boolean}
           */


          isDataFetchReady(scope, state) {
            let {
              superScope
            } = this,
                {
              collections,
              publishers,
              doc,
              bookmarks
            } = scope;
            return superScope.cachedCollsReady && superScope.cachedPublishersReady && superScope.cachedBookmarksReady && Q.$arrayExists(collections) && Q.$arrayExists(publishers) && Q.$arrayExists(bookmarks) && Q.$objectExists(doc) && !doc.isPlaceholder;
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param state
           * @return {Promise<[any, any, any, any]>}
           */


          fetch(scope, state) {
            let {
              vDocResolver,
              collectionsResolver,
              publishersResolver,
              bookmarksResolver
            } = this;
            return Promise.all([vDocResolver.resolveLater(state), collectionsResolver.resolveLater(state), publishersResolver.resolveLater(state), bookmarksResolver.resolveLater(state)]);
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param res
           */


          onResolve(scope, res) {
            scope.doc = res[0];
            scope.collections = res[1];
            scope.publishers = res[2];
            scope.bookmarks = res[3];
          } // noinspection JSMethodCanBeStatic

          /**
           *
           * @param scope
           * @param err
           */


          onReject(scope, err) {
            console.error(err);
          }

        }

        $export(VView);
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

      class Bookmark extends awr.Model {
        static get $require() {
          return {};
        }

        constructor() {
          super(Bookmark.$require);
          this.url = '/bookmark/';
          this.headers = {};
        }

      }

      $export(Bookmark);

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

      class Invite extends awr.Model {
        static get $require() {
          return {};
        }

        constructor() {
          super(Invite.$require);
          this.url = '/invite/';
          this.headers = {};
        }

      }

      $export(Invite);

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

      class MainCollection extends awr.Model {
        static get $require() {
          return {};
        }

        constructor() {
          super(MainCollection.$require);
          this.url = '/main_collection/';
          this.headers = {};
        }

      }

      $export(MainCollection);

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
      const scoreKey = '__$$score$$__';

      class FieldSearch extends awr.Pipe {
        static get $require() {
          return {};
        }

        constructor() {
          super(FieldSearch.$require);
        }

        transform(set, query, field = 'name', defaultReduceFn = null) {
          field = Q.$stringExist(field) ? field : 'name';
          let score, transformedItems;

          if (!Q.$stringExist(query)) {
            if (Q.$functionExist(defaultReduceFn)) {
              transformedItems = set.$reduce(defaultReduceFn);
            } else {
              transformedItems = set;
            }

            set[Symbol.for('lastSearchResultLength')] = transformedItems.length;
            return transformedItems;
          }

          transformedItems = Q.$asCollection(set).$reduce(nxt => {
            score = getScore(nxt[field], query);

            if (!(nxt.hasOwnProperty(field) && score >= 0)) {
              return false;
            }

            nxt[scoreKey] = score;
            return true;
          }).$sortBy(scoreKey);
          set[Symbol.for('lastSearchResultLength')] = transformedItems.length;
          return transformedItems;
        }

      }

      $export(FieldSearch);

      function getScore(field, query) {
        return field && query ? field.toLowerCase().indexOf(query.toLowerCase()) : -1;
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

      class HasRoleInPublisher extends awr.Pipe {
        static get $require() {
          return {
            roleHelper: 'service:roleHelper'
          };
        }

        constructor() {
          super(HasRoleInPublisher.$require);
        }

        transform(set, userId, roleName) {
          if (!(Q.$stringExist(userId) || Q.$numberExist(userId))) {
            return Q.$asCollection([]);
          }

          let {
            roleHelper
          } = this;
          roleName = Q.$setContainsString(['moderator', 'publisher', 'creator'], roleName) ? roleName : 'any';
          return Q.$asCollection(set).$reduce(nxt => roleHelper.hasRoleInPublisher(nxt, userId, roleName)).$sortByDesc(function (a, b) {
            let v = 0;

            if (roleHelper.hasRoleInPublisher(a, userId, 'publisher') && !roleHelper.hasRoleInPublisher(b, userId, 'publisher')) {
              v = 1;
            } else if (!roleHelper.hasRoleInPublisher(a, userId, 'publisher') && roleHelper.hasRoleInPublisher(b, userId, 'publisher')) {
              v = -1;
            }

            return v;
          });
        }

      }

      $export(HasRoleInPublisher);

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

      class PickDevColls extends awr.Pipe {
        static get $require() {
          return {};
        }

        constructor() {
          super(PickDevColls.$require);
        }

        transform(input, ...args) {
          return input.$map(nxt => {
            if (!Q.$isEmpty(nxt.stories)) {
              nxt.stCount = nxt.stories.length;
            } else {
              nxt.stCount = 0;
            }

            return nxt;
          });
        }

      }

      $export(PickDevColls);

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

      class PrettyDate extends awr.Pipe {
        static get $require() {
          return {
            dateFormatter: 'service:dateFormatter'
          };
        }

        constructor() {
          super(PrettyDate.$require);
        }

        transform(input, format = 'long') {
          let {
            dateFormatter
          } = this;
          return dateFormatter.prettyDate(input, format);
        }

      }

      $export(PrettyDate);

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

      class PublisherCollections extends awr.Pipe {
        static get $require() {
          return {};
        }

        constructor() {
          super(PublisherCollections.$require);
        }

        transform(set, publisherId, userId, publishers) {
          let publisher, publisherColls, collsInSomePublisher;

          if (!Q.$exist(publisherId) || Q.$isEmpty(publishers) || Q.$isEmpty(set)) {
            return Q.$asCollection([]);
          }

          if (!Q.$functionExist(set.$reduce)) {
            set = Q.$asCollection(set);
          }

          if (publisherId === 'personal-collections') {
            collsInSomePublisher = Q.$asCollection([]);
            Q.$each(publishers, nxt => {
              collsInSomePublisher = collsInSomePublisher.$merge(getPublisherCollIds(nxt));
            });
            return set.$reduce(nxt => !collsInSomePublisher.includes(parseInt(nxt.id)) && nxt.user_id == userId);
          }

          publisher = publishers.$find('id', parseInt(publisherId));
          publisherColls = getPublisherCollIds(publisher);
          return set.$reduce(nxt => {
            return publisherColls.includes(parseInt(nxt.id));
          });
        }

      }

      $export(PublisherCollections);

      function getPublisherCollIds(publisher) {
        return Q.$asCollection(publisher && publisher.collections ? publisher.collections : []).$map(nxt => parseInt(nxt.id));
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

      class Bookmarks extends awr.Resolvable {
        static get $require() {
          return {
            model: "model:Bookmark"
          };
        }

        constructor() {
          super(Bookmarks.$require);
          this.$importSuperScope();
        }

        resolve(state) {
          return resolveFn(state, this, false);
        }

        resolveLater(state) {
          return resolveFn(state, this, true);
        }

      }

      $export(Bookmarks);

      function resolveFn(state, self, network = false) {
        let {
          model,
          superScope
        } = self;

        if (!Q.$objectExist(superScope.currentUser)) {
          superScope.cachedBookmarksReady = true;
          return Promise.resolve(Q.$asCollection([]));
        }

        if (Q.$arrayExists(superScope.cachedBookmarks) && superScope.cachedBookmarksReady) {
          return Promise.resolve(superScope.cachedBookmarks);
        }

        if (!network) {
          superScope.cachedBookmarksReady = false;
          return Promise.resolve(Q.$asCollection([]));
        }

        return new Promise((resolve, reject) => {
          model.$findAll().then(res => {
            superScope.cachedBookmarksReady = true;
            superScope.cachedBookmarks = Q.$asCollection(res);
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

      class Invites extends awr.Resolvable {
        static get $require() {
          return {
            model: 'model:Invite'
          };
        }

        constructor() {
          super(Invites.$require);
          this.$importSuperScope();
        }

        resolve(state) {
          return resolveFn(state, this, false);
        }

        resolveLater(state) {
          return resolveFn(state, this, true);
        }

      }

      $export(Invites);

      function resolveFn(state, self, network = false) {
        let {
          model,
          superScope
        } = self;

        if (!Q.$objectExist(superScope.currentUser)) {
          superScope.cachedInvitesReady = true;
          return Promise.resolve(Q.$asCollection([]));
        }

        if (Q.$arrayExists(superScope.cachedInvites) && superScope.cachedInvitesReady) {
          return Promise.resolve(superScope.cachedInvites);
        }

        if (!network) {
          superScope.cachedInvitesReady = false;
          return Promise.resolve(Q.$asCollection([]));
        }

        return new Promise((resolve, reject) => {
          model.$findAll().then(res => {
            superScope.cachedInvitesReady = true;
            superScope.cachedInvites = Q.$asCollection(res);
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
      /**
       * @class awr.$.DataFetcher
       * @abstract
       */

      class DataFetcher extends awr.FactoryType {
        static get $require() {
          return {
            router: 'service:router'
          };
        }

        constructor() {
          super(DataFetcher.$require);
          this.listenerIdSuffix = 'DataFetcher';
          this.recompileOnResolve = false;
        }
        /**
         * custom superType init
         */


        init() {}
        /**
         * @abstract isDataFetchReady
         */


        static [$abstract('isDataFetchReady')]() {}
        /**
         * @abstract fetch
         */


        static [$abstract('fetch')]() {}
        /**
         * @abstract onResolve
         */


        static [$abstract('onResolve')]() {}
        /**
         * @abstract onReject
         */


        static [$abstract('onReject')]() {} // noinspection JSMethodCanBeStatic

        /**
         *
         * @param scope
         * @param state
         * @return {boolean}
         */


        stateCheck(scope, state) {
          return true;
        }
        /**
         * @optional
         * @param scope
         */


        setup(scope) {}
        /**
         * @optional
         * @param scope
         */


        scopeBinds(scope) {}

        setupAndFetch(scope) {
          let self = this,
              {
            router
          } = this;

          if (scope.$isFlushed() || !this.stateCheck(scope, router.$getCurrentState())) {
            return;
          }

          Object.defineProperty(scope, 'isDataFetchReady', {
            get() {
              return self.isDataFetchReady(scope, self.router.$getCurrentState());
            }

          });
          this.setup(scope);

          if (scope.isDataFetchReady && Q.$functionExists(scope.onDataReady)) {
            try {
              scope.onDataReady();
            } catch (e) {
              console.error(e);
            }
          }

          scope.$ready(_ => {
            if (scope.isDataFetchReady) {
              return;
            }

            this.fetch(scope, this.router.$getCurrentState()).then(res => {
              if (scope.$isFlushed()) {
                return;
              } // noinspection JSUnresolvedFunction


              this.onResolve(scope, res);

              if (scope.isDataFetchReady && Q.$functionExists(scope.onDataReady)) {
                try {
                  scope.onDataReady();
                } catch (e) {
                  console.error(e);
                }
              }

              if (this.recompileOnResolve) {
                scope.$recompile();
              }
            }, err => {
              if (scope.$isFlushed()) {
                return;
              } // noinspection JSUnresolvedFunction


              this.onReject(scope, err);
            });
          }, `onReady@${this.listenerIdSuffix}`);
          this.scopeBinds(scope);
        }

      }

      $export(DataFetcher);

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

      class Epub extends awr.Validator {
        static get $require() {
          return {};
        }

        constructor() {
          super(Epub.$require);
        }

        isValid(val, elem) {
          //FileList is not instance of array!
          if (!(Q.$objectExist(val) && val instanceof FileList && val.length > 0)) {
            return true;
          }

          return val[0].type && val[0].type.indexOf('application/epub') >= 0;
        }

      }

      $export(Epub);

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

      class OptionalUrl extends awr.Validator {
        static get $require() {
          return {
            urlValidator: 'validator:url'
          };
        }

        constructor() {
          super(OptionalUrl.$require);
        }

        isValid(val, elem) {
          return !Q.$stringExist(val) || this.urlValidator.isValid(val, null);
        }

      }

      $export(OptionalUrl);

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

      class Pdf extends awr.Validator {
        static get $require() {
          return {};
        }

        constructor() {
          super(Pdf.$require);
        }

        isValid(val, elem) {
          if (!(Q.$objectExist(val) && val instanceof FileList && val.length > 0)) {
            return false;
          }

          return val[0].type && val[0].type.indexOf('application/pdf') >= 0;
        }

      }

      $export(Pdf);

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
        scope.appName = 'pageshare_main_app';
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
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');
      const readyWId = 'book-form-scope-configurer-ready-watcher',
            recompileWId = 'book-form-scope-configurer-recompile-watcher';

      class BookFormScopeConfigurer extends awr.Service {
        static get $require() {
          return {
            pubCollPipe: 'pipe:publisherCollections',
            modal: 'service:modal',
            collFetcher: 'service:collectionFetcher',
            autocomplete: 'service:autocomplete'
          };
        }

        constructor() {
          super(BookFormScopeConfigurer.$require);
          Object.defineProperty(this, 'superScope', {
            get() {
              return $import('object:awr.superScope');
            }

          });
        }

        setup({
          scope,
          personalCollectionGroupId,
          initialCollectionKey,
          publisherSelectPath,
          yearSelectPath,
          collectionSelectPath
        }) {
          let {
            superScope,
            collFetcher
          } = this,
              initColl,
              years = [];

          for (let y = 1900; y <= new Date().getFullYear(); y++) {
            years.push(y);
          }

          years.reverse();
          scope.activePublisherId = personalCollectionGroupId;
          Object.defineProperty(scope, 'currentUserId', {
            get() {
              return Q.$objectExist(superScope.currentUser) ? superScope.currentUser.id : null;
            }

          });
          Object.defineProperty(scope, 'activePublisher', {
            get() {
              return scope.activePublisherId !== personalCollectionGroupId ? scope.publishers.$find('id', parseInt(scope.activePublisherId)) : null;
            }

          });
          /*collectionId hint coming from the above for example can be defined by state*/

          if (Q.$numberExist(parseInt(scope[initialCollectionKey]))) {
            initColl = scope.collections.$find('id', parseInt(scope[initialCollectionKey]));
            scope.initialCollectionId = initColl && Q.$numberExist(parseInt(initColl.id)) ? parseInt(initColl.id) : null;
            scope.activePublisherId = Q.$objectExist(initColl) && Q.$numberExist(parseInt(initColl.publisher_id)) ? parseInt(initColl.publisher_id) : scope.activePublisherId;
          }

          scope.$addBeforeRecompileListener(_ => {
            if (Q.$numberExist(parseInt(scope[initialCollectionKey]))) {
              initColl = scope.collections.$find('id', parseInt(scope[initialCollectionKey]));
              scope.initialCollectionId = initColl && Q.$numberExist(parseInt(initColl.id)) ? parseInt(initColl.id) : null;
              scope.activePublisherId = Q.$objectExist(initColl) && Q.$numberExist(parseInt(initColl.publisher_id)) ? parseInt(initColl.publisher_id) : scope.activePublisherId;
            }
          }, recompileWId);
          scope.$ready(_ => {
            init({
              scope,
              initColl,
              publisherSelectPath,
              collectionSelectPath,
              yearSelectPath,
              years,
              collFetcher
            });
          }, readyWId);
          scope.$addRecompileListener(_ => {
            init({
              scope,
              initColl,
              publisherSelectPath,
              collectionSelectPath,
              yearSelectPath,
              years,
              collFetcher
            });
          }, recompileWId);
        }

        autocompleteSetup(field) {
          let {
            autocomplete
          } = this;

          if (Q.$setContainsString(['authors', 'categories', 'languages', 'tags'], field.key)) {
            field.onSearch = query => {
              let opts = {
                type: 'meta_key',
                key: field.key,
                take: 10
              };

              if (field.key === 'tags') {
                opts.type = null;
                opts.key = null;
              }

              return autocomplete.search(query, opts);
            };
          }
        }

        selectPublisher({
          scope,
          collectionSelectPath,
          publisherSelectPath,
          personalCollectionGroupId
        }) {
          let {
            modal,
            pubCollPipe
          } = this;
          selectPublisher({
            scope,
            pubCollPipe,
            publisherId: $(scope.$getDom()).find(publisherSelectPath).val(),
            collSelectPath: collectionSelectPath,

            onEmpty() {
              $(scope.$getDom()).find(publisherSelectPath).val(personalCollectionGroupId);
              modal.$enter('smallNotifModal', {
                icon: 'fa fa-exclamation-triangle text-warning',
                message: `This publisher has no collections and cannot be selected!`,
                showRemove: true
              });
              selectPublisher({
                scope,
                publisherId: $(scope.$getDom()).find(publisherSelectPath).val(),
                collSelectPath: 'select.collections'
              });
            }

          });
        }

      }

      $export(BookFormScopeConfigurer);

      function init({
        scope,
        initColl,
        publisherSelectPath,
        collectionSelectPath,
        yearSelectPath,
        years,
        collFetcher
      }) {
        if (Q.$numberExist(scope.activePublisherId)) {
          $(scope.$getDom()).find(publisherSelectPath).val(scope.activePublisherId);
        }

        if (Q.$objectExist(initColl) && Q.$numberExist(parseInt(initColl.id))) {
          $(scope.$getDom()).find(collectionSelectPath).val(initColl.id);
        }

        setYearOptions(scope, yearSelectPath, years);
        collFetcher.setCurrent(scope.initialCollectionId);
      }

      function selectPublisher({
        scope,
        pubCollPipe,
        publisherId,
        collSelectPath,
        onEmpty
      }) {
        let {
          collections,
          publishers,
          currentUserId
        } = scope,
            collSelect = $(scope.$getDom()).find(collSelectPath),
            colls;
        scope.activePublisherId = publisherId;
        scope.doc = Q.$objectExist(scope.doc) ? scope.doc : {};

        if (Q.$numberExist(parseInt(scope.activePublisherId))) {
          scope.activePublisherId = parseInt(scope.activePublisherId);
          scope.doc.publisher_id = scope.activePublisherId;
        } else {
          scope.doc.publisher_id = null;
        }

        colls = pubCollPipe.transform(collections, scope.activePublisherId, currentUserId, publishers);
        $(collSelect).find('option').remove();
        colls.$each(nxt => {
          $(collSelect).append(`<option value="${nxt.id}">${nxt.name}</option>`);
        });

        if (!Q.$isEmpty(colls)) {
          scope.doc.collection_id = colls[0].id;
        } else {
          scope.doc.collection_id = null;
          setTimeout(_ => {
            if (Q.$functionExist(onEmpty)) {
              onEmpty();
            }
          }, 500);
        }
      }

      function setYearOptions(scope, yearSelect, years) {
        if (scope.step !== 0) {
          return;
        }

        $(scope.$getDom()).find(yearSelect).find('option').remove();

        for (let y of years) {
          $(scope.$getDom()).find('select[name="year"]').append(`<option value="${y}">${y}</option>`);
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
      /*globals $abstract, $app, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');

      class Bookmarker extends awr.Service {
        static get $require() {
          return {
            bookmarkModel: 'model:Bookmark'
          };
        }

        constructor() {
          super(Bookmarker.$require);
          Object.defineProperty(this, 'superScope', {
            get() {
              return $import('object:awr.superScope');
            }

          });
        }

        setup({
          scope,
          bookmarks
        }) {
          let {
            superScope
          } = this;
          scope.bookmarks = !Q.$isEmpty(superScope.cachedBookmarks) ? superScope.cachedBookmarks : Q.$asCollection([]);
          Object.defineProperty(scope, 'isDocBookmarked', {
            get() {
              return Q.$objectExist(scope.doc) && !Q.$isEmpty(scope.bookmarks) && scope.bookmarks.$count(nxt => parseInt(nxt.story.id) === parseInt(scope.doc.id)) > 0;
            },

            configurable: true
          });
        }

        toggleBookmark({
          scope,
          uiSelector
        }) {
          let {
            bookmarkModel,
            superScope
          } = this,
              {
            bookmarks
          } = scope,
              bookmark;

          if (scope.isBookmarkingBusy) {
            return;
          }

          scope.isBookmarkingBusy = true;

          if (scope.isDocBookmarked) {
            $(scope.$getDom()).find(uiSelector).removeClass('active');
            bookmark = bookmarks.$reduce(nxt => parseInt(nxt.story_id) === parseInt(scope.doc.id)).$first();
            bookmark.$remove().then(_ => {
              if (!Q.$arrayExists(superScope.cachedBookmarks)) {
                superScope.cachedBookmarks = Q.$asCollection([]);
              }

              superScope.cachedBookmarks = bookmarks.$reduce(nxt => {
                return parseInt(nxt.story_id) !== parseInt(scope.doc.id);
              });
              scope.bookmarks = superScope.cachedBookmarks;
              scope.isBookmarkingBusy = false;
            }, err => {
              scope.isBookmarkingBusy = false;
              console.error(err);
            });
          } else {
            $(scope.$getDom()).find(uiSelector).addClass('active');
            bookmarkModel.$create({
              story_id: scope.doc.id
            }).then(newInstance => {
              if (!Q.$arrayExists(superScope.cachedBookmarks)) {
                superScope.cachedBookmarks = Q.$asCollection([]);
              }

              superScope.cachedBookmarks.push(newInstance);
              scope.bookmarks = superScope.cachedBookmarks;
              scope.isBookmarkingBusy = false;
            }, err => {
              scope.isBookmarkingBusy = false;
              console.error(err);
            });
          }
        }

        removeBookmarkByDoc({
          scope,
          doc
        }) {
          let {
            superScope
          } = this,
              {
            bookmarks
          } = scope,
              bookmark = bookmarks.$find('story_id', parseInt(doc.id));

          if (scope.isBookmarkingBusy || !Q.$objectExist(doc)) {
            return;
          }

          scope.isBookmarkingBusy = true;

          if (bookmark && Q.$functionExist(bookmark.$remove)) {
            bookmark.$remove().then(res => {
              if (!Q.$arrayExists(superScope.cachedBookmarks)) {
                superScope.cachedBookmarks = Q.$asCollection([]);
              }

              superScope.cachedBookmarks = bookmarks.$reduce(nxt => {
                return parseInt(nxt.story_id) !== parseInt(doc.id);
              });
              scope.bookmarks = superScope.cachedBookmarks;
              scope.isBookmarkingBusy = false;
            }, err => {
              scope.isBookmarkingBusy = false;
              console.error(err);
            });
          } else {
            scope.isBookmarkingBusy = false;
          }
        }

      }

      $export(Bookmarker);

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
      /*globals $abstract, $app, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');
      const dummyPub = {
        user: {},
        creators: [],
        moderators: []
      };

      class CommonListCtrFn extends awr.Service {
        static get $require() {
          return {
            roleHelper: 'service:roleHelper',
            listHelper: 'service:listHelper',
            hasRoleInPubPipe: 'pipe:hasRoleInPublisher',
            userResolver: 'resolvable:ctrUsers',
            roleModel: 'model:Role',
            publisherRoleModel: 'model:PublisherRole',
            modal: 'service:modal'
          };
        }

        constructor() {
          super(CommonListCtrFn.$require);
          this.$importSuperScope();
        }

        resolveRestOfUsers({
          scope,
          state
        }) {
          let {
            userResolver,
            superScope
          } = this;
          userResolver.resolveRest(state).then(rest => {
            //all loaded
            if (!Q.$isEmpty(rest)) {
              scope.users = scope.users.$merge(rest);
              superScope.cachedUsers = scope.users;

              if (Q.$functionExist(scope.onListRefresh)) {
                scope.onListRefresh();
              }
            }
          }, err => {
            console.error(err);
          });
        }

        decideFirstActivePublisher({
          scope,
          publishers
        }) {
          let {
            superScope,
            hasRoleInPubPipe
          } = this;

          if (superScope.currentUser) {
            scope.activePublisher = hasRoleInPubPipe.transform(publishers, superScope.currentUser.id, 'any').$first();

            if (!Q.$objectExist(scope.activePublisher)) {
              scope.activePublisher = dummyPub;
            }
          }
        }

        assignPublisherRole(user, publisher, roleName) {
          let {
            publisherRoleModel
          } = this;

          if (!(Q.$objectExist(user) && Q.$objectExist(publisher) && Q.$stringExist(roleName))) {
            return;
          }

          if (!Q.$isEmpty(user.roles) && Q.$count(user.roles, r => r.name === roleName || r.role_name === roleName) > 0) {
            return;
          }

          publisherRoleModel.$create({
            'user_id': user.id,
            'publisher_id': publisher.id,
            'name': roleName
          }).then(instance => {}, err => {
            console.error(err);
          });
        }

        removePublisherRole(user, publisher, roleName) {
          let {
            publisherRoleModel
          } = this,
              role;

          if (!(Q.$objectExist(user) && Q.$objectExist(publisher) && Q.$stringExist(roleName))) {
            return;
          }

          role = Q.$asCollection(roleName === 'moderator' ? publisher.moderators : publisher.creators).$map(nxt => {
            if (parseInt(nxt.id) === parseInt(user.id)) {
              return {
                id: nxt.role_id,
                name: nxt.role_name,
                user_id: nxt.id,
                publisher_id: publisher.id
              };
            }
          }).$first();

          if (!Q.$objectExist(role)) {
            return;
          }

          publisherRoleModel.$template(role).$remove().then(res => {}, err => {
            console.error(err);
          });
        }

        assignRole(user, roleName) {
          let {
            roleModel
          } = this;

          if (!(Q.$objectExist(user) && Q.$stringExist(roleName))) {
            return;
          }

          if (!Q.$isEmpty(user.roles) && Q.$count(user.roles, r => r.name === roleName || r.role_name === roleName) > 0) {
            return;
          }

          roleModel.$create({
            'user_id': user.id,
            'name': roleName
          }).then(instance => {// console.log(instance);
          }, err => {
            console.error(err);
          });
        }

        removePublisher(scope, publisher) {
          let {
            superScope,
            modal
          } = this;
          commonItemRemoveConfirm({
            modal,
            itemType: 'publisher',

            onConfirm() {
              if (scope.isPublisherRemoveBusy || !(publisher && Q.$functionExist(publisher.$remove))) {
                return;
              }

              scope.isPublisherRemoveBusy = true;
              publisher.$remove().then(res => {
                scope.isPublisherRemoveBusy = false;
                superScope.cachedPublishers = scope.publishers.$reduce(nxt => parseInt(nxt.id) !== parseInt(publisher.id));
                scope.publishers = superScope.cachedPublishers;
              }, err => {
                scope.isPublisherRemoveBusy = false;
                console.error(err);
              });
            }

          });
        }

        removeAccount(scope, userAccount) {
          let {
            superScope,
            modal
          } = this;
          commonItemRemoveConfirm({
            modal,
            itemType: 'account',

            onConfirm() {
              if (scope.isAccountRemoveBusy || !(userAccount && Q.$functionExist(userAccount.$remove))) {
                return;
              }

              scope.isAccountRemoveBusy = true;
              userAccount.$remove().then(res => {
                scope.isAccountRemoveBusy = false;
                superScope.cachedUsers = scope.users.$reduce(nxt => parseInt(nxt.id) !== parseInt(userAccount.id));
                scope.users = superScope.cachedUsers;

                if (!Q.$isEmpty(superScope.cachedPublishers)) {
                  superScope.cachedPublishers = !Q.$arrayExist(scope.publishers) ? Q.$asCollection([]) : scope.publishers.$reduce(nxt => parseInt(nxt.user_id) !== parseInt(userAccount.id));
                  scope.publishers = superScope.cachedPublishers;
                }
              }, err => {
                scope.isAccountRemoveBusy = false;
                console.error(err);
              });
            }

          });
        }

        removeRole(user, roleName) {
          let {
            roleModel
          } = this,
              role;

          if (!(Q.$objectExist(user) && Q.$stringExist(roleName))) {
            return;
          }

          role = Q.$asCollection(user.roles).$find('name', roleName);

          if (!Q.$objectExist(role)) {
            return;
          }

          roleModel.$template(role).$remove().then(res => {// console.log(res);
          }, err => {
            console.error(err);
          });
        }

        currentCanRemoveUser(userId) {
          let {
            superScope,
            roleHelper
          } = this,
              current = superScope.currentUser;
          return current && parseInt(current.id) !== parseInt(userId) && roleHelper.rolesInclude(current, 'admin@pageshare');
        }

        hasRole({
          scope,
          userId,
          roleName
        }) {
          let {
            roleHelper
          } = this;
          return roleHelper.hasRole(scope, userId, roleName);
        }

        hasRoleInActivePublisher({
          scope,
          userId,
          roleName
        }) {
          let {
            roleHelper
          } = this;
          return roleHelper.hasRoleInPublisher(scope.activePublisher, userId, roleName);
        } // noinspection JSMethodCanBeStatic


        itemSelect({
          scope,
          event
        }) {
          let parent = $(event.target).parent();

          if (!parent) {
            return;
          }

          if (!$(parent).hasClass('selected')) {
            $(scope.$getDom()).find('.list-container .list-item').removeClass('selected');
            $(parent).addClass('selected');
            return;
          }

          $(parent).find('.expand-btn').trigger('click');
        }

        search({
          scope,
          event,
          selector,
          errMsg
        }) {
          let {
            listHelper
          } = this,
              query;
          listHelper.navigateInItems(scope, event, {
            // selector: '.list-container .list-item',
            selector,

            onSelect(event, item) {
              if (Q.$objectExist(item) || !Q.$isEmpty(item)) {
                $(item).find('.expand-btn').trigger('click');
              }
            },

            onNoItems(event) {},

            onNewActive(event, item) {}

          });

          if (listHelper.isDirectionKey(event)) {
            return;
          }

          listHelper.resetSuggIdx(scope);

          let wasEmpty,
              proceed = () => {
            if (Q.$functionExist(scope.onSearch)) {
              query = Q.$stringExist(scope.query) ? scope.query.trim() : '';

              try {
                wasEmpty = !Q.$stringExist(query);
                scope.onSearch(query);
                setTimeout(_ => {
                  if (!wasEmpty && !Q.$stringExist(query) || wasEmpty && Q.$stringExist(query)) {
                    scope.onSearch(query);
                  }
                }, 200);
              } catch (err) {
                // console.error('APP@AWR: Pageshare : bad function < onSearch > for controller@controls');
                console.error(errMsg);
                console.error(err);
              }
            }
          };

          Q.$nonBlocking(proceed, null, scope.$getScopeId());
        }

      }

      $export(CommonListCtrFn);

      function commonItemRemoveConfirm({
        modal,
        message,
        onConfirm,
        itemType
      }) {
        if (!Q.$stringExist(message)) {
          message = 'Please note that confirming this action will cause to all data ' + `associated with this ${itemType} to be destroyed permanently.` + ` Are you sure about removing this ${itemType}?`;
        }

        modal.$enter('confirm-modal', {
          mainIcon: 'far fa-trash-alt',
          message,
          confirmText: 'Remove',
          confirmAfterIcon: 'fas fa-check-circle',
          onConfirm
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

      class ConvertJob extends awr.Service {
        static get $require() {
          return {
            server: 'service:serverCall',
            remoteCnf: 'config:remoteConnection'
          };
        }

        constructor() {
          super(ConvertJob.$require);
        }

        create(docId, pdfId) {
          let {
            server,
            remoteCnf
          } = this;
          return server.$post({
            url: `${remoteCnf.serverURL}/api/ps_convert/${docId}/${pdfId}`,
            headers: {
              authorization: $import(`token:awr_app_token @decoder: base64:${remoteCnf.decoder}`)
            }
          });
        }

      }

      $export(ConvertJob);

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

      /**
       *
       *  @Author Renata Hnykova
       *
       *  - Monday 26th of July, 2018
       *  - Monday 26th of July, 2018 at 12:24pm
       *  11:59am, 12:00pm 11:59pm, 12:00am
       *
       * @param date
       * @returns {*}
       */
      let awr = window.awr || {},
          Q = awr.Q;
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const stDates = [1, 21, 31];
      const ndDates = [2, 22];
      const rdDates = [3, 23];

      class DateFormatter extends awr.Service {
        static get $require() {
          return {};
        }

        constructor() {
          super(DateFormatter.$require);
        }

        prettyDate(date, format) {
          format = Q.$stringExist(format) ? format : 'short';

          if (Q.$stringExist(date)) {
            date = new Date(date);
          }

          let isValid = date && date instanceof Date;

          if (!isValid) {
            return 'invalid date';
          }

          let day = days[date.getDay()],
              month = months[date.getMonth()],
              dateNum = date.getDate(),
              suffix = getDateSuffix(dateNum),
              time = getPrettyTime(date.getHours(), date.getMinutes()),
              short = `${day} ${dateNum}${suffix} of ${month}, ${date.getFullYear()}`,
              medium = `${month} ${dateNum}${suffix}, ${date.getFullYear()}`;

          if (format === 'short') {
            return short;
          } else if (format === 'medium') {
            return `${medium}`;
          } else if (format === 'mediumWithTime') {
            return `${medium} at ${time}`;
          }

          return `${short} at ${time}`;
        }

      }

      $export(DateFormatter);

      function getDateSuffix(dateNum) {
        let suffix = 'th';

        if (Q.$setContainsNumber(stDates, dateNum)) {
          suffix = 'st';
        } else if (Q.$setContainsNumber(ndDates, dateNum)) {
          suffix = 'nd';
        } else if (Q.$setContainsNumber(rdDates, dateNum)) {
          suffix = 'rd';
        }

        return suffix;
      }

      function getPrettyTime(hour, minute) {
        let prettyTime = '';

        if (hour >= 1 && hour < 12) {
          prettyTime = `${hour}:${minute}am`;
        } else if (hour > 12) {
          prettyTime = `${hour - 12}:${minute}pm`;
        } else if (hour === 12) {
          prettyTime = `12:${minute}pm`;
        } else if (hour === 0) {
          prettyTime = `12:${minute}am`;
        }

        return prettyTime;
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

      class DocFormDataPreparer extends awr.Service {
        static get $require() {
          return {};
        }

        constructor() {
          super(DocFormDataPreparer.$require);
        }

        prepare(scope, doc) {
          doc.collection_id = Q.$numberExist(parseInt(doc.collection_id)) ? parseInt(doc.collection_id) : null;
          doc.status = Q.$booleanTrue(doc.status) || parseInt(doc.status) === 1 ? 'published' : 'draft';
          doc.meta = {
            print: [doc.print],
            designs: [doc.designs],
            meme: [doc.meme],
            authors: doc.authors,
            categories: doc.categories,
            languages: doc.languages,
            year: [doc.year]
          };
          doc.settings = {
            allow_aggregating: [parseInt(doc.allow_aggregating) === 1 || Q.$booleanTrue(doc.allow_aggregating)]
          };
        }

      }

      $export(DocFormDataPreparer);

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

      class DocScopeUtils extends awr.Service {
        static get $require() {
          return {
            router: 'service:router'
          };
        }

        constructor() {
          super(DocScopeUtils.$require);
          this.$importSuperScope();
        }

        onDocRemoved() {
          let {
            superScope,
            router
          } = this;
          superScope.currentDoc = null;
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
        } // noinspection JSMethodCanBeStatic


        aboutCurrentDoc(scope, event) {
          return Q.$objectExist(event.modelInstance) && Q.$objectExist(scope.doc) && Q.$idEqual(scope.doc.id, event.modelInstance.id);
        }

        getMaxVisiblePageNumber(scope) {
          let maxVisiblePage = Q.$asCollection($(scope.$getDom()).find('.doc-page')).$reduce(elem => {
            return $(elem).isInViewport();
          }).$collect((collected, nxt) => {
            collected = !Q.$objectExist(collected) ? nxt : collected;

            if ($(nxt).data('page-number') > $(collected).data('page-number')) {
              collected = nxt;
            }

            return collected;
          });
          return Q.$objectExist(maxVisiblePage) ? $(maxVisiblePage).data('page-number') : null;
        }

        docInCollection(collection, doc) {
          return collection && Q.$count(collection.stories, nxt => Q.$idEqual(nxt.id, doc.id)) > 0;
        }

      }

      $export(DocScopeUtils);

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
            authNextBuilder: 'service:authNextBuilder',
            collectionFetcher: 'service:collectionFetcher',
            base64: 'service:uriBase64',
            myDoc: 'model:MyDoc',
            modal: 'service:modal',
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
          authNextBuilder,
          collectionFetcher,
          base64,
          myDoc,
          modal,
          helper
        } = svcContext,
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
            let defaultInLink = `${hashPrefix}in/v?c=index`,
                appNext,
                next,
                cmpEncoder;
            appNext = authNextBuilder.getAppNextLink(router);
            next = authNextBuilder.getCleanAuthNext(remoteConfig, appNext, router, defaultInLink);
            cmpEncoder = authNextBuilder.getURIEncoder();
            view = Q.$stringExist(view) && view === 'signUp' ? 'signup' : 'default';
            window.location = `${remoteConfig.serverURL}/insider${hashPrefix}auth?view=${view}&next=${cmpEncoder(next)}`;
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
              }

            });
          },

          openControls() {
            scope.$preventDefault();
            router.$go('bookmarks-view', {
              params: {},
              attrs: {}
            }, true);
          },

          openPrinciples() {
            scope.$preventDefault();

            try {
              helper.findPrinciplesCollId().then(id => {
                scope.openCollection(id);
              }, err => {
                console.error(err);
              });
            } catch (e) {
              console.error(e);
            }
          },

          openMyCollections() {
            scope.$preventDefault();
            let {
              router
            } = this;
            router.$go('my-collections-view', {
              params: {
                cId: 'index'
              },
              attrs: {}
            }, true);
          },

          openMyShelf() {
            scope.$preventDefault();
            let pivot = null;

            if (this.currentUser && !Q.$isEmpty(this.currentUser.main_series)) {
              pivot = Q.$asCollection(this.currentUser.main_series).$reduce(nxt => nxt.type === 'my_shelf').$first();
            }

            if (Q.$objectExist(pivot)) {
              // noinspection JSObjectNullOrUndefined
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
                state = router.$getCurrentState();
            current = collectionFetcher.getCurrent();

            if (!Q.$exist(collId)) {
              return;
            }

            if (Q.$setContainsString(['default'], state.name) && Q.$objectExist(current) && current.id == collId) {
              return;
            }

            helper.firstDocDataInCollection(collId).then(data => {
              router.$go('default', {
                params: {
                  title: data.docTitle,
                  docId: data.docId,
                  page: 'index'
                },
                attrs: {
                  c: 'index'
                }
              }, true);
            }, err => {
              if (Q.$stringExist(err) && err === 'empty') {
                // console.error('Collection is empty');
                router.$go('errors-view', {
                  params: {
                    code: 'e1'
                  },
                  attrs: {}
                }, true);
              } else {
                console.error('PS: Failed to open collection');
                console.error(err);
              }
            });
          },

          openDoc(docId, docTitle) {
            scope.$preventDefault();
            let state = router.$getCurrentState();

            if (!Q.$exist(docId)) {
              return;
            }

            if (state && state.name === 'default' && Q.$objectExist(scope.currentDoc) && Q.$idEqual(scope.currentDoc.id, docId)) {
              return;
            }

            docTitle = Q.$stringExist(docTitle) ? encodeURIComponent(docTitle.toLowerCase().replace(/\s/g, '_')) : 'no_title';
            docId = base64.encode(docId);
            router.$go('default', {
              params: {
                title: docTitle,
                docId,
                page: 'index'
              },
              attrs: {
                c: 'index'
              }
            }, true);
          },

          addDoc(cId) {
            scope.$preventDefault();

            if (!Q.$exist(cId)) {
              return;
            }

            cId = base64.encode(cId);
            router.$go('upload-doc-view', {
              params: {
                cId
              },
              attrs: {}
            }, true);
          },

          editDoc(docId) {
            scope.$preventDefault();

            if (!Q.$exist(docId)) {
              return;
            }

            docId = base64.encode(docId);
            router.$go('edit-view', {
              params: {
                docId
              },
              attrs: {}
            }, true);
          },

          removeDoc(docId) {
            scope.$preventDefault();

            if (!Q.$numberExist(docId) || Q.$stringExist(docId)) {
              return;
            }

            modal.$enter('confirmModal', {
              icon: 'fas fa-exclamation-triangle text-warning',
              title: 'Remove document',
              message: 'Are you sure about removing this document?',
              confirmText: 'Remove',
              cancelText: 'Cancel',
              confirmBtnClass: 'btn btn-danger',

              onConfirm() {
                let doc = myDoc.$template({
                  id: docId
                });
                modal.$enter('smallNotifModal', {
                  icon: 'fas fa-circle-notch fa-spin',
                  message: 'Removing...'
                });
                setTimeout(_ => {
                  doc.$remove().then(res => {
                    modal.$exit();
                  }, err => {
                    modal.$enter('smallNotifModal', {
                      icon: 'fa fa-exclamation-triangle text-warning',
                      message: 'We are sorry but document removal failed. Please try again later!',
                      showRemove: true
                    });
                    console.error(err);
                  });
                }, 500);
              }

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
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');

      class ListHelper extends awr.Service {
        static get $require() {
          return {};
        }

        constructor() {
          super(ListHelper.$require);
        }

        isDirectionKey(event) {
          return event && Q.$setContainsNumber([40, 39, 38, 37, 13], event.keyCode);
        }

        resetSuggIdx(scope) {
          let params = scope.$getParams();

          if (params && Q.$objectExist(params.listHelper)) {
            params.listHelper.suggIdx = -1;
          }
        }

        loadMore(scope, {
          maxItems,
          loadedSizeKey,
          getList,
          onNoMore,
          onItemLoad
        }) {
          if (!(Q.$objectExist(scope) && Q.$functionExist(getList))) {
            return;
          }

          loadedSizeKey = Q.$stringExist(loadedSizeKey) ? loadedSizeKey : 'loadedItemSize';
          let list = Q.$asCollection(getList()),
              loadedItems;
          maxItems = Q.$numberExist(maxItems) ? maxItems : 20;
          loadedItems = Q.$numberExist(scope[loadedSizeKey]) ? scope[loadedSizeKey] : maxItems;

          if (list.$isEmpty()) {
            if (Q.$functionExist(onNoMore)) {
              onNoMore();
            }

            return;
          }

          list = list.$skip(loadedItems).$take(maxItems);
          scope[loadedSizeKey] += maxItems;

          if (Q.$functionExist(onItemLoad)) {
            list.$each(nxt => {
              onItemLoad(nxt);
            });
          }

          if (list.$isEmpty()) {
            if (Q.$functionExist(onNoMore)) {
              onNoMore();
            }
          }
        }

        navigateInItems(scope, event, {
          selector,
          onNoItems,
          onSelect,
          onNewActive
        }) {
          if (!Q.$objectExist(scope)) {
            return;
          }

          if (!Q.$objectExist(scope.$getParams().listHelper)) {
            scope.$getParams().listHelper = {};
          }

          let params = scope.$getParams().listHelper,
              isDown = event && event.keyCode === 40,
              suggItems = $(scope.$getDom()).find(selector);
          params.suggIdx = Q.$numberExist(params.suggIdx) ? params.suggIdx : -1;
          params.suggIdx = isDown ? params.suggIdx + 1 : params.suggIdx - 1;

          if (event && (event.keyCode === 13 || event.keyCode === 39)) {
            if (Q.$functionExist(onSelect)) {
              onSelect(event, $(suggItems[params.suggIdx + 1]));
            }

            return;
          }

          if (!(event && (event.keyCode === 38 || event.keyCode === 40))) {
            return;
          }

          if (Q.$isEmpty(suggItems)) {
            if (Q.$functionExist(onNoItems)) {
              onNoItems(event);
            }

            return;
          }

          if (params.suggIdx >= $(suggItems).length) {
            params.suggIdx = $(suggItems).length - 1;
          }

          if (params.suggIdx < 0) {
            params.suggIdx = 0;
          }

          $(suggItems).removeClass('selected');
          $(suggItems[params.suggIdx]).addClass('selected');

          if (Q.$functionExist(onNewActive)) {
            onNewActive(event, $(suggItems[params.suggIdx]));
          }
        }

      }

      $export(ListHelper);

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

      class ListSectionEventBinder extends awr.Service {
        static get $require() {
          return {
            roleModel: 'model:Role',
            publisherRoleModel: 'model:PublisherRole'
          };
        }

        constructor() {
          super(ListSectionEventBinder.$require);
        }

        bindWithPublisherRoleEvents(scope) {
          scope.$bind('model:PublisherRole', {
            onEvent(event, preventDefault) {
              preventDefault();

              if (!Q.$objectExist(event)) {
                return;
              }

              let listEnv = scope.$findProperty('listEnvName'),
                  activePublisher = scope.$findProperty('activePublisher'),
                  roleName,
                  roleList,
                  convertedModelInstance;
              let {
                modelInstance,
                requestType
              } = event;

              if (!(scope.listType === 'user' && listEnv === 'publishers' && Q.$objectExist(activePublisher) && Q.$objectExist(modelInstance) && Q.$setContainsString(['create', 'remove'], requestType))) {
                return;
              }

              roleName = modelInstance.name;
              activePublisher.moderators = Q.$asCollection(!Q.$isEmpty(activePublisher.moderators) ? activePublisher.moderators : []);
              activePublisher.creators = Q.$asCollection(!Q.$isEmpty(activePublisher.creators) ? activePublisher.creators : []);
              roleList = roleName === 'moderator' ? activePublisher.moderators : activePublisher.creators;
              convertedModelInstance = Q.$objectExist(modelInstance.user) ? modelInstance.user : {};
              convertedModelInstance.role_id = modelInstance.id;
              convertedModelInstance.role_name = modelInstance.name;

              if (event.requestType === 'create') {
                roleList.push(convertedModelInstance);
                roleList = roleList.$unique('id');
              } else {
                roleList = roleList.$reduce(nxt => parseInt(nxt.role_id) !== parseInt(modelInstance.id));
              }

              if (roleName === 'moderator') {
                activePublisher.moderators = roleList;
              } else {
                activePublisher.creators = roleList;
              }

              scope.$getAllSegments().$each(nxt => {
                if (parseInt(nxt.dataContext.id) === parseInt(event.modelInstance.user_id)) {
                  nxt.$update();
                }
              });
            }

          });
        }

        bindWithRoleEvents(scope) {
          scope.$bind('model:Role', {
            onEvent(event, preventDefault) {
              preventDefault();
              let listEnv = scope.$findProperty('listEnvName');

              if (!(scope.listType === 'user' && listEnv === 'users' && event && event.modelInstance && Q.$setContainsString(['create', 'remove'], event.requestType))) {
                return;
              }

              scope.$getAllSegments().$each(nxt => {
                if (parseInt(nxt.dataContext.id) === parseInt(event.modelInstance.user_id)) {
                  nxt.dataContext.roles = Q.$asCollection(!Q.$isEmpty(nxt.dataContext.roles) ? nxt.dataContext.roles : []);

                  if (event.requestType === 'create') {
                    nxt.dataContext.roles.push(event.modelInstance);
                  } else {
                    nxt.dataContext.roles = nxt.dataContext.roles.$reduce(nxtRole => parseInt(nxtRole.id) !== parseInt(parseInt(event.modelInstance.id)));
                  }

                  nxt.$update();
                }
              });
            }

          });
        }

      }

      $export(ListSectionEventBinder);

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

      class PsDocCreator extends awr.Service {
        static get $require() {
          return {
            myDocModel: 'model:MyDoc',
            fileUploader: 'service:fileUploader',
            convertJob: 'service:convertJob'
          };
        }

        constructor() {
          super(PsDocCreator.$require);
        }

        create(scope, doc, files) {
          let {
            myDocModel,
            fileUploader,
            convertJob
          } = this;
          return proceedWithDocCreation({
            scope,
            doc,
            files,
            model: myDocModel,
            uploader: fileUploader,
            convertJob
          });
        }

      }

      $export(PsDocCreator);

      async function proceedWithDocCreation({
        scope,
        doc,
        model,
        uploader,
        files,
        convertJob
      }) {
        let docInstance, uploadResult, pdfId, convertResult;
        scope.newInstance = null;
        $(scope.$getDom()).find('.working .msg').text('Initializing new document');
        docInstance = await model.$create(doc);
        scope.newInstance = docInstance;
        $(scope.$getDom()).find('.working .msg').text('Uploading files');
        uploadResult = await uploader.upload({
          path: `/api/story_attachment/${docInstance.id}`,
          fileKey: 'attachment',
          files
        });
        pdfId = !Q.$isEmpty(uploadResult) ? Q.$asCollection(uploadResult).$map(nxt => {
          if (nxt.status === 'success' && nxt.mime && nxt.mime.indexOf('application/pdf') >= 0) {
            return parseInt(nxt.file_id);
          }
        }).$first() : null;

        if (!Q.$numberExist(pdfId)) {
          throw new Error('Bad pdf file id');
          return;
        }

        $(scope.$getDom()).find('.working .up-item').text('');
        $(scope.$getDom()).find('.working .msg').text('Creating a convert job');
        convertResult = await convertJob.create(docInstance.id, pdfId);
        return {
          docId: docInstance.id,
          pdfId,
          convertResult
        };
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

      class TagSubSuggestions extends awr.Service {
        static get $require() {
          return {
            autocomplete: 'service:autocomplete',
            listHelper: 'service:listHelper'
          };
        }

        constructor() {
          super(TagSubSuggestions.$require);
        }

        applySuggestions(scope, suggs = []) {
          let manager = this,
              el,
              container = $(scope.$getDom()).find('.suggestion-items .container');
          $(container).html('');

          if (Q.$isEmpty(suggs)) {
            scope.selectedName = null;
            scope.suggIdx = -1;
            return;
          }

          Q.$each(suggs, nxt => {
            el = manager.makeSuggItem(nxt);
            $(container).append($(el));
          });
          $(container).find('.search-suggestion').on('click', function (event) {
            scope.selectedName = $(this).data('name');
            event.keyCode = 13;
            manager.navigateInSuggestions(scope, event);
          });
        }

        navigateInSuggestions(scope, event) {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          let {
            listHelper
          } = this;
          listHelper.navigateInItems(scope, event, {
            selector: '.tag-subscription.search-suggestion',

            onSelect(event, item) {
              scope.newTagName = scope.selectedName;
              scope.selectedName = null; // scope.suggIdx = -1;

              $(scope.$getDom()).find('.tag-search .sf-group input[type="text"]').val(scope.newTagName);
              $(scope.$getDom()).find('.tag-search .suggestion-items .container').html('');
            },

            onNoItems(event) {
              scope.selectedName = null;
            },

            onNewActive(event, item) {
              scope.selectedName = $(item).data('name');
            }

          });
        }

        makeSuggItem(name) {
          return `<div class="tag-subscription search-suggestion" data-name="${name}">
                    <div class="item">
                        ${name}
                    </div>
                </div>`;
        }

      }

      $export(TagSubSuggestions);

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

      class UserPublisherVarsConfigurer extends awr.Service {
        static get $require() {
          return {
            roleHelper: 'service:roleHelper',
            hasRoleInPubPipe: 'pipe:hasRoleInPublisher',
            router: 'service:router',
            base64: 'service:uriBase64'
          };
        }

        constructor() {
          super(UserPublisherVarsConfigurer.$require);
          Object.defineProperty(this, 'superScope', {
            get() {
              return $import('object:awr.superScope');
            }

          });
        }

        setupWhenData(scope) {
          let {
            superScope,
            roleHelper,
            hasRoleInPubPipe,
            router,
            base64
          } = this,
              {
            users,
            publishers
          } = scope;
          superScope.cachedPublishers = publishers;
          superScope.cachedUsers = users;
          scope._publishers = publishers;
          scope._users = publishers;
          Object.defineProperty(this, 'publishers', {
            set(value) {
              scope._publishers = value;
            },

            get() {
              return Q.$arrayExist(superScope.cachedPublishers) ? superScope.cachedPublishers : scope._publishers;
            },

            configurable: true
          });
          Object.defineProperty(this, 'users', {
            set(value) {
              scope._users = value;
            },

            get() {
              return Q.$arrayExist(superScope.cachedUsers) ? superScope.cachedUsers : scope._users;
            },

            configurable: true
          });
        }

        setup(scope) {
          let {
            superScope,
            roleHelper,
            hasRoleInPubPipe,
            router,
            base64
          } = this,
              {
            users,
            publishers
          } = scope;
          Object.defineProperty(scope, 'list', {
            get() {
              return Q.$setContainsString(['t1', 't3'], scope.tabId) ? scope.users : scope.tabId === 't4' ? Q.$asCollection([]) : scope.publishers;
            }

          });
          Object.defineProperty(scope, 'listType', {
            get() {
              return Q.$setContainsString(['t1', 't3'], scope.tabId) ? 'user' : scope.tabId === 't4' ? 'new-publisher' : 'publisher';
            }

          });
          Object.defineProperty(scope, 'listEnvName', {
            get() {
              return Q.$setContainsString(['t2', 't3'], scope.tabId) ? 'publishers' : scope.tabId === 't4' ? 'new-publisher' : 'users';
            }

          });
          Object.defineProperty(scope, 'searchPlaceholder', {
            get() {
              return scope.listType === 'user' ? 'Search for users' : 'Search for publishers';
            }

          });
          Object.defineProperty(scope, 'currentUser', {
            get() {
              return Q.$objectExist(superScope) && Q.$objectExist(superScope.currentUser) ? superScope.currentUser : null;
            }

          });
          Object.defineProperty(scope, 'currentUserId', {
            get() {
              return Q.$objectExist(superScope) && Q.$objectExist(superScope.currentUser) ? superScope.currentUser.id : '';
            }

          });
          Object.defineProperty(scope, 'assignee', {
            get() {
              let state = router.$getCurrentState(),
                  aid = state && state.attrs ? state.attrs.aid : null;
              aid = aid !== 'cr' && Q.$numberExist(parseInt(base64.decode(aid))) ? parseInt(base64.decode(aid)) : aid;

              if (!Q.$numberExist(parseInt(aid))) {
                return scope.currentUser;
              }

              return Q.$reduce(!Q.$isEmpty(scope.users) ? scope.users : [], nxt => parseInt(nxt.id) === parseInt(aid)).$first();
            }

          });
          Object.defineProperty(scope, 'assigneeId', {
            get() {
              return Q.$objectExist(scope.assignee) ? scope.assignee.id : null;
            }

          });
          Object.defineProperty(scope, 'isCurrentAdminInActivePub', {
            get() {
              return roleHelper.isAdminInPublisher(scope.activePublisher, scope.currentUserId);
            }

          });
          Object.defineProperty(scope, 'isCurrentAdmin', {
            get() {
              return roleHelper.isPSAdminOrHigher(scope, scope.currentUserId);
            }

          });
          Object.defineProperty(scope, 'currentHasMyPublisher', {
            get() {
              return hasRoleInPubPipe.transform(scope.publishers, scope.currentUserId, 'any').length > 0;
            }

          });
          Object.defineProperty(scope, 'activePubHasCreators', {
            get() {
              return scope.activePublisher && !Q.$isEmpty(scope.activePublisher.creators);
            }

          });
          Object.defineProperty(scope, 'activePubHasModerators', {
            get() {
              return scope.activePublisher && !Q.$isEmpty(scope.activePublisher.moderators);
            }

          });
          Object.defineProperty(scope, 'activePubHasDesc', {
            get() {
              return scope.activePublisher && Q.$stringExist(scope.activePublisher.description);
            }

          });
          Object.defineProperty(scope, 'defaultListReduceFn', {
            get() {
              if (scope.tabId !== 't3') {
                return nxt => true;
              }

              return nxt => {
                return roleHelper.hasRoleInPublisher(this.activePublisher, nxt.id, 'any');
              };
            }

          });
          Object.defineProperty(scope, 'showAdminActions', {
            get() {
              return scope.listEnvName === 'users' && scope.isCurrentAdmin;
            }

          });
          Object.defineProperty(scope, 'showOrgAdminActions', {
            get() {
              return scope.listEnvName === 'publishers' && scope.isCurrentAdminInActivePub;
            }

          });
          Object.defineProperty(scope, 'showEmptyActionsPlaceholder', {
            get() {
              return scope.listEnvName === 'publishers' && !scope.showOrgAdminActions || scope.listEnvName === 'users' && !scope.showAdminActions;
            }

          });
          Object.defineProperty(scope, 'showSearch', {
            get() {
              if (scope.tabId === 't4') {
                return false;
              }

              return scope.tabId !== 't3' || scope.currentHasMyPublisher;
            }

          });
          Object.defineProperty(scope, 'showListSection', {
            get() {
              if (!scope.isDataFetchReady || scope.tabId === 't4') {
                return false;
              }

              return scope.tabId !== 't3' || scope.currentHasMyPublisher;
            }

          });
          Object.defineProperty(scope, 'showNewPublisherForm', {
            get() {
              return scope.isDataFetchReady && scope.tabId === 't4';
            }

          });
        }

      }

      $export(UserPublisherVarsConfigurer);

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

      class BookList extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(BookList.$require);
          this.template = 'app/components/book-list/book-list.hbs';
          this.controller = 'BookList';
          this.scope = {
            items: '='
          };
        }

      }

      $export(BookList);

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
      /*globals $abstract, $app, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');

      class BookList extends awr.Controller {
        static get $require() {
          return {
            modal: 'service:modal'
          };
        }

        constructor(data, parent) {
          super(BookList.$require, data, parent);
        }

        removeSelected() {
          this.$preventDefault();
          let {
            modal,
            selected
          } = this,
              scope = this,
              parent = this.$getParent(),
              segment;

          if (!Q.$objectExist(selected)) {
            return;
          }

          segment = this.$getAllSegments().$reduce(nxt => nxt.dataContext.id === selected.id).$first();
          modal.$enter('confirm-modal', {
            mainIcon: 'far fa-trash-alt',
            message: 'Are you sure you want to remove the item from saved list?',
            confirmText: 'Remove',
            confirmAfterIcon: 'fas fa-check-circle',

            onConfirm() {
              if (segment) {
                $(segment.$getDom()).animate({
                  width: ["hide", "swing"],
                  height: ["hide", "swing"],
                  opacity: "0.1"
                }, 700, "linear", () => {});
              }

              scope.selected = null;
              $(scope.$getDom()).find('.actions .action-item.remove').removeClass('on');

              if (Q.$functionExist(parent.removeItem)) {
                parent.removeItem(selected);
              }
            }

          });
        }

        selectItem() {
          this.$preventDefault();

          if (!(this.$segment && Q.$objectExist(this.$segment.dataContext))) {
            return;
          }

          this.$getAllSegments().$each(nxt => {
            $(nxt.$getDom()).removeClass('selected');
          });
          $(this.$getDom()).find('.actions .action-item.remove').removeClass('on');

          if (Q.$objectExist(this.selected) && this.selected.id === this.$segment.dataContext.id) {
            this.selected = null;
            return;
          }

          this.selected = this.$segment.dataContext;
          $(this.$segment.$getDom()).addClass('selected');
          $(this.$getDom()).find('.actions .action-item.remove').addClass('on');
        }

      }

      $export(BookList);

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

      class CollectionList extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(CollectionList.$require);
          this.controller = 'CollectionList';
          this.template = 'app/components/collection-list/collection-list.hbs';
          this.scope = {
            collections: '=',
            activePublisherId: '='
          };
        }

      }

      $export(CollectionList);

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

      class CollectionList extends awr.Controller {
        static get $require() {
          return {
            myCollModel: 'model:MyCollection',
            mainCollModel: 'model:MainCollection',
            superScope: 'object:awr.superScope',
            listHelper: 'service:listHelper',
            pubCollsPipe: 'pipe:publisherCollections'
          };
        }

        constructor(data, parent) {
          super(CollectionList.$require, data, parent);
          let {
            myCollModel,
            superScope
          } = this,
              scope = this;
          scope.collections = scope.collections.$sortBy('created_at', 'date');
          this.maxItems = 20;
          this.loadedItems = this.maxItems;
          this.$getParent().listScope = this;
          Object.defineProperty(this, 'hasMoreItems', {
            get() {
              let list = getCurrentList(this);
              return this.loadedItems < list.length;
            }

          });
        }

        addNewItem(item) {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          item.inEdit = true;
          this.collections.reverse();
          this.collections.push(item);
          this.collections.reverse();
          this.loadedItems++;

          if (this.loadedItems > this.collections.length) {
            this.loadedItems = this.collections.length;
          }

          this.$prepend({
            selector: 'table tbody',
            dataContext: item,
            segment: 'cItem'
          });
          this.$getDom().find('.content').removeClass('busy');
          $(this.$getDom()).find('tbody tr.push-tr').remove();
          $(this.$getDom()).find('tbody').prepend(getPushTr());
        }

        loadMore(event) {
          this.$preventDefault();
          let {
            listHelper
          } = this,
              scope = this;
          listHelper.loadMore(this, {
            maxItems: scope.maxItems,
            loadedSizeKey: 'loadedItems',
            getList: () => getCurrentList(scope),

            onNoMore() {
              $(scope.$getDom()).find('.list-actions button.load-more').addClass('hidden');
            },

            onItemLoad(item) {
              scope.$append({
                selector: '.content table.items tbody',
                dataContext: item,
                segment: 'cItem'
              });
            }

          });
        }

        toggleEdit(event) {
          this.$preventDefault();
          this.$segment.dataContext.inEdit = !this.$segment.dataContext.inEdit;
          this.$segment.$update();
        }

        remove() {
          this.$preventDefault();
          let scope = this,
              parent = this.$getParent(),
              item,
              segment = scope.$segment;
          scope.$getDom().find('.content').addClass('busy');
          $(segment.$getDom()).animate({
            width: ["hide", "swing"],
            height: ["hide", "swing"],
            opacity: "0.1"
          }, 700, "linear", () => {
            item = segment.dataContext;
            item.$remove().then(_ => {
              segment.$remove();
              scope.$getDom().find('.content').removeClass('busy');
              parent.collections = parent.collections.$reduce(nxt => nxt.id !== item.id);
              scope.collections = parent.collections;
              scope.loadedItems--;

              if (scope.loadedItems < 0) {
                scope.loadedItems = 0;
              }
            }, err => {
              console.error(err);
              scope.$getDom().find('.content').removeClass('busy');
            });
          });
        }

        checkKey(event) {
          this.$preventDefault();

          if (event && event.keyCode === 13) {
            this.saveName();
          }
        }

        saveName() {
          this.$preventDefault();
          let scope = this,
              segment = scope.$segment,
              item = segment.dataContext,
              editName = item.editName,
              origName;
          item.inEdit = false; // debugger;

          if (!(Q.$stringExist(editName) && item && Q.$functionExist(item.$save))) {
            item.editName = item.name;
          } else {
            origName = item.name;
            item.name = editName;
            scope.$getDom().find('.collection-list .content').addClass('busy');
            item.$save().then(res => {
              scope.$getDom().find('.collection-list .content').removeClass('busy');
            }, err => {
              console.error(err);
              item.name = origName;
              item.editName = item.name;
              setTimeout(_ => {
                segment.$update();
                scope.$getDom().find('.collection-list .content').removeClass('busy');
              }, 500);
            });
          }

          segment.$update();
        }

        toggleIsMain(event) {
          this.$preventDefault();
          let {
            mainCollModel,
            superScope
          } = this,
              scope = this,
              segment = scope.$segment,
              mainSeries,
              instData;

          if (Q.$booleanTrue(this.isToggleMainBusy)) {
            return;
          }

          this.isToggleMainBusy = true;

          if (superScope.isCollectionMyShelf(segment.dataContext.id)) {
            mainSeries = superScope.currentUser.main_series;
            instData = mainSeries.$reduce(nxt => nxt.id == segment.dataContext.id).$first();
            superScope.currentUser.main_series = mainSeries.$reduce(nxt => nxt.series_id !== segment.dataContext.id);
            segment.$update();
            mainCollModel.$template(instData).$remove().then(_ => {
              this.isToggleMainBusy = false;
            }, err => {
              this.isToggleMainBusy = false;
              console.error(err);
            });
          } else {
            superScope.currentUser.main_series = superScope.currentUser.main_series.$reduce(nxt => nxt.type !== 'my_shelf');
            this.$getAllSegments().$each(nxt => {
              if (nxt.dataContext.currentIsMyShelf) {
                nxt.$update();
              }
            });
            $(segment.$getDom()).find('.c-item.d-toggle').addClass('checked');
            mainCollModel.$create({
              type: 'my_shelf',
              series_id: segment.dataContext.id
            }).then(newInst => {
              superScope.currentUser.main_series.push(newInst);
              segment.$update();
              this.isToggleMainBusy = false;
            }, err => {
              this.isToggleMainBusy = false;
              console.error(err);
            });
          }
        }

      }

      $export(CollectionList);

      function getCurrentList(scope) {
        let {
          pubCollsPipe
        } = scope,
            userId = scope.$findProperty('currentUserId'),
            publishers = scope.$findProperty('publishers'),
            transformed = pubCollsPipe.transform(scope.collections, scope.activePublisherId, userId, publishers);
        return transformed.$sortBy('created_at', 'date');
      }

      function isMain(item) {
        return item && (item.is_main == 1 || Q.$booleanTrue(item.is_main));
      }

      function getPushTr() {
        return `<tr class="push-tr">
                <td>
                    <span>#</span>
                </td>
            </tr>`;
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

      class DocReader extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(DocReader.$require);
          this.controller = 'DocReader';
          this.template = 'app/components/doc-reader/doc-reader.hbs';
          this.scope = {
            doc: '='
          };
        }

      }

      $export(DocReader);

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

      class DocReader extends awr.Controller {
        static get $require() {
          return {
            superScope: 'object:awr.superScope',
            initializer: 'service:docReaderInit',
            methods: 'service:docReaderMethods'
          };
        }

        constructor(data, parent) {
          super(DocReader.$require, data, parent);
          let {
            initializer
          } = this;
          this.$disableDefaultActionAutoRecompile();
          initializer.init(this);
        }

        loadPreviousPages() {
          let {
            methods
          } = this;
          methods.loadPreviousPages({
            scope: this
          });
        }

        imageLoaded(event) {
          let {
            methods
          } = this;
          methods.imageLoaded({
            scope: this,
            event
          });
        }

        toggleLeftActions(event) {
          let {
            methods
          } = this;
          methods.toggleLeftActions({
            scope: this,
            event
          });
        }

        togglePageMenu(event) {
          let {
            methods
          } = this;
          methods.togglePageMenu({
            scope: this,
            event
          });
        }

      }

      $export(DocReader);

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

      class InvitedList extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(InvitedList.$require);
          this.template = 'app/components/invited-list/invited-list.hbs';
          this.controller = 'InvitedList';
          this.scope = {
            invites: '='
          };
        }

      }

      $export(InvitedList);

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

      class InvitedList extends awr.Controller {
        static get $require() {
          return {};
        }

        constructor(data, parent) {
          super(InvitedList.$require, data, parent);
          let scope = this;
        }

      }

      $export(InvitedList);

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

      class ListSection extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(ListSection.$require);
          this.template = 'app/components/list-section/list-section.hbs';
          this.controller = 'ListSection';
          this.scope = {
            list: '=',
            listType: '='
          };
        }

      }

      $export(ListSection);

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
          $ = $import('window:jQuery'),
          lastRecTime = 0,
          currentQuery,
          painting = false,
          cache = {};

      class ListSection extends awr.Controller {
        static get $require() {
          return {
            fieldSearchPipe: 'pipe:fieldSearch',
            listHelper: 'service:listHelper',
            eventBinder: 'service:listSectionEventBinder',
            searchCache: 'service:searchCache'
          };
        }

        constructor(data, parent) {
          super(ListSection.$require, data, parent);

          let {
            fieldSearchPipe,
            eventBinder,
            searchCache
          } = this,
              hasMore = () => {
            let lSym = Symbol.for('lastSearchResultLength'),
                length = Q.$numberExist(this.list[lSym]) ? Math.min(this.list[lSym], this.list.length) : this.list.length;
            return this.loadedItems < length;
          };

          currentQuery = this.query;
          this.isReady = false;
          this.maxItems = 20;
          this.lastComputedList = computeScopeList(this);
          this.loadedItems = Math.min(this.maxItems, this.lastComputedList.length);
          eventBinder.bindWithRoleEvents(this);
          eventBinder.bindWithPublisherRoleEvents(this);
          Object.defineProperty(this, 'hasMoreItems', {
            get() {
              let res = hasMore();
              setTimeout(_ => {
                if (res !== hasMore()) {
                  res = hasMore();
                  $(this.$getDom()).find('.list-actions button.load-more').toggleClass('hidden', !res);
                }
              }, 250);
              return res;
            }

          });

          this.$getParent().onSearch = query => {
            if (currentQuery === query) {
              return;
            }

            currentQuery = query;
            let res,
                now,
                defaultListReduceFn,
                listType,
                parent,
                tabId,
                cacheName,
                partialList,
                lSym = Symbol.for('lastSearchResultLength'),
                partialQuery = Q.$stringExist(query) ? query.toLowerCase() : query;
            parent = this.$getParent();
            this.list = parent.$findProperty('list');
            partialList = this.list;
            defaultListReduceFn = parent.$findProperty('defaultListReduceFn');
            listType = parent.$findProperty('listType');
            tabId = parent.$findProperty('tabId');
            this.query = query;
            now = new Date().getTime();
            cacheName = `${listType}:list-results`;

            if (searchCache.inCache(cacheName, query.toLowerCase())) {
              res = searchCache.getFromCache(cacheName, query.toLowerCase());
            } else {
              while (Q.$stringExist(partialQuery) && !searchCache.inCache(cacheName, partialQuery)) {
                partialQuery = partialQuery.substring(0, partialQuery.length - 1);
              }

              if (Q.$stringExist(partialQuery) && searchCache.inCache(cacheName, partialQuery)) {
                partialList = searchCache.getFromCache(cacheName, partialQuery);
              }

              res = fieldSearchPipe.transform(partialList, this.query, 'name', defaultListReduceFn);
              searchCache.putInCache(cacheName, query.toLowerCase(), res);
            }

            this.loadedItems = Math.min(this.maxItems, res.length);
            this.list[lSym] = res.length;
            setTimeout(_ => {
              if (Q.$booleanTrue(painting)) {
                return;
              }

              painting = true;
              lastRecTime = new Date().getTime() + 500;
              $(this.$getDom()).find('.list-container').html('');
              res.$take(this.maxItems).$each(nxt => {
                this.$append({
                  selector: '.list-container',
                  dataContext: nxt,
                  segment: listType === 'publisher' ? 'publisherItem' : 'userItem'
                });
              });
              $(this.$getDom()).find('.list-actions .load-more').toggleClass('hidden', !this.hasMoreItems);
              $(this.$getDom()).find('.list-label').toggleClass('hidden', tabId === 't3' && Q.$stringExist(query));
              painting = false;
            }, now < lastRecTime ? 500 : 0);
          };

          this.$getParent().onListRefresh = () => {
            this.list = this.$getParent().list;
            let cleanList = computeScopeList(this);

            if (!modelListsAreEqual(cleanList, this.lastComputedList)) {
              this.lastComputedList = cleanList;
              this.loadedItems = Math.min(this.maxItems, this.lastComputedList.length);
              this.$recompile();
            }
          };

          this.$ready(_ => {
            if (!Q.$booleanTrue(this.isReady)) {
              this.isReady = true;
              this.$recompile();
            }
          });

          this.hasRole = (userId, roleName) => this.$getParent().hasRole.apply(this.$getParent(), [userId, roleName]);

          this.hasRoleInActivePublisher = (userId, roleName) => this.$getParent().hasRoleInActivePublisher.apply(this.$getParent(), [userId, roleName]);
        }

        loadMore(event) {
          this.$preventDefault();
          let {
            listHelper,
            fieldSearchPipe
          } = this,
              scope = this;
          listHelper.loadMore(this, {
            maxItems: scope.maxItems,
            loadedSizeKey: 'loadedItems',
            getList: () => {
              scope.lastComputedList = computeScopeList(scope);
              return scope.lastComputedList;
            },

            onNoMore() {
              $(scope.$getDom()).find('.list-actions button.load-more').addClass('hidden');
            },

            onItemLoad(item) {
              scope.$append({
                selector: '.list-container',
                dataContext: item,
                segment: scope.listType === 'user' ? 'userItem' : 'publisherItem'
              });
            }

          });
        }

        toggleExpand() {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          if (!(Q.$objectExist(this.$segment) && Q.$objectExist(this.$segment.dataContext))) {
            return;
          }

          this.$segment.dataContext.isExpanded = !this.$segment.dataContext.isExpanded;
          this.$segment.$update();
        }

        itemSelect(event) {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          this.$getParent().itemSelect.call(this.$getParent(), event);
        }

      }

      $export(ListSection);

      function computeScopeList(scope) {
        let {
          fieldSearchPipe
        } = scope;
        return fieldSearchPipe.transform(scope.list, scope.$findProperty('query'), 'name', scope.$findProperty('defaultListReduceFn'));
      }

      function modelListsAreEqual(a, b) {
        if (Q.$isEmpty(a) && Q.$isEmpty(b)) {
          return true;
        }

        if (Q.$isEmpty(a) || Q.$isEmpty(b)) {
          return false;
        }

        if (a.length !== b.length) {
          return false;
        }

        let equal = true;
        Q.$each(a, nxt => {
          if (b.$count(bNxt => bNxt.id !== nxt.id) > 0) {
            equal = false;
          }
        });
        return equal;
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

      class TagsSection extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(TagsSection.$require);
          this.template = 'app/components/tags-section/tags-section.hbs';
          this.controller = 'TagsSection';
          this.scope = {
            tags: '='
          };
        }

      }

      $export(TagsSection);

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

      class TagsSection extends awr.Controller {
        static get $require() {
          return {
            autocomplete: 'service:autocomplete',
            suggSvc: 'service:tagSubSuggestions',
            model: 'model:TagSubscription',
            listHelper: 'service:listHelper',
            superScope: 'object:awr.superScope'
          };
        }

        constructor(data, parent) {
          super(TagsSection.$require, data, parent);
          this.newTagName = '';
          this.isSearchBusy = false;
          this.selectedName = null;
          this.isSubscribeBusy = false;
          this.tagSearchData = {
            actionsBusy: false
          };
          this.maxItems = 20;
          this.loadedItems = this.maxItems;
          this.filterName = 'all';

          this.filterReduce = nxt => {
            return this.filterName === 'all' || nxt.type === this.filterName;
          };

          Object.defineProperty(this, 'hasMoreItems', {
            get() {
              return this.loadedItems < Q.$asCollection(this.tags).$reduce(this.filterReduce).length;
            }

          });
        }

        filter(type) {
          this.$preventDefault();

          if (!type || type === this.filterName) {
            return;
          }

          if (Q.$setContainsString(['whitelist', 'blacklist', 'all'], type)) {
            this.filterName = type;
            this.loadedItems = this.maxItems;
            this.$recompile();
          }
        }

        remove(id) {
          this.$preventDefault();

          if (!Q.$objectExist(this.$segment)) {
            return;
          }

          let {
            superScope
          } = this,
              segment = this.$segment,
              dataContext;
          $(segment.$getDom()).animate({
            width: ["hide", "swing"],
            height: ["hide", "swing"],
            opacity: "0.1"
          }, 700, "linear", () => {
            dataContext = segment.dataContext;
            dataContext.$remove().then(_ => {
              this.tags = Q.$reduce(!Q.$isEmpty(this.tags) ? this.tags : [], nxt => {
                return !Q.$idEqual(dataContext.id, nxt.id);
              });
              superScope.cachedTags = this.tags;
              segment.$remove();
            }, err => {
              console.error(err);
            });
          });
        }

        subscribe(tagName, type) {
          this.$preventDefault();
          let {
            model,
            superScope
          } = this,
              tmp,
              segment;

          if (!(Q.$stringExist(tagName) && Q.$setContainsString(['blacklist', 'whitelist'], type))) {
            return;
          }

          if (Q.$booleanTrue(this.isSubscribeBusy)) {
            return;
          }

          if (this.tags.$count(nxt => nxt.name && nxt.name.toLowerCase() === tagName.toLowerCase())) {
            setTimeout(_ => {
              this.setAsNotBusy();
              $(this.$getDom()).find('.already-exists.ntf-item').addClass('on');
              setTimeout(_ => {
                $(this.$getDom()).find('.already-exists.ntf-item').removeClass('on');
              }, 2000);
            }, 200);
            return;
          }

          this.isSubscribeBusy = true;
          tmp = model.$template({
            name: tagName,
            type
          });
          this.$prepend({
            selector: '.tag-items',
            dataContext: tmp,
            segment: 'tagSubscription'
          });
          setTimeout(_ => {
            this.setAsBusy();
            model.$create(tmp.$getData()).then(instance => {
              if (!Q.$arrayExists(this.tags)) {
                this.tags = Q.$asCollection([]);
              }

              this.tags.push(instance);
              superScope.cachedTags = this.tags;
              segment = getSegmentByDataKey(this, 'name', instance.name);

              if (Q.$objectExist(segment)) {
                segment.$upgrade(instance);
              }

              this.setAsNotBusy();
            }, err => {
              console.error(err);
              this.setAsNotBusy();
              segment = getSegmentByDataKey(this, 'name', tmp.name);

              if (Q.$objectExist(segment)) {
                $(segment.$getDom()).addClass('failed');
              }
            });
          }, 200);
        }

        loadMore(event) {
          this.$preventDefault();
          let {
            listHelper
          } = this,
              scope = this;
          listHelper.loadMore(this, {
            maxItems: scope.maxItems,
            loadedSizeKey: 'loadedItems',

            getList() {
              return Q.$asCollection(scope.tags).$reduce(scope.filterReduce);
            },

            onNoMore() {
              $(scope.$getDom()).find('.bottom-actions button.load-more').addClass('hidden');
            },

            onItemLoad(item) {
              scope.$append({
                selector: '.tag-items',
                dataContext: item,
                segment: 'tagSubscription'
              });
            }

          });
        }

        search(event) {
          this.$preventDefault();
          let {
            autocomplete,
            listHelper
          } = this;

          if (event && Q.$setContainsNumber([38, 39, 40, 13], event.keyCode)) {
            this.suggSvc.navigateInSuggestions(this, event);
            return;
          }

          if (!Q.$stringExist(this.newTagName)) {
            this.suggSvc.applySuggestions(this, []);
            return;
          }

          if (this.isSearchBusy) {
            return;
          }

          this.isSearchBusy = true;
          this.selectedName = null;
          listHelper.resetSuggIdx(this);

          if (Q.$stringExist(this.newTagName) && this.newTagName.length === 1 && event && event.keyCode === 8) {
            this.isSearchBusy = false;
            this.suggSvc.applySuggestions(this, []);
            return;
          }

          autocomplete.search(this.newTagName).then(res => {
            this.isSearchBusy = false;
            this.suggSvc.applySuggestions(this, res);
          }, err => {
            console.error(err);
            this.isSearchBusy = false;
            this.suggSvc.applySuggestions(this, []);
          });
        }

        setAsBusy() {
          this.reset();
          this.isSubscribeBusy = true;
          this.$getAllSegments().$each(nxt => {
            if (nxt.dataContext && nxt.dataContext.isTagSearch) {
              nxt.dataContext.actionsBusy = true;
              nxt.$update();
            }
          });
        }

        setAsNotBusy() {
          this.reset();
          this.isSubscribeBusy = false;
          this.$getAllSegments().$each(nxt => {
            if (nxt.dataContext && nxt.dataContext.isTagSearch) {
              nxt.dataContext.actionsBusy = false;
              nxt.$update();
            }
          });
        }

        reset() {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          let {
            listHelper
          } = this;
          this.newTagName = '';
          this.isSearchBusy = false;
          this.selectedName = null;
          this.isSubscribeBusy = false;
          listHelper.resetSuggIdx(this);
          $(this.$getDom()).find('.tag-search .suggestion-items').html('');
          $(this.$getDom()).find('.tag-search .sf-group input[type="text"]').val(this.newTagName);
          $(this.$getDom()).find('.tags-section').removeClass('in-search');
        }

      }

      $export(TagsSection);

      function getSegmentByDataKey(scope, key, value) {
        return scope.$getAllSegments().$reduce(nxt => {
          return nxt.dataContext && nxt.dataContext[key] && nxt.dataContext[key] === value;
        }).$first();
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

      class DocForm extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(DocForm.$require);
          this.template = 'app/forms/doc-form/doc-form.hbs';
          this.controller = 'DocForm';
          this.scope = {
            collectionId: '=',
            collections: '=',
            publishers: '='
          };
        }

      }

      $export(DocForm);

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

      class DocForm extends awr.Controller {
        static get $require() {
          return {
            formActivator: 'service:formViewActivator',
            psDocCreator: 'service:psDocCreator',
            formScopeConfigurer: 'service:bookFormScopeConfigurer',
            dataPreparer: 'service:docFormDataPreparer'
          };
        }

        constructor(data, parent) {
          super(DocForm.$require, data, parent);
          let {
            formActivator,
            psDocCreator,
            formScopeConfigurer,
            dataPreparer
          } = this,
              scope = this,
              yearSelectPath = 'select[name="year"]';
          formScopeConfigurer.setup({
            scope,
            personalCollectionGroupId: 'personal-collections',
            initialCollectionKey: 'collectionId',
            publisherSelectPath: 'select.publisher',
            collectionSelectPath: 'select.collections',
            yearSelectPath
          });
          this.doc = {
            /*initial collection_id will be set by configurer service*/
            collection_id: this.initialCollectionId,
            year: new Date().getFullYear(),
            status: true,
            allow_aggregating: false
          }; // this.doc = {
          //     // collection_id: !Q.$isEmpty(scope.collections) ? scope.collections[0].id : null,
          //     year: new Date().getFullYear(),
          //     title: "One dummy book",
          //     categories: ["computer science"],
          //     tags: ["technology", "science", "engineering"],
          //     languages: ["english", "finnish"],
          //     authors: ["Luisa-Claudia Sovijärvi", "Second person"],
          //     print: "https://www.site.com/print",
          //     designs: "www.designs.com/my_designs",
          //     meme: "http://public-memes.net/mKoLjdsd#n=jadgs&bn=9",
          //     status: true,
          //     allow_aggregating: false
          // };

          formActivator.activate({
            scope,
            form: 'doc_form',
            formInputSelector: '.doc-form input',

            beforeSetup() {
              scope.docFormFields.$each((field, idx) => {
                formScopeConfigurer.autocompleteSetup(field);
              });
            },

            onSubmit(doc) {
              let pdf, epub;
              dataPreparer.prepare(scope, doc);
              pdf = doc.pdf;
              epub = doc.epub;
              delete doc.pdf;
              delete doc.epub;
              return psDocCreator.create(scope, doc, [pdf, epub]);
            }

          });
          this.stepsValidation = [['collection', 'title'], ['print', 'meme', 'designs'], ['pdf']];
          this.$addBeforeRecompileListener(_ => {
            this.skipVisited = true;

            if (this.step === 1) {
              this.doc.collection_id = $(this.$getDom()).find('select.collections').val();
            }
          }, 'step-max-watcher');
          this.$bind('observable:uploadEvents', {
            onEvent(event, preventDefault) {
              preventDefault();
              let upItem,
                  prog = '';

              if (event.eventName === 'progress') {
                if (!(event.file && event.file.type)) {
                  return;
                }

                if (event.track) {
                  prog = Math.round(event.track.loaded / event.track.total * 100) + '%';
                }

                if (event.file.type.indexOf('application/pdf') >= 0) {
                  upItem = $(scope.$getDom()).find('.working .upload-progress .up-item.pdf');
                } else if (event.file.type.indexOf('application/epub') >= 0) {
                  upItem = $(scope.$getDom()).find('.working .upload-progress .up-item.epub');
                }

                if (!Q.$isEmpty(upItem)) {
                  $(upItem).text(`${event.file.name} ${prog}`);
                }
              }
            }

          }); // this.mode = 'fail';
          // setTimeout(_ => {
          //     scope.step = 2;
          //     scope.$recompile();
          // }, 500);
        }

        selectPublisher() {
          this.$preventDefault();
          let {
            formScopeConfigurer
          } = this,
              scope = this;
          formScopeConfigurer.selectPublisher({
            scope,
            collectionSelectPath: 'select.collections',
            publisherSelectPath: 'select.publisher',
            personalCollectionGroupId: 'personal-collections'
          });
        }

      }

      $export(DocForm);

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

      class InviteForm extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(InviteForm.$require);
          this.template = 'app/forms/invite-form/invite-form.hbs';
          this.controller = 'InviteForm';
        }

      }

      $export(InviteForm);

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

      class InviteForm extends awr.Controller {
        static get $require() {
          return {
            formActivator: 'service:formViewActivator',
            inviteModel: 'model:Invite',
            superScope: 'object:awr.superScope'
          };
        }

        constructor(data, parent) {
          super(InviteForm.$require, data, parent);
          let {
            formActivator,
            inviteModel
          } = this;
          this.inviteFormContext = {
            invite_text: makeDefaultInviteText({
              name: ''
            })
          };
          formActivator.activate({
            scope: this,

            /*The should be equal to what the form.json file name property specifies.*/
            form: 'invite-form',

            /*The selector depends on how the parent input path is.*/
            formInputSelector: '.invite-form input',

            beforeSetup() {},

            onSubmit(inviteFormContext) {
              if (!Q.$stringExist(inviteFormContext.invite_text) || Q.$stringEqual(inviteFormContext.invite_text.trim(), makeDefaultInviteText({
                name: ''
              }).trim())) {
                inviteFormContext.invite_text = makeDefaultInviteText(inviteFormContext);
              }

              return inviteModel.$create(inviteFormContext);
            }

          });
          Object.defineProperty(this, 'failReason', {
            get() {
              let {
                inviteFormContext,
                superScope
              } = this,
                  currentUser = superScope.currentUser,
                  invites = this.$findProperty('invites');

              if (!Q.$isEmpty(invites) && Q.$count(invites, nxt => nxt.email === inviteFormContext.email)) {
                return `You have already invited a person by email [ ${inviteFormContext.email} ].`;
              } else if (currentUser && currentUser.email === inviteFormContext.email) {
                return `Are you seriously trying to invite yourself!? The email [ ${inviteFormContext.email} ] belongs to you.`;
              }

              return 'Something went wrong. Make sure you are not trying to invite someone which is already joined the platform!';
            },

            configurable: true
          });
        }

      }

      $export(InviteForm);

      function makeDefaultInviteText(context) {
        return `Hello ${Q.$capitalizeName(context.name)},` + `\nI would like to invite you to join Pageshare platform and become part of this amazing community.` + ` Pageshare is a book reading and publishing platform for readers, authors and publishers.` + ` I am sure you will love this platform as much as I do.`;
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

      class EditForm extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(EditForm.$require);
          this.template = 'app/forms/edit-form/edit-form.hbs';
          this.controller = 'EditForm';
          this.scope = {
            doc: '=',
            collections: '=',
            publishers: '='
          };
        }

      }

      $export(EditForm);

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

      class EditForm extends awr.Controller {
        static get $require() {
          return {
            formActivator: 'service:formViewActivator',
            remoteCnf: 'config:remoteConnectionConfig',
            collFetcher: 'service:collectionFetcher',
            myDoc: 'model:MyDoc',
            superScope: 'object:awr.superScope',
            router: 'service:router',
            formScopeConfigurer: 'service:bookFormScopeConfigurer',
            dataPreparer: 'service:docFormDataPreparer'
          };
        }

        constructor(data, parent) {
          super(EditForm.$require, data, parent);
          let {
            formActivator,
            remoteCnf,
            collFetcher,
            myDoc,
            superScope,
            router,
            formScopeConfigurer,
            dataPreparer
          } = this;
          let scope = this,
              formHeight,
              yearSelectPath = 'select[name="year"]';
          Object.defineProperty(scope, 'hasCover', {
            get() {
              return Q.$setContainsString(['working', 'fail'], scope.mode);
            }

          });
          initDocForEdit(scope, remoteCnf, collFetcher);
          formScopeConfigurer.setup({
            scope,
            personalCollectionGroupId: 'personal-collections',
            initialCollectionKey: 'collectionId',
            publisherSelectPath: 'select.publisher',
            collectionSelectPath: 'select.collections',
            yearSelectPath
          });

          scope.inHeadSection = nxt => Q.$setContainsString(['title'], nxt.key);

          scope.inCoverSection = nxt => Q.$setContainsString(['status', 'allow_aggregating'], nxt.key);

          scope.inMainTopSection = nxt => Q.$setContainsString(['collection'], nxt.key);

          scope.inMainBottomSection = nxt => {
            return !(scope.inHeadSection(nxt) || scope.inMainTopSection(nxt) || scope.inCoverSection(nxt) || Q.$setContainsString(['epub', 'pdf'], nxt.key));
          };

          formActivator.activate({
            scope,
            form: 'edit_form',
            formInputSelector: '.edit_form input',

            beforeSetup() {
              scope.editFormFields.$each((field, idx) => {
                formScopeConfigurer.autocompleteSetup(field);
              });
            },

            onSubmit(doc) {
              dataPreparer.prepare(scope, doc);
              scope.doc = doc;
              delete doc.pdf;
              delete doc.epub;
              return save(scope, myDoc, remoteCnf, collFetcher);
            }

          });
          scope.$addBeforeRecompileListener(_ => {
            superScope.dontCheckTheScroll = true;
          }, 'step-max-watcher');
          /*
          * Notice:
          * Functions nextStep, backStep, restart and submit are set for scope and ready by activator!
          *
          * Variable scope.mode can have values default, success, fail and working. Use them in your template!
          * */

          scope.$fn({
            //overriding default formView restart
            restart() {
              scope.$preventDefault();
              router.$reloadCurrentState();
            }

          });
          scope.$addRecompileListener(_ => {
            if (scope.mode === 'fail') {
              $(scope.$getDom()).find('div[awr-click="restart"]').off('click');
              $(scope.$getDom()).find('div[awr-click="restart"]').on('click', scope.restart);
            }
          });
          scope.$init(_ => {
            formHeight = $(scope.$getDom()).find('.edit-form').height();
            $(scope.$getDom()).find('.edit-form').css('min-height', `${formHeight}px`);
            superScope.dontCheckTheScroll = false;

            if (Q.$numberExist(parseInt(scope.doc.year))) {
              $(scope.$getDom()).find('select[name="year"]').val(scope.doc.year);
            }

            textAreaAdjust($(this.$getDom()).find('.form-member textarea[name="title"]')[0]);
          });
        }

        selectPublisher() {
          this.$preventDefault();
          let {
            formScopeConfigurer
          } = this,
              scope = this;
          formScopeConfigurer.selectPublisher({
            scope,
            collectionSelectPath: 'select.collections',
            publisherSelectPath: 'select.publisher',
            personalCollectionGroupId: 'personal-collections'
          });
        }

      }

      $export(EditForm);

      async function save(scope, myDoc, remoteCnf, collFetcher) {
        await scope.doc.$save();
        await collFetcher.findAll(null, true);
        scope.doc = await myDoc.$findOne(scope.doc.id);
        initDocForEdit(scope, remoteCnf, collFetcher);
        return scope.doc;
      }

      function textAreaAdjust(o) {
        o.style.height = "1px";
        o.style.height = 25 + o.scrollHeight + "px";
      }

      function initDocForEdit(scope, remoteCnf, collFetcher) {
        let cover, status, aggregate, pdf, epub, coll;
        scope.doc = Q.$objectExist(scope.doc) ? scope.doc : {};
        scope.doc.authors = getMetaValues(scope, 'authors');
        scope.doc.categories = getMetaValues(scope, 'categories');
        scope.doc.languages = getMetaValues(scope, 'languages');
        scope.doc.year = getMetaValues(scope, 'year', true);
        scope.doc.meme = getMetaValues(scope, 'meme', true);
        scope.doc.designs = getMetaValues(scope, 'designs', true);
        scope.doc.print = getMetaValues(scope, 'print', true);
        scope.doc.tags = !Q.$isEmpty(scope.doc.tags) ? Q.$map(scope.doc.tags, nxt => Q.$objectExist(nxt) ? nxt.name : nxt) : [];
        cover = Q.$objectExist(scope.doc.cover) ? scope.doc.cover : {};
        scope.coverImg = `${remoteCnf.serverURL}${cover.src}`;
        status = scope.doc.status;
        aggregate = getMetaValues(scope, 'allow_aggregating', true, true);
        scope.doc.status = status == 1 || status === "true" || Q.$booleanTrue(status) || status === 'published';
        scope.doc.allow_aggregating = aggregate == 1 || aggregate == "true" || Q.$booleanTrue(aggregate);
        pdf = !Q.$isEmpty(scope.doc.attachments) ? Q.$reduce(scope.doc.attachments, nxt => nxt.mime && nxt.mime.indexOf('application/pdf') >= 0).$first() : null;
        epub = !Q.$isEmpty(scope.doc.attachments) ? Q.$reduce(scope.doc.attachments, nxt => nxt.mime && nxt.mime.indexOf('application/epub') >= 0).$first() : null;
        scope.doc.pdfName = pdf && Q.$stringExist(pdf.name) ? pdf.name : '';
        scope.doc.epubName = epub && Q.$stringExist(epub.name) ? epub.name : '';
        coll = collFetcher.getDocCollections(scope.doc.id);

        if (!Q.$isEmpty(coll)) {
          scope.doc.collection_id = coll[0].id; // scope.collectionId = coll[0].id;
        }

        delete scope.collectionId;
        Object.defineProperty(scope, 'collectionId', {
          get() {
            return scope.doc && Q.$numberExist(parseInt(scope.doc.collection_id)) ? parseInt(scope.doc.collection_id) : null;
          },

          configurable: true
        });
      }

      function getMetaValues(scope, key, getOne = false, isSetting = false) {
        let res = Q.$isEmpty(isSetting ? scope.doc.settings : scope.doc.meta) ? [] : Q.$map(isSetting ? scope.doc.settings : scope.doc.meta, nxt => {
          if (nxt.key === key) {
            return nxt.value;
          }
        });
        return Q.$booleanTrue(getOne) && !Q.$isEmpty(res) ? res[0] : res;
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

      class PublisherForm extends awr.Component {
        static get $require() {
          return {};
        }

        constructor() {
          super(PublisherForm.$require);
          this.template = 'app/forms/publisher-form/publisher-form.hbs';
          this.controller = 'PublisherForm';
          this.scope = {
            assignee: '='
          };
        }

      }

      $export(PublisherForm);

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

      class PublisherForm extends awr.Controller {
        static get $require() {
          return {
            formActivator: 'service:formViewActivator',
            router: 'service:router',
            publisherModel: 'model:PsPublisher',
            superScope: 'object:awr.superScope'
          };
        }

        constructor(data, parent) {
          super(PublisherForm.$require, data, parent);
          let {
            router,
            publisherModel,
            superScope
          } = this,
              scope = this,
              formActivator = this.formActivator;
          /*
           * Did you know that the extension allows defining a custom default
           * state for the formContext object instead of the default empty object!
           *
           * All you have to do is to set the default values for the form fields
           * and the extension is smart enough to remember these values each time when
           * it resets the form to default state!
           *
           */

          this.publisherFormContext = {
            user_id: this.$findProperty('assigneeId')
          };
          /*
          * Note:
          *   - Forms must be always activated like this!
          *   - You can activate max 1 form per controller scope!
          * */

          formActivator.activate({
            scope,

            /*The should be equal to what the form.json file name property specifies.*/
            form: 'publisher-form',

            /*The selector depends on how the parent input path is.*/
            formInputSelector: '.publisher-form input',

            beforeSetup() {// scope.publisherFormFields.$each((val, idx) => {
              //     if (val.key === 'famous') {
              //         val.onSearch = query => {
              //             return Promise.resolve(["Bill Clinton", "Michal Jackson", "Karl Marx", "and so on..."]);
              //         };
              //     }
              // });
            },

            /*
            * context is also available as arg while using
            * scope.publisherFormContext is equally fine!
            * */
            onSubmit(publisherFormContext) {
              let state = router.$getCurrentState();
              return new Promise((resolve, reject) => {
                publisherModel.$create(publisherFormContext).then(newInstance => {
                  state.attrs.aid = 'done';
                  router.$go(state.name, state, false);

                  if (Q.$arrayExist(superScope.cachedPublishers)) {
                    superScope.cachedPublishers.push(newInstance);
                  }

                  resolve('done');
                }, err => {
                  state.attrs.aid = 'done';
                  router.$go(state.name, state, false);
                  console.error(err);
                  reject('failed');
                }); // setTimeout(_ => {
                //     let state = router.$getCurrentState();
                //     state.attrs.aid = 'done';
                //     router.$go(state.name, state, false);
                //     reject('dummy done!');
                //     // reject('failed');
                // }, 1000)
              });
            }

          });
        }

      }

      $export(PublisherForm);

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
      /*globals $app, $abstract, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');

      class CItem extends awr.Segment {
        static get $require() {
          return {
            superScope: 'object:awr.superScope'
          };
        }

        constructor() {
          super(CItem.$require);
          this.itemAs = 'item';
          this.template = 'app/segments/c-item/c-item.hbs'; // this.bind = 'model:MyCollection';

          this.bindOptions = {};
        }

        setup() {
          let {
            context,
            superScope,
            scope
          } = this,
              item = context.item;
          item.docsCount = !Q.$isEmpty(item.stories) ? item.stories.length : 0;
          item.editName = item.name;
          delete context.isMyShelf;
          Object.defineProperty(context.item, 'isMyShelf', {
            get() {
              return superScope.isCollectionMyShelf(item.id);
            },

            configurable: true
          });
          item.currentIsMyShelf = superScope.isCollectionMyShelf(item.id);
        }

        start() {}

        ready() {}

      }

      $export(CItem);

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

      class DocPage extends awr.Segment {
        static get $require() {
          return {
            remoteCnf: 'config:remoteConnection',
            base64: 'service:uriBase64'
          };
        }

        constructor() {
          super(DocPage.$require);
          this.itemAs = 'page';
          this.template = 'app/segments/doc-page/doc-page.hbs'; // this.bind = '';
          // this.nodeName ='';

          this.bindOptions = {};
        }
        /**
         * @Note the docReader is using a performance boost mechanism which
         * includes removing actual docPage segments after the page is loaded.
         * You should not attach event handlers in the docPage template unless
         * you make sure the event handler is kept attached after removal
         * of the docPage segment instance!
         */


        setup() {
          let {
            remoteCnf,
            base64,
            context
          } = this;
          context.name = 'docPage';
          context.doc = this.scope.$findProperty('doc'); // debugger;

          context.docId = Q.$objectExist(context.doc) ? context.doc.id : null;
          context.imageSrc = `${remoteCnf.serverURL}${context.page.src}`;
          context.shareUrl = `${remoteCnf.serverURL}/page/${base64.encode('ps:' + context.page.id)}/${context.page.number}`;
          /*the rootContext is used by parent and for making lazy loading work*/
          // delete context.page.rootContext;
          // Object.defineProperty(context.page, 'rootContext', {
          //     get() {
          //         return context;
          //     },
          //     configurable: true
          // });

          setupContextMetaValues(context);
          setupAttachments(context, remoteCnf);
          setupShareLink(context, remoteCnf, base64);
        }

        start() {
          let {
            remoteCnf,
            base64,
            context
          } = this;
          context.page.busyLoading = true;
          context.page.isBusy = true;
          context.page.loaded = false;
          context.page.preLoaded = false;
        }

        ready() {
          let {
            dom,
            context
          } = this;

          if (context.page.loaded || context.page.preLoaded) {
            $(dom).find('img').attr('src', context.imageSrc);
          }
        }

      }

      $export(DocPage);

      function setupShareLink(scope, remoteCnf, base64) {
        let getCleanTitle = title => title ? encodeURIComponent(title.toLowerCase().replace(/\s/g, '_')) : 'no_title';

        scope.shareLink = `${remoteCnf.serverURL}/page/` + `${getCleanTitle(scope.doc.title)}/` + `${base64.encode('ps:' + scope.doc.id)}/${scope.page.number}`;
      }

      function setupContextMetaValues(context) {
        context.meta = context.doc && !Q.$isEmpty(context.doc.meta) ? Q.$asCollection(context.doc.meta) : Q.$asCollection([]);
        context.meme = context.meta.$reduce(nxt => nxt.key && nxt.key.toLowerCase() === 'meme').$first();
        context.designs = context.meta.$reduce(nxt => nxt.key && nxt.key.toLowerCase() === 'designs').$first();
        context.print = context.meta.$reduce(nxt => nxt.key && nxt.key.toLowerCase() === 'print').$first();
        context.hasMeme = Q.$objectExist(context.meme);
        context.hasDesigns = Q.$objectExist(context.designs);
        context.hasPrint = Q.$objectExist(context.print);
      }

      function setupAttachments(context, remoteCnf) {
        context.attachments = context.doc && !Q.$isEmpty(context.doc.attachments) ? Q.$asCollection(context.doc.attachments) : Q.$asCollection([]);
        context.pdf = context.attachments.$reduce(nxt => nxt.mime && nxt.mime.indexOf('application/pdf') >= 0).$first();
        context.epub = context.attachments.$reduce(nxt => nxt.mime && nxt.mime.indexOf('application/epub') >= 0).$first();
        context.hasPdf = Q.$objectExist(context.pdf);
        context.hasEpub = Q.$objectExist(context.epub);
        context.hasDownloads = context.hasPdf || context.hasEpub;

        if (context.hasPdf) {
          context.pdf.url = `${remoteCnf.serverURL}${context.pdf.src}`;
        }

        if (context.hasEpub) {
          context.epub.url = `${remoteCnf.serverURL}${context.epub.src}`;
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

      class ForbiddenCover extends awr.Segment {
        static get $require() {
          return {};
        }

        constructor() {
          super(ForbiddenCover.$require);
          this.itemAs = 'item';
          this.template = 'app/segments/forbidden-cover/forbidden-cover.hbs';
          this.bind = '';
          this.bindOptions = {};
        }

        setup() {
          /*@hint let {context, scope} = this*/
          let {
            context,
            scope
          } = this;
          Object.defineProperty(context, 'isForbidden', {
            get() {
              if (Q.$functionExist(scope.isAccessForbidden)) {
                try {
                  return Q.$booleanTrue(scope.isAccessForbidden());
                } catch (err) {
                  console.error(err);
                }
              }

              return false;
            },

            configurable: true
          });
        }

        start() {
          /*@hint let {context, scope} = this*/
        }

        ready() {
          /*@hint let {dom, context, scope} = this*/
        }

      }

      $export(ForbiddenCover);

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

      class MyPublisher extends awr.Segment {
        static get $require() {
          return {};
        }

        constructor() {
          super(MyPublisher.$require);
          this.itemAs = 'publisher';
          this.template = 'app/segments/my-publisher/my-publisher.hbs';
          this.bind = '';
          this.bindOptions = {};
        }

        setup() {
          /*@hint let {context, scope} = this*/
          let {
            context,
            scope
          } = this;
        }

        start() {
          /*@hint let {context, scope} = this*/
        }

        ready() {
          /*@hint let {dom, context, scope} = this*/
        }

      }

      $export(MyPublisher);

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
      /*globals $abstract, $app, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');

      class PublisherItem extends awr.Segment {
        static get $require() {
          return {};
        }

        constructor() {
          super(PublisherItem.$require);
          this.itemAs = 'item';
          this.template = 'app/segments/publisher-item/publisher-item.hbs';
          this.bind = 'model:PsPublisher';
          this.bindOptions = {
            itemRemoveSignal(segmentInstance) {
              let dom = segmentInstance.$getDom();
              $(dom).attr('awr-segment-id', null);
              $(dom).animate({
                width: ["hide", "swing"],
                height: ["hide", "swing"],
                opacity: "0.1"
              }, 700, "linear", () => {});
            }

          };
        }

        setup() {
          /*@hint let {context, scope} = this*/
          let {
            context,
            scope
          } = this;
          context.noCreators = Q.$isEmpty(context.item.creators);
          context.noModerators = Q.$isEmpty(context.item.moderators);
        }

        start() {
          /*@hint let {context, scope} = this*/
          // this.context.item.isExpanded = true;
        }

        ready() {
          /*@hint let {dom, context, scope} = this*/
        }

      }

      $export(PublisherItem);

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

      class TagSearch extends awr.Segment {
        static get $require() {
          return {};
        }

        constructor() {
          super(TagSearch.$require); // this.itemAs = 'item';

          this.template = 'app/segments/tag-search/tag-search.hbs';
          this.bind = '';
          this.bindOptions = {};
        }

        setup() {
          let {
            context,
            scope
          } = this;
          context.isTagSearch = true;
          context.parent = scope;
        }

        start() {
          /*@hint let {context, scope} = this*/
        }

        ready() {
          /*@hint let {dom, context, scope} = this*/
        }

      }

      $export(TagSearch);

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

      class TagSubscription extends awr.Segment {
        static get $require() {
          return {};
        }

        constructor() {
          super(TagSubscription.$require);
          this.itemAs = 'item';
          this.template = 'app/segments/tag-subscription/tag-subscription.hbs';
          this.bind = '';
          this.bindOptions = {};
        }

        setup() {
          /*@hint let {context, scope} = this*/
          let {
            context,
            scope
          } = this;
          context.isBlackListed = context.item.type === 'blacklist';
        }

        start() {
          /*@hint let {context, scope} = this*/
        }

        ready() {
          /*@hint let {dom, context, scope} = this*/
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
      /*globals $abstract, $app, $, console, $on, $off, $emit, $require, $main, $errorOut, $loadErrors, $export, $import*/
      let awr = window.awr || {},
          Q = awr.Q,
          $ = $import('window:jQuery');

      class UserItem extends awr.Segment {
        static get $require() {
          return {};
        }

        constructor() {
          super(UserItem.$require);
          this.itemAs = 'item';
          this.template = 'app/segments/user-item/user-item.hbs';
          this.bind = 'model:PsUser';
          this.bindOptions = {
            itemRemoveSignal(segmentInstance) {
              console.log('removing ');
              let dom = segmentInstance.$getDom();
              $(dom).attr('awr-segment-id', null);
              $(dom).animate({
                width: ["hide", "swing"],
                height: ["hide", "swing"],
                opacity: "0.1"
              }, 700, "linear", () => {});
            }

          };
        }

        setup() {
          /*@hint let {context, scope} = this*/
          let {
            context,
            scope,
            roleHelper
          } = this;

          if (context.hasOwnProperty('cleanRoles')) {
            delete context.cleanRoles;
          }

          Object.defineProperty(context, 'cleanRoles', {
            get() {
              return getCleanRoles(context.item, scope);
            }

          });
          Object.defineProperty(context, 'removeUserAllowed', {
            get() {
              let fn = scope.$findProperty('canRemoveUser');
              return Q.$functionExist(fn) ? fn(context.item.id) : false;
            }

          });
          setupIsRoles(context, scope); // debugger;
        }

        start() {
          /*@hint let {context, scope} = this*/
          let {
            context,
            scope
          } = this;
        }

        ready() {
          /*@hint let {dom, context, scope} = this*/
        }

      }

      $export(UserItem);

      function setupIsRoles(context, scope) {
        defineIsRole(context.item, scope, 'publisher');
        defineIsRole(context.item, scope, 'creator');
        defineIsRole(context.item, scope, 'moderator');
        defineIsRole(context.item, scope, 'admin');
        defineIsRole(context.item, scope, 'author');
      }

      function defineIsRole(item, scope, roleName) {
        let key = `is${Q.$firstLetterToUpperCase(roleName)}`,
            key2 = `${key}InOrg`;

        if (item.hasOwnProperty(key)) {
          delete item[key];
        }

        if (item.hasOwnProperty(key2)) {
          delete item[key2];
        }

        Object.defineProperty(item, key, {
          get() {
            return scope.hasRole(item.id, roleName.toLowerCase());
          },

          configurable: true
        });
        Object.defineProperty(item, key2, {
          get() {
            return scope.hasRoleInActivePublisher(item.id, roleName.toLowerCase());
          },

          configurable: true
        });
      }

      function getCleanRoles(item, scope) {
        let listEnv = scope.$findProperty('listEnvName'),
            roles = Q.$map(item && item.roles ? item.roles : [], nxt => {
          let name = nxt.name;

          if (!Q.$stringExist(name) && Q.$stringExist(nxt.role_name)) {
            name = nxt.role_name;
          }

          if (name && name.endsWith('@pageshare')) {
            name = name.replace('@pageshare', '');
          } else if (name === 'moderator') {
            name = 'sys_moderator';
          }

          return name;
        });

        if (listEnv === 'publishers') {
          if (item.isPublisherInOrg) {
            roles.push('publisher');
          }

          if (item.isModeratorInOrg) {
            roles.push('moderator');
          }

          if (item.isCreatorInOrg) {
            roles.push('creator');
          }
        } else {
          if (item.isPublisher) {
            roles.push('publisher');
          }

          if (item.isModerator) {
            roles.push('moderator');
          }

          if (item.isCreator) {
            roles.push('creator');
          }
        }

        if (Q.$isEmpty(roles)) {
          roles.push('reader');
        }

        return Q.$unique(roles);
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

      class BookmarksView extends awr.Controller {
        static get $require() {
          return {
            superScope: 'object:awr.superScope',
            bookmarker: 'service:bookmarker',
            dataFetcher: 'dataFetcher:bookmarks'
          };
        }

        constructor(data, parent) {
          super(BookmarksView.$require, data, parent);
          let {
            bookmarker,
            dataFetcher
          } = this;
          bookmarker.setup({
            scope: this,
            bookmarks: this.bookmarks
          });
          Object.defineProperty(this, 'items', {
            get() {
              return !Q.$isEmpty(this.bookmarks) ? this.bookmarks.$map(nxt => {
                nxt.story.bookmark_id = nxt.id;
                nxt.story.bookmark_user_id = nxt.user_id;
                return nxt.story;
              }) : Q.$asCollection([]);
            },

            configurable: true
          });
          this.removeBtnTitle = "Remove from saved list";
          dataFetcher.setupAndFetch(this);
        }

        removeItem(item) {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          let {
            bookmarker
          } = this;
          bookmarker.removeBookmarkByDoc({
            scope: this,
            doc: item
          });
        }

      }

      $export(BookmarksView);

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

      class BookmarksView extends awr.Route {
        static get $require() {
          return {};
        }

        constructor() {
          super(BookmarksView.$require);
          this.link = 'controls/bookmarks?';
          this.template = 'app/views/bookmarks-view/bookmarks-view-index.hbs';
          this.controller = 'BookmarksView';
          this.defaults = {
            params: {},
            attrs: {}
          };
          this.resolve = {
            bookmarks: 'bookmarks'
          };
        }

      }

      $export(BookmarksView);

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

      class EditView extends awr.Controller {
        static get $require() {
          return {
            superScope: 'object:awr.superScope',
            roleHelper: 'service:roleHelper',
            collFetcher: 'service:collectionFetcher',
            dataFetcher: 'dataFetcher:editView',
            router: 'service:router',
            docScpUtils: 'service:docScopeUtils'
          };
        }

        constructor(data, parent) {
          super(EditView.$require, data, parent);
          let {
            superScope,
            roleHelper,
            collFetcher,
            dataFetcher,
            docScpUtils
          } = this,
              scope = this,
              coll;
          this.$disableDefaultActionAutoRecompile();
          window.scrollTo(0, 0);
          dataFetcher.setupAndFetch(this);
          Object.defineProperty(this, 'isReady', {
            get() {
              return this.isDataFetchReady && !this.isAccessForbidden();
            },

            configurable: true
          });
          this.forbiddenContext = {};

          this.isAccessForbidden = () => {
            if (!this.isDataFetchReady) {
              return false;
            }

            coll = collFetcher.getDocCollections(this.doc.id);
            coll = !Q.$isEmpty(coll) ? coll[0] : null;
            return !(roleHelper.hasPSAdminRoleOrHigher(superScope.currentUser) || roleHelper.canEditDoc(superScope.currentUser, this.doc, coll, this.publishers));
          };

          Object.defineProperty(this, 'editAsAdmin', {
            get() {
              if (!this.isReady) {
                return false;
              }

              let coll = collFetcher.getDocCollections(this.doc.id);
              coll = !Q.$isEmpty(coll) ? coll[0] : null;
              return roleHelper.hasPSAdminRoleOrHigher(superScope.currentUser) && !roleHelper.canEditDoc(superScope.currentUser, this.doc, coll, this.publishers);
            }

          });
          this.$bind('observable:psDocEvents', {
            onEvent(event, preventDefault) {
              preventDefault();

              if (!this.isDataFetchReady) {
                return;
              }

              if (!Q.$idEqual(event.target_id, scope.doc.id)) {
                return;
              }

              if (Q.$setContainsString(['ps-doc:remove'], event.name)) {
                docScpUtils.onDocRemoved();
              }
            }

          });
          this.$bind('model:MyDoc', {
            onEvent(event, preventDefault) {
              preventDefault();

              if (!this.isDataFetchReady) {
                return;
              }

              if (Q.$stringEqual(event.requestType, 'remove') && docScpUtils.aboutCurrentDoc(this, event)) {
                docScpUtils.onDocRemoved();
              }
            }

          });
        }

      }

      $export(EditView);

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

      class EditView extends awr.Route {
        static get $require() {
          return {};
        }

        constructor() {
          super(EditView.$require);
          let {
            link,
            controller,
            template,
            defaults,
            resolve
          } = getRouteSetup();
          this.link = link;
          this.controller = controller;
          this.template = template;
          this.defaults = defaults;
          this.resolve = resolve;
        }

      }

      $export(EditView);

      function getRouteSetup() {
        return {
          link: "edit/:docId?",
          template: "app/views/edit-view/edit-view-index.hbs",
          defaults: {
            params: {
              docId: 'none'
            },
            attrs: {}
          },
          resolve: {
            doc: 'doc',
            collections: 'collections',
            publishers: 'ctrPublishers'
          },
          controller: 'EditView'
        };
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

      class InviteView extends awr.Controller {
        static get $require() {
          return {
            router: 'service:router',
            dataFetcher: 'dataFetcher:invitesView'
          };
        }

        constructor(data, parent) {
          super(InviteView.$require, data, parent);
          let {
            dataFetcher
          } = this;
          this.inForm = this.$state && this.$state.attrs.v === 'fm';
          Object.defineProperty(this, 'defaultModeReady', {
            get() {
              return !this.inForm && this.isDataFetchReady;
            }

          });
          dataFetcher.setupAndFetch(this);
        }

        openInviteForm() {
          this.$preventDefault();
          let {
            router,
            $state
          } = this;

          if ($state.attrs.v === 'fm') {
            return;
          }

          $state.attrs.v = 'fm';
          router.$go($state.name, $state, true);
        }

        cancelInvite() {
          this.$preventDefault();
          let {
            router,
            $state
          } = this;

          if ($state.attrs.v === 'default') {
            return;
          }

          $state.attrs.v = 'default';
          router.$go($state.name, $state, true);
        }

      }

      $export(InviteView);

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

      class InviteView extends awr.Route {
        static get $require() {
          return {};
        }

        constructor() {
          super(InviteView.$require);
          this.link = "controls/invite?:v";
          this.template = "app/views/invite-view/invite-view-index.hbs";
          this.controller = 'InviteView';
          this.defaults = {
            params: {},
            attrs: {
              v: 'default'
            }
          };
          this.resolve = {
            invites: 'invites'
          };
        }

      }

      $export(InviteView);

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

      class MyCollectionsView extends awr.Controller {
        static get $require() {
          return {
            superScope: 'object:awr.superScope',
            myCollModel: 'model:MyCollection',
            roleHelper: 'service:roleHelper',
            dataFetcher: 'dataFetcher:myCollections'
          };
        }

        constructor(data, parent) {
          super(MyCollectionsView.$require, data, parent);
          let {
            superScope,
            roleHelper,
            dataFetcher
          } = this;
          this.isReady = false;
          this.activePublisherId = 'personal-collections';
          Object.defineProperty(this, 'currentUserId', {
            get() {
              return Q.$objectExist(superScope.currentUser) ? superScope.currentUser.id : null;
            }

          });
          Object.defineProperty(this, 'activePublisher', {
            get() {
              return this.activePublisherId !== 'personal-collections' ? this.publishers.$find('id', parseInt(this.activePublisherId)) : null;
            }

          });
          Object.defineProperty(this, 'canEditCollections', {
            get() {
              if (Q.$objectExist(this.activePublisher)) {
                return roleHelper.isAdminInPublisher(this.activePublisher, this.currentUserId);
              }

              return this.activePublisherId === 'personal-collections' && roleHelper.canOwnPersonalCollections(superScope.currentUser);
            }

          });
          Object.defineProperty(this, 'canUseTheView', {
            get() {
              if (roleHelper.canOwnPersonalCollections(superScope.currentUser)) {
                return true;
              }

              let res = false;
              Q.$each(this.publishers, nxt => {
                if (this.roleHelper.hasRoleInPublisher(nxt, this.currentUserId, 'any')) {
                  res = true;
                }
              });
              return res;
            }

          });
          this.forbiddenContext = {};

          this.isAccessForbidden = () => Q.$booleanFalse(this.canUseTheView);

          dataFetcher.setupAndFetch(this);
        }

        selectPublisher() {
          this.$preventDefault();
          this.activePublisherId = $(this.$getDom()).find('select.publisher').val();

          if (Q.$numberExist(parseInt(this.activePublisherId))) {
            this.activePublisherId = parseInt(this.activePublisherId);
          }

          $(this.$getDom()).find('.head .actions .create-btn').toggleClass('on', this.canEditCollections);

          if (this.activePublisherId !== this.listScope.activePublisherId) {
            this.listScope.activePublisherId = this.activePublisherId;
            this.listScope.$recompile();
          }
        }

        addCollection() {
          this.$preventDefault();
          let {
            myCollModel,
            listScope,
            superScope
          } = this;

          if (!Q.$objectExist(listScope)) {
            return;
          }

          listScope.$getDom().find('.content').addClass('busy');
          myCollModel.$create({
            name: 'New Collection',
            is_main: false,
            publisher_id: Q.$numberExist(parseInt(this.activePublisherId)) ? parseInt(this.activePublisherId) : null
          }).then(newInstance => {
            if (Q.$exist(newInstance.publisher_id)) {
              Q.$each(this.publishers, nxt => {
                nxt.collections = Q.$asCollection(nxt.collections);

                if (Q.$idEqual(nxt.id, newInstance.publisher_id) && !nxt.collections.$contains('id', newInstance.id)) {
                  nxt.collections.push(newInstance);
                }
              });
            }

            listScope.addNewItem.call(listScope, newInstance);
          }, err => {
            listScope.$getDom().find('.content').removeClass('busy');
            console.error(err);
          });
        }

      }

      $export(MyCollectionsView);

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

      class MyCollectionsView extends awr.Route {
        static get $require() {
          return {};
        }

        constructor() {
          super(MyCollectionsView.$require);
          let {
            link,
            controller,
            template,
            defaults,
            resolve
          } = getRouteSetup();
          this.link = link;
          this.controller = controller;
          this.template = template;
          this.defaults = defaults;
          this.resolve = resolve;
        }

      }

      $export(MyCollectionsView);

      function getRouteSetup() {
        return {
          name: "my-collections-view",
          link: "my_collections/:cId?",
          template: "app/views/my-collections-view/my-collections-view-index.hbs",
          defaults: {
            params: {
              cId: 'index'
            },
            attrs: {}
          },
          resolve: {
            collections: 'myCollections',
            publishers: 'ctrPublishers'
          },
          controller: 'MyCollectionsView'
        };
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
      const dummyPub = {
        user: {},
        creators: [],
        moderators: []
      };

      class MyPublisherView extends awr.Controller {
        static get $require() {
          return {
            listHelper: 'service:listHelper',
            varConfigurer: 'service:userPublisherVarsConfigurer',
            commonListFn: 'service:commonListCtrFn',

            /*Yes, using same dataFetcher as usersView!*/
            dataFetcher: 'dataFetcher:usersView',
            router: 'service:router'
          };
        }

        constructor(data, parent) {
          super(MyPublisherView.$require, data, parent);
          let {
            varConfigurer,
            commonListFn,
            dataFetcher,
            router
          } = this;
          this.tabId = 't3';
          this.query = '';
          this.activePublisher = dummyPub;
          dataFetcher.setupAndFetch(this);
          varConfigurer.setup(this);
          this.$init(_ => {
            if (this.isDataFetchReady) {
              $(this.$getDom()).find('.pub-select option').removeAttr('selected');
              $(this.$getDom()).find(`.pub-select option[data-id="${this.activePublisher.id}"]`).attr('selected', 'selected');
            }
          });
        }

        onDataReady() {
          if (Q.$functionExists(this.$preventDefault)) {
            this.$preventDefault();
          }

          let {
            varConfigurer,
            commonListFn,
            router
          } = this;
          varConfigurer.setupWhenData(this);
          commonListFn.resolveRestOfUsers({
            scope: this,
            state: router.$getCurrentState()
          });
          commonListFn.decideFirstActivePublisher({
            scope: this,
            publishers: this.publishers
          });
        }

        assignPublisherRole(user, publisher, roleName) {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          return this.commonListFn.assignPublisherRole(user, publisher, roleName);
        }

        removePublisherRole(user, publisher, roleName) {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          return this.commonListFn.removePublisherRole(user, publisher, roleName);
        }

        selectPublisher(event) {
          // this.$preventDefault();
          let id = $(event.target).find(`option[value="${$(event.target).val()}"]`).data('id');
          this.activePublisher = this.publishers.$reduce(nxt => nxt.id == id).$first();
          this.activePublisher.selected = "selected";
        }

        hasRole(userId, roleName) {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          let scope = this;
          return this.commonListFn.hasRole({
            scope,
            userId,
            roleName
          });
        }

        hasRoleInActivePublisher(userId, roleName) {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          let scope = this;
          return this.commonListFn.hasRoleInActivePublisher({
            scope,
            userId,
            roleName
          });
        }

        itemSelect(event) {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          let scope = this;
          this.commonListFn.itemSelect({
            scope,
            event
          });
        }

        search(event) {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          let scope = this,
              selector = '.list-container .list-item',
              errMsg = 'APP@AWR: Pageshare : bad function < onSearch > for controller@controls/myPublisher';
          this.commonListFn.search({
            scope,
            selector,
            event,
            errMsg
          });
        }

      }

      $export(MyPublisherView);

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

      class MyPublisherView extends awr.Route {
        static get $require() {
          return {};
        }

        constructor() {
          super(MyPublisherView.$require);
          this.link = "my_publisher?";
          this.template = "app/views/my-publisher-view/my-publisher-view-index.hbs";
          this.controller = 'MyPublisherView';
          this.defaults = {
            params: {},
            attrs: {}
          };
          this.resolve = {
            users: 'ctrUsers',
            publishers: 'ctrPublishers'
          };
        }

      }

      $export(MyPublisherView);

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

      class TagsView extends awr.Controller {
        static get $require() {
          return {
            dataFetcher: 'dataFetcher:tags'
          };
        }

        constructor(data, parent) {
          super(TagsView.$require, data, parent);
          let {
            dataFetcher
          } = this,
              scope = this;
          dataFetcher.setupAndFetch(this);
        }

      }

      $export(TagsView);

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

      class TagsView extends awr.Route {
        static get $require() {
          return {};
        }

        constructor() {
          super(TagsView.$require);
          this.link = "controls/tags?";
          this.template = "app/views/tags-view/tags-view-index.hbs";
          this.controller = 'TagsView';
          this.defaults = {
            params: {},
            attrs: {}
          };
          this.resolve = {
            tags: 'ctrTags'
          };
        }

      }

      $export(TagsView);

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

      class UploadDocView extends awr.Controller {
        static get $require() {
          return {
            base64: 'service:uriBase64',
            superScope: 'object:awr.superScope',
            roleHelper: 'service:roleHelper',
            collFetcher: 'service:collectionFetcher',
            dataFetcher: 'dataFetcher:uploadView'
          };
        }

        constructor(data, parent) {
          super(UploadDocView.$require, data, parent);
          let {
            base64,
            superScope,
            roleHelper,
            collFetcher,
            dataFetcher
          } = this;
          let scope = this,
              cId = scope.$state.params.cId,
              coll;
          scope.collectionId = !Q.$stringExist(cId) || cId === 'index' ? cId : base64.decode(cId);
          this.forbiddenContext = {};
          Object.defineProperty(this, 'isReady', {
            get() {
              return this.isDataFetchReady && !this.isAccessForbidden();
            },

            configurable: true
          });

          this.isAccessForbidden = () => {
            if (!this.isDataFetchReady) {
              return false;
            }

            coll = collFetcher.getOneLocal(scope.collectionId);
            return !roleHelper.canCreateDocsInCollection(superScope.currentUser, coll, this.publishers);
          };

          dataFetcher.setupAndFetch(this);
        }

      }

      $export(UploadDocView);

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

      class UploadDocView extends awr.Route {
        static get $require() {
          return {};
        }

        constructor() {
          super(UploadDocView.$require);
          let {
            link,
            controller,
            template,
            defaults,
            resolve
          } = getRouteSetup();
          this.link = link;
          this.controller = controller;
          this.template = template;
          this.defaults = defaults;
          this.resolve = resolve;
        }

      }

      $export(UploadDocView);

      function getRouteSetup() {
        return {
          link: "upload/:cId",
          template: "app/views/upload-doc-view/upload-doc-view-index.hbs",
          defaults: {
            params: {
              cId: 'index'
            },
            attrs: {}
          },
          resolve: {
            collections: 'myCollections',
            publishers: 'ctrPublishers'
          },
          controller: 'UploadDocView'
        };
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
      const dummyPub = {
        user: {},
        creators: [],
        moderators: []
      };

      class UsersView extends awr.Controller {
        static get $require() {
          return {
            router: 'service:router',
            listHelper: 'service:listHelper',
            varConfigurer: 'service:userPublisherVarsConfigurer',
            commonListFn: 'service:commonListCtrFn',
            base64: 'service:uriBase64',
            superScope: 'object:awr.superScope',
            dataFetcher: 'dataFetcher:usersView'
          };
        }

        constructor(data, parent) {
          super(UsersView.$require, data, parent);
          let {
            varConfigurer,
            commonListFn,
            router,
            superScope,
            dataFetcher
          } = this,
              state = this.$state,
              tabV = state && state.attrs ? state.attrs.v : 't1';
          this.tabs = getTabs();
          this.tabId = Q.$setContainsString(['t1', 't2', 't4'], tabV) ? tabV : 't1';
          this.query = '';
          this.activePublisher = dummyPub;

          this.canRemoveUser = userId => {
            return commonListFn.currentCanRemoveUser(userId);
          };

          if (isDoneT4Signal(state)) {
            this.tabId = 't1';
            state.attrs.v = 't1';
            state.attrs.aid = 'cr';
            router.$go(state.name, state, false);
          }

          dataFetcher.setupAndFetch(this);
          varConfigurer.setup(this); // this.assignee = this.currentUser;

          this.$init(_ => {
            if (this.isDataFetchReady) {
              $(this.$getDom()).find('.pub-select option').removeAttr('selected');
              $(this.$getDom()).find(`.pub-select option[data-id="${this.activePublisher.id}"]`).attr('selected', 'selected');
            }
          });
        }

        onDataReady() {
          if (Q.$functionExists(this.$preventDefault)) {
            this.$preventDefault();
          }

          let {
            varConfigurer,
            commonListFn,
            router
          } = this;
          varConfigurer.setupWhenData(this);
          commonListFn.resolveRestOfUsers({
            scope: this,
            state: router.$getCurrentState()
          });
          commonListFn.decideFirstActivePublisher({
            scope: this,
            publishers: this.publishers
          });
        }

        changeTab(id) {
          this.$preventDefault();

          if (id === this.tabId) {
            return;
          }

          let {
            router
          } = this,
              state = router.$getCurrentState();
          this.tabId = Q.$setContainsString(['t1', 't2', 't4'], id) ? id : 't1';
          this.query = '';
          state.attrs.v = this.tabId;
          state.attrs.aid = state.attrs && this.tabId === 't4' ? state.attrs.aid : 'cr';
          router.$go(state.name, state, false);
          this.$recompile();
        }

        createPublisher(userId) {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          if (!Q.$numberExist(parseInt(userId))) {
            return;
          }

          let {
            base64,
            router
          } = this,
              state = router.$getCurrentState();
          state.attrs.aid = base64.encode(userId);
          state.attrs.v = 't4';
          router.$go(state.name, state, true);
        }

        cancelCreatePublisher() {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          let {
            router
          } = this,
              state = router.$getCurrentState();
          state.attrs.aid = 'cr';
          state.attrs.v = 't1';
          router.$go(state.name, state, true);
        }

        removeAccount(user) {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          return this.commonListFn.removeAccount(this, user);
        }

        removePublisher(publisher) {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          return this.commonListFn.removePublisher(this, publisher);
        }

        assignRole(user, roleName) {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          return this.commonListFn.assignRole(user, roleName);
        }

        removeRole(user, roleName) {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          return this.commonListFn.removeRole(user, roleName);
        }

        hasRole(userId, roleName) {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          let scope = this;
          return this.commonListFn.hasRole({
            scope,
            userId,
            roleName
          });
        }

        hasRoleInActivePublisher(userId, roleName) {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          return this.commonListFn.hasRoleInActivePublisher({
            scope: this,
            userId,
            roleName
          });
        }

        itemSelect(event) {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          let scope = this;
          this.commonListFn.itemSelect({
            scope,
            event
          });
        }

        search(event) {
          if (Q.$functionExist(this.$preventDefault)) {
            this.$preventDefault();
          }

          let scope = this,
              selector = '.list-container .list-item',
              errMsg = 'APP@AWR: Pageshare : bad function < onSearch > for controller@controls/users';
          Q.$nonBlocking(() => {
            this.commonListFn.search({
              scope,
              selector,
              event,
              errMsg
            });
          }, '', this.$getScopeId());
        }

      }

      $export(UsersView);

      function getTabs() {
        return [{
          name: 'Users directory',
          id: 't1',
          icon: 'fas fa-users-cog'
        }, {
          name: 'Publishers directory',
          id: 't2',
          icon: 'fas fa-building'
        }, {
          name: 'New publisher',
          id: 't4',
          icon: 'fas fa-plus'
        }];
      }

      function isDoneT4Signal(state) {
        return state.attrs && state.attrs.aid && (
        /*we do not want to allow numeric ids to work!*/
        Q.$numberExist(parseInt(state.attrs.aid)) || Q.$setContainsString(['done', 'none', 'undefined', 'null'], state.attrs.aid.toLowerCase()));
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

      class UsersView extends awr.Route {
        static get $require() {
          return {};
        }

        constructor() {
          super(UsersView.$require);
          this.link = "controls/users?:v&:aid";
          this.template = "app/views/users-view/users-view-index.hbs";
          this.controller = 'UsersView';
          this.defaults = {
            params: {},
            attrs: {
              v: 'default',

              /*assignee id with default current user*/
              aid: 'cr'
            }
          };
          this.resolve = {
            users: 'ctrUsers',
            publishers: 'ctrPublishers'
          };
        }

      }

      $export(UsersView);

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
          $ = $import('window:jQuery'),
          nextUpdate;

      class V extends awr.Controller {
        static get $require() {
          return {
            router: 'service:router',
            superScope: 'object:awr.superScope',
            base64: 'service:uriBase64',
            collFetcher: 'service:collectionFetcher',
            roleHelper: 'service:roleHelper',
            bookmarker: 'service:bookmarker',
            psDocEvents: 'observable:psDocEvents',
            dataFetcher: 'dataFetcher:vView',
            docResolver: 'resolvable:vDoc',
            docScpUtils: 'service:docScopeUtils'
          };
        }

        constructor(data, parent) {
          super(V.$require, data, parent);
          let {
            router,
            superScope,
            docScpUtils,
            collFetcher,
            roleHelper,
            dataFetcher
          } = this,
              scope = this;
          this.$disableDefaultActionAutoRecompile();
          window.scrollTo(0, 0);
          dataFetcher.setupAndFetch(this);
          Object.defineProperty(this, 'userCanEditDoc', {
            get() {
              if (!this.isDataFetchReady) {
                return false;
              }

              let coll = collFetcher.getDocCollections(this.doc.id);
              coll = !Q.$isEmpty(coll) ? coll[0] : null;
              return roleHelper.hasPSAdminRoleOrHigher(superScope.currentUser) || roleHelper.canEditDoc(superScope.currentUser, this.doc, coll, this.publishers);
            }

          });
          Object.defineProperty(this, 'isReady', {
            get() {
              return this.isDataFetchReady;
            },

            configurable: true
          });
          this.$init(_ => {
            if (this.isDataFetchReady && Q.$booleanTrue(this.doc.is_busy)) {
              $(scope.$getDom()).find('.v-view').addClass('processing');
            }
          });
          this.$bind('observable:psDocEvents', {
            onEvent(event, preventDefault) {
              preventDefault();

              if (!this.isDataFetchReady) {
                return;
              }

              if (!Q.$idEqual(event.target_id, scope.doc.id)) {
                return;
              }

              let container = $(scope.$getDom()).find('.v-view');

              if (event.name.endsWith('start-processing')) {
                $(container).addClass('processing');
              } else if (event.name.endsWith('end-processing')) {
                // $(container).removeClass('processing');
                scope.reloadDocWhenReady();
              } else if (event.name === 'ps-doc:publish') {
                // $(container).removeClass('processing');
                setTimeout(_ => {
                  router.$reloadCurrentState();
                }, 1000);
              } else if (Q.$setContainsString(['ps-doc:unpublish', 'ps-doc:remove'], event.name)) {
                $(container).addClass('no-content');
              }
            }

          });
          this.$bind('model:MyDoc', {
            onEvent(event, preventDefault) {
              preventDefault();

              if (!this.isDataFetchReady) {
                return;
              }

              if (Q.$stringEqual(event.requestType, 'remove') && docScpUtils.aboutCurrentDoc(this, event)) {
                docScpUtils.onDocRemoved();
              }
            }

          });
        }

        reloadDocWhenReady() {
          let {
            docResolver,
            router
          } = this;
          clearInterval(this.reloadDocInterval);
          this.reloadWait = false;
          this.reloadDocInterval = setInterval(_ => {
            if (this.reloadWait) {
              return;
            }

            this.reloadWait = true;
            docResolver.resolveLater(router.$getCurrentState()).then(doc => {
              if (!doc.is_busy) {
                clearInterval(this.reloadDocInterval);
                this.reloadWait = false;
                this.doc = doc;
                this.$recompile();
              } else {
                this.reloadWait = false;
              }
            }, err => {
              console.error(err);
              clearInterval(this.reloadDocInterval);
              this.reloadWait = false;
            });
          }, 500);
        }

        onDataReady() {
          let {
            router,
            superScope,
            base64,
            collFetcher,
            bookmarker,
            docScpUtils
          } = this,
              docId = this.$state.params.docId,
              title = this.$state.params.title,
              encodedId = base64.encode(this.doc.id),
              docColls,
              cleanTitle = Q.$stringExist(this.doc.title) ? encodeURIComponent(this.doc.title.toLowerCase().replace(/\s/g, '_')) : 'no_title';
          bookmarker.setup({
            scope: this,
            bookmarks: this.bookmarks
          });
          this.$state.params.docId = encodedId;
          this.$state.params.title = cleanTitle;

          if (!Q.$stringEqual(docId, encodedId) || !Q.$stringEqual(title, cleanTitle)) {
            router.$go(this.$state.name, this.$state, false);
          }

          superScope.currentDoc = this.doc;
          docColls = collFetcher.getDocCollections(this.doc.id);

          if (!(docScpUtils.docInCollection(collFetcher.getCurrent(), this.doc) || Q.$isEmpty(docColls))) {
            collFetcher.setCurrent(docColls[0].id);
          }

          $emit('collection:events', {
            name: 'new-doc-selected',
            doc: this.doc
          });
        }

        toggleBookmark() {
          let {
            bookmarker
          } = this,
              uiSelector = '.doc-page .left-actions .tool-item.bookmark';
          bookmarker.toggleBookmark({
            scope: this,
            uiSelector
          });
        }

      }

      $export(V);

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
      /*globals $, console, $require, $main, $export, $import, $available, $errorOut, $loadErrors*/
      let awr = window.awr || {},
          Q = awr.Q;

      class Default extends awr.Route {
        static get $require() {
          return {};
        }

        constructor() {
          super(Default.$require);
          this.link = "v/:title/:docId/:page?:c";
          this.controller = "V";
          this.template = "app/views/v-view/v-index.hbs";
          this.defaults = {
            params: {
              title: 'no_title',
              docId: 'none',
              page: 'index'
            },
            attrs: {
              c: 'index'
            }
          };
          this.resolve = {
            doc: 'vDoc',
            publishers: 'ctrPublishers',
            collections: 'collections',
            bookmarks: 'bookmarks'
          };
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

      class DocReaderInit extends awr.Service {
        static get $require() {
          return {
            router: 'service:router',
            utils: 'service:docReaderUtils'
          };
        }

        constructor() {
          super(DocReaderInit.$require);
          this.$importSuperScope();
        }

        init(scope) {
          let {
            router,
            superScope,
            utils
          } = this,
              onScroll;
          scope.isReady = Q.$booleanTrue(superScope.isReaderReady);
          scope.hasGotToPagePos = false;
          scope.pagePos = 0;
          scope.renderedPages = 20;
          utils.setScopeItems(scope);
          utils.initCurrentPage(scope, router);
          Object.defineProperty(scope, 'pendingPages', {
            get() {
              return scope.$getAllSegments().$reduce(seg => utils.isPendingDocPage(seg));
            },

            configurable: true
          });

          onScroll = (event, loadMore = true) => {
            scope.pendingPages.$each(seg => {
              /*this root context containing dataContext!*/
              let ctx = seg.$segmentContextInstance;
              ctx.page.preLoaded = true;
              seg.$update();
            });

            if (loadMore && $('#btmIndicator').isInViewport(5000) && scope.renderedPages + scope.prePages < Q.$count(scope.pages)) {
              scope.pages.$skip(scope.renderedPages + scope.prePages).$take(20).$each(p => {
                scope.renderedPages++;
                scope.$append({
                  selector: '.doc-reader > .pages',
                  segment: 'docPage',
                  dataContext: p
                });
              });
            }
          };

          scope.$ready(_ => {
            window.addEventListener('scroll', onScroll);
          }, 'mainOnReady');
          scope.$init(_ => {
            if (scope.hasGotToPagePos && Q.$numberExist(scope.pagePos) && scope.pagePos > 1) {
              let currentPos = $(scope.$getDom()).find(`.doc-page[data-page-number="${scope.pagePos}"]`).position();
              window.scrollTo(0, currentPos.top - 100);
              scope.hasGotToPagePos = false;
              scope.pagePos = 0;
            }

            setTimeout(_ => {
              onScroll(null, false);
              setTimeout(_ => {
                onScroll(null, false);
              }, 1500);
            }, 0);
          });
          scope.$addFlushListener(_ => {
            window.removeEventListener('scroll', onScroll);
          });
        }

      }

      $export(DocReaderInit);

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

      class DocReaderMethods extends awr.Service {
        static get $require() {
          return {
            router: 'service:router'
          };
        }

        constructor() {
          super(DocReaderMethods.$require);
          this.$importSuperScope();
        }

        loadPreviousPages({
          scope
        }) {
          let {
            router
          } = this,
              state,
              page,
              take,
              topPage;
          state = router.$getCurrentState();
          page = state.params.page;

          if (page === 'index' || !Q.$numberExist(parseInt(page)) || parseInt(page) < 2) {
            return;
          }

          take = Math.min(10, scope.prePages);
          scope.prePages = Math.max(0, scope.prePages - take);
          scope.renderedPages += take;
          scope.hasPrePages = scope.prePages > 0;
          scope.hasGotToPagePos = true;
          scope.pagePos = page;
          /*
          * due to the detached segments we cannot use scope.$getAllSegments
          * for determining the topPage*/

          topPage = Q.$asCollection($(scope.$getDom()).find('.doc-page')).$reduce((el, idx) => {
            return $(el).isInViewport();
          }).$first();

          if (Q.$objectExists(topPage) && Q.$idExists($(topPage).data('page-number'))) {
            scope.pagePos = $(topPage).data('page-number');
            state.params.page = scope.pagePos;
            router.$go(state.name, state, false);
          } else {
            scope.pagePos = page;
          }

          scope.$recompile();
        } // noinspection JSMethodCanBeStatic


        imageLoaded({
          scope,
          event
        }) {
          let segment = scope.$segment,
              page,
              imgEl,
              detach;

          if (!Q.$objectExist(segment)) {
            return;
          }

          page = segment.dataContext;

          if (page.loaded) {
            return;
          }

          page.busyLoading = false;
          page.isBusy = false;
          page.loaded = true;
          imgEl = $(segment.$getDom()).find('img');
          $(imgEl).css('display', 'none');
          $(imgEl).css('opacity', 0.1);
          $(imgEl).animate({
            opacity: 1,
            left: "+=50",
            height: "toggle"
          }, function (event) {});
          segment.$update();
          /*
          * Saving some memory by removing the segment objects which are no longer needed.
          * Very helpful performance boost in case of large books. It's important
          * to keep the event listeners attached
          * */

          setTimeout(_ => {
            detach = $(segment.$getDom());
            $(detach).attr('awr-segment-id', `detached-${segment.segmentId.replace('SMT-', '')}`);
            segment.$remove();
            $(detach).on('click', event => {
              this.toggleLeftActions({
                scope: {
                  $segment: {
                    $getDom: () => detach
                  }
                },
                event
              });
            });
            $(detach).find('.page-menu > .number, .page-menu > .expand > .close-btn').on('click', event => {
              this.togglePageMenu({
                scope: {
                  $segment: {
                    $getDom: () => detach
                  }
                },
                event
              });
            });
          }, 500);
        } // noinspection JSMethodCanBeStatic


        toggleLeftActions({
          scope,
          event
        }) {
          let segment = scope.$segment,
              target,
              actions;

          if (!Q.$objectExist(segment)) {
            return;
          }

          target = event.target;
          actions = $(segment.$getDom()).find('.tools .left-actions');

          if (Q.$isEmpty($(target).closest('.doc-page .tools'))) {
            $(actions).toggleClass('on', !$(actions).hasClass('on'));
          }
        } // noinspection JSMethodCanBeStatic


        togglePageMenu({
          scope,
          event
        }) {
          let segment = scope.$segment,
              pMenu;

          if (!Q.$objectExist(segment)) {
            return;
          }

          pMenu = $(segment.$getDom()).find('.page-menu');
          return $(pMenu).hasClass('on') ? $(pMenu).removeClass('on') : $(pMenu).addClass('on');
        }

      }

      $export(DocReaderMethods);

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

      class DocReaderUtils extends awr.Service {
        static get $require() {
          return {
            remoteCnf: 'config:remoteConnectionConfig',
            base64: 'service:uriBase64',
            router: 'service:router'
          };
        }

        constructor() {
          super(DocReaderUtils.$require);
        }

        initCurrentPage(scope) {
          let {
            router
          } = this,
              state = router.$getCurrentState(),
              page = state.params.page;
          scope.prePages = 0;
          scope.hasPrePages = false;

          if (page === 'index' || !Q.$numberExist(parseInt(page)) || parseInt(page) < 2) {
            return;
          }

          scope.prePages = page - 1;
          scope.hasPrePages = true;
        } // noinspection JSMethodCanBeStatic


        setScopeItems(scope) {
          if (!Q.$objectExist(scope.doc)) {
            scope.pages = Q.$asCollection([]);
            return;
          }

          scope.pages = Q.$isEmpty(scope.doc.pages) ? Q.$asCollection([]) : Q.$asCollection(scope.doc.pages);
        }

        isPendingDocPage(segment) {
          /*this root context containing dataContext!*/
          let ctx = segment.$segmentContextInstance;
          return ($(segment.$getDom()).isInViewport() || $(segment.$getDom()).isInViewport(3500)) && Q.$objectExists(ctx) && ctx.name === 'docPage' && !(ctx.page.preLoaded || ctx.page.loaded);
        }

      }

      $export(DocReaderUtils);

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