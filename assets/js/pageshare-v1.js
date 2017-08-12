/**
*	Pageshare-App v1.8 
*	Developed using liteUX library, by Awiar Solutions
*	Say hello to hello@awiarsolutions.com
*
*   Report bugs and feature requests: https://bug.awiar.net
*
*	@author: kavan Soleimanbeigi
*	@email: solxiom@gmail.com
*/
!(function (window, $) {
    var awr = window.awr || {},
        Q = awr.Q,
        pageshare = window.pageshare || {};
    pageshare.activeLogin = new ActiveLogin();
    function ActiveLogin() {
        var _self = this, communityAuthUI = null;
        /*some of legacy controller data
         *are not as fresh as they should be
         * for now and with this quick solution
         * we make sure that we use latest data.*/
        function setUpCurrentUser(cmdUser, apiUser) {
            cmdUser.user_name = apiUser.name;
            cmdUser.user_id = apiUser.id;
            cmdUser.user_email = apiUser.email;
            cmdUser.main_collection = apiUser.main_collection;
            cmdUser.user_modified = apiUser.modified;
            cmdUser.user_last_login = apiUser.last_login;
            return cmdUser;
        }


        function getSavedUser() {
            var savedUser = null;
            if ($('body').attr('id') !== 'premium') {
                return null;
            }
            try {
                savedUser = JSON.parse(localStorage.getItem('pageshare_user'));
            } catch (e) {
            }
            return savedUser;
        }

        function saveUser(user) {
            if (user === null) {
                localStorage.setItem('pageshare_user', null);
            } else if (user && typeof user.name !== 'undefined' && typeof user.email !== 'undefined') {
                localStorage.setItem('pageshare_user', JSON.stringify(user));
            }
        }

        function forgetUser() {
            localStorage.setItem('pageshare_user', null);
        }

        function proceedWithUIReloadAfterAuth() {
            var newCurrColl, isEmptyForGuest, hiddenCount;
            if (Q.$objectExist(pageshare.currentCollection) &&
                Q.$arrayNotEmpty(pageshare.collections)) {
                newCurrColl = Q.$collect(pageshare.collections, function (collected) {
                    collected = collected || null;
                    if (Q.$stringEqual(pageshare.currentCollection.id + '', this.id + '')) {
                        collected = this;
                    }
                    return collected;
                });
                if (Q.$objectExist(newCurrColl)) {
                    pageshare.currentCollection = newCurrColl;
                }
            }
            if ($('body').attr('id') !== 'premium') {
                pageshare.UI.reload(true);
            } else {
                pageshare.UI.reload(true);
                pageshare.basicModal.stop();
            }
        }

        _self.wrongUser = function () {
            forgetUser();
            _self.login();
        };

        _self.login = function login(opts) {
            opts = opts || {};
            var event = null;
            if (opts && opts instanceof Event) {
                event = opts;
                opts = {};
                event.preventDefault();
            }
            var hasSavedUser = typeof savedUser !== "undefined" && savedUser !== null;
            var savedUser = getSavedUser(),
                loginFormTemp = Pageshare.Templates['assets/modules/activeLogin/activeLoginForm.hbs'],
                communityErr = $('<div class="error"></div>'),
                renderedForm = $(loginFormTemp({
                    defaultView: true,
                    hasUser: savedUser !== null,
                    userName: hasSavedUser ? savedUser.name : null,
                    userEmail: hasSavedUser ? savedUser.email : null
                }));
            var proceed = function proceed(onErr) {
                var data = new FormData($('form.login-form')[0]);
                var rememberUser = data.get('saveUser') === "on";
                if ($('body').attr('id') !== "premium") {
                    saveUser(null);
                }
                if (savedUser) {
                    data.append('user', $('input[name="saved-user"]').val());
                }
                if (!data.get('user') || data.get('user') === '' || !data.get('password') || data.get('password') === '') {
                    var errorMsg = 'Username and' +
                        ' password are required and should not be empty!';
                    if (savedUser) {
                        errorMsg = 'Password is required and should not be empty!';
                    }
                    renderedForm = $(loginFormTemp({
                        defaultView: true,
                        hasError: true,
                        errorMsg: errorMsg,
                        hasUser: savedUser !== null,
                        userName: savedUser ? savedUser.name : null,
                        userEmail: savedUser ? savedUser.email : null
                    }));
                    if ($('body').attr('id') !== 'premium') {

                    } else {
                        pageshare.basicModal.release({
                            title: "<h1 class='fa fa-lock'> Sign in</h1> ",
                            message: renderedForm
                        });
                    }
                    if (typeof onErr === "function") {
                        onErr(errorMsg);
                    }

                } else {
                    if ($('body').attr('id') !== 'premium') {
                        communityAuthUI.busy();
                    } else {
                        renderedForm = $(loginFormTemp({busyView: true}));
                        pageshare.basicModal.busy({
                            message: renderedForm,
                            isInfo: true
                        });
                    }

                    setTimeout(function () {
                        $.ajax({
                            url: '/admin/auth/active_login',
                            type: 'POST',
                            data: data,
                            async: true,
                            cache: false,
                            contentType: false,
                            processData: false,
                            success: function (res) {
                                if (rememberUser) {
                                    saveUser({name: res.user.user_name, email: res.user.user_email});
                                } else {
                                    forgetUser();
                                }
                                pageshare.currentUser = res.user;
                                renderedForm = $(loginFormTemp({successView: true}));
                                if ($('body').attr('id') !== 'premium') {

                                } else {
                                    pageshare.basicModal.update({
                                        title: "" +
                                        "<h1 class='fa fa-lock'> Sign in</h1> ",
                                        message: renderedForm
                                    });
                                }
                                if (opts && typeof opts.success === "function") {
                                    opts.success();
                                }
                                pageshare.collServer.findAllCollections(function onLoad(colls) {
                                    pageshare.collections = colls;
                                    proceedWithUIReloadAfterAuth();
                                }, function onErr() {
                                    proceedWithUIReloadAfterAuth();
                                });

                            },
                            error: function (res) {
                                res = res.responseJSON || {error: res.responseText};
                                if (savedUser) {
                                    res.error = "Login failed!";
                                }
                                renderedForm = $(loginFormTemp({
                                    defaultView: true,
                                    hasError: true,
                                    errorMsg: res.error,
                                    hasUser: savedUser !== null,
                                    userName: savedUser ? savedUser.name : null,
                                    userEmail: savedUser ? savedUser.email : null
                                }));
                                if (typeof onErr === "function") {
                                    onErr(res.error);
                                }
                                if ($('body').attr('id') === 'premium') {
                                    pageshare.basicModal.release({
                                        title: "<h1 class='fa fa-lock'> Sign in</h1> ",
                                        message: renderedForm
                                    });
                                }
                                var loginInputUser = $('.login-form input[name="user"]'),
                                    loginInputPassword = $('.login-form input[type="password"]');
                                if (!savedUser) {
                                    $(loginInputUser).css("border-color", "red");
                                    $(loginInputUser).css("color", "red");
                                    $(loginInputUser).val(data.get('user'));
                                }
                                $(loginInputPassword).css("border-color", "red");
                                $(loginInputPassword).css("color", "red");
                                $(loginInputPassword).val(data.get('password'));
                            }
                        });
                    }, 500);
                }
            };
            if ($('body') !== 'premium') {
                var communityRender = $(renderedForm),
                    submitBtn = $('<span class="awr-btn">Log in</span>');
                // $(communityRender).append(communityErr);
                $(submitBtn).on('click', function () {
                    proceed(function onErr(errMsg) {
                        _self.login();
                        var communityErrMsg = $('<span class="field text-danger fa fa-remove">&nbsp;' + errMsg + '</span>');
                        $(communityErr).append(communityErrMsg);
                        $('.community-login').append(communityErr);
                    })
                });
                $(communityRender).append(submitBtn);
                $('.community-login').html(communityRender);

            } else {
                pageshare.basicModal.start({
                    mainClass: "active-login",
                    actionName: "Sign in",
                    actionClass: "btn-primary",
                    isInfo: false,
                    action: proceed
                });
                pageshare.basicModal.update({
                    title: "" +
                    "<h1 class='fa fa-lock'> Sign in</h1> ",
                    message: renderedForm
                });
            }


        };

        _self.toggleCommunityAuthUI = function () {
            communityAuthUI = pageshare.communityAuthUIDriver;
            if ($('body').attr('id') !== 'premium') {
                communityAuthUI.start({});
                communityAuthUI.busy();
                setTimeout(function () {
                    communityAuthUI.update({
                        currentUser: pageshare.currentUser
                    });
                    pageshare.mainHeader.reload();
                }, 500);
            }
        };

        _self.findCurrentUser = function (complete) {
            var currentUser = null,
                RemoteModel = awr.importClass('RemoteModel'),
                usrModel = new RemoteModel({api_path: 'api', url: 'user'});
            $.ajax({
                url: 'admin/auth/active_user',
                type: 'GET',
                // data: $($('.doc-form form')[0]).serialize(),
                async: true,
                cache: false,
                contentType: false,
                processData: false,
                success: function (cmdUser) {
                    usrModel.$findOne(cmdUser.user_id).then(function (apiUser) {
                        currentUser = setUpCurrentUser(cmdUser, apiUser);
                        pageshare.currentUser = currentUser;
                        _self.toggleCommunityAuthUI();
                        if (typeof complete === "function") {
                            return complete(currentUser);
                        }
                    });

                },
                error: function (res) {
                    pageshare.currentUser = null;
                    if (typeof complete === "function") {
                        return complete(null);
                    }
                }
            });
        };

        _self.logout = function logout(opts) {
            var event = null;
            opts = opts || {};
            if (opts && opts instanceof Event) {
                event = opts;
                opts = {};
                event.preventDefault();
            }
            var loginFormTemp = Pageshare.Templates['assets/modules/activeLogin/activeLoginForm.hbs'],
                renderedForm = $(loginFormTemp({logoutView: true}));
            if ($('body').attr('id') !== 'premium') {
                pageshare.communityAuthUIDriver.busy();
            } else {
                pageshare.basicModal.start({
                    mainClass: "active-login",
                    isInfo: true,
                    action: null
                });
                pageshare.basicModal.busy({
                    title: "<h1 class='fa fa-lock'> Sign out</h1> ",
                    message: renderedForm
                });
            }

            $.ajax({
                url: '/logout',
                type: 'GET',
                // data: $($('.doc-form form')[0]).serialize(),
                async: true,
                cache: false,
                success: function (res) {
                    pageshare.currentUser = null;
                    if (opts && typeof opts.success === "function") {
                        opts.success();
                    }
                    proceedWithUIReloadAfterAuth();
                },
                error: function (res) {
                    res = res.responseJSON || {error: res.responseText};
                    var renderedForm = $(loginFormTemp({
                        logoutErrorView: true,
                        hasError: true,
                        errorMsg: res.error
                    }));
                    setTimeout(function () {
                        proceedWithUIReloadAfterAuth();
                        if ($('body').attr('id') === 'premium') {
                            pageshare.basicModal.release({
                                message: renderedForm
                            });
                        }
                    }, 1000);

                }
            });
        };
    }

    window.pageshare = pageshare;
})(window, jQuery);


!(function (window, $) {
    var pageshare = window.pageshare || {},
        awr = window.awr || {},
        Q = awr.Q;
    /*this is a awr module*/
    pageshare.basicModal = awr.basicModal;
    pageshare.appConfig = appConfig;

    function appConfig() {
        routeConfig();
    }

    function routeConfig() {

        awr.router.config({
            mode: 'hash',
            prefix: 'app'
        });
        awr.router.on("onStateBusy", function hideUI() {
            $('body > #contents').hide();
            $('body > #loading').show();
            $('body').removeClass('awr-ready');
            $('body').addClass('awr-busy');
        });
        awr.router
            .listen()
            .route({
                name: "default",
                link: "?:v",
                runner: function defaultRoute(state) {
                    /*this one is defined directly in app.module*/
                    pageshare.openFirstCover();
                }
            })
            .route({
                name: "coll-index",
                link: "c/:cId",
                defaultParams: {
                    cId: 'index'
                },
                replaceNullString: true,
                runner: function (state) {
                    var params = state.params || {},
                        cId = params.cId, link = '#v/not_found/0/index?c=' + cId;
                    if (Q.$setContainsString(['index', 'aggregated', 'aggregated-collection', 'undefined', 'null', 'not-found'], cId + '')) {
                        pageshare.currentCollection = null;
                        pageshare.appStart(true);
                    } else if (Q.$stringExist(cId + '')) {
                        pageshare.mainMenu.setSelected(cId);
                        pageshare.collServer.loadAsCurrentCollection(cId, function onIndexScc(current) {
                            if (current) {
                                var docs = current && current.docs ? current.docs : null,
                                    first = docs && docs.length ? docs[0] : null;
                                first = pageshare.collServer.fixMissingLegacyDocAPI(first);
                                var title = first && first.book_name ? first.book_name : 'not_found',
                                    id = first && first.id ? first.id : '0';
                                awr.router.go("doc-link", {
                                    params: {docId: id, docName: title}, attrs: {
                                        c: cId
                                    }
                                });
                            }
                            else {
                                pageshare.UI.showNotFound();
                            }
                        }, function onIndexFail(err) {
                            awr.errorLog("appStart@UI@app", "failed to load main collection for current user", err);
                            pageshare.UI.showNotFound();
                        });
                    } else {
                        pageshare.UI.showNotFound();
                    }
                }
            })
            .route({
                name: "add-doc",
                link: "collection/:cId/add",
                defaultParams: {},
                replaceNullString: true,
                runner: function (state) {
                    var params = state.params || {}, cId = params.cId;
                    pageshare.shelfCtrl.close();
                    pageshare.UI.show(function initAddView() {
                        pageshare.docForm.start(cId);
                    });
                }
            })
            .route({
                name: "share-link",
                link: "share/:docName/:docId/:pageNumber?:c",
                defaultParams: {
                    pageNumber: 'index',
                    docId: 'index'
                },
                replaceNullString: true,
                runner: function (state) {
                    var params = state.params || {},
                        attrs = state.attrs || {};
                    if (Q.$or(Q.$booleanFalse(Q.$stringExist(attrs.c + '')),
                            Q.$setContainsString(['undefined', 'null', '0', '-1', ''], attrs.c + ''))) {
                        state.attrs.c = 'index';
                        awr.router.go('share-link', state, false);
                    }
                    var docLinkSvc = new DocLinkService();
                    docLinkSvc.openByIgnoreLegacy(state);
                }
            })
            .route({
                name: "share-legacy-link",
                link: "share/legacy/:docName/:docId/:pageNumber?",
                defaultParams: {
                    pageNumber: 'index',
                    docId: 'index'
                },
                replaceNullString: true,
                runner: function (state) {
                    var params = state.params || {},
                        attrs = state.attrs || {};
                    if (Q.$or(Q.$booleanFalse(Q.$stringExist(attrs.c + '')),
                            Q.$setContainsString(['undefined', 'null', '0', '-1', ''], attrs.c + ''))) {
                        state.attrs.c = 'index';
                        awr.router.go('share-legacy-link', state, false);
                    }
                    var docLinkSvc = new DocLinkService();
                    docLinkSvc.openByPreferLegacy(state);
                }
            })
            .route({
                name: "doc-link",
                link: "v/:docName/:docId/:pageNumber?:c",
                defaultParams: {
                    pageNumber: 'index',
                    docId: 'index'
                },
                replaceNullString: true,
                runner: function docLinkInit(state) {
                    var params = state.params || {},
                        attrs = state.attrs || {};
                    if (Q.$or(Q.$booleanFalse(Q.$stringExist(attrs.c + '')),
                            Q.$setContainsString(['undefined', 'null', '0', '-1', ''], attrs.c + ''))) {
                        state.attrs.c = 'index';
                        awr.router.go('doc-link', state, false);
                    }
                    var docLinkSvc = new DocLinkService();
                    docLinkSvc.openByPreferLegacy(state);
                }
            })
            .route({
                name: "tag-search",
                link: "collect/tag/:group/:query?:current",
                defaultParams: {
                    group: 'any'
                },
                replaceNullString: true,
                runner: function docLinkInit(state) {
                    Q.$waitForComps({
                        name: 'pageshare.simpleSearch',
                        type: 'object'
                    }).then(function onInit() {
                        pageshare.simpleSearch.start(state);
                    }, function onLate() {

                    });
                }
            })
            .route({
                name: "easy-signup",
                link: "signup/basic?:b_name&:b_ref",
                runner: function (state) {
                    var params = state.params || {},
                        attrs = state.attrs || {};
                    pageshare.UI.show();//keeping the UI visible behind
                    pageshare.easySignup.start();
                }
            })
            .route({
                name: "collections-edit",
                link: "collections/edit?:view",
                runner: function (state) {
                    var params = state.params || {},
                        attrs = state.attrs || {};
                    pageshare.UI.show(function () {
                        pageshare.editCollections.start();
                    }, {hideShelf: true});
                }
            })
            .route({
                name: "doc-edit",
                link: "edit/:docId?:view",
                runner: function (state) {
                    var params = state.params || {},
                        attrs = state.attrs || {};
                    if (Q.$or(Q.$booleanFalse(Q.$stringExist(attrs.view)),
                            Q.$setContainsString(['undefined', 'null', '0', '-1', ''], attrs.view + ''))) {
                        state.attrs.view = 'open';
                        awr.router.go('doc-edit', state, false);
                    }
                    var isDoc = params.docId &&
                        (params.docId.startsWith('doc-') || params.docId.startsWith('d'));
                    var opts = {
                        success: function (res) {
                            pageshare.docEdit.edit(res);
                            pageshare.UI.show();
                        }
                    };
                    if (!params.docId) {
                        return;
                    }
                    if (isDoc) {
                        opts.doc_id = params.docId;
                        opts.doc_id = opts.doc_id.startsWith('doc-') ?
                            opts.doc_id.replace('doc-', '') : opts.doc_id.startsWith('d') ?
                                opts.doc_id.replace('d', '') : opts.doc_id;

                    } else {
                        opts.id = params.docId;
                    }
                    pageshare.docServer.findDoc(opts);
                }
            })
            .route({
                name: "invite-view",
                link: "invite/:view",
                runner: function (state) {
                    var params = state.params || {},
                        attrs = state.attrs || {};
                    pageshare.UI.hide();
                    pageshare.UI.show(function () {
                        if (!(pageshare.currentUser && pageshare.currentUser.is_admin === true)) {
                            awr.router.go("default", {}, true);
                            return;
                        }
                        pageshare.shelfCtrl.close();
                        pageshare.inviteView.start();
                        awr.router.go('invite-view', {params: {view: "index"}}, false);
                    });
                }
            });

    }

    function DocLinkService() {
        function addPrefixToDocId(docId) {
            if (Q.$stringExist(docId + '')) {
                return docId.startsWith('d') && !docId.startsWith('doc-') ?
                    docId.replace('d', 'doc-') : docId;
            }
            return '-1';
        }

        function ignoreLegacyId(docId) {
            var inDigitForm = Q.$stringExist(docId + '') && Q.$numberExist(parseInt(docId)),
                inStringForm = Q.$stringExist(docId) && docId.startsWith('d'),
                inLongStringForm = Q.$stringExist(docId) && docId.startsWith('doc-');

            return inDigitForm ? 'doc-' + docId : inStringForm && !inLongStringForm ? docId.replace('d', 'doc-') :
                inLongStringForm ? docId : '-1';

        }

        function pageNumberExist(pageNumber) {
            var isIndex = Q.$stringExist(pageNumber) && Q.$stringEqual(pageNumber, 'index'),
                isPNumber = Q.$stringExist(pageNumber) &&
                    pageNumber.startsWith('p') && Q.$numberExist(parseInt(pageNumber.replace('p', '')));
            return isIndex || isPNumber;
        }

        function openDocInReader(docId, pageNumber) {
            Q.$qTry(function () {
                pageshare.UI.openDocInReader(docId, pageNumber).then(function onScc() {

                }, function onErr(errMsg) {
                    awr.errorLog("route@openDocLink@UI@app", errMsg, ' Forwarded error.');
                });
            }, function onErr(err) {
                awr.errorLog("route@config@UI@app", "Error stopped attempt for opening " +
                    "a direct doc link in reader. \n\t + Details: " + err);
            });
        }

        function legacyFirst(state) {


            var params = state.params || {}, attrs = state.attrs || {},
                docId = params.docId,
                pageNumber = params.pageNumber;

            pageNumber = pageNumberExist(pageNumber) ? pageNumber : 'p1';
            docId = addPrefixToDocId(docId);
            if (Q.$stringEqual(docId, '-1')) {
                awr.errorLog("route@config@UI@app", "direct doc link not valid for doc-link state. \n\t +Details: Bad value for [docId].");
                return;
            }

            openDocInReader(docId, pageNumber);


        }

        function openByIgnoreLegacy(state) {
            var params = state.params || {}, attrs = state.attrs || {},
                docId = params.docId,
                pageNumber = params.pageNumber;
            docId = ignoreLegacyId(docId);
            pageNumber = pageNumberExist(pageNumber) ? pageNumber : 'p1';
            if (Q.$stringEqual(docId, '-1')) {
                awr.errorLog("route@config@UI@app", "direct doc link not valid for doc-link state. \n\t +Details: Bad value for [docId].");
                return;
            }
            openDocInReader(docId, pageNumber);
        }

        return {
            openByPreferLegacy: legacyFirst,
            openByIgnoreLegacy: openByIgnoreLegacy
        };
    }

})(window, jQuery);
//edit/users/:userName

!(function (window, $) {
    var pageshare = window.pageshare || {},
        awr = window.awr || {},
        Q = awr.Q;


    $(document).ready(function () {
        Q.$waitForComps({name: 'awr.routeManager', type: 'object'}).then(function onStateReady() {
            setTimeout(function iniAppUI() {
                pageshare.appConfig();
                pageshare.UI.reloadMainHeader();
                pageshare.appStart();
            }, 300);
        }, function onErr(err) {
            console.error('Failed to init APP! \n\t + Details: ' + err);
        });
    });

    pageshare.appStart = function APP_START(reset) {
        /*Handlebars helper: required by legacy code! Keep it for now.*/
        Q.$qTry(function () {
            Handlebars.registerHelper('shorten', function (str) {
                if (str && str.length > 40) {
                    str = str.slice(0, 37) + "...";
                }
                return str;
            });
        }, function (e) {
            console.error('@APPStart: failed to register Handlebar helper[shorten].\\t + Details:' + e);
        });
        pageshare.getAppData().then(function () {
            var resetRequired = Q.$booleanTrue(reset) ? reset : defineReset();
            setCurrentCollection(pageshare.collections);
            if (Q.$booleanTrue(resetRequired)) {
                setTimeout(function () {
                    if (Q.$objectExist(pageshare.currentCollection) &&
                        Q.$stringExist(pageshare.currentCollection.id + '')) {
                        awr.router.pushLink('/app#c/' + pageshare.currentCollection.id);
                    } else if (Q.$arrayNotEmpty(pageshare.collections)) {
                        awr.router.pushLink('/app#c/' + pageshare.collections[0].id);
                    }

                }, 200);
            } else {
                pageshare.UI.initUI(false, function onComplete() {
                    awr.router.reloadCurrentState();
                });
            }
        });

    };
    pageshare.openFirstCover = function OPEN_FIRST_COVER() {
        var visibleDocs, doc;
        // console.log('hi visible docs!!');
        // console.log(visibleDocs);
        pageshare.UI.hide();
        pageshare.activeLogin.findCurrentUser(function (user) {
            /*here user can be null also*/
            visibleDocs = findVisibleDocsInCurrentCollection();
            if (Q.$arrayNotEmpty(visibleDocs)) {
                doc = visibleDocs[0];
                awr.router.go('doc-link', {
                    params: {
                        docName: doc.book_name,
                        docId: doc.id,
                        pageNumber: 'index'
                    }
                }, true);
            } else {
                pageshare.UI.showNotFound(true);
            }
        });
    };

    pageshare.findIndexCover = function findIndexDoc() {
        var visibleDocs = findVisibleDocsInCurrentCollection();
        return Q.$arrayNotEmpty(visibleDocs) ? visibleDocs[0] : null;
    };

    pageshare.getUserMainCollection = function () {
        return findUserMainColl(pageshare.collections);
    };
    pageshare.getAppData = function getAppData$() {
        return new Promise(function (resolve, reject) {
            pageshare.activeLogin.findCurrentUser(function onUsrLoad(usr) {
                pageshare.currentUser = usr;
                pageshare.collServer.findAllCollections(function scc(colls) {
                    resolve('done');
                });
            });
        });
    };
    /*if user has no main collection we can try to find one collection which
     *is owned by user
     *if not just randomly choosing one in collectionList*/
    function findUserMainColl(colls) {
        var mainColl = Q.$arrayNotEmpty(colls) ? Q.$collect(colls, function (collected) {
            collected = Q.$stringEqual(this.id, pageshare.currentUser.main_collection) ? this : collected;
            return collected;
        }) : null;
        return !Q.$objectExist(mainColl) && Q.$arrayNotEmpty(colls) ? colls[0] : mainColl;
    }

    function defineReset() {
        var currentState = awr.router.getCurrentState(),
            /*When a non-default state already exist we should let the router resolve the
             *appropriate state runner and view controller*/
            dontReset = Q.$objectExist(currentState) && Q.$stringExist(currentState.link) &&
                !Q.$stringEqual(currentState.name, 'default');
        return Q.$booleanFalse(dontReset);
    }

    function setCurrentCollection(colls) {
        var currentState = awr.router.getCurrentState(),
            cId = Q.$objectExist(currentState.attrs) && Q.$stringExist(currentState.attrs.c + '') ?
                currentState.attrs.c : null;
        //cId always decide first
        if (Q.$stringExist(cId)) {
            pageshare.currentCollection = Q.$collect(colls, function (collected) {
                if (Q.$stringEqual(this.id + '', cId + '')) {
                    return this;
                }
            });
        } else if (!Q.$objectExist(pageshare.currentCollection)) {
            if (!Q.$objectExist(pageshare.currentUser)) {
                pageshare.currentCollection = colls[0];
            } else {
                pageshare.currentCollection = findUserMainColl(colls);
            }
        }

    }

    function findVisibleDocsInCurrentCollection() {
        if (!pageshare.currentCollection) {
            return [];
        }
        var allDocs = pageshare.currentCollection.docs,
            user = pageshare.currentUser;
        allDocs = Q.$arrayExist(allDocs) ? allDocs : [];
        return Q.$reduce(allDocs, function () {
            var isVisible = Q.$stringEqual(this.visibility + '', '1') || Q.$stringEqual(this.public + '', '1'),
                isUserOwner = Q.$objectExist(user) && (Q.$stringEqual(this.owner_id, user.user_id) ||
                    Q.$stringEqual(this.author_id, user.user_id));
            return Q.$booleanTrue(isVisible) || Q.$booleanTrue(isUserOwner);

        });
    }

})(window, jQuery);


!(function (window) {
    'use strict';
    /*jshint sub:true*/
    /*jshint forin:false*/
    /**
     * TODO: properly test, especially the integration of between...
     * ...this module and AWRSet(iterator)
     * /home/kavan/Projects/pageshare/node_modules/sinon/pkg/sinon-2.2.0.js
     */
    window.awr = window.awr || {};
    window.awr.bootQueue = window.awr.bootQueue || [];


    var awr = window.awr || {},
        bootQueue = awr.bootQueue,
        $ = window.jQuery,
        Promise = window.Promise;

    var errorReg = {
        exampleErr: {
            moduleName: '$start@BasicTable',
            errMsg: 'Bad controller instance.',
            hintMsg: 'Table Controller does not have a start function. \n\t + Error: {errMsg}'
        },
    };

    var simpleModule = {
        moduleName: '$$collServer@Module',
        requires: [{
            name: 'awr.$$appEssentials',
            type: 'object'
        }],
        wTime: 6000,
        init: init,
        QAsContext: true
    };
    bootQueue.push(simpleModule);

    function init() {
        /*Here the context is Q interface*/
        var Q = this,
            RemoteModel = awr.importClass('RemoteModel'),
            cModel = new RemoteModel({api_path: 'api', url: 'collection'}),
            usrModel = new RemoteModel({api_path: 'api', url: 'user'}),
            currentCollection = null;

        window.pageshare = window.pageshare || {};
        window.pageshare.collServer = new CollectionServer();

        this.$qBundle.$createBundle('PageshareCollServerGroup', [
            {
                name: 'pageshare.collServer',
                type: 'object'
            }
        ]);

        function findAllCollections(success, error) {

            var collections = [], newCurrent;
            cModel.$findAll().then(function onScc(res) {
                setCollectionList(res, success);
                if (Q.$objectExist(pageshare.currentCollection)) {
                    newCurrent = Q.$collect(pageshare.collections, function (collected) {
                        collected = collected || null;
                        if (Q.$stringEqual(pageshare.currentCollection.id, this.id)) {
                            collected = this;
                        }
                        return collected;
                    });
                    pageshare.currentCollection = Q.$objectExist(newCurrent) ? newCurrent : pageshare.currentCollection;
                }


            }, function onErr(err) {
                var e = err && err.statusText ? err.statusText : Q.$functionExist(err.toString) ? err.toString() : '';
                awr.errorLog("findAllCollections@collServer@app", "Failed to fetch collections from server", e);
                if (Q.$functionExist(error)) {
                    error(err);
                }
            });
        }

        function findDocsByCollection(col_id, success, error) {
            var collections = [];
            cModel.$findOne(col_id).then(function onScc(item) {
                item.docs = Q.$map(item.docs, function () {
                    this.book_name = this.name;
                    return this;
                });
                if (Q.$functionExist(success)) {
                    success(item);
                }
            }, function onErr(err) {
                var e = err && err.statusText ? err.statusText : Q.$functionExist(err.toString) ? err.toString() : '';
                awr.errorLog("findDocsByCollections@collServer@app", "Failed to fetch docs for collections from server", e);
                if (Q.$functionExist(error)) {
                    error(err);
                }
            });
        }
        /*first we publish for public and we let
         * system to detect current user if current user finally resolves then we
         * allow to user see also those collections which he owns.
         * In publish mode we should only show collections
         * which include at least on public document.
         * The problem of this code is the double call of [success] if user get resolves late.*/
        function setCollectionList(colls, success) {
            //the timeout exit will be silent and here no need for handle wait exit
            var collections = safeSetCollections(colls);

            if (!Q.$objectExist(pageshare.currentUser)) {
                Q.$waitForComps({
                    name: 'pageshare.currentUser',
                    type: 'object'
                }).then(function onScc() {
                    collections = safeSetCollections(colls);
                    if (Q.$functionExist(success)) {
                        success(collections);
                        setTimeout(function () {
                            pageshare.mainMenu.reload();
                        }, 300);
                    }
                }, function onNotUser(timeoutErr) {
                    success(collections);
                    pageshare.mainMenu.reload();
                });
            }else{
                success(collections);
                pageshare.mainMenu.reload();
            }
        }

        function safeSetCollections(colls) {
            var currentUser = pageshare.currentUser,
                collections = Q.$map(colls, function () {
                    this.docs = Q.$arrayExist(this.docs) ? this.docs : [];
                    var pubDocCount = Q.$collect(this.docs, function (collected) {
                        collected = collected || 0;
                        if (Q.$stringEqual(this.visibility, '1') || Q.$stringEqual(this.public, '1')) {
                            collected++;
                        }
                        return collected;
                    });
                    pubDocCount = Q.$numberExist(pubDocCount) ? pubDocCount : 0;
                    var isOwner = Q.$objectExist(currentUser) && Q.$stringEqual(this.owner_id, currentUser.user_id),
                        condition = isOwner || pubDocCount > 0;

                    if (Q.$booleanTrue(condition)) {
                        return this;
                    }
                });
            collections = filterAndSetDocs(collections);
            //some bad code from legacy@legacy@oldSystem may still spin
            // around and ask for such ugly variables
            // that are set to global space directly.
            // We feel merciful, and help them not break for now.
            window.collections = collections;
            pageshare.collections = collections;

            return collections;
        }

        function setCurrentCollection(collection) {

            pageshare.currentCollection = collection;
            currentCollection = collection;
        }

        function loadAsCurrentCollection(col_id, success, error) {
            var sccCalled = false, localColl;
            if (Q.$arrayNotEmpty(pageshare.collections)) {
                localColl = Q.$collect(pageshare.collections, function (collected) {
                    collected = collected || null;
                    if (Q.$stringEqual(col_id + '', this.id + '')) {
                        collected = this;
                    }
                    return collected;
                });
                if (Q.$objectExist(localColl)) {
                    setCurrentCollection(localColl);
                    if (Q.$functionExist(success)) {
                        sccCalled = true;
                        Q.$qTry(function sccCall() {
                            success(localColl);
                        }, function onErr(err) {
                            console.error('loadAsCurrentCollection@collServer@App:' +
                                ' Bad success callback. \n\t + Details: ' + err);
                        });
                    }
                }

            }
            cModel.$findOne(col_id).then(function onScc(item) {
                item = filterAndSetDocs([item])[0];
                setCurrentCollection(item);
                if (Q.$arrayNotEmpty(pageshare.collections)) {
                    //updating local data
                    pageshare.collections = Q.$map(pageshare.collections, function () {
                        if (Q.$stringEqual(this.id + '', col_id + '')) {
                            return item;
                        }
                        return this;
                    });
                }
                if (Q.$functionExist(success) && Q.$booleanFalse(sccCalled)) {
                    Q.$qTry(function sccCall() {
                        success(item);
                    }, function onErr(err) {
                        console.error('loadAsCurrentCollection@collServer@App:' +
                            ' Bad success callback. \n\t + Details: ' + err);
                    });
                }

            }, function onErr(err) {
                var e = err && err.statusText ? err.statusText : Q.$functionExist(err.toString) ? err.toString() : '';
                awr.errorLog("findDocsByCollections@collServer@app", "Failed to load current collection from server", e);
                if (Q.$functionExist(error)) {
                    error(err);
                }
            });
        }

        function loadUserMainCollection(user_id, success, error) {
            var collection;
            usrModel.$findOne(pageshare.currentUser.user_id).then(function (usr) {
                cModel.$findAll().then(function onScc(colls) {
                    collection = Q.$collect(colls, function (collected) {
                        if (Q.$stringEqual(usr.main_collection + '', this.id)) {
                            return this;
                        }
                    });
                    collection = filterAndSetDocs([collection])[0];
                    setCurrentCollection(collection);
                    if (Q.$functionExist(success)) {
                        success(collection);
                    }

                }, function onErr(err) {
                    var e = err && err.statusText ? err.statusText : Q.$functionExist(err.toString) ? err.toString() : '';

                    awr.errorLog("findAllCollections@collServer@app", "Failed to fetch collections from server", e);
                    if (Q.$functionExist(error)) {
                        error(err);
                    }
                });
            }, function (err) {

            });
        }

        /**
         * For each doc in a collection this will Add the legacy support and filters hidden one out.
         * @param collections
         * @returns {*}
         */
        function filterAndSetDocs(collections) {
            return Q.$map(collections, function () {
                var nxtColl = this;
                this.docs = convertToLegacy(this.docs);
                if (Q.$arrayNotEmpty(this.docs)) {
                    this.docs = Q.$map(this.docs, function () {
                        var isVisible = pageshare.docServer.isDocVisible(this);
                        if (Q.$or(isVisible, isUserAdmin())) {
                            return this;
                        }
                    });
                }
                return this;
            });
        }

        function isUserAdmin() {
            return Q.$objectExist(pageshare.currentUser) && Q.$booleanTrue(pageshare.currentUser.is_admin);
        }

        function convertToLegacy(doc) {
            var docs = Q.$arrayNotEmpty(doc) ? Q.$map(doc, function () {
                return this;
            }) : Q.$objectExist(doc) ? [doc] : [];
            docs = Q.$map(docs, function () {
                fixMissingDocName(this);
                if (!Q.$objectExist(this.book)) {
                    this.book = Q.$mapObject(this, function () {
                        return this;
                    });
                }
                return this;
            });
            return Q.$arrayExist(doc) ? docs : Q.$objectExist(doc) ? docs[0] : null;
        }

        function fixMissingLegacyDocAPI(doc) {
            fixMissingDocName(doc);
            if (!Q.$objectExist(doc)) {
                return null;
            }
            doc.id = Q.$stringExist(doc.id) && doc.id.startsWith('doc-') ? doc.id.replace('doc-', 'd') : doc.id;
            doc.book = Q.$mapObject(doc, function () {
                return this;
            });
            return doc;
        }

        function fixMissingDocName(doc) {
            if (!Q.$objectExist(doc)) {
                return null;
            }
            doc.name = Q.$stringExist(doc.name) ? doc.name : Q.$stringExist(doc.book_name) ?
                doc.book_name : Q.$stringExist(doc.book_name_clean) ? doc.book_name_clean : 'No Name detected for this Doc!';
            doc.book_name = doc.book_name_clean = doc.name;
        }

        function CollectionServer() {
            return {
                findDocsByCollection: findDocsByCollection,
                findAllCollections: findAllCollections,
                loadAsCurrentCollection: loadAsCurrentCollection,
                loadUserMainCollection: loadUserMainCollection,
                fixMissingLegacyDocAPI: fixMissingLegacyDocAPI,
                getCurrentCollection: function getCurrColl() {
                    return currentCollection;
                }

            }
        }

    }

})(window);

!(function (window, $) {
    var pageshare = window.pageshare || {},
        awr = window.awr || {},
        Q = awr.Q;
    pageshare.communityAuthUIDriver = new CommunityAuthUIDriver();


    function CommunityAuthUIDriver() {
        awr = window.awr || {};
        Q = awr.Q;
        var _self = this,
            loginFormTemp = Pageshare.Templates['assets/modules/communityAuthUIDriver/communityLoginBtn.hbs'],
            mainMenuSelector = '#mainMenu > .menu-content > ul', userName = '',
            renderedForm = null,
            loadingMode = false,
            outMode = false;

        function init(opts) {

            _self.initLock = awr.ux.initLock(_self.initLock);
            _self.initLock.setDuration(500);
            awr.ux.execWithLock(_self.initLock, function execCompileINIT() {

                proceedWithInit(opts);
            });
        }

        function proceedWithInit(opts) {
            opts = opts || {};
            var isAdmin = Q.$objectExist(opts.currentUser) && opts.currentUser.is_admin;
            $(mainMenuSelector).find('#mainMenuLoginBtn').remove();

            if (opts.currentUser) {
                userName = opts.currentUser.user_name;
                outMode = true;
            } else {
                outMode = false;
                userName = null;
            }
            loadingMode = false;
            renderedForm = $(loginFormTemp({
                loadingMode: false,
                outMode: outMode,
                userName: userName,
                isAdmin: Q.$booleanTrue(isAdmin)
            }));
            $(mainMenuSelector).append(renderedForm);

        }
        function busy(opts) {
            var menuLinks = $($(mainMenuSelector));
            $(menuLinks).find('#mainMenuLoginBtn').remove();
            renderedForm = $(loginFormTemp({
                loadingMode: true
            }));
            $(menuLinks).append(renderedForm);
        }

        return awr.notifManager.implementOutDriver({
            onStart: init,
            onUpdate: init,
            onBusy: busy,
            onRelease: init,
            onStop: function (opts) {
                var menuLinks = $(mainMenuSelector);
                $(menuLinks).find('#mainMenuLoginBtn').remove();
            }
        });
    }


    window.pageshare = pageshare;
})(window, jQuery);





!(function (window, $) {
    var pageshare = window.pageshare || {},
        awr = window.awr || {},
        Q = awr.Q;
    pageshare.DocData = DocData;
//
    function DocData(opts) {
        pageshare = window.pageshare || {};
        awr = window.awr || {};
        Q = awr.Q;

        opts = opts || {};
        var formData = null;

        function getData() {
            if (opts.dataGroupType === 'form') {
                formData = new FormData($(opts.dataElement)[0]);
            } else if (opts.dataGroupType === 'formData' && opts.dataElement instanceof FormData) {
                formData = opts.dataElement;
            }
            if (formData && opts.appends) {
                for (var i in opts.appends) {
                    var next = opts.appends[i];
                    formData.append(i, typeof next === "function" ? next() : next);
                }
            }
            return formData;
        }

        function getDocInitForm() {
            var formData = new FormData(),
                user_id = pageshare.currentUser.user_id ?
                    pageshare.currentUser.user_id : -1,
                data = getData();
            var _public = parseInt(data.get("public")) === 1 || data.get("public") === "on" ? 1 : 0,
                _allow_aggregating = parseInt(data.get("allow_aggregating")) === 1 ||
                data.get("allow_aggregating") === "on" ? 1 : 0;
            formData.append("user_id", user_id);
            formData.append("doc_name", data.get("book_name"));
            formData.append("shelf_id", data.get("shelf_id"));
            formData.append("collection_id", data.get("shelf_id"));
            formData.append("public", _public);
            formData.append("allow_aggregating", _allow_aggregating);
            return formData;
        }

        function getDocUpdateForm() {
            var formData = new FormData(),
                data = getData(),
                _public = parseInt(data.get("public")) === 1 || data.get("public") === "on" ? 1 : 0,
                _allow_aggregating = parseInt(data.get("allow_aggregating")) === 1 ||
                data.get("allow_aggregating") === "on" ? 1 : 0;
            formData.append("doc_id", data.get("doc_id"));
            formData.append("doc_name", data.get("book_name"));
            formData.append("shelf_id", data.get("shelf_id"));
            if (Q.$exist(data.get("original_collection") && Q.$stringExist(data.get("original_collection") + ''))) {
                formData.append("original_collection", data.get("original_collection"));
            } else {
                formData.append("original_collection", data.get("shelf_id"));
            }
            formData.append("collection_id", data.get("collection_id"));
            formData.append("public", _public);
            formData.append("allow_aggregating", _allow_aggregating);
            // window.update_info = formData;
            return formData;
        }

        function getLegacyUpgradeData() {
            var formData = new FormData(),
                data = getData();
            formData.append("doc_id", data.get("doc_id"));
            formData.append("legacy_id", data.get("legacy_id"));
            formData.append("pdf_path", data.get("pdf_path"));
            formData.append("epub_path", data.get("epub_path"));
            formData.append("audio_path", data.get("audio_path"));
            // window.update_info = formData;
            return formData;
        }

        function getDocInitUrl() {
            return 'cmd/doc/init';
        }

        function getDocUpdateUrl() {
            return 'cmd/doc/update';
        }

        function getDocMetaUrl() {
            return 'cmd/meta/save_meta';
        }

        function getFileUploadUrl() {
            return 'cmd/doc/upload';
        }

        function getLegacyUpgradeUrl() {
            return 'cmd/doc/upgrade_legacy';
        }

        function getDocName() {
            return getData().get("book_name");
        }

        function getCollectionId() {
            return getData().get("shelf_id");
        }

        //
        function getMetaAsJSON(serialize) {
            var data = getData();
            var meta = {
                "doc_id": data.get('doc_id'),
                "doc_meta": {
                    "Languages": data.get('Languages').split(','),
                    "Authors": data.get('Authors').split(','),
                    "Categories": data.get('Categories').split(','),
                    "Meme": data.get('Meme').split(','),
                    "Designs": data.get('Designs').split(','),
                    "Print": data.get('Print').split(','),
                    "Year of publication": data.get('pub_year')
                }
            };
            return serialize === true ? JSON.stringify(meta) : meta;
        }

//
        function getFiles() {
            var validation = validate(), formData = getData(), files = [];
            if (validation.hasPdfFile) {
                files.push(formData.get('pdffile'));
            }
            if (validation.hasEpubFile) {
                files.push(formData.get('epubfile'))
            }
            if (validation.hasAudioFile) {
                files.push(formData.get('audiozipfile'))
            }
            return files;
        }

        function validate() {
            var errs_msgs = [], warnings = [];
            var formData = getData(),
                doc_name = formData.get("book_name"),
                authors = formData.get("Authors"),
                fileCount = 3,
                pdfFile = formData.get("pdffile"),
                epubFile = formData.get("epubfile"),
                audioFile = formData.get("audiozipfile");

            if (doc_name === "" || doc_name.length < 3) {
                errs_msgs.push("Document / file name should not be empty!");
                warnings["doc_name"] = "Document / file name should not be empty!";

            }
            if (authors === "" || authors.length < 3) {
                errs_msgs.push("Specify at least one author for the new document!");
                warnings["authors"] = "Specify at least one author for the new document!";
            }
            if (pdfFile.size <= 0 || pdfFile.name === "") {
                warnings["pdf_file"] = "Pdf file not selected!";
                fileCount--;
            }
            if (epubFile.size <= 0 || epubFile.name === "") {
                warnings["epub_file"] = "Epub file not selected!";
                fileCount--;
            }
            if (audioFile.size <= 0 || audioFile.name === "") {
                warnings["audio_file"] = "Audio file not selected!";
                fileCount--;
            }
            if (fileCount <= 0) {
                errs_msgs.push("Select at least one document for upload!");
                warnings["files"] = "Select at least one document for upload!";
            }
            return {
                error_msgs: errs_msgs,
                warnings: warnings,
                errors_size: errs_msgs.length,
                warnings_size: warnings.length,
                filesCount: fileCount,
                hasDocName: typeof warnings["doc_name"] === "undefined",
                hasAuthors: typeof warnings["authors"] === "undefined",
                hasPdfFile: typeof warnings["pdf_file"] === "undefined",
                hasEpubFile: typeof warnings["epub_file"] === "undefined",
                hasAudioFile: typeof warnings["audio_file"] === "undefined"
            }
        }

        function isValid() {
            return validate().error_msgs.length < 1;
        }

        return {
            getData: getData,
            getDocName: getDocName,
            getDocInitForm: getDocInitForm,
            getDocUpdateForm: getDocUpdateForm,
            getDocMetaAsJSON: getMetaAsJSON,
            getDocInitUrl: getDocInitUrl,
            getDocUpdateUrl: getDocUpdateUrl,
            getDocMetaUrl: getDocMetaUrl,
            getLegacyUpgradeData: getLegacyUpgradeData,
            getLegacyUpgradeUrl: getLegacyUpgradeUrl,
            getFileUploadUrl: getFileUploadUrl,
            getCollectionId: getCollectionId,
            getFiles: getFiles,
            validate: validate,
            isValid: isValid,
            append: function (key, val, data) {
                // $($('.doc-form form')[0]).find('input[name="' + key + '"]').remove();
                // $($('.doc-form form')[0]).append('<input type="hidden" name="' + key + '" value="' + val + '" />');
                if (opts.dataGroupType === "form" && opts.dataElement) {
                    $($(opts.dataElement)[0]).find('input[name="' + key + '"]').remove();
                    $($(opts.dataElement)[0]).append('<input type="hidden" name="' + key + '" value="' + val + '" />');
                } else if (opts.dataGroupType === "formData" && opts.dataElement instanceof FormData) {
                    opts.dataElement.delete(key);
                    opts.dataElement.append(key, val);
                }
                if (typeof data !== 'undefined' && typeof data.append === 'function') {
                    data.append(key, val);
                }
            }
        };
    }


})(window, jQuery);
/*globals console, Pageshare*/
!(function (window, $) {
    'use strict';
    var pageshare = window.pageshare || {},
        awr = window.awr || {},
        Q = awr.Q;
    pageshare.docEdit = new DocEdit();
    function DocEdit() {
        var _self = this;
        _self.tags = {};
        _self.selects = {};
        _self.checkboxes = {};
        _self.inputs = {};
        _self.currentEditDoc = null;
        var collections = [],
            years = [];
        $(document).ready(function () {
            pageshare = window.pageshare || {};
            awr = window.awr || {};
            Q = awr.Q;
            Q.$waitForComps({name: 'pageshare.collServer', type: 'object'}).then(function onScc() {
                init();
            }, function onErr(e) {

            });
        });
        function init() {
            for (var y = new Date().getFullYear(); y >= 1800; y--) {
                years.push({value: y, selected: y === new Date().getFullYear() ? 'selected' : ''});
            }
            if (Q.$arrayNotEmpty(pageshare.collections)) {
                collections = pageshare.collections;
            } else {
                pageshare.collServer.findAllCollections(function onScc(colls) {
                    collections = colls;
                });
            }
        }

        function updateUI() {
            pageshare.collServer.findAllCollections(function onScc(colls) {
                // collServer will always update pageshare.collections after this call
                var doc = pageshare.docEdit.currentEditDoc,
                    newCurrentColl = Q.$collect(pageshare.collections, function (collected) {
                        collected = collected || pageshare.currentCollection;
                        if (Q.$exist(doc.original_collection) && Q.$stringEqual(doc.original_collection + '', this.id + '')) {
                            collected = this;
                        }
                        return collected;
                    });
                //currently collServer will reload the mainMenu also on refresh
                // pageshare.mainMenu.reload();
                if (Q.$objectExist(newCurrentColl) && !Q.$stringEqual(pageshare.currentCollection.id, newCurrentColl.id)) {
                    pageshare.currentCollection = newCurrentColl;
                    pageshare.shelfCtrl.open();
                }

            }, function onErr(err) {

            });

        }

        function filterCollections(colls) {
            if (!Q.$arrayNotEmpty(colls)) {
                return [];
            }
            return Q.$reduce(colls, function () {
                var currentUserId = Q.$objectExist(pageshare.currentUser) ? pageshare.currentUser.user_id : null,
                    currentDocId = Q.$objectExist(pageshare.docEdit.currentEditDoc) ?
                        pageshare.docEdit.currentEditDoc.original_collection : null;
                if (Q.$exist(currentDocId) && Q.$stringEqual(currentDocId + '', this.id + '')) {
                    return true;
                }
                return Q.$exist(currentUserId) && Q.$stringEqual(this.owner_id + '', currentUserId + '');
            });
        }

        function initCollectionOptions() {
            $('#collectionSelect').on('change', function (event) {
                var newCollId = $(event.target).val(), currDoc = Q.$objectExist(pageshare.docEdit.currentEditDoc) ?
                    pageshare.docEdit.currentEditDoc : null;
                if (Q.$objectExist(currDoc)) {
                    currDoc.original_collection = Q.$exist(newCollId) && Q.$stringExist(newCollId + '') ?
                        newCollId + '' : currDoc.original_collection;
                }
            });
        }

        function getAttrFirsValue(attr) {
            return attr && attr instanceof Array ? attr[0].value : '';
            // doc.attributes.url.Designs && doc.attributes.url.Designs instanceof Array ? doc.attributes.url.Designs[0].value : '';
        }

        function getAttrValues(attrArray) {
            return attrArray && attrArray instanceof Array ?
                attrArray : attrArray && attrArray.length > 0 ? [attrArray] : [];
        }

        function getShortFileName(name) {
            var shorten = name;
            if (name.length > 26) {
                shorten = name.substring(0, 13) + "(...)" +
                    name.substring(name.length - 13);
            }
            return shorten;
        }

        _self.edit = function edit(doc, complete) {
            pageshare.docServer.initMetaDataDB();
            updateUI();
            pageshare = window.pageshare || {};
            awr = window.awr || {};
            Q = awr.Q;
            var editTemp, pdf_file_path,
                epub_file_path, context,
                rendered, upgradeOpts,
                searchInMeta;
            if (!Q.$objectExist(pageshare.currentUser)) {
                if (Q.$objectExist(awr.router)) {
                    awr.router.goToRoot();
                }
                return;
            }
            pageshare.viewName = "doc-edit";
            editTemp = Pageshare.Templates['assets/modules/docEdit/docEdit.hbs'];
            doc = doc && doc.book ? doc.book : pageshare.currentDoc.book;
            _self.currentEditDoc = doc;
            if ($('.doc-edit')) {
                $('.doc-edit').remove();
            }
            doc.meta = {};
            if (doc.attributes && doc.attributes.url) {
                doc.meta.designs = getAttrFirsValue(doc.attributes.url.Designs);
                doc.meta.print = getAttrFirsValue(doc.attributes.url.Print);
                doc.meta.meme = getAttrFirsValue(doc.attributes.url.Meme);
            }
            if (doc.attributes.attribute) {
                doc.meta.authors = getAttrValues(doc.attributes.attribute.Authors);
                doc.meta.languages = getAttrValues(doc.attributes.attribute.Languages);
                doc.meta.categories = getAttrValues(doc.attributes.attribute.Categories);
            }

            pdf_file_path = doc.file_url_pdf ? doc.file_url_pdf.split('/') : [];
            epub_file_path = doc.file_url_epub ? doc.file_url_epub.split('/') : [];
            if (doc.pdfFile) {
                doc.pdf_name = doc.pdfFile.name;
            } else if (pdf_file_path.length > 0) {
                doc.pdf_name = pdf_file_path[pdf_file_path.length - 1];
                doc.pdf_name = getShortFileName(doc.pdf_name);
            }
            if (doc.epubFile) {
                doc.epub_name = doc.epubFile.name;
            } else if (epub_file_path.length > 0) {
                doc.epub_name = epub_file_path[epub_file_path.length - 1];
                doc.epub_name = getShortFileName(doc.epub_name);
            }
            context = {
                doc: doc,
                collections: filterCollections(collections),
                years: years

            };
            rendered = $(editTemp(context));

            $('#ajax-content').html(rendered);
            initCollectionOptions();
            /*
             *Normal page reload and direct links will  cause a body.ready to be triggered
             * SPA routing will not cause body.ready callback and it needs
             * a small timeout wait and then init call.
             */
            setTimeout(function () {
                initUI(doc);
                $('.doc-edit .back-link').on('click', function () {
                    awr.router.back({
                        onStateChange: function () {
                            pageshare.mainHeader.reload();
                        }
                    });
                });
            }, 500);
            $('body').ready(function () {
                initUI(doc);
                $('.doc-edit .back-link').on('click', function () {
                    awr.router.back({
                        onStateChange: function () {
                            pageshare.mainHeader.reload();
                        }
                    });
                });
                if (!Q.$stringEqual($('body').attr('id'), 'premium')) {
                    pageshare.shelfCtrl.open();
                }

            });
            if (!doc.doc_id) {
                _self.disableEdit();
            } else {
                _self.enableEdit();
            }
            if (awr.ux) {
                if (!(Q.$exist(doc.doc_id) && Q.$stringExist(doc.doc_id + '') )) {
                    upgradeOpts = {
                        ntfText: 'This document must be upgraded before it can be edited.',
                        actionName: 'Upgrade',
                        moreInfoText: 'more info...',
                        type: 'warning',
                        hasIcon: true,
                        hasMoreInfo: true,
                        hasAction: true,
                        parentElemKey: '#ajax-content',
                        moreInfo: function () {

                            pageshare.basicModal.start({
                                mainClass: "upgrade-info",
                                actionName: "Upgrade",
                                title: " Upgrade recommended for this document!",
                                titleIcon: "fa fa-exclamation-triangle text-warning",
                                message: "This document was created using the legacy system. The current system provides limited support for legacy documents." +
                                " This means that the legacy documents are not compatible with many new features introduced by the current system," +
                                " such as edit and update, tag based search," +
                                " auto-complete for data fields, file replace, and etc. We highly recommend that you upgrade this document now.",
                                actionClass: "btn-success",
                                action: function proceed_with_confirm() {


                                    pageshare.basicModal.stop();
                                    _self.upgrade();

                                },
                                cancelName: 'Cancel'

                            });
                        },
                        action: function () {


                            pageshare.basicModal.stop();
                            _self.upgrade();
                        }
                    };
                    awr.ux.notifBar.show(upgradeOpts);
                }
                searchInMeta = pageshare.docServer.searchInMeta;
                _self.tags.authors = awr.ux.tagField('#authorsField', {
                    capitalize: true,
                    tags: doc.meta.authors,
                    onSearch: function (query, onResult) {
                        var res = searchInMeta("Authors", query);
                        if (query.length < 1) {
                            res = [];
                        }
                        if (typeof onResult === "function") {
                            onResult(res);
                        }

                    }
                });
                _self.tags.languages = awr.ux.tagField('#langsField', {
                    capitalize: true,
                    tags: doc.meta.languages,
                    onSearch: function (query, onResult) {

                        var res = searchInMeta("languages", query);
                        if (query.length < 1) {
                            res = [];
                        }
                        if (typeof onResult === "function") {
                            onResult(res);
                        }

                    }
                });
                _self.tags.categories = awr.ux.tagField('#categsField', {
                    capitalize: true,
                    tags: doc.meta.categories,
                    onSearch: function (query, onResult) {
                        var res = searchInMeta("categories", query);
                        if (query.length < 1) {
                            res = [];
                        }
                        if (typeof onResult === "function") {
                            onResult(res);
                        }

                    }
                });
                if (doc.doc_id) {
                    pageshare.docServer.getDocState(doc.doc_id, function (state) {
                        if (state.is_busy === true) {
                            var cover = $('.side .img-cover');
                            $(cover).css('display', 'block');
                            $(cover).parent().find('img').attr('src', 'assets/img/hourglass.gif');
                            var upgradeOpts = {
                                ntfText: 'This document is currently being processed. You can edit the document when this job is done.',
                                actionName: '',
                                moreInfoText: 'more info...',
                                type: 'warning',
                                hasIcon: true,
                                hasMoreInfo: false,
                                hasAction: false,
                                parentElemKey: '#ajax-content',
                                moreInfo: function () {
                                },
                                action: function () {
                                }
                            };
                            awr.ux.notifBar.show(upgradeOpts);
                            _self.disableEdit();
                            pageshare.docServer.waitForBusyDoc(doc.doc_id, function () {
                                if (window.pageshare.viewName === "doc-edit") {
                                    pageshare.docServer.findDoc({
                                        doc_id: doc.doc_id,
                                        success: function (readyDoc) {
                                            _self.edit(readyDoc);
                                        }, fail: function () {
                                            console.error("docEdit: could not open ready document for editing.");
                                        }
                                    });
                                }
                            });
                        }
                    });
                }


            }
            _self.selects.publicationYear = $('#yearSelect');
            _self.selects.collections = $('#collectionSelect');
            _self.checkboxes.public = $('input[name="public"]');
            _self.checkboxes.allowAggregating = $('input[name="allow_aggregating"]');
            if ($('textarea[name="doc_name"]').css('display') === 'block') {
                _self.inputs.docName = $('textarea[name="doc_name"]');
            } else {
                _self.inputs.docName = $('input[name="doc_name"]');
            }

            _self.inputs.designs = $('input[name="designs"]');
            _self.inputs.print = $('input[name="print"]');
            _self.inputs.meme = $('input[name="meme"]');
            _self.doc = doc;
            pageshare.mainHeader.reload();
            pageshare.UI.setDefaultEventHandlers();

        };

        function initUI(doc) {
            doc = doc || {};
            doc.attributes = doc.attributes || {};
            doc.attributes.attribute = doc.attributes.attribute || {};
            var year = 1900,
                attr = doc.attributes.attribute['Year of publication'];
            if (attr instanceof Array &&
                attr[0].value) {
                year = attr[0].value;
            }

            if (parseInt(doc.public) === 1) {
                $('input[name="public"]').attr('checked', doc.public);
            }
            if (parseInt(doc.allow_aggregating) === 1) {
                $('input[name="allow_aggregating"]').attr('checked', doc.allow_aggregating);
            }
            var selCol = $("#collectionSelect option[value='" + doc.shelf_id + "']");
            if (selCol) {
                $(selCol).attr('selected', 'selected');

            }
            $("#yearSelect option[value='" + year + "']").attr('selected', 'selected');
            // $('input[name="doc_name"]').ready(function(){
            // });
            _self.adjustInputSize($('input[name="doc_name"]'));
            _self.adjustInputSize($('textarea[name="doc_name"]'));

        }

        _self.addFile = function (type, replace) {
            pageshare.basicModal.start({
                mainClass: "no-edit-notice",
                actionName: "ok",
                actionClass: "btn-primary",
                isInfo: true
            });
            pageshare.basicModal.update({
                title: "<span class='fa fa-exclamation-circle'></span> " +
                "Feature not available",
                message: "<Strong>Note:</Strong> The edit feature currently does not support file upload. This complementary feature become available in near future!"
            });
        };
        _self.adjustInputSize = function (field) {
            if (!$(field)[0]) {
                return;
            }
            var val = $(field).text() ? $(field).text() : $(field).val();

            if ($(field) && $(field)[0].nodeName.toLowerCase() === "textarea") {
                // $(field).text($(field).text().trim()+' ');
                $(field).height(0);
                $(field).width($('.doc-edit .header').width() - 15);
                $(field).height($(field)[0].scrollHeight);
            } else {
                var parent = $(field).parent(),
                    parentWidth = parent.width(),
                    newWidth = ((val.length + 1) * 20);
                if (newWidth < parentWidth - 15 || $(field).width() < parentWidth - 15) {
                    // $(field).css('width', ((val.length + 1) * 20) + 'px');
                    Math.min($(field).width(((val.length + 1) * 20)), parentWidth - 15);
                }
            }

        };
        _self.getEditData = function () {
            var docData,
                editForm = new FormData(),
                id = _self.doc.doc_id ? _self.doc.doc_id : _self.doc.id;

            editForm.append("doc_id", id);
            docData = new pageshare.DocData({
                dataGroupType: "formData",
                dataElement: editForm,
                appends: {
                    "book_name": _self.inputs.docName.val(),
                    "shelf_id": _self.selects.collections.val(),
                    "original_collection": _self.selects.collections.val(),
                    "collection_id": _self.selects.collections.val(),
                    "Authors": _self.tags.authors.getTags,
                    "Languages": _self.tags.languages.getTags,
                    "Categories": _self.tags.categories.getTags,
                    "pub_year": _self.selects.publicationYear.val(),
                    "public": _self.checkboxes.public.is(':checked') ? 1 : 0,
                    "allow_aggregating": _self.checkboxes.allowAggregating.is(':checked') ? 1 : 0,
                    "Meme": _self.inputs.meme.val(),
                    "Print": _self.inputs.print.val(),
                    "Designs": _self.inputs.designs.val()
                }
            });
            return docData;
        };
        _self.disableEdit = function () {
            $('.doc-edit .disabled-overlay').css('display', 'block');
            $('.doc-edit .footer .edit').addClass('disabled');
        };
        _self.enableEdit = function () {
            $('.doc-edit .disabled-overlay').css('display', 'none');
            $('.doc-edit .footer .edit').removeClass('disabled');
        };
        _self.update = function update(e) {
            if ($(e.target).hasClass('disabled')) {
                return;
            }
            pageshare.basicModal.start({
                mainClass: "saving-doc",
                actionName: "save"
            });
            pageshare.basicModal.busy({
                title: "<span class='fa fa-spinner text-muted'></span>&nbsp;&nbsp;Saving document",
                message: " Please wait..."
            });
            var uLevel = 0,
                docData = _self.getEditData(),
                isOwner = Q.$exist(pageshare.currentUser.user_id) && Q.$exist(_self.doc.author_id) &&
                    Q.$stringEqual(_self.doc.author_id, pageshare.currentUser.user_id);
            setTimeout(function waitAnime() {

                if (Q.$booleanTrue(pageshare.currentUser.is_admin) ||
                    Q.$booleanTrue(isOwner)) {
                    pageshare.docServer.updateDocInfo({
                        docData: docData,
                        success: function (res) {
                            uLevel++;
                            refresh(uLevel);
                        },
                        fail: function (res) {
                            // console.error(res);
                        }
                    });
                    pageshare.docServer.saveDocMeta({
                        docData: docData,
                        success: function (res) {
                            uLevel++;
                            refresh(uLevel);
                        },
                        fail: function (res) {
                            // console.error(res);
                        }
                    });
                    pageshare.basicModal.stop();
                } else {
                    _self.releaseByForbiddenError();
                }

            }, 1000);
            //level acts like a gate
            function refresh(level) {
                if (Q.$numberExist(level) && level > 1) {
                    updateUI();
                    pageshare.docServer.refreshCache({
                        doc_id: 'doc-' + docData.getData().get('doc_id')
                    });
                }
            }
        };
        _self.releaseByForbiddenError = function relForbidden(title) {
            title = title || "Saving document failed";
            pageshare.basicModal.release({
                title: "<span class='fa fa-meh-o text-danger'>" +
                "</span><span class='text-danger'>&nbsp;&nbsp;" + title + "</span>",
                message: "Server rejected your request with status <strong class='text-warning'>404 Forbidden!</strong>" +
                "<br>Sorry, but you are not authorized for doing this action.",
                isInfo: true,
                cancelName: "Ok"
            });
        };
        _self.upgrade = function upgrade() {
            var upgraded_id = null, animeFrameTime = 1000;
            _self.currentLegacy = _self.doc;
            pageshare.basicModal.start({
                mainClass: "upgrade-progress",
                titleIcon: "fa fa-cube text-warning",
                title: "Upgrade",
                actionClass: "btn-primary",
                isInfo: true
            });
            pageshare.basicModal.busy({
                message: "<div class='upgrade-wait'>" +
                "<img src='assets/img/spining_dots.gif' style='width: 60px'/>" +
                " <strong class='tex-info'>Upgrading the document. Initializing new document...</strong>" +
                "</div>"
            });
            var docData = _self.getEditData(),
                legacy = _self.currentLegacy || {};
            if (legacy.file_url_pdf) {
                docData.append('pdf_path', legacy.file_url_pdf);
            }
            if (legacy.file_url_epub) {
                docData.append('epub_path', legacy.file_url_epub);
            }
            if (legacy.file_url_audio) {
                docData.append('audio_path', legacy.file_url_audio);
            }
            if (legacy.id) {
                docData.append('legacy_id', legacy.id);
            }
            setTimeout(function () {
                if (pageshare.currentUser.is_admin === true ||
                    pageshare.currentUser.user_id === _self.doc.author_id) {
                    pageshare.docServer.createDoc({
                        docData: docData,
                        success: function (res) {
                            setTimeout(function () {
                                pageshare.basicModal.busy({
                                    message: "<div class='upgrade-wait'>" +
                                    "<img src='assets/img/spining_dots.gif' style='width: 60px'/>" +
                                    " <strong class='tex-info'>Upgrading the document. Saving meta data...</strong>" +
                                    "</div>"
                                });
                                docData.append('doc_id', res.doc_id);
                                upgraded_id = res.doc_id;
                                window.editData = docData;
                                pageshare.docServer
                                    .saveDocMeta({
                                        docData: docData,
                                        success: function (res) {
                                            setTimeout(function () {
                                                pageshare.basicModal.busy({
                                                    message: "<div class='upgrade-wait'>" +
                                                    "<img src='assets/img/spining_dots.gif' style='width: 60px'/>" +
                                                    " <strong class='tex-info'>Upgrading the document. Copying files...</strong>" +
                                                    "</div>"
                                                });

                                                if (!upgraded_id) {
                                                    console.error('Failed to proceed with upgrade. No new document could be initialized!');
                                                    return;
                                                }
                                                pageshare.docServer
                                                    .upgradeLegacyFiles({
                                                        docData: docData,
                                                        success: function (res) {
                                                            setTimeout(function () {
                                                                pageshare.basicModal.busy({
                                                                    message: "<div class='upgrade-wait'>" +
                                                                    "<img src='assets/img/spining_dots.gif' style='width: 60px'/>" +
                                                                    " <strong class='tex-info'>Upgrading the document. Creating image files and scaling...</strong>" +
                                                                    "</div>"
                                                                });
                                                                pageshare.docServer.findDoc({
                                                                    doc_id: upgraded_id,
                                                                    success: function (doc) {
                                                                        _self.edit(doc);
                                                                        pageshare.currentDoc = doc;
                                                                        pageshare.basicModal.stop();
                                                                        pageshare.basicModal.start({
                                                                            mainClass: "upgrade-info",
                                                                            actionName: "Remove legacy",
                                                                            title: " Upgrade complete!",
                                                                            titleIcon: "fa fa-thumbs-o-up text-success",
                                                                            message: "Document upgrade completed successfully. " +
                                                                            " The legacy version of this document still exist in the system but no longer needed." +
                                                                            " Do you want to remove it?",
                                                                            action: function proceed_with_remove_legacy() {
                                                                                if (pageshare.docRemove) {
                                                                                    pageshare.docRemove.remove(_self.currentLegacy, function () {
                                                                                        pageshare.docEdit.edit(doc);
                                                                                    });
                                                                                }
                                                                            },
                                                                            cancelName: 'Keep it!'

                                                                        });
                                                                    },
                                                                    fail: function (res) {
                                                                        console.error('Upgrade failed \n' + res);
                                                                    }
                                                                });
                                                            }, animeFrameTime);

                                                        },
                                                        fail: function (res) {
                                                            console.error(res);
                                                        }
                                                    });
                                            }, animeFrameTime);

                                        },
                                        fail: function (res) {
                                            // console.error(res);
                                        }
                                    });

                            }, animeFrameTime);

                        },
                        fail: function (res) {
                            // console.error(res);
                        }
                    });
                } else {
                    _self.releaseByForbiddenError("Upgrading document failed!");
                }


            }, animeFrameTime);

        };


    }

    // window.pageshare = pageshare;
})(window, jQuery);


!(function (window, $) {
    var pageshare = window.pageshare || {},
        awr = window.awr || {},
        Q = awr.Q,
        docForm = new DocForm();
    pageshare.docForm = docForm;

    /**
     * TODO: make a separate module and move it under awr
     */
    function WorkingLog() {
        var self = this;

        function startTemplate(msg, subWork) {
            var cls = 'col-md-12 col-sm-12 col-xs-12';
            if (subWork === true) {
                cls = 'col-md-6 text-info col-md-offset-1 col-sm-offset-1 col-sm-8 col-xs-12';
            }
            return '<li class="fa fa-square-o pending ' + cls + '"> ' + msg + '...</li>';
        }

        function initLog() {
            $('#docWorkingLog').css('display', 'inline-block');
            $('#docWorkingLog').empty();
        }

        function initWork(msg, subWork) {
            var work = $(startTemplate(msg, subWork));
            $('#docWorkingLog').append(work);
            return {
                done: function (msg) {
                    $(work).removeClass('fa-square-o');
                    $(work).removeClass('fa-exclamation-triangle');
                    $(work).removeClass('pending');
                    $(work).removeClass('fail');
                    $(work).removeClass('text-info');
                    $(work).removeClass('text-danger');

                    $(work).addClass('fa-check-square-o');
                    $(work).addClass('done');
                    $(work).addClass('text-success');
                    if (msg && msg.length > 0) {
                        $(work).html(msg);
                    }

                },
                fail: function (msg) {
                    $(work).removeClass('fa-square-o');
                    $(work).removeClass('fa-check-square-o');
                    $(work).removeClass('pending');
                    $(work).removeClass('done');
                    $(work).removeClass('text-success');
                    $(work).removeClass('text-info');

                    $(work).addClass('fa-exclamation-triangle');
                    $(work).addClass('done');
                    $(work).addClass('text-danger');
                    if (msg && msg.length > 0) {
                        $(work).html(msg);
                    }

                }
            }
        }

        return {
            initLog: initLog,
            initWork: initWork
        }
    }

    /**
     * TODO: refactor this huge module to match with the common style used in the new modules
     * Huge module which is too complex a legacy quick solutions which
     * made at beginning for solving customer's urgent requirement about getting
     * fast some real improvements and seeing some new functionality
     * @returns {{
     * level1: (*|HTMLElement),
     * level2: (*|HTMLElement),
     * level3: (*|HTMLElement),
     * currentLevel: number,
     *  watchId: number,
     * init: init,
     * reset: (DocForm.reset|*),
     * restart: restart,
     * next: next,
     * back: back,
     * startUpload: startUpload,
     * setLevel: (DocForm.setLevel|*),
     * validate: (DocForm.validate|*),
     * noopLink:noopLink, start: start
     * }}
     * @constructor
     */
    function DocForm() {
        var _self = this;
        awr = window.awr || {};
        Q = awr.Q;
        function setBackToHomeLink() {
            var homeColl = [], link = null;
            if (Q.$arrayNotEmpty(pageshare.collections) && Q.$objectExist(pageshare.currentUser)) {
                homeColl = Q.$collect(pageshare.collections, function (collected) {
                    if (Q.$stringEqual(this.owner_id + '', pageshare.currentUser.main_collection + '')) {
                        return this;
                    }
                });
            }
            if (homeColl && homeColl.length) {
                link = "/app#c/" + ( Q.$objectExist(homeColl) ? homeColl.id : 'index');
            }
            if (pageshare.currentUploadCollectionId) {
                $('.to-home a').off('click');
                $('.to-home a').on('click', function (e) {
                    e.preventDefault();
                    awr.router.go("coll-index", {params: {cId: pageshare.currentUploadCollectionId}});
                });
            }
            return link;
        }

        _self.isAudioType = function (filename) {
            var types = ['mp3', 'ogg', 'flac', 'alac', 'wav', 'mp4', 'zip', 'gz', 'tar.gz',
                'wmv', 'mp4b', 'raw', 'm4b', 'spx', 'aac', 'vox', 'amr', '3ga', 'aa',
                'asx', 'efa', 'rma', 'orc', 'rmx', 'ima4', 'rmj', 'm2a', 'mp1', 'mp2', 'mpga', 'mg4'];
            for (var t in types) {
                if (filename.endsWith('.' + types[t]) || filename.endsWith('.' + types[t].toUpperCase())) {
                    return true;
                }
            }
            return false;
        };
        _self.showLevel1 = function showLevel1() {
            $(docForm.level1[0]).val(100);
            $(docForm.level2[0]).val(0);
            $(docForm.level3[0]).val(0);
            $("#docFrmMain .head").addClass("level-1");
            $("#docFrmMain .head").removeClass("level-2");
            $("#docFrmMain .head").removeClass("level-3");
            $("#docFrmMain .head").removeClass("level-4");
            $("#docFrmMain .content").addClass("level-1");
            $("#docFrmMain .content").removeClass("level-2");
            $("#docFrmMain .content").removeClass("level-3");
            $("#docFrmMain .content").removeClass("level-4");
            $("#docFrmMain #formGeneralTab").addClass("active");
            $("#docFrmMain #formUrlsTab").removeClass("active");
            $("#docFrmMain #formFilesTab").removeClass("active");
            $("h4.progress_level.level-badge").html("1 / 3");
        };
        _self.showLevel2 = function showLevel2() {
            $(docForm.level1[0]).val(100);
            $(docForm.level2[0]).val(100);
            $(docForm.level3[0]).val(0);
            $("#docFrmMain .head").addClass("level-2");
            $("#docFrmMain .head").removeClass("level-1");
            $("#docFrmMain .head").removeClass("level-3");
            $("#docFrmMain .head").removeClass("level-4");
            $("#docFrmMain .content").addClass("level-2");
            $("#docFrmMain .content").removeClass("level-1");
            $("#docFrmMain .content").removeClass("level-3");
            $("#docFrmMain .content").removeClass("level-4");
            $("#docFrmMain #formGeneralTab").removeClass("active");
            $("#docFrmMain #formUrlsTab").addClass("active");
            $("#docFrmMain #formFilesTab").removeClass("active");
            $("h4.progress_level.level-badge").html("2 / 3");
        };
        _self.showLevel3 = function showLevel3() {
            $(docForm.level1[0]).val(100);
            $(docForm.level2[0]).val(100);
            $(docForm.level3[0]).val(100);
            $("#docFrmMain .head").addClass("level-3");
            $("#docFrmMain .head").removeClass("level-1");
            $("#docFrmMain .head").removeClass("level-2");
            $("#docFrmMain .head").removeClass("level-4");
            $("#docFrmMain .content").addClass("level-3");
            $("#docFrmMain .content").removeClass("level-1");
            $("#docFrmMain .content").removeClass("level-2");
            $("#docFrmMain .content").removeClass("level-4");
            $("#docFrmMain #formGeneralTab").removeClass("active");
            $("#docFrmMain #formUrlsTab").removeClass("active");
            $("#docFrmMain #formFilesTab").addClass("active");
            $("h4.progress_level.level-badge").html("3 / 3");
            $("#pdf-select").fileinput({'showUpload': false, 'previewFileType': 'any'});
            $("#epub-select").fileinput({'showUpload': false, 'previewFileType': 'any'});
            $("#audio-select").fileinput({'showUpload': false, 'previewFileType': 'any'});
            $('#pdf-select').on('fileselect', function (event, numFiles, label) {
                if (numFiles > 1) {
                    alert("Only 1 pdf file is allowed to be uploaded at once");
                }
                if (!label.endsWith(".pdf")) {
                    alert("Only pdf files are allowed to be chosen here!");
                    $('.pdf-input button.fileinput-remove').trigger('click');
                    setTimeout(function () {
                        $('#pdf-select').fileinput('reset');
                    }, 200);
                }
                _self.validate("all");
            });
            $('#epub-select').on('fileselect', function (event, numFiles, label) {
                if (!(label.endsWith(".epub") || label.endsWith(".mobi"))) {
                    alert("Only ePub or mobi file formats are allowed to be chosen here!");
                    $('.epub-input button.fileinput-remove').trigger('click');
                    setTimeout(function () {
                        $('#epub-select').fileinput('reset');
                    }, 200);

                }
                _self.validate("all");
            });
            $('#audio-select').on('fileselect', function (event, numFiles, label) {
                if (!_self.isAudioType(label)) {

                    alert("Only audio / audio zip files are allowed to be chosen here!");
                    $('.audio-input button.fileinput-remove').trigger('click');
                    setTimeout(function () {
                        $('#audio-select').fileinput('reset');
                    }, 200);

                }
                _self.validate("all");
            });
        };
        _self.initUploadView = function () {
            $('.doc-form .collection-name select#shelfSelect')
                .attr('disabled', 'disabled');
            $(docForm.level1[0]).val(100);
            $(docForm.level2[0]).val(100);
            $(docForm.level3[0]).val(100);
            $("#docFrmMain .head").addClass("level-4");
            $("#docFrmMain .head").removeClass("level-1");
            $("#docFrmMain .head").removeClass("level-2");
            $("#docFrmMain .head").removeClass("level-3");
            $("#docFrmMain .content").addClass("level-4");
            $("#docFrmMain .content").removeClass("level-1");
            $("#docFrmMain .content").removeClass("level-2");
            $("#docFrmMain .content").removeClass("level-3");
            $("#docFrmMain #formGeneralTab").removeClass("active");
            $("#docFrmMain #formUrlsTab").removeClass("active");
            $("#docFrmMain #formFilesTab").removeClass("active");
            $("h4.progress_level.level-badge").html("3 / 3");

        };
        _self.activateSuccessView = function () {

            $('#docFrmMain .content.level-4 .working').css('display', 'none');
            $('#docFrmMain .content.level-4 .failed').css('display', 'none');
            $('#docFrmMain .content.level-4 .success').css('display', 'block');
            setBackToHomeLink();
        };
        _self.activateFailedView = function () {
            $('#docFrmMain .content.level-4 .working').css('display', 'none');
            $('#docFrmMain .content.level-4 .failed').css('display', 'block');
            $('#docFrmMain .content.level-4 .success').css('display', 'none');
            setBackToHomeLink();

        };
        _self.activateWorkingView = function () {
            $('#docFrmMain .content.level-4 .working').css('display', 'block');
            $('#docFrmMain .content.level-4 .failed').css('display', 'none');
            $('#docFrmMain .content.level-4 .success').css('display', 'none');

        };
        _self.getFileInputs = function () {
            function getFilePlugin(key) {
                key = key.replace('.', '').replace('#', '');
                var elem_key = '', plugin_key = '';
                if (key === "pdf" || key === "pdf-select" || key === "pdf-input") {
                    elem_key = '.pdf-input';
                    plugin_key = '#pdf-select';
                }
                if (key === "epub" || key === "epub-select" || key === "epub-input") {
                    elem_key = '.epub-input';
                    plugin_key = '#epub-select';
                }
                if (key === "audio" || key === "audio-select" || key === "audio-input") {
                    elem_key = '.audio-input';
                    plugin_key = '#audio-select';
                }
                var plugin_elem = $(elem_key);


                return {
                    plugin: function () {
                        return $(plugin_key).fileinput();
                    },
                    remove: function () {
                        try {
                            $(plugin_elem).find("button.fileinput-remove")
                                .trigger('click');
                            $(plugin_key).fileinput('clear');
                        } catch (e) {
                            console.info("docForm: [warning] " + e);
                        }

                    }
                }
            }

            return {
                pdfInput: getFilePlugin,
                epubInput: getFilePlugin,
                audioInput: getFilePlugin,
                get: getFilePlugin
            }
        };
        _self.startUpload = function startUpload() {
            var authors = _self.tags.authors,
                currentCollId = Q.$objectExist(pageshare.currentCollection) ?
                    pageshare.currentCollection.id : null,
                languages = _self.tags.languages,
                categories = _self.tags.categories;
            var docData = new pageshare.DocData({
                    dataGroupType: "form",
                    dataElement: '.doc-form form',
                    appends: {
                        "Authors": authors.getTags,
                        "Languages": languages.getTags,
                        "Categories": categories.getTags
                    }
                }),
                server = pageshare.docServer;

            // window.docData = docData;
            var workingLog = new WorkingLog();
            workingLog.initLog();
            if (!docData.isValid()) {
                console.error("docForm: [Error] : The form is not valid. Aborting upload process!");
                return;
            }
            _self.initUploadView();
            _self.activateWorkingView();
            var connWork = workingLog.initWork(" Connecting to Server..."),
                initWork = workingLog.initWork(" Initializing new Document...");
            server.createDoc({
                docData: docData,
                success: function (res) {
                    connWork.done(" Connecting to Server.");
                    initWork.done(" Initializing new Document.");
                    var metaWork = workingLog.initWork(" Sending meta data to server..");
                    var doc_id = res.doc_id;
                    docData.append("doc_id", doc_id);
                    server.saveDocMeta({
                        docData: docData,
                        success: function (res) {
                            metaWork.done(" Sending meta data to server.");
                            var filesGroup = server.buildFilesGroup(docData, _self.getFileInputs()),
                                start_index = 0;
                            var groupUploadWork = workingLog.initWork(" Uploading Files");
                            server.uploadFiles({
                                files: filesGroup.files,
                                u_index: start_index,
                                doc_id: doc_id,
                                clean: filesGroup.clean,
                                cleanAll: filesGroup.cleanAll,
                                uploadUrl: filesGroup.uploadUrl,
                                success: function (res) {
                                    //per file success
                                    var fileWork = workingLog.initWork(" File [" +
                                        res.file_name + "] uploaded.", true);
                                    fileWork.done();
                                },
                                fail: function (err) {
                                    //per file fail
                                    // "Failed on uploads files"

                                },
                                complete: function (res) {
                                    if (res && res.isSuccess === true) {
                                        pageshare.collServer.findAllCollections(function (colls) {
                                            pageshare.mainMenu.reload();
                                            if (Q.$exist(currentCollId)) {
                                                pageshare.currentCollection = Q.$collect(colls, function (collected) {
                                                    if (Q.$stringEqual(this.id + '', currentCollId + '')) {
                                                        collected = this;
                                                    }
                                                    return collected;
                                                });
                                            }
                                            pageshare.shelfCtrl.reload();
                                            _self.activateSuccessView();
                                            var suc_msg = filesGroup.files.length > 1 ? " " + filesGroup.files.length +
                                                " files uploaded successfully." : " Upload job finished successfully";
                                            groupUploadWork.done(suc_msg);
                                        }, function () {
                                            _self.activateSuccessView();
                                            var suc_msg = filesGroup.files.length > 1 ? " " + filesGroup.files.length +
                                                " files uploaded successfully." : " Upload job finished successfully";
                                            groupUploadWork.done(suc_msg);
                                        });

                                    }
                                    if (Q.$objectExist(res) && Q.$booleanFalse(res.isSuccess)) {
                                        _self.activateFailedView();
                                        groupUploadWork.fail(" Upload failed!");
                                        _self.activateFailedView();
                                    }

                                }
                            });

                        }, fail: function (err) {
                            // "Failed on save Meta data for DOC"
                            _self.activateFailedView();
                            metaWork.fail(" Failed on sending meta data.");
                        }
                    });

                }, fail: function (err) {

                    // "Failed on init new DOC"
                    _self.activateFailedView();
                    connWork.done(" Failed on Connecting to Server.");
                    initWork.done(" Failed on initializing new Document.");

                }
            });


        };
        _self.setLevel = function setLevel(level) {
            $("#pDocLevel1").ready(function () {
                var docForm = window.pageshare.docForm;
                if (level > 3 || level < 1) {
                    level = 1;
                }
                if (level === 1) {
                    _self.showLevel1();
                } else if (level === 2) {
                    _self.showLevel2();
                } else if (level === 3) {
                    _self.showLevel3();
                }
                docForm.currentLevel = level;
            });
        };
        _self.validate = function (level) {
            var errs = [], lv1_has_err = false,
                authors = _self.tags.authors,
                languages = _self.tags.languages,
                categories = _self.tags.categories;
            var docData = pageshare.DocData({
                    dataGroupType: "form",
                    dataElement: $('.doc-form form')[0],
                    appends: {
                        "Authors": authors.getTags,
                        "Languages": languages.getTags,
                        "Categories": categories.getTags

                    }
                }),
                validation = docData.validate(),
                isValid = docData.isValid();
            // window.docData = docData;
            if (isValid) {
                $('ul.error-list li').remove();
                $('ul.error-list').removeClass('has-error');
                $('.doc-form input[name="book_name"]').parent().find('.field-head .notif').removeClass("not-valid");
                $('.doc-form input[name="Authors"]').parent().find('.field-head .notif').removeClass("not-valid");
                return [];
            } else {
                if (level === "all" || level > 0) {
                    if (!validation.hasDocName) {
                        $('.doc-form input[name="book_name"]').parent().find('.field-head .notif').addClass("not-valid");
                        errs.push(validation.warnings["doc_name"]);
                        lv1_has_err = true;
                    } else {
                        $('.doc-form input[name="book_name"]').parent().find('.field-head .notif').removeClass("not-valid");
                    }
                    if (!validation.hasAuthors) {
                        $('.doc-form input[name="Authors"]').parent().find('.field-head .notif').addClass("not-valid");
                        errs.push(validation.warnings["authors"]);
                        lv1_has_err = true;
                    } else {
                        $('.doc-form input[name="Authors"]').parent().find('.field-head .notif').removeClass("not-valid");
                    }
                    if (lv1_has_err) {
                        $(".doc-form #formGeneralTab").addClass("not-valid");
                    } else {
                        $(".doc-form #formGeneralTab").removeClass("not-valid");
                    }
                }
            }
            if (level === "all" || level >= 3) {
                if (validation.filesCount < 1) {
                    $(".doc-form #formFilesTab").addClass("not-valid");
                    errs.push(validation.warnings["files"]);
                } else {
                    $(".doc-form #formFilesTab").removeClass("not-valid");
                }
            }
            $('ul.error-list li').remove();
            $('ul.error-list').removeClass('has-error');
            if (errs.length > 0) {
                $('ul.error-list').addClass('has-error');
                for (var e in errs) {
                    var newEr = $('<li> <span class="notif text-danger fa fa-exclamation-triangle pull-left"> ' + errs[e] + '</span></li>');
                    $('ul.error-list').append(newEr);
                }
            }

            return errs;
        };
        _self.initShelfOptions = function initSelect() {
            /**
             * tricky but works well for now,
             * this script is initiated by legacy server response and
             * therefore the below trick will let us to wait for SPA variables be
             * initiated correctly before starting to filter collections and define some new vars for
             * later back to home redirection. Refactor this if you have time!
             */
            if (!pageshare.currentUser && pageshare.docForm.initShelf !== true) {
                setTimeout(function () {
                    pageshare.docForm.initShelf = true;
                    _self.initShelfOptions();
                }, 1000);
                return;
            }
            var all_collections = [],
                shelf = pageshare.currentCollection;
            if (pageshare.collections) {
                all_collections = $.grep(pageshare.collections, function (n, i) {
                    return pageshare.currentUser && n.owner_id + '' === pageshare.currentUser.user_id;
                });
            }
            for (var next in all_collections) {
                var nxtShelf = all_collections[next];
                if (nxtShelf.id !== shelf.id) {
                    $('#shelfSelect').append('<option value="' + nxtShelf.id + '">' + nxtShelf.name + '</option>');
                }
            }
            pageshare.currentUploadCollectionId = $('input[name="shelf_id"]').val();
            $('#shelfSelect').on('change', function (event) {
                $('input[name="shelf_id"]').val($(this).val());
                pageshare.docForm.shelfId = $(this).val();
                pageshare.currentUploadCollectionId = $(this).val();
            });
        };
        _self.watchForm = function watchForm() {
            var docForm = pageshare.docForm;
            if (!docForm) {
                return;
            }
            if (docForm.watchId != -1) {
                clearInterval(docForm.watchId);
            }
            var wId = setInterval(function () {
                docForm.watchId = wId;
                //fixing the modal problem
                //moving the modal out of its parent will fix the z-index problem
                if ($('.doc-form-section #kvFileinputModal').length > 0) {
                    $('.doc-form-section #kvFileinputModal').appendTo('body');

                }
                if (docForm.currentLevel > 0 && docForm.currentLevel < 4) {
                    var errs = _self.validate(docForm.currentLevel);
                    if (errs.length > 0) {
                        $('.doc-form button.upload').addClass('disabled');
                    } else {
                        $('.doc-form button.upload').removeClass('disabled');
                    }
                }
            }, 500);


        };
        _self.reset = function () {
            $('.doc-form .collection-name select#shelfSelect').removeAttr('disabled');
            $('.doc-form input[type="text"]').val('');
            // $('.doc-form input[type="checkbox"]').val('1');
            $('.doc-form input[type="checkbox"]').attr('checked', '1');
            $('#docWorkingLog').css('display', 'none');
            try {
                $('.pdf-input button.fileinput-remove').trigger('click');
                $('.epub-input button.fileinput-remove').trigger('click');
                $('.audio-input button.fileinput-remove').trigger('click');
                $('#pdf-select').fileinput('reset');
                $('#epub-select').fileinput('reset');
                $('#audio-select').fileinput('reset');
            } catch (e) {

            }
        };

        function setupTagFields() {
            _self.tags = {};
            if (awr.ux) {
                _self.tags.authors = awr.ux.tagField('.doc-form #authorsField', {
                    capitalize: true,
                    placeholder: 'Enter an author name',
                    tags: [],
                    onSearch: function (query, onResult) {
                        var res = pageshare.docServer.searchInMeta("Authors", query);
                        if (query.length < 1) {
                            res = [];
                        }
                        if (typeof onResult === "function") {
                            onResult(res);
                        }
                    }
                });
                _self.tags.languages = awr.ux.tagField('.doc-form #langsField', {
                    capitalize: true,
                    placeholder: 'Enter a Language name',
                    tags: [],
                    onSearch: function (query, onResult) {
                        var res = pageshare.docServer.searchInMeta("Languages", query);
                        if (query.length < 1) {
                            res = [];
                        }
                        if (typeof onResult === "function") {
                            onResult(res);
                        }
                    }
                });
                _self.tags.categories = awr.ux.tagField('.doc-form #categsField', {
                    capitalize: true,
                    placeholder: 'Enter a category name',
                    tags: [],
                    onSearch: function (query, onResult) {
                        var res = pageshare.docServer.searchInMeta("Categories", query);
                        if (query.length < 1) {
                            res = [];
                        }
                        if (typeof onResult === "function") {
                            onResult(res);
                        }
                    }
                });
            }
        }

        return {
            level1: $(_self.lev1),
            level2: $(_self.lev2),
            level3: $(_self.lev3),
            currentLevel: 0,
            watchId: -1,
            init: function () {
                $(".doc-form").ready(function () {
                    var docForm = pageshare.docForm;
                    docForm.reset();
                    docForm.level1 = $('#pDocLevel1');
                    docForm.level2 = $('#pDocLevel2');
                    docForm.level3 = $('#pDocLevel3');
                    _self.setLevel(1);
                    _self.initShelfOptions();
                    setupTagFields();
                    $(".doc-form").slideDown('fast');
                    if (!Q.$stringEqual($('body').attr('id'), 'premium')) {
                        pageshare.shelfCtrl.open();
                    }

                });
            },
            reset: _self.reset,
            restart: function () {
                pageshare.docServer.initMetaDataDB();
                pageshare.docForm.init();
            },
            next: function () {
                var docForm = pageshare.docForm;
                _self.validate(docForm.currentLevel);
                docForm.currentLevel++;
                _self.setLevel(docForm.currentLevel);
                _self.watchForm();
            },
            back: function () {
                var docForm = pageshare.docForm;
                _self.validate(docForm.currentLevel);
                docForm.currentLevel--;
                _self.setLevel(docForm.currentLevel);
                _self.watchForm();
            },
            startUpload: function () {
                var errs = _self.validate("all");
                if (errs.length < 1) {
                    var docForm = pageshare.docForm;
                    clearInterval(docForm.watchId);
                    _self.startUpload();
                }
            },
            setLevel: _self.setLevel,
            validate: _self.validate,
            noopLink: function (event) {
                event.preventDefault();
            },
            /**
             * TODO: make this better
             * a quick solution to get ride of old doc.php file which rendered
             * and called docForm. At that time it was the only possible way to add anything new
             * to the existing structure. Now the implemented SPA for front allows much nicer design
             * for this and whole module in general
             */
            start: function (cId) {
                pageshare = window.pageshare || {};
                awr = window.awr || {};
                Q = awr.Q;
                $('#ajax-content').html("<div id='docFrmMain' class=''></div>");
                pageshare.allShelves = pageshare.collections;
                pageshare.preChosenShelf = pageshare.currentCollection;
                var years = [];
                for (var y = new Date().getFullYear(); y >= 1800; y--) {
                    years.push({value: y, selected: y === new Date().getFullYear() ? 'selected' : ''});
                }
                if (!Q.$objectExist(pageshare.currentCollection)) {
                    pageshare.collServer.loadAsCurrentCollection(cId, function onScc(current) {
                        proceedWithStart(current);
                    }, function onErr() {

                    });
                } else {
                    proceedWithStart(pageshare.currentCollection);
                }


                function proceedWithStart(currentColl) {
                    var context = {
                        title: "Add to collection: ",
                        shelf: {
                            id: currentColl.id,
                            name: currentColl.name
                        },
                        document: {},
                        years: years
                    };

                    if (typeof jQuery === "undefined") {
                        setTimeout(initDocForm, 500);
                    }
                    else {
                        initDocForm();
                    }
                    function initDocForm() {
                        var newDocTmp = Pageshare.Templates['assets/modules/docForm/docForm.hbs'];
                        var rendered = $(newDocTmp(context));
                        $("#docFrmMain").html(rendered);
                        $("#docFrmMain .doc-form").ready(function () {
                            window.docForm = pageshare.docForm;
                            pageshare.docForm.init();
                        });
                        if (pageshare.UI.compile) {
                            pageshare.UI.compile();
                            pageshare.UI.setDefaultEventHandlers();
                        }
                    }
                }

            }

        };
    }

    window.dummySend = dummySend;

    window.addDummyValues = addDummyValues;

    function dummySend() {
        var formData = new FormData($('form')[0]);
        $.ajax({
            url: $($('form')[0]).attr('action'),
            type: 'POST',
            data: formData,
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                console.log(data);
            },
            error: function (err) {
                console.log("error in ajax form submission");
                console.log(err);
            }
        });
    }

    function addDummyValues() {
        $("input").each(function () {
            if ($(this).attr('name') === "book_name") {
                $(this).val('Best audio file');
            }
            if ($(this).attr('name') === "Authors") {
                $(this).val('Some Author');
            }
            if ($(this).attr('name') === "Designs") {
                $(this).val('http://somelink.com/designs');
            }
            if ($(this).attr('name') === "Print") {
                $(this).val('http://somelink.com/prints');
            }
            if ($(this).attr('name') === "Meme") {
                $(this).val('http://somelink.com/meme');
            }
            if ($(this).attr('name') === "pub_year") {
                $(this).val('2016');
            }
            if ($(this).attr('name') === "Languages") {
                $(this).val('English');
            }
            if ($(this).attr('name') === "public") {
                $(this).attr('checked', '1');
                $(this).val('1');
            }
            if ($(this).attr('name') === "allow_aggregating") {
                $(this).attr('checked', '1');
                $(this).val('1');
            }
        });
        setTimeout(function () {
            var authorTagField = $('#authorsField input[type="text"]');
            $(authorTagField).val('Qoli Guy');
            var e = $.Event('keypress');
            e.which = 13; //
            $(authorTagField).trigger(e);
        }, 500);
    }

    // window.workingLog = new WorkingLog();

})(window, jQuery);
!(function (window, $) {
    var pageshare = window.pageshare || {},
        awr = window.awr || {},
        Q = awr.Q;
    var docReader = new DocReader();
    pageshare.docReader = docReader;

    function DocReader() {
        awr = window.awr || {};
        Q = awr.Q;
        Q.$waitForComps({name: 'awr.imgCache', type: 'object'}).then(function onImgCacheReady() {
            awr.imgCache.initCache();
            awr.imgCache.createGroup('single-pages');
        }, function onTimeOutErr(err) {

        });

        var _self = this;
        /* Support for image loading placeholders */
        var placeHolder = (function () {
            var placeholders = {};
            var svgSupport = !!document.createElementNS &&
                !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;
            var canvas = document.createElement('canvas');
            var canvasSupport = canvas.getContext &&
                canvas.toDataURL('image/png').indexOf('data:image/png') != -1;

            if (svgSupport) {
                var svg = Handlebars.compile('<?xml version="1.0" standalone="no"?>' +
                    '<svg width="{{w}}" height="{{h}}" viewBox="0 0 {{w}} {{h}}" ' +
                    'xmlns="http://www.w3.org/2000/svg" version="1.1"><text font-size="30" ' +
                    'font-family="Open Sans" y="60"><tspan x="{{m}}" text-anchor="middle">Loading...</tspan></text></svg>');

                return function placeHolder(img) {
                    var w = img.width,
                        h = img.height,
                        key = w + "x" + h;
                    if (!placeholders[key]) {
                        placeholders[key] = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg({
                                w: w,
                                h: h,
                                m: w / 2
                            }));
                    }
                    return placeholders[key];
                };

            } else if (canvasSupport) {
                var ctx = canvas.getContext ? canvas.getContext('2d') : {};

                return function placeHolder(img) {

                    var w = img.width;
                    var h = img.height;
                    var key = w + "x" + h;

                    if (!placeholders[key]) {
                        canvas.width = w;
                        canvas.height = h;
                        ctx.fillStyle = 'transparent';
                        ctx.fillRect(0, 0, w, h);
                        ctx.font = "30px Open Sans";
                        ctx.fillStyle = 'black';
                        ctx.textAlign = 'center';
                        ctx.fillText("Loading...", w / 2, 60);
                        placeholders[key] = canvas.toDataURL('image/png');
                    }
                    return placeholders[key];
                };
            } else {
                var empty = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                return function () {
                    return empty;
                };
            }
        })();
        var docTemplate = Pageshare.Templates['assets/modules/docReader/doc_pages.hbs'];
        var base_url = {base_url: $('link[rel="top"]').attr('href')};
        $(document).on('shelf:bookClosing', function (event, bookId) {
            _self.clearDocInfoUI();
        });
        $(document).on('shelf:bookOpened', function (event, bookId, data) {
            _self.buildDocInfoUI(data);
        });
        function clearDocInfoUI() {
            var brand = $('#mainlogo');
            var container = $('#book_info');
            brand.find('.text').text('PageShare');
            container.empty();
            $("body").removeClass("has_book_info book_info_open");
        }

        function buildDocInfoUI(data) {
            data = data || {};
            data.book = data.book || {
                    name: 'nullBook'
                };
            if ($('body').attr('id') === "premium") {
                return;
            }
            if (!Q.$objectExist(data)) {
                return;
            }
            $('#mainlogo .arrows').removeClass('hidden');

            data.editable = Q.$stringEqual('editable', data.editable) ? true : data.editable;
            data.collections = Q.$arrayNotEmpty(data.collections) && Q.$exist(data.collections[0])
                ? data.collections : [];

            var brand = $('#mainlogo'),
                legacyCollId = Q.$stringExist(data.shelf_id) || Q.$numberExist(data.shelf_id) ? data.shelf_id + '' :
                    Q.$stringExist(data.book.shelf_id) || Q.$numberExist(data.book.shelf_id) ?
                        data.book.shelf_id + '' : null,
                origCollId = Q.$stringExist(data.original_collection) ||
                Q.$numberExist(data.original_collection) ? data.original_collection + '' :
                    Q.$objectExist(data.book) && Q.$stringExist(data.book.original_collection) ||
                    Q.$numberExist(data.book.original_collection) ?
                        data.book.original_collection + '' : null,
                collIds = Q.$map(data.collections, function () {
                    return this.id + '';
                }),
                legacyColl = Q.$stringExist(legacyCollId) ? Q.$collect(pageshare.collections, function (collected) {
                    if (Q.$stringEqual(this.id + '', legacyCollId)) {
                        return this;
                    }
                }) : null,
                origColl = Q.$stringExist(origCollId) ?
                    Q.$collect(pageshare.collections, function (collected) {
                        if (Q.$stringEqual(this.id + '', origCollId)) {
                            return this;
                        }
                    }) : null,
                container = $('#book_info'),
                infoTemplate = Pageshare.Templates['assets/modules/docReader/doc_info.hbs'];


            brand.find('.text').text(data.book.book_name);
            if (Q.$objectExist(origColl) && !Q.$setContainsString(collIds, origColl.id + '')) {
                data.collections.push(origColl);
                collIds.push(origColl.id + '');
            }
            if (Q.$objectExist(legacyColl) && !Q.$setContainsString(collIds, legacyColl.id + '')) {
                data.collections.push(legacyColl);
                collIds.push(legacyColl.id + '');
            }
            var book = Q.$objectExist(data.book) ? data.book : data;
            data.edit_id = Q.$stringExist(book.doc_id) ? 'doc-' + book.doc_id :
                Q.$or(Q.$stringExist(book.id), Q.$numberExist(book.id)) ? book.id : '';
            data.id = data.edit_id;
            if (Q.$objectExist(data.book)) {
                data.id = data.edit_id;
            }
            Q.$waitForComps({
                name: 'pageshare.bookInfoDom',
                type: 'object'
            }).then(function onScc() {
                var rendered = $(infoTemplate(data));
                container = $('#mainHeaderContainer #book_info');
                $(container).html($(rendered));
                $(container).removeClass('hidden');
                $("body").addClass("has_book_info");

            }, function onErr(err) {
                console.error('docReader@Pageshare: Failed to load book info. Framework wait timeout interrupted the dom compile.' +
                    '\n\t + Details: Header components could not ' +
                    'be detected before the maximum allowed wait. ');
            });

        }

        function buildDirectLink(docData) {
            var docId = docData.book.id,
                name = docData.book.book_name.split(" ").join("_").toLowerCase(),
                isDoc = docId.startsWith('doc-') || docId.startsWith('d'),
                prefix = Q.$booleanTrue(isDoc) ? '/app#share/' : '/app#share/legacy/';
            name = name.replace(/[\?\!\#\.\/\&\=]/g, '');
            docId = Q.$booleanTrue(isDoc) ? docId.replace('doc-', '').replace('d', '') : docId;
            return window.location.origin + prefix + name + '/' + docId;
        }

        function buildDirectLinkLabel(docData) {
            var link = buildDirectLink(docData);
            if (link.length > 50) {
                return link.substring(0, 30) + "..." + link.substring(link.length - 20);
            }
            return link;
        }

        function getCleanDocId(dId, doc_data) {
            var docId = dId;
            if (Q.$objectExist(doc_data) && Q.$objectExist(doc_data.book) && Q.$booleanFalse(doc_data.book.id.startsWith('d') || doc_data.book.id.startsWith('doc-'))) {
                docId = Q.$stringExist(doc_data.book.id + '') ? doc_data.book.id + '' : docId;
            }
            docId = Q.$stringExist(docId) && docId.startsWith('d') && !docId.startsWith('doc-') ? 'doc-' + docId.replace('d', '') : docId;
            return docId;
        }

        function buildReadUI(dId, doc_data, container) {
            if (!Q.$or(isUserAdmin(), isDocVisible(doc_data))) {
                pageshare.UI.showNotFound();
                return;
            }

            var context, rendered, docId = getCleanDocId(dId);
            if (container && $(container).length > 0) {
                container = $(container);
            } else {
                container = $('#ajax-content');
            }
            pageshare.currentView = {
                id: "doc-reader-" + docId,
                name: "doc-reader"
            };
            window.calls = window.calls || {};
            window.calls[docId] = null;
            pageshare = window.pageshare || {};
            if (!doc_data.book) {
                return;
            }
            doc_data.editable = pageshare.currentUser ? 'editable' : '';
            doc_data.direct_link = buildDirectLink(doc_data);
            doc_data.direct_link_label = buildDirectLinkLabel(doc_data);
            doc_data.edit_link = "#edit/" + docId + "?view=open";

            context = $.extend(doc_data, base_url);
            context.url_links = getDocURLAttributes(doc_data);
            rendered = $(docTemplate(context));
            rendered.find('img').each(function () {
                this.src = placeHolder(this);
            });
            $(container).html(rendered);
            var nxtImg,
                nxtOrigImg,
                nxtImgSrc,
                images = $(container).find('.single-page img');
            if (Q.$objectExist(awr.imgCache)) {
                images = Q.$reduce(images, function () {
                    nxtImgSrc = $(this).data('original');
                    if (Q.$stringExist(nxtImgSrc) && !awr.imgCache.inCache('single-pages', nxtImgSrc)) {
                        awr.imgCache.addToGroup('single-pages', nxtImgSrc);
                    } else {
                        //place holder is function here
                        nxtImg = Q.$stringExist(nxtImgSrc) ? awr.imgCache.getImg('single-pages', nxtImgSrc, {
                            placeHolder: placeHolder,
                            width: Q.$numberExist($(nxtOrigImg).attr('width')) ? $(nxtOrigImg).attr('width') : $(window).width(),
                            height: Q.$numberExist($(nxtOrigImg).attr('height')) ? $(nxtOrigImg).attr('height') : $(window).height() * 2
                        }) : null;
                        nxtOrigImg = $(container).find('.single-page img[data-original="' + nxtImgSrc + '"]');
                        if (Q.$arrayNotEmpty(nxtOrigImg) && Q.$objectExist(nxtImg)) {
                            // nxtImg = getImgWithPlaceHolder(nxtImg,placeHolder);
                            $(nxtImg).addClass('img-responsive');
                            // $(nxtImg).attr('width', $(nxtOrigImg).attr('width'));
                            // $(nxtImg).attr('height', $(nxtOrigImg).attr('height'));
                            // $(nxtImg).attr('data-original', $(nxtOrigImg).attr('data-original'));
                            $(nxtOrigImg).replaceWith(nxtImg);
                            // console.log('II: from cache for page img: ' + nxtImgSrc);
                            return false;
                        }
                    }
                    return true;
                });
            }
            //we use lazyload for not yet cached pages
            $(images).lazyload({threshold: $(window).height() * 5});
            $(container).find('.single-page:visible:first .page-share').addClass('open');
            $(container).find('.single-page').on('click', function toggleTools(event) {
                var target = event.currentTarget,
                    tools = $(target).find('.tools');
                if ($(tools).hasClass('on')) {
                    $(tools).removeClass('on');
                    $(tools).addClass('off');
                } else {
                    $(tools).addClass('on');
                    $(tools).removeClass('off');
                }
            });
            pageshare.UI.setDefaultEventHandlers();
        }

        function isUserAdmin() {
            return Q.$objectExist(pageshare.currentUser) && Q.$booleanTrue(pageshare.currentUser.is_admin);
        }

        function isDocVisible(doc) {
            return pageshare.docServer.isDocVisible(doc);
        }


        function getDocURLAttributes(doc_data) {
            var bookURLS = Q.$objectExist(doc_data) && Q.$objectExist(doc_data.book) &&
            Q.$exist(doc_data.book.attributes) && Q.$exist(doc_data.book.attributes.url) ? doc_data.book.attributes.url : null;
            if (!Q.$objectExist(bookURLS)) {
                return {
                    // Meme: [{value:'-'}],
                    // Print: [{value:'-'}],
                    // Designs:[{value:'-'}]
                };
            }
            return {
                Meme: bookURLS.Meme,
                Print: bookURLS.Print,
                Designs: bookURLS.Designs
            };
            // urls.push({name:});
        }

        function openDoc(docId, complete, fail, args) {
            var badDocId = !Q.$exist(docId) || docId <= 0 || Q.$setContainsString(['0', '-1', 'null'], docId);
            if (badDocId) {
                console.error('openDoc@Reader@Pageshare: Bad document id [ ' + docId + ' ]. Aborting.');
                return;
            }
            args = args || {};
            // startingPage = startingPage || 1;
            var currentDocId = pageshare.currentDoc ? pageshare.currentDoc.book.id : null;
            if (currentDocId !== docId) {
                $(document).trigger('shelf:bookClosing', [currentDocId]);
            }
            $("#shelf .cover").each(function () {
                $(this).toggleClass('selected', $(this).data('book-id') == docId);
            });
            $("#ajax-content").empty();
            // $(document).trigger('shelf:bookOpening', [docId]);
            _self.getDoc(docId, function (doc_data) {
                if (!doc_data) {
                    console.error('getDoc@Reader: no doc data for id [' + docId + ']. Aborting.');
                    return;
                }
                if (!pageshare.currentUser) {
                    var book = doc_data.book;
                    if (book.public === "0") {
                        awr.router.goToRoot();
                        return;
                    }
                }
                setTimeout(function () {
                    _self.buildDocInfoUI(doc_data);
                    Q.$waitForComps({
                        name: 'pageshare.bookInfoDom',
                        type: 'object'
                    }).then(function () {
                        setTimeout(function () {
                            awr.domAttrs.$compile($('#book_info'), {router: awr.router});
                        }, 700);
                    }, function onTimeErr(timeErr) {
                        //do nothing here
                    });
                    _self.buildReadUI(docId, doc_data, $('#ajax-content'));
                    if (Q.$objectExist(awr.domAttrs)) {
                        awr.domAttrs.$compile($('#ajax-content'), {router: awr.router});
                    }
                    if (Q.$booleanTrue(doc_data.book.isBusy)) {
                        watchBusy(docId, function ready() {
                            _self.openDoc(docId, function onDocOpenScc(doc) {
                            }, function onDocOpenErr() {

                            });
                        });
                    }
                    try {
                        if (Q.$arrayNotEmpty(pageshare.collections)) {
                            var coll_matches = $.grep(pageshare.collections, function (n, i) {
                                var book = doc_data.book;
                                return book.shelf_id === n.id;
                            });
                            pageshare.currentCollection = coll_matches[0] || {};
                        }
                        pageshare.currentDoc = doc_data;
                        pageshare.UI.compile();
                    } catch (e) {
                        awr.errorLog("openDoc@docReader@app",
                            "UI compile failed for UI.compile@openDoc@docReader", e);
                    }
                    if (typeof complete === "function") {
                        complete(doc_data);
                    }
                }, 500);
            }, fail);
        }

        function openPreview(opts) {
            opts = opts || {};
            var docId = opts.docId || 0,
                complete = opts.complete || null,
                fail = opts.fail || null,
                previewElem = $('<div class="doc-preview-instance"></div>');
            _self.getDoc(docId, function (doc_data) {
                docId = docId + '';
                docId = (docId.startsWith('doc-') || docId.startsWith('d')) ? 'doc-' + docId.replace('doc-', '').replace('d', '') : docId;
                _self.buildReadUI(docId, doc_data, $(previewElem));
                if (typeof doc_data.book.isBusy !== 'undefined' &&
                    doc_data.book.isBusy === true) {
                    watchBusy(docId, function ready() {
                        _self.buildReadUI(docId, doc_data, $(previewElem));
                    });
                }
                pageshare.UI.compile(true);
                pageshare.currentDoc = doc_data;
                if (typeof complete === "function") {
                    complete($(previewElem));
                }
            }, fail);

        }

        function goToPage(pageNum) {
            var currentDoc = pageshare.currentDoc || null;
            if (!currentDoc || !currentDoc.book || isNaN(parseInt(pageNum))) {
                return;
            }
            var num = parseInt(pageNum), pages = $('#ajax-content').find('.single-page');
            if (num > pages.length || num < 1) {
                return;
            }
            // num = pages.length - 1;

            var previousPages = $.grep(pages, function (n, i) {
                if ($(n).data('page-number') < num) {
                    $(n).addClass('close');
                }
                if ($(n).data('page-number') >= num) {
                    $(n).removeClass('close');
                }
                return $(n).data('page-number') < num;
            });
            if (previousPages.length > 0) {
                var openPre = $("<div class='pre-open'>Load previous pages</div>");
                $(openPre).on('click', function reopen() {
                    var currentOpenPages = $.grep($('.single-page'), function (n, i) {
                        return !$(n).hasClass('close');
                    });
                    _self.goToPage(1);
                    setTimeout(function () {
                        window.scrollTo(0, $(currentOpenPages[0]).position().top);
                    }, 200);

                });
                $(previousPages).parent().prepend(openPre);
            } else {
                $('#ajax-content').find('.pre-open').remove();
            }
            _self.updatePageNumberInURL(currentDoc, pageNum);
        }

        /**
         * updates the page number in the url without
         * reloading the document
         * @param doc should be currentDoc
         * @param pageNum
         */
        function updateUrlPageNumber(doc, pageNum) {
            doc = doc || {};
            var currentState = null, currentStateName = null;
            if (awr.router && doc.book) {
                var docName = doc.book.book_name,
                    docId = doc.book.id && doc.book.id.startsWith('doc-') ? doc.book.id.replace('doc-', 'd') : doc.book.id;
                Q.$qTry(function onScc() {
                    docName = docName
                        .replace(/[\!\?\#\:\%\=\&\.\;]/g, '')
                        .replace(/\s/g, '_')
                        .toLowerCase();
                }, function onErr() {
                    docName = "user_document";
                });
                Q.$qTry(function onScc() {
                    currentState = awr.router.getCurrentState();
                    currentStateName = currentState.name;
                }, function onErr() {
                    currentState = null;
                    currentStateName = 'doc-link';
                });
                if (Q.$setContainsString(['share-link'], currentStateName) && Q.$stringExist(docId)) {
                    docId = docId.replace('doc-', '').replace('d', '');
                }
                awr.router.go(currentStateName, {
                    params: {
                        docName: docName,
                        docId: docId,
                        pageNumber: parseInt(pageNum) === 1 ? "index" : "p" + pageNum
                    },
                    attrs: Q.$objectExist(currentState) ? currentState.attrs : {}
                }, false);
            }
        }

        function getDocState(doc_id, success) {

            window.pageshare = window.pageshare || {};
            var activeGetState = window.pageshare.activeGetState;
            if (Q.$stringEqual(activeGetState,doc_id)) {
                return;
            }
            window.pageshare.activeGetState = doc_id;
            pageshare.docServer.getDocState(doc_id, function () {
                window.pageshare.activeGetState = null;
                if (Q.$functionExist(success)) {
                    return success(state);
                }
            });
        }

        function watchBusy(doc_id, ready) {
            var watchId = "doc-reader-" + doc_id;
            pageshare.docServer.waitForBusyDoc(doc_id, function (state) {

                var currentViewId = pageshare.currentView &&
                pageshare.currentView.id ? pageshare.currentView.id : null;
                if (currentViewId && currentViewId === watchId) {
                    return Q.$functionExist(ready)? ready(state) : undefined;
                }
            }, watchId);
        }

        function getDoc(docId, success, fail) {
            if (!docId) {
                return;
            }
            docId = "" + docId;
            var opts = {};
            if (docId.startsWith('doc-')) {
                opts.doc_id = docId.replace('doc-', '');

            } else {
                opts.id = docId;
            }//
            opts.success = function (doc_data) {
                if (Q.$functionExist(success)) {
                    success(doc_data);
                }
            };
            opts.fail = function (res) {
                return Q.$functionExist(fail) ? fail(res) : undefined;
            };

            pageshare.docServer.findDoc(opts);
        }

        function reload() {
            var currentDoc = pageshare.currentDoc ? pageshare.currentDoc.book : {};
            _self.openDoc(currentDoc.id);
        }

        _self.getDoc = getDoc;
        _self.getDocState = getDocState;
        _self.buildReadUI = buildReadUI;
        _self.openDoc = openDoc;
        _self.goToPage = goToPage;
        _self.updatePageNumberInURL = updateUrlPageNumber;
        _self.reload = reload;
        _self.clearDocInfoUI = clearDocInfoUI;
        _self.buildDocInfoUI = buildDocInfoUI;
        _self.openPreview = openPreview;
        _self.togglePageInfo = function togglePageInfo(event) {
            awr = window.awr || {};
            Q = awr.Q;
            if (Q.$objectExist(event) && Q.$objectExist(event.target)) {
                $(event.target).parent().toggleClass('open');
            }
        };
    }
})(window, jQuery);
/**
 * @author: kavan soleimanbeigi
 * @date:
 */
!(function (window, $) {
    'use strict';
    var awr = window.awr || {},
        bootQueue = awr.bootQueue || [],
        pageshare = window.pageshare || {};

    var SimpleReaderModule = {
        moduleName: '$$appEssentials@CORE',
        requires: [{
            name: 'awr.$$appEssentials',
            type: 'object'
        }],
        wTime: 500,
        init: init,
        QAsContext: true
    };
    bootQueue.push(SimpleReaderModule);

    function init() {

    }

})(window, jQuery);








/*globals console*/
!(function (window, $) {
    'use strict';
    var awr = window.awr || {},
        Q = awr.Q,
        pageshare = window.pageshare || {};

    pageshare.docRemove = new DocRemove();
    function DocRemove() {
        var _self = this;
        var proceed = function (doc, complete, onErr) {
            var docId = Q.$or(Q.$stringExist(doc.doc_id), Q.$numberExist(doc.doc_id)) ? doc.doc_id : null,
                legacyId = Q.$numberExist(doc.id) ? doc.id : null,
                url = Q.$exist(docId) ?
                    "cmd/doc/remove/" + docId : Q.$exist(legacyId) ? "cmd/doc/legacy_remove/" + legacyId : null;
            if (Q.$booleanFalse(Q.$stringExist(url))) {
                return Q.$functionExist(complete) ? complete() : false;
            }
            awr.serverCall.$post({
                url: url,
                data: {
                    confirm: true
                }
            }).then(function onRemoveSuccess(res) {
                pageshare.docServer.invalidateCache({
                    doc_id: Q.$numberExist(docId) ? 'doc-' + docId : Q.$stringExist(docId) ? docId : legacyId
                });
                removeFromLocalData(docId, legacyId);
                if (Q.$objectExist(pageshare.currentCollection)) {
                    awr.router.pushLink('/app#c/' + pageshare.currentCollection.id);
                } else {
                    awr.router.pushLink('/app#c/index');
                }
                if (Q.$functionExist(complete)) {
                    complete();
                }

            }, function onRemoveErr(err) {
                var res_obj = err.responseJSON || {error: err.responseText};
                return Q.$numberEqual(err.status, 403) &&
                Q.$stringEqual(err.status, "Forbidden") ? pageshare.activeLogin.login({
                    success: function cont() {
                        proceed(doc, complete);
                    }
                }) : Q.$functionExist(onErr) ? onErr(res_obj) : false;
            });
        };

        function removeFromLocalData(docId, legacyId) {

            if (Q.$objectExist(pageshare.currentCollection) && Q.$arrayNotEmpty(pageshare.currentCollection.docs)) {
                pageshare.currentCollection.docs = Q.$reduce(pageshare.currentCollection.docs, function () {
                    return !Q.$setContainsString(
                        ['doc-' + docId, 'd' + docId + '', docId + '', legacyId + ''], this.id + '');
                });
                pageshare.shelfCtrl.reload();
            }
            if (Q.$arrayNotEmpty(pageshare.collections)) {
                pageshare.collections = Q.$map(pageshare.collections, function () {
                    if (Q.$arrayNotEmpty(this.docs)) {
                        this.docs = Q.$reduce(this.docs, function () {
                            return !Q.$setContainsString(
                                ['doc-' + docId, 'd' + docId + '', docId + '', legacyId + ''], this.id + '');
                        });
                    }
                    return this;
                });
                pageshare.mainMenu.reload();
            }
        }

        _self.quickRemove = function (doc) {
            var currentUser = pageshare.currentUser,
                isAuthorized = Q.$objectExist(currentUser) &&
                    Q.$or(currentUser.is_admin, doc.author_id === currentUser.user_id);
            if (Q.$booleanFalse(isAuthorized)) {
                return;
            }
            return proceed(doc, null, function onErr(err) {
                console.error('fastDocRemove@Pageshare failed to remove doc.' +
                ' \n\t + Details: ' + Q.$objectExist(err) ? err.statusText : 'Error');
            });
        };
        _self.remove = function remove(doc, complete) {
            var currentUser = pageshare.currentUser,
                isAuthorized = Q.$objectExist(currentUser) &&
                    Q.$or(currentUser.is_admin, doc.author_id === currentUser.user_id);
            pageshare.basicModal.busy({
                title: "<span class='fa fa-spinner fa-spin text-muted'></span>&nbsp;&nbsp;Removing document",
                message: " Please wait..."
            });
            if (Q.$booleanFalse(isAuthorized)) {
                setTimeout(function () {
                    _self.releaseByForbiddenError();
                }, 1000);
                return;
            }
            //separate function should request a busy state for modal
            // as proceed
            //can be triggered after a successful login
            //which might be already in a busy state

            proceed(doc, function complete$proceed() {
                setTimeout(function () {
                    pageshare.basicModal.stop();
                }, 700);
                if (Q.$functionExist(complete)) {
                    Q.$qTry(function () {
                        complete();
                    }, function onErr(err) {
                        console.error('proceed@Remove@Pageshare: error in complete block.\n\t + Details: ' + err);
                    });
                }
            }, function onErr() {
                setTimeout(function () {
                    pageshare.basicModal.stop();
                }, 700);
            });
        };
        _self.releaseByForbiddenError = function relForbidden(title) {
            title = title || "Removing document failed";
            pageshare.basicModal.release({
                title: "<span class='fa fa-meh-o text-danger'>" +
                "</span><span class='text-danger'>&nbsp;&nbsp;" + title + "</span>",
                message: "Server rejected your request with status <strong class='text-warning'>404 Forbidden!</strong>" +
                "<br>Sorry, but you are not authorized for doing this action.",
                isInfo: true,
                cancelName: "Ok"
            });
        };
        _self.confirm = function confirm(doc, complete) {
            if (!doc || !(doc.id || doc.doc_id)) {
                console.error("docRemove: bad doc object. aborting..");
                return;
            }
            pageshare.basicModal.start({
                mainClass: "confirm-remove",
                actionName: "remove",
                title: " Are you sure?",
                titleIcon: "fa fa-exclamation-triangle text-danger",
                message: "If you proceed the document will be permanently removed. Please" +
                " note that proceeding with this action can't be undone!",
                actionClass: "btn-danger",
                action: function proceed_with_confirm() {
                    return _self.remove(doc, function complete$remove() {

                        if (Q.$functionExist(complete)) {
                            Q.$qTry(function () {
                                complete();
                            }, function (err) {
                                console.error('confirm@Remove@Pageshare: error in complete block.\n\t + Details: ' + err);
                            });
                        }
                    });
                }
            });

        };
    }

    window.pageshare = pageshare;
})(window, jQuery);


!(function (window, $) {
    var awr = window.awr || {},
        Q = awr.Q,
        pageshare = window.pageshare || {};
    pageshare.docServer = new DocServer();
    pageshare.watchBusyCallback = null;
    var metaGroups = [], cachedData = {};

    function initMetaDataDB() {
        awr.serverCall.basicGET({
            url: "cmd/meta/pairs",
            success: function (res) {
                metaGroups = res;
            },
            error: function (res) {
                awr.errorLog("initMetaData@docServer", "Failed to fetch metaGroups from server", res.statusText);
            }
        });
    }

    function searchInMeta(key, queryStr) {
        var values = getValuesForKey(key);
        return $.grep(values, function (nxt, i) {
            var n = nxt.toLowerCase(),
                query = queryStr.toLowerCase();
            var nxtAr = nxt.split(' ');
            if (nxtAr.length === 2) {
                values[i] = capitalize(nxtAr[0]) + " " + capitalize(nxtAr[1]);
            } else {
                values[i] = capitalize(nxt);
            }
            return Q.$stringEqual(n, query) || n.startsWith(query) || query.startsWith(n);
        });
    }

    function capitalize(word) {
        return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
    }

    function getValuesForKey(key) {
        for (var k in metaGroups) {
            if (metaGroups[k].name.toLowerCase() === key.toLowerCase()) {
                return extractValues(metaGroups[k].values);
            }
        }
        return [];
    }

    function extractValues(arr) {
        var val = [];
        for (var o in arr) {

            val.push(arr[o].value);
        }
        return val;
    }

    function getCleanDocId(doc_id) {
        if (Q.$numberExist(doc_id)) {
            return doc_id;
        }
        return Q.$stringExist(doc_id) ? doc_id.replace('doc-', '').replace('d', '') : '';
    }

    function isDocVisible(doc) {
        doc = Q.$objectExist(doc) ? doc : {};
        var legacyVisibility = Q.$objectExist(doc.book) ? doc.book.public + '' : 'NO LEGACY Visibility',
            isUsrOwner = isUserDocOwner(doc),
            isVisible = Q.$stringEqual(doc.visibility + '', '1') || Q.$stringEqual(legacyVisibility, '1');
        return isUsrOwner || isVisible;
    }

    function isUserDocOwner(doc) {
        var doc_data = doc || {},
            user = Q.$objectExist(pageshare.currentUser) ? pageshare.currentUser : {user_id: 'no user id'};
        doc_data.book = doc_data.book || {};
        return Q.$setContainsString([doc_data.owner_id + '',
            doc_data.book.author_id + '', doc_data.author_id + '', doc_data.book.owner_id + ''], user.user_id + '');
    }

    function DocServer() {
        var _self = this;
        initMetaDataDB();
        _self.busyWatchers = {};
        _self.initMetaDataDB = initMetaDataDB;
        _self.searchInMeta = searchInMeta;
        _self.isDocVisible = isDocVisible;
        _self.isUserDocOwner = isUserDocOwner;
        _self.invalidateCache = function invalidateCache(opts) {
            opts = opts || {};
            var link = "/cmd/doc/doc_info?";
            if (opts.doc_id) {
                link += "doc_id=" + getCleanDocId(opts.doc_id);
            } else if (opts.id) {
                //even  here cleanId can be used as it always returns number
                link += "id=" + getCleanDocId(opts.id);
            } else {
                return;
            }
            if (Q.$objectExist(cachedData[link])) {
                cachedData[link] = null;
            }
        };
        _self.refreshCache = function invalidateCache(opts) {

            _self.invalidateCache(opts);
            _self.findDoc(opts);
        };
        _self.findDoc = function (opts) {
            opts = opts || {};
            var link = "/cmd/doc/doc_info?";
            if (opts.doc_id) {
                link += "doc_id=" + getCleanDocId(opts.doc_id);
            } else if (opts.id) {
                //even  here cleanId can be used as it always returns number
                link += "id=" + getCleanDocId(opts.id);
            } else {
                return;
            }
            if (Q.$objectExist(cachedData[link])) {
                if (Q.$functionExist(opts.success)) {
                    opts.success(cachedData[link])
                }
                return;
            }

            try {
                awr.serverCall.basicGET({
                    url: link,
                    success: function (data) {
                        cachedData[link] = data;
                        if (Q.$functionExist(opts.success)) {
                            opts.success(data);
                        }
                    },
                    error: opts.error,
                    fail: opts.fail
                });
            } catch (e) {
                if (typeof opts.fail === "function") {
                    opts.fail(e);
                }
                awr.errorLog("findDoc@docServer@app", "Error occurred with server call ", e);
            }

        };
        _self.getDocState = function getState(doc_id, success) {
            awr.serverCall.basicGET({
                url: "cmd/doc/state/" + getCleanDocId(doc_id),
                success: success
            });
        };
        _self.waitForBusyDoc = function watchBusy(doc_id, ready, watchId) {
            /**
             * if an id for watch is passed the ready function will be kept in
             * the watch queue. Otherwise, the ready function will be set as a single global
             * callback and the later similar calls that don't pass an id will override the global callback.
             * In this way the last "no id" watch call will be treated as global watcher.
             */

            if (Q.$stringExist(watchId) && Q.$functionExist(ready)) {
                _self.busyWatchers[watchId] = ready;
            }
            var iv = setInterval(function () {
                if (!Q.$stringExist(watchId) && Q.$functionExist(ready)) {
                    pageshare.watchBusyCallback = ready;
                }

                _self.getDocState(getCleanDocId(doc_id), function onScc(state) {
                    _self.invalidateCache({doc_id: doc_id});
                    if (Q.$booleanTrue(state.is_done)) {
                        clearInterval(iv);
                        if (Q.$functionExist(pageshare.watchBusyCallback)) {
                            pageshare.watchBusyCallback(state);
                        }
                        for (var w in _self.busyWatchers) {
                            var nxtW = _self.busyWatchers[w];
                            if (Q.$functionExist(nxtW)) {
                                nxtW(state);
                            }
                        }
                    }
                    if (Q.$booleanTrue(state.is_busy)) {
                    }
                });
            }, 2000);
            // }
        };
        _self.createDoc = function (opts) {
            opts = opts || {};
            var docData = opts.docData;
            opts.onSuccess = opts.success;
            opts.onError = opts.fail;
            opts.url = docData.getDocInitUrl();
            opts.data = docData.getDocInitForm();
            awr.serverCall.basicFormPOST(opts);
        };
        _self.updateDocInfo = function (opts) {
            opts = opts || {};
            var docData = opts.docData;
            opts.onSuccess = opts.success;
            opts.onError = opts.fail;
            opts.url = docData.getDocUpdateUrl();
            opts.data = docData.getDocUpdateForm();
            awr.serverCall.basicFormPOST(opts);
        };
        _self.upgradeLegacyFiles = function (opts) {
            opts = opts || {};
            var docData = opts.docData;
            opts.onSuccess = opts.success;
            opts.onError = opts.fail;
            opts.url = docData.getLegacyUpgradeUrl();
            opts.data = docData.getLegacyUpgradeData();
            awr.serverCall.basicFormPOST(opts);
        };
        _self.saveDocMeta = function saveDocMeta(opts) {

            opts = opts || {};
            var docData = opts.docData, stringify = true;

            opts.onSuccess = opts.success;
            opts.onError = function (res) {
                //
                return typeof opts.fail === "function" ? opts.fail(res) : null;
            };
            opts.url = docData.getDocMetaUrl();
            opts.data = docData.getDocMetaAsJSON(stringify);
            awr.serverCall.basicPOST(opts);

        };
        _self.buildFilesGroup = function (docData, fileInputs) {
            var validation = docData.validate(),
                files = docData.getFiles();
            var fileinputs_keys = [], all_fileinputs_keys = [];
            all_fileinputs_keys = ["pdf-input", "epub-input", "audio-input"];
            if (validation.hasPdfFile) {
                fileinputs_keys.push("pdf-input");
            }
            if (validation.hasEpubFile) {
                fileinputs_keys.push("epub-input");
            }
            if (validation.hasAudioFile) {
                fileinputs_keys.push("audio-input");
            }
            return {
                files: files,
                uploadUrl: docData.getFileUploadUrl(),
                clean: function (u_index) {
                    if (typeof fileinputs_keys[u_index] !== "undefined" &&
                        fileinputs_keys[u_index].length > 0) {
                        fileInputs.get(fileinputs_keys[u_index]).remove();
                    }
                },
                /**
                 * This one cleans all the keys even if they were empty
                 */
                cleanAll: function () {
                    for (var i in all_fileinputs_keys) {
                        if (typeof all_fileinputs_keys[i] !== "undefined" &&
                            all_fileinputs_keys[i].length > 0) {
                            fileInputs.get(all_fileinputs_keys[i]).remove();
                        }
                    }
                }
            }

        };
        _self.uploadFiles = function (opts) {
            var files = opts.files,
                u_index = opts.u_index;
            u_index = u_index && u_index > 0 ? u_index : 0;
            return _self.fileUpload({
                file: files[u_index],
                doc_id: getCleanDocId(opts.doc_id),
                success: function onScc(res) {
                    res.isSuccess = true;
                    if (typeof opts.success === "function") {
                        opts.success(res);
                    }
                },
                error: function onErr(err) {
                    err.isSuccess = false;
                    if (typeof opts.fail === "function") {
                        opts.fail(err);
                    }
                    if (typeof opts.error === "function") {
                        opts.error(err);
                    }
                },
                uploadUrl: opts.uploadUrl,
                complete: function (res) {
                    if (typeof opts.clean === "function") {
                        opts.clean(u_index);
                    }
                    if (u_index < files.length - 1) {
                        opts.u_index++;
                        return _self.uploadFiles(opts);
                    } else {
                        res.isSuccess = true;
                        if (typeof opts.cleanAll === "function") {
                            opts.cleanAll(u_index);
                        }
                        // A file group including  (u_index + 1)  files uploaded!
                        return typeof opts.complete === "function" ? opts.complete(res) : undefined;
                    }
                }
            });
        };
        _self.fileUpload = function (opts) {
            opts = opts || {};
            awr.serverCall.basicFileUpload({
                url: opts.uploadUrl,
                data: {
                    doc_id: getCleanDocId(opts.doc_id),
                    file_key: 'client_file',
                    file: opts.file
                },
                success: opts.success,
                error: opts.error,
                fail: opts.fail,
                complete: opts.complete
            });

            return true;
        };

    }

})(window, jQuery);

!(function (window, $) {
    // ZXEK-0981-7937-199E
    // DXEY-0149-1205-112E
    // EJMQ-5762-4004-260Q
    var pageshare = window.pageshare || {};
    pageshare.easySignup = new EasySignup();
    pageshare.limitedSignup = new LimitedSignup();
    var awr = window.awr || {};

    function LimitedSignup() {
        var _self = this;
        _self.showGotShortKeyInfo = function () {
            $('.invite-key #shortKeyInfoToggle').addClass('hidden');
            $('.invite-key #shortKeyInfo').removeClass('hidden');
        };
        _self.getRegistrationKey = function () {
            return typeof _self.fullKey === "string" ? _self.fullKey : null;
        };
        _self.setTicket = function (key) {
            var ticket = {
                fullKey: key,
                expires: new Date(new Date().getTime() + (5 * 60000))
            };
            localStorage.setItem("registrationTicket", JSON.stringify(ticket));
        };
        _self.resetTicket = function () {
            localStorage.setItem("registrationTicket", null);
        };
        _self.authorizeUI = function (authorizedViewInit, rejectViewInit) {
            var ticket = localStorage.getItem("registrationTicket");
            if (ticket && !(ticket === null || ticket === "null")) {
                ticket = JSON.parse(ticket);
                if (typeof ticket.fullKey === "string" && ticket.expires &&
                    new Date().getTime() <= new Date(ticket.expires).getTime()
                    && awr.serial.basicPrime.check(ticket.fullKey)) {
                    pageshare.inviteView.validateAndReserveFullKey(ticket.fullKey,
                        function activateSuccess(updated) {
                            _self.setTicket(ticket.fullKey);
                            return typeof authorizedViewInit === "function" ? authorizedViewInit({fullKey: ticket.fullKey}) : false;
                        }, function activateFail(res) {
                            _self.resetTicket();
                            return typeof  rejectViewInit === "function" ? rejectViewInit() : false;

                        });

                } else {
                    _self.resetTicket();
                    return typeof  rejectViewInit === "function" ? rejectViewInit() : false;
                }

            } else {
                _self.resetTicket();
                return typeof  rejectViewInit === "function" ? rejectViewInit() : false;
            }
        };
        _self.activate = function (e) {
            $('.activate-field').addClass('activating');
            setTimeout(function () {
                if (typeof _self.fullKey === "string" &&
                    typeof pageshare.inviteView.validateAndReserveFullKey === "function") {
                    var preLevel = $('#inviteFormLevel1'), nextLevel = $('#inviteFormLevel2');
                    pageshare.inviteView.validateAndReserveFullKey(_self.fullKey,
                        function activateSuccess(updated) {
                            $('.activate-field').removeClass('activating');
                            $(nextLevel).removeClass('hidden');
                            $(preLevel).addClass('hidden');
                            $(nextLevel).find('#accepted').removeClass('hidden');
                            $(nextLevel).find('#rejected').addClass('hidden');
                            $(nextLevel).find('#accepted').find(".key-preview").prepend(_self.fullKey);
                            $(nextLevel).find('#accepted').find("button.btn-success").on("click", function (e) {
                                _self.setTicket(_self.fullKey);
                                pageshare.easySignup.start();
                            });
                        }, function activateFail(res) {
                            $('.activate-field').removeClass('activating');
                            $(preLevel).addClass('hidden');
                            $(nextLevel).removeClass('hidden');
                            $(nextLevel).find('#accepted').addClass('hidden');
                            $(nextLevel).find('#rejected').removeClass('hidden');
                            $(nextLevel).find('#rejected').find(".key-preview").prepend(_self.fullKey);
                            $(nextLevel).find('#rejected').find("button.btn-success").on("click", function (e) {
                                pageshare.easySignup.start();
                            });

                        });
                } else {
                    $('.invite-key .activate-field span.fa-remove').removeClass('hidden');
                    $('.invite-key .activate-field span.fa-check').addClass('hidden');
                    console.error("Can not proceed with key activation: bad key or required module [inviteView] missing");
                }
            }, 2000);
        };
        _self.validate = function (e) {
            var target = e && e.target ? e.target : {},
                text = $(target).val(),
                reservedKeys = [8, 37, 38, 39, 40],
                dashPoints = [4, 9, 14, 18];
            if (reservedKeys.includes(e.keyCode) && e.type !== "paste") {
                if (text.length <= 1) {
                    $('.invite-key .activate-field span.fa-remove').addClass('hidden');
                }
                return;
            }
            if (e.type === "paste" || (dashPoints.includes(text.length) && e.keyCode >= 48 && e.keyCode <= 90)) {
                if (e.type !== "paste" && e.keyCode !== 189 && text.length !== 18) {
                    $(target).val(text + "-");
                }
                $(target).val($(target).val().replace(/--/g, '-'));
                var fullText = e.type !== "paste" ? $(target).val() + String.fromCharCode(e.keyCode) : e.clipboardData.getData("text");
                var isValid = awr.serial.basicPrime.startsWithPattern(fullText, dashPoints.indexOf(fullText.length) + 1);
                if (!isValid) {
                    $('.invite-key .activate-field span.fa-remove').removeClass('hidden');
                    $('.invite-key .activate-field span.fa-check').addClass('hidden');
                } else {
                    $('.invite-key .activate-field span.fa-remove').addClass('hidden');
                }
                if (fullText.length === 19 && isValid) {
                    isValid = awr.serial.basicPrime.check(fullText);
                    $('.invite-key .activate-field span.fa-remove').addClass('hidden');
                    $('.invite-key .activate-field span.fa-check').removeClass('hidden');
                    $(target).val(fullText);
                    if (isValid) {
                        $(target).attr('disabled', 'true');
                        $('.invite-key button').removeClass('disabled');
                        _self.fullKey = fullText;
                        // console.log("heree");
                    } else {
                        $('.invite-key .activate-field span.fa-remove').removeClass('hidden');
                        $('.invite-key .activate-field span.fa-check').addClass('hidden');
                    }
                }

            }
        }
    }

    function EasySignup() {
        var _self = this;
        _self.takenEmails = [];
        var signupTemp = Pageshare.Templates['assets/modules/easySignup/easySignup.hbs'];
        var limitedSignupTemp = Pageshare.Templates['assets/modules/easySignup/easySignupLimited.hbs'];

        function toggleValidClassForGroup(target, errorDescEl, hasValidationError) {
            if (!$(target).parent().hasClass('visited')) {
                $(target).parent().addClass('visited');
            }
            $(target).parent().removeClass('valid');
            $(target).parent().removeClass('not-valid');
            $(target).parent().addClass(hasValidationError ?
                'not-valid' : 'valid');
            if (hasValidationError) {
                $(errorDescEl).addClass('not-valid');
            } else {
                $(errorDescEl).removeClass('not-valid');
            }
            if (!$(errorDescEl).hasClass('visited')) {
                $(errorDescEl).addClass('visited');
            }
        }

        function addValidationClasses(target, validation) {
            var targetName = $(target).attr('name');
            if (targetName === "first_name") {
                var errorDescEl = $('.error-desc li[name="fName"]'),
                    hasValidationError = !validation.isFirstNameValid;
                toggleValidClassForGroup(target, errorDescEl, hasValidationError);
            }
            if (targetName === "last_name") {
                var errorDescEl = $('.error-desc li[name="lName"]'),
                    hasValidationError = !validation.isLastNameValid;
                toggleValidClassForGroup(target, errorDescEl, hasValidationError);
            }
            if (targetName === "email") {
                var errorDescEl = $('.error-desc li[name="email"]'),
                    hasValidationError = !validation.isEmailValid;
                toggleValidClassForGroup(target, errorDescEl, hasValidationError);
            }
            if (targetName === "password") {
                var errorDescEl = $('.error-desc li[name="password"]'),
                    hasValidationError = !validation.isPasswordValid;
                toggleValidClassForGroup(target, errorDescEl, hasValidationError);
            }
            if (targetName === "password_confirmation") {
                var errorDescEl = $('.error-desc li[name="passwordConfirm"]'),
                    hasValidationError = !validation.isPasswordConfirmationValid;
                toggleValidClassForGroup(target, errorDescEl, hasValidationError);
            }
        }

        function getValidatorData() {
            var dataFrm = new FormData($('.easy-signup form')[0]);
            var firstName = dataFrm.get('first_name'),
                lastName = dataFrm.get('last_name'),
                email = dataFrm.get('email'),
                password = dataFrm.get('password'),
                passwordConfirm = dataFrm.get('password_confirmation');
            return {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                passwordConfirmation: passwordConfirm,
                optional: []
            };
        }

        function proceedWithSignup(dataFrm, success, error) {
            if (typeof _self.registrationKey === "string") {
                var bpArr = _self.registrationKey.split("-"), basicPrimeAD = [bpArr[0], bpArr[1]].join("-");
                dataFrm.append("registrationKey", basicPrimeAD);
            }
            $.ajax({
                url: "admin/auth/signup",
                type: "POST",
                data: dataFrm,
                async: true,
                processData: false,
                contentType: false,
                success: function (res) {
                 	pageshare.limitedSignup.resetTicket();    
		if (typeof success === "function") {
                        success(res);
                    }
                },
                error: function (res) {
                        pageshare.limitedSignup.resetTicket();    
                    var resObj = res.responseJSON || {};
                    console.error("Pageshare: Failed to register new user");
                    if (typeof error === "function") {
                        error(resObj);
                    }
                }
            });
        }

        function takeUserToHome() {
            pageshare.basicModal.busy({
                message: '<div class="signup-wait">' +
                '<img src="assets/img/spining_dots.gif" style="width: 60px"/>' +
                ' <strong class="tex-info">Signed up successfully.' +
                ' Logging in...</strong>' +
                '</div>'
            });
            pageshare.UI.reload();
            setTimeout(function () {
                pageshare.basicModal.stop();
                awr.router.goToRoot();
            }, 500);
        }

        function putUIInBusyMode() {
            pageshare.basicModal.busy({
                message: '<div class="signup-wait">' +
                '<img src="assets/img/spining_dots.gif" style="width: 60px"/>' +
                ' <strong class="tex-info">Please Wait a moment...</strong>' +
                '</div>'
            });
        }

        function reloadIndexAfterError(dataForm, res) {
            dataForm = dataForm || {};
            pageshare.basicModal.release({message: ""});
            var rendered = $(signupTemp({
                values: {
                    fName: dataForm.firstName || "",
                    lName: dataForm.lastName || "",
                    email: dataForm.email || "",
                    password: dataForm.password || "",
                    passwordConfirm: dataForm.passwordConfirmation || ""
                }
            }));
            _self.index(rendered);
            setTimeout(function () {
                if (res.signup_msg && res.signup_msg === "email in use") {
                    $('.error-desc li[name="emailInUse"]').addClass('error');
                    $('.easy-signup form input[name="email"]')
                        .css('background', 'pink');
                    if (res.data && res.data.email) {
                        _self.takenEmails.push(res.data.email);
                    }
                }
            }, 200);
        }

        _self.visited = {
            fName: false,
            lName: false,
            email: false,
            password: false,
            passwordConfirm: false
        };
        _self.start = function (state) {
            if (typeof pageshare.currentUser !== "undefined" && pageshare.currentUser !== null) {
                pageshare.UI.reload();
                awr.router.goToRoot();
                return;
            }
            var rendered = $(signupTemp({
                values: {}
            }));

            if (pageshare.shelfCtrl &&
                typeof pageshare.shelfCtrl.close === "function") {
                // pageshare.shelfCtrl.close();
            }
            pageshare.basicModal.stop();
            pageshare.basicModal.start({
                mainClass: "active-login",
                actionName: "",
                actionClass: "btn-primary",
                isInfo: false,
                action: null,
                hideFooter: true,
                onClose: function back() {
                    awr.router.back(true);
                }

            });
            _self.index(rendered);
            // $('#ajax-content').html(rendered);
            if (awr.router) {
                awr.router.go("easy-signup", {
                    attrs: {
                        b_name: "redirect",
                        b_ref: "index"
                    }
                }, false);
            }
        };
        _self.index = function indexPage(renderedContent) {
            var indexFinally = function finallyIndex() {
                pageshare.basicModal.update({
                    title: "" +
                    "<h1 class='fa fa-lock '> Please sign up for Pageshare <small>It's free!</small></h1>",
                    message: $(renderedContent)
                });
                var inputFields = $('.easy-signup form input');
                $(inputFields).on('keypress', function (event) {
                    //preventing auto form submit on enter key pressed
                    if (event.keyCode === 13) {
                        event.preventDefault();
                        event.stopPropagation();
                    }

                });
                $(inputFields).on('keydown', function (event) {
                    setTimeout(function () {
                        var target = event.target;
                        var validation = _self.validate();
                        addValidationClasses(target, validation);


                    }, 300);

                });
            };

            pageshare.limitedSignup.authorizeUI(function (params) {
                params = params || {};
                _self.registrationKey = typeof params.fullKey === "string" ? params.fullKey : null;
                $(renderedContent).find('.main .panel.form-panel').removeClass('hidden');
                indexFinally();
            }, function () {
                $(renderedContent).find('.main').prepend($(limitedSignupTemp({})));
                indexFinally();
            });
        };
        _self.register = function registerNow() {
            var validator = awr.validation.basicUserInfoValidator,
                validatorForm = getValidatorData(),
                isValid = validator.isValid(validatorForm);
            var dataFrm = new FormData($('.easy-signup form')[0]);
            if (isValid) {
                putUIInBusyMode();
                setTimeout(function prcd() {
                    proceedWithSignup(dataFrm, function onScc() {
                        takeUserToHome();
                    }, function onErr(res) {
                        reloadIndexAfterError(validatorForm, res);
                    });
                }, 500);
            } else {
                $('.easy-signup .form-group').addClass('visited');
                $('.easy-signup .form-group input').trigger('keydown');
            }
        };
        _self.validate = function () {
            var validator = awr.validation.basicUserInfoValidator,
                validatorForm = getValidatorData();
            var v = validator.test(validatorForm);
            $('.error-desc li[name="emailInUse"]').removeClass('error');
            if ($.inArray(validatorForm['email'], _self.takenEmails) >= 0) {
                v.isEmailValid = false;
                var field = $('.error-desc li[name="emailInUse"]');
                $(field).addClass('error')
                $('.easy-signup form input[name="email"]')
                    .css('background', 'pink');
            } else {
                $('.easy-signup form input[name="email"]')
                    .css('background', '#fff');
            }
            return v;
        };
    }

    window.pageshare = pageshare;
})(window, jQuery);


/*globals window,console, jQuery, Promise*/
/**
 * @author: kavan soleimanbeigi
 * @date: 14.5.2017
 */
!(function (window, $) {
    'use strict';
    /*jshint sub:true*/
    /*jshint forin:false*/
    /**
     * TODO: properly test, especially the integration of between...
     * ...this module and AWRSet(iterator)
     * /home/kavan/Projects/pageshare/node_modules/sinon/pkg/sinon-2.2.0.js
     */
    window.awr = window.awr || {};
    window.awr.bootQueue = window.awr.bootQueue || [];

    var awr = window.awr || {},
        pageshare = window.pageshare || {},
        bootQueue = awr.bootQueue,
        Promise = window.Promise;

    var errorReg = {
        exampleError: {
            moduleName: '$@AppModule',
            errMsg: '',
            hintMsg: ''
        }
    };
    var simpleModule = {
        moduleName: 'editCollections@AppModule',
        requires: [{
            name: 'awr.$$appEssentials',
            type: 'object'
        }, {
            name: 'BasicTableGroup@AWRBundle',
            type: 'bundle'
        }],
        wTime: 6000,
        init: init,
        QAsContext: true
    };
    bootQueue.push(simpleModule);
    function init() {
        /*Here the context is Q interface*/
        var Q = this;
        pageshare.editCollections = new EditCollections();

        function EditCollections() {
            var _editTable = this;

            var TableUIComp = awr.importClass('BasicTable@UIComps'),
                Context = awr.importClass('BasicTableContext@UIComps'),
                Controller = awr.importClass('BasicTableCTR@UIComps'),
                CTRConf = awr.importClass('BasicTableCTRConf@UIComps'),
                ctrParams = new ControllerConfig(_editTable);
            var ctrConf = new CTRConf(ctrParams),
                controller = new Controller(ctrConf),
                context = new Context(new EditCollectionConfig());
            this.view = new TableUIComp(controller, context);

            this.start = function _start$() {
                $('#mainlogo > div.text').text('PageShare');
                $('body').removeClass('has_book_info');
                pageshare.bookInfoDom = null;
                if (!Q.$objectExist(pageshare.currentUser)) {
                    awr.router.pushLink('/app#c/index');
                    return;
                }
                _editTable.view.$start();
                pageshare.shelfCtrl.open();
                pageshare.UI.setDefaultEventHandlers();
            };

        }

        function ControllerConfig(collTable) {
            this.userModelParams = {
                api_path: 'api',
                url: 'user'
            };
            this.collectionModelParams = {
                api_path: 'api',
                url: 'collection'
            };
            this.removeConfirmFunction = confirmedRemove;
            this.loggedInUserDetector = loggedInUserDetector;
            this.getLoggedInUserId = getLoggedInUserId;
            this.afterSave = function afterSave$(item, user) {
                updateAppViewForCollections();
            };
            this.afterRemove = function afterSave$(item, user) {
                updateAppViewForCollections();
            };
            this.afterCreate = function afterSave$(item, user) {
                updateAppViewForCollections();
            };
            this.afterToggle = function afterToggle$(item, user) {
                if (Q.$objectExist(pageshare.currentUser) && Q.$objectExist(user)) {
                    pageshare.currentUser.main_collection = user.main_collection;
                    pageshare.currentCollection = Q.$collect(pageshare.collections, function (collected) {
                        if (Q.$stringEqual(this.id + '', user.main_collection + '')) {
                            return this;
                        }
                    });
                    collTable.view.$rebuild();
                    updateAppViewForCollections();
                }
            };
            this.beforeToggle = function beforeToggle$(item, user) {
                user.main_collection = Q.$stringEqual(user.main_collection, item.id) ?
                    null : item.id + '';
            };
            this.getToggleModel = function (item, user) {
                return user;
            };
            function updateAppViewForCollections() {
                if (Q.$objectExist(pageshare.collServer)) {
                    pageshare.collServer.findAllCollections(function onScc(colls) {
                        pageshare.mainMenu.reload(colls);
                    });
                }
            }
        }

        function EditCollectionConfig() {
            this.mainTableTitle = 'Edit Collections:';
            this.createTitle = 'Create new collection';
            this.itemCountTitle = 'Documents';
            this.itemDateTitle = 'Created';
            this.toggleTitle = 'Main collection';
            this.toggleOnName = 'Main';
            this.itemName = 'Collection';
            this.backLink = function buildBackLink() {
                var backLink = '#c/16',
                    mainColl = Q.$functionExist(pageshare.getUserMainCollection) ? pageshare.getUserMainCollection() : null;
                if (Q.$objectExist(mainColl) && Q.$stringExist(mainColl.id)) {
                    backLink = '#c/' + mainColl.id;
                }
                return backLink;
            };
            this.backLinkName = 'Back to collection';
            this.tableId = 'editCollectionsMain';
            this.rootContainerSelector = '#ajax-content';
            this.itemCountFunction = function getDocCount$(item) {
                return Q.$arrayExist(item.docs) ? item.docs.length : 0;
            };
        }

        /* table will send confirm-able action
         * on confirm just apply the removeAction
         * and the item will be removed*/
        function confirmedRemove(removeAction, item) {
            pageshare.basicModal.start({
                mainClass: "remove-coll-info",
                actionName: "Remove",
                title: " Remove collection",
                titleIcon: "fa fa-exclamation-triangle text-warning",
                message: "If you proceed you will loose the access " +
                "for all the documents containing this collection. This action can not be undone!",
                actionClass: "btn-danger",
                action: function proceed_with_confirm() {
                    if (Q.$functionExist(removeAction)) {
                        Q.$qTry(removeAction);
                    }
                    this.stop();
                },
                cancelName: 'Cancel'
            });
        }

        function loggedInUserDetector() {
            return Q.$objectExist(pageshare.currentUser) &&
                Q.$exist(pageshare.currentUser.user_id);
        }

        function getLoggedInUserId() {
            return Q.$objectExist(pageshare.currentUser) &&
            Q.$exist(pageshare.currentUser.user_id) ? pageshare.currentUser.user_id : null;
        }

    }


})(window, jQuery);

/*globals Number, console*/
/**
 * @author: kavan soleimanbeigi
 * @date: 14.5.2017
 */
!(function (window, $) {
    'use strict';
    window.awr = window.awr || {};
    window.awr.bootQueue = window.awr.bootQueue || [];
    var awr = window.awr || {},
        bootQueue = awr.bootQueue;
    var appEssentialsModule = {
        moduleName: '$$imgCache@APP',
        requires: [{
            name: 'awr.$$appEssentials',
            type: 'object'
        }],
        wTime: 500,
        init: init,
        QAsContext: true
    };
    bootQueue.push(appEssentialsModule);

    function init() {
        var Q = this,
            rendered,
            cTemp = Pageshare.Templates['assets/modules/imgCache/imgCache.hbs'];

        function AwrImgCache() {

        }

        AwrImgCache.prototype.initCache = function () {
            if (Q.$arrayNotEmpty($('#awrImgCache'))) {
                return;
            }
            rendered = $(cTemp({}));
            $('body').append(rendered);
        };
        AwrImgCache.prototype.createGroup = function (grpName) {
            if (Q.$stringExist(grpName) && !Q.$arrayNotEmpty($('#awrImgCache').find('div#grp-' + grpName))) {
                $('#awrImgCache').append('<div id="grp-' + grpName + '"></div>');
            }
        };
        AwrImgCache.prototype.addToGroup = function (grpName, url) {
            var group = $('#awrImgCache').find('#grp-' + grpName),
                groupExist = Q.$stringExist(grpName) && Q.$arrayNotEmpty(group);
            if (groupExist && Q.$stringExist(url) && !Q.$arrayNotEmpty($(group).find('img[src="' + url + '"]'))) {
                $(group).append('<img src="' + url + '" />');
            }
        };
        AwrImgCache.prototype.inCache = function (grpName, url) {
            var group = $('#awrImgCache').find('#grp-' + grpName),
                groupExist = Q.$stringExist(grpName) && Q.$arrayNotEmpty(group);
            return groupExist && Q.$arrayNotEmpty($(group).find('img[src="' + url + '"]'));
        };
        AwrImgCache.prototype.getImg = function (grpName, url, opts) {
            opts = opts || {};
            var orig, img = null, placeHolder = opts.placeHolder;

            function onImgLoad() {
                var currImg = this;
                $(this).off('load', onImgLoad);
                setTimeout(function () {
                    $(currImg).attr('src', $(currImg).data('original-src'));
                }, 500);
            }

            if (this.inCache(grpName, url)) {
                orig = $('#awrImgCache').find('#grp-' + grpName).find('img[src="' + url + '"]').clone();
            } else {
                orig = $('<img src=" ' + url + '"');
            }
            if (Q.$exist(opts.width)) {
                $(orig).attr('width', opts.width);
            }
            if (Q.$exist(opts.height)) {
                $(orig).attr('height', opts.height);
            }
            // console.log(opts);
            //place holder can be a function or a string
            // and it is used to keep the src until image gets loaded
            if (Q.$exist(placeHolder)) {
                orig.width = opts.width;
                orig.height = opts.height;
                img = $('<img data-original-src=" ' + url + '" />');
                $(img)
                    .on('load', onImgLoad)
                    .attr('src',
                        Q.$stringExist(placeHolder) ? placeHolder : Q.$functionExist(placeHolder) ? placeHolder(orig) : '');

            }
            return Q.$objectExist(img) ? img : orig;
        };
        var installs = {$$imgCache: new AwrImgCache()};
        awr.imgCache = installs.$$imgCache;
        this.$installInAWRGlobal('imgCache', '$$imgCache', installs);
        //Agent Detect
        // Opera 8.0+
        var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

        // Firefox 1.0+
        var isFirefox = typeof InstallTrigger !== 'undefined';

        // Safari 3.0+ "[object HTMLElementConstructor]" 
        var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);

        // Internet Explorer 6-11
        var isIE = /*@cc_on!@*/false || !!document.documentMode;

        // Edge 20+
        var isEdge = !isIE && !!window.StyleMedia;

        // Chrome 1+
        var isChrome = !!window.chrome && !!window.chrome.webstore;

        // Blink engine detection
        var isBlink = (isChrome || isOpera) && !!window.CSS;
        
        function AgentDetect(){

        }
        AgentDetect.prototype.$isOpera = function(){
            return isOpera;
        };
        AgentDetect.prototype.$isFirefox = function(){
            return isFirefox;
        };
        AgentDetect.prototype.$isSafari = function(){
            return isSafari;
        };
        AgentDetect.prototype.$isIE = function(){
            return isIE;
        };
        AgentDetect.prototype.$isEdge = function(){
            return isEdge;
        };
        AgentDetect.prototype.$isChrome = function(){
            return isChrome;
        };
        AgentDetect.prototype.$isBlink = function(){
            return isBlink;
        };
        awr.agentDetect = new AgentDetect();
        this.$installInAWRGlobal('agentDetect', '$$agentDetect', {$$agentDetect:new AgentDetect()});
    }


})(window, jQuery);








!(function (window, $) {
    var pageshare = window.pageshare || {};
    pageshare.inviteView = new InviteView();
    function InviteView() {
        var _self = this,
            viewTemp = Pageshare.Templates['assets/modules/inviteView/inviteView.hbs'],
            keyTemp = Pageshare.Templates['assets/modules/inviteView/inviteKey.hbs'];
        _self.keys = [];
        _self.currentFilterQuery = "all";

        _self.generateSet = function () {
            $(".invite-view .header > .panel > .panel-footer").addClass('generating');
            var serials = awr.serial.basicPrime.generate(10),
                set = [];
            for (var n in serials) {
                var nxt = serials[n].split("-");
                set.push({
                    'group': 'registration',
                    'key': nxt[0] + "-" + nxt[1]
                });
            }
            server_call({
                path: "push",
                data: JSON.stringify({"group": "registration", "set": set}),
                type: "POST",
                success: function (res_serials) {
                    for (var s in res_serials.setForGroup) {
                        var nxtSerial = res_serials['setForGroup'][s];

                        var nxt = serialToKeyObject(nxtSerial);
                        _self.keys.push(nxt);
                    }
                    // _self.showKeys(_self.keys);
                    setTimeout(function () {
                        _self.filterByStatus(_self.currentFilterQuery);
                        $(".invite-view .header > .panel > .panel-footer").removeClass('generating');
                    }, 1000);
                },
                error: function (res) {
                    console.error(res);
                }
            });

        };
        _self.start = function () {
            var rendered = $(viewTemp({}));
            $('#ajax-content').html(rendered);
            server_call({
                path: "list",
                data: JSON.stringify({"group": "registration"}),
                type: "POST",
                success: function (serials) {
                    for (var s in serials) {
                        var nxtSerial = serials[s];
                        var nxt = serialToKeyObject(nxtSerial);
                        _self.keys.push(nxt);
                    }
                    _self.showKeys(_self.keys);
                },
                error: function (res) {
                    console.error(res);
                }
            });
        };
        _self.filterByStatus = function (e, query) {
            if (!(e instanceof Event && typeof e !== "string")) {
                query = e;
            } else {
                e.preventDefault();
            }
            if (!(query && typeof query === "string" && query.length > 0)) {
                return;
            }
            var filteredResult = $.grep(_self.keys, function (n, i) {
                    return query === "all" || n.keyStatus === query;
                }),
                tabId = query === "valid-key" ? "validKeysTab" :
                    query === "expired-key" ?
                        "expiredKeysTab" :
                        query === "reserved-key" ?
                            "reservedKeysTab" : "allKeysTab";
            var tabLists = $('.invite-view  .header  .panel  .panel-footer  ul  li');
            $(tabLists).removeClass("active");
            $("#" + tabId).addClass("active");

            _self.showKeys(filteredResult);
            _self.currentFilterQuery = query;
        };
        _self.showKeys = function (keys) {
            var keyContainer = $('.invite-view .main');
            $(keyContainer).html("");
            if (!(keys && keys instanceof Array)) {
                return;
            }
            keys.sort(function (a, b) {
                return new Date(a.created).getTime() - new Date(b.created).getTime()
            });
            keys.reverse();
            for (var s in keys) {
                var nxt = keys[s], nxtRendered = $(keyTemp(nxt));
                $(keyContainer).append(nxtRendered);
            }
        };
        _self.reserve = function (e) {
            var parent = findParentForKeyButton($(e.target));
            if (!parent) {
                return;
            }
            $(parent).find('.tools .reserve').addClass('disabled');
            $(parent).find('.tools .invalidate').addClass('disabled');
            $(parent).addClass('seeking-key');
            var keyElement = findKeyInParent(parent),
                keyStr = $(keyElement).text(), keyArr = keyStr ? keyStr.split("-") : [];
            if (typeof keyStr === "string" && keyArr.length >= 2) {
                var keyAD = [keyArr[0], keyArr[1]].join("-"), keyStatus = "reserved-key";
                for(var k in _self.keys){
                    var nxt = _self.keys[k];
                    if(nxt.serialNumber === keyStr && nxt.keyStatus === "reserved-key"){
                        keyStatus = "valid-key";
                    }
                }
                server_call({
                    path: "update",
                    data: JSON.stringify({"group": "registration", "key": keyAD, "keyStatus": keyStatus}),
                    type: "POST",
                    success: function (res) {
                        var updated = res.updated;
                        if (updated) {
                            for (var k in _self.keys) {
                                var nxt = _self.keys[k];
                                if (nxt.serverObject.key === updated.key) {
                                    _self.keys[k] = serialToKeyObject(updated);
                                }
                            }
                        }
                        setTimeout(function () {
                            $(parent).find('.tools .reserve').addClass('disabled');
                            $(parent).find('.tools .invalidate').addClass('disabled');
                            $(parent).addClass('seeking-key');
                            _self.filterByStatus(_self.currentFilterQuery);
                        }, 2000);

                    },
                    error: function (res) {
                        console.error(res);
                    }
                });

            }
        };
        _self.invalidate = function (e) {
            var parent = findParentForKeyButton($(e.target));
            if (!parent) {
                return;
            }
            $(parent).find('.tools .reserve').addClass('disabled');
            $(parent).find('.tools .invalidate').addClass('disabled');
            $(parent).addClass('seeking-key');

            var keyElement = findKeyInParent(parent),
                keyStr = $(keyElement).text(), keyArr = keyStr ? keyStr.split("-") : [];
            if (typeof keyStr === "string" && keyArr.length >= 2) {
                var keyAD = [keyArr[0], keyArr[1]].join("-");
                server_call({
                    path: "invalidate",
                    data: JSON.stringify({"group": "registration", "key": keyAD}),
                    type: "POST",
                    success: function (res) {
                        var updated = res.updated;
                        if (updated) {
                            for (var k in _self.keys) {
                                var nxt = _self.keys[k];
                                if (nxt.serverObject.key === updated.key) {
                                    _self.keys[k] = serialToKeyObject(updated);
                                }
                            }
                        }
                        setTimeout(function () {
                            $(parent).find('.tools .reserve').addClass('disabled');
                            $(parent).find('.tools .invalidate').addClass('disabled');
                            $(parent).addClass('seeking-key');
                            _self.filterByStatus(_self.currentFilterQuery);
                        }, 2000);
                    },
                    error: function (res) {
                        console.error(res);
                    }
                });

            }
        };
        _self.copyKey = function (e) {
            var parent = findParentForKeyButton($(e.target));
            if (!parent) {
                return;
            }
            var keyElement = findKeyInParent(parent);
            return parent ? copyToClipboard(keyElement) : null;
        };

        _self.mobileCopyKey = function (e) {
            var parent = $(e.target).parent(),
                keyElement = findKeyInParent(parent);
            return keyElement ? copyToClipboard(keyElement) : null;
        };

        _self.validateAndReserveFullKey = function (fullKey, success, fail) {
            var keyArr = typeof fullKey === "string" ? fullKey.split("-") : [];
            if (!(keyArr && keyArr instanceof Array && keyArr.length >= 2)) {
                return typeof fail === "function" ? fail({reason: "Bad key"}) : false;
            }
            var isValid = awr.serial.basicPrime.check(fullKey), keyAD = [keyArr[0], keyArr[1]].join("-");
            if (isValid) {
                server_call({
                    path: "update",
                    data: JSON.stringify({"group": "registration", "key": keyAD, "keyStatus": "reserved-key"}),
                    type: "POST",
                    success: function (res) {
                        var updated = res.updated;
                        if (updated) {
                            return typeof success === "function" ? success(updated) : true;
                        } else {
                            return typeof fail === "function" ? fail({reason: "No confirmation from server"}) : false;
                        }
                    },
                    error: function (res) {
                        return typeof fail === "function" ? fail({
                            reason: "Failed by server",
                            errorResponse: res
                        }) : false;
                    }
                });
            } else {
                return typeof fail === "function" ? fail({reason: "bad key"}) : false;
            }
        };
        function findKeyInParent(parent) {
            return parent ? $(parent).find('span.key')[0] : null;
        }

        function findParentForKeyButton(target) {
            return target ? $(target)
                .parent()
                .parent()
                .parent()
                .parent() : null;
        }

        function server_call(opts) {
            opts = opts || {};
            $.ajax({
                url: "cmd/serial/" + opts.path,
                type: opts.type,
                data: opts.data,
                async: true,
                cache: false,
                contentType: "application/json",
                processData: true,
                success: function (res) {
                    return typeof opts.success === "function" ? opts.success(res) : undefined;
                },
                error: function (res) {
                    return typeof opts.error === "function" ? opts.error(res) : undefined;
                }
            });
        }

        function serialToKeyObject(nxtSerial) {
            var key = nxtSerial.key;
            if (nxtSerial.mode === "BasicPrime AD") {
                var nxtParts = nxtSerial.key.split("-");
                key = awr.serial.basicPrime
                    .generateOne({alpha: nxtParts[0].split(''), delta: nxtParts[1].split('')});
            }

            return {
                keyStatus: nxtSerial.status,
                serialNumber: key,
                createdBy: "Admin",
                created: nxtSerial.created,
                expires: simpleDateFormat(new Date(nxtSerial.expires)),
                serverObject: nxtSerial,
                domId: "key-" + nxtSerial.key
            };
        }

        function simpleDateFormat(d) {
            if (d && d instanceof Date) {
                var date = [d.getDate(), (d.getMonth() + 1), d.getFullYear()],
                    hours = [d.getHours(), d.getMinutes()];
                hours[0] = hours[0] < 10 ? "0" + hours[0] : hours[0];
                hours[1] = hours[1] < 10 ? "0" + hours[1] : hours[1];
                return date.join('.') + " at " + hours.join(":");
            }
            return "-";
        }

        function copyToClipboard(element) {
            return awr && awr.ux && typeof awr.ux.copyToClipboard === "function" ? awr.ux.copyToClipboard(element) : null;
        }
    }

    window.pageshare = pageshare;
})(window, jQuery);


!(function (window, $) {
    var pageshare = window.pageshare || {};
    pageshare.mainHeader = new MainHeader();


    function MainHeader() {
        var _self = this, currentState;
        $(document).ready(function () {
            awr.Q.$waitForComps({
                name: 'awr.routeManager',
                type: 'object'
            }).then(function onStateReady() {
                reload();
            }, function onErr(err) {
                console.error('Failed to init mainHeader in APP! \n\t +Details: ' + err);
            });
        });
        function reload() {
            currentState = awr.router.getCurrentState() || {};
            pageshare.bookInfoDom = null;
            var template = Pageshare.Templates['assets/modules/mainHeader/mainHeader.hbs'],
                oldBookInfo = $('#book_info'),
                frontPageLink = $('#frontPageLink').val(),
                sidebarToggleKey = "#sidebar-toggle",
                contentsDivKey = "#contents",
                rendered = template({
                    frontPageLink: frontPageLink,
                    hasBookName: pageshare.currentDoc && pageshare.currentDoc.book && pageshare.currentDoc.book.book_name,
                    bookName: pageshare.currentDoc && pageshare.currentDoc.book ? pageshare.currentDoc.book.book_name : 'PageShare'
                });

            $('#mainHeaderContainer').html(rendered);

            _self.loadFreemiumLogo();
            if ($('body').attr('id') !== 'premium') {
                if ($(oldBookInfo).length <= 0) {

                    $('.navbar-fixed-top').append('<div id="book_info" class="book-info"></div>');
                } else {
                    $('.navbar-fixed-top').append($(oldBookInfo));
                }
                $('#book_info').removeClass('hidden');
                $('#mainlogo').find('.arrows').removeClass('hidden');
            }

            setTimeout(function waitForUI() {
                currentState = awr.router.getCurrentState() || {};
                if (pageshare.currentUser && currentState.name === "doc-link") {
                    $('#book_info').find('.editBook').removeClass('hidden');
                    $('#book_info').find('.link-element').on('click', function () {
                        awr.router.go("doc-edit", {params: {docId: pageshare.currentDoc.book.id}});
                    });
                }
                if (currentState.name === "doc-edit") {
                    $('#book_info').addClass('hidden');
                    $('#mainlogo').find('.text').text('PageShare');
                    $('#mainlogo').find('.arrows').addClass('hidden');
                }
                $("#sidebar-toggle").click(function () {

                });
                $(contentsDivKey).off('click');
                $(sidebarToggleKey).off('click');
                $(contentsDivKey).on('click', function () {
                    $("body").removeClass("book_info_open");
                });
                $(sidebarToggleKey).on('click', function (e) {
                    e.preventDefault();
                    pageshare.mainMenu.toggleMainMenu();
                    if (pageshare && pageshare.userNav) {
                        pageshare.userNav.hideInfo();
                    }
                });
                pageshare.bookInfoDom = $('#book_info');
            }, 200);
        }

        _self.reload = reload;

        _self.loadFreemiumLogo = function () {

            $('#mainlogo span.text').click(function (e) {
                if ($('body').attr('id') === "premium") {
                    return;
                }

                if ($("body").is('.has_book_info')) {
                    e.preventDefault();
                    e.stopPropagation();
                    $.each($('#book_info a'), function (i, n) {

                        if (i > 0) {
                            $(this).text(awr.ux.capitalizeName($(n).text()));
                        }
                    });

                    $("body").toggleClass("book_info_open");
                } else {
                    e.preventDefault();
                    e.stopPropagation();
                    var frontPageLink = $('#frontPageLink').val();
                    if (frontPageLink) {
                        window.location = frontPageLink;
                    }
                }
            });
            $('#mainlogo .arrows').click(function (e) {
                if ($("body").is('.has_book_info')) {
                    e.preventDefault();
                    e.stopPropagation();
                    $.each($('#book_info a'), function (i, n) {

                        if (i > 0) {
                            $(this).text(awr.ux.capitalizeName($(n).text()));
                        }
                    });

                    $("body").toggleClass("book_info_open");
                }
            });
        }

    }

    window.pageshare = pageshare;
})(window, jQuery);


!(function (window, $) {
    var pageshare = window.pageshare || {},
        awr = window.awr || {},
        Q = awr.Q;
    pageshare.mainMenu = new MainMenu();

    function MainMenu() {
        var _self = this,
            menuSessVal = window.sessionStorage.getItem("toggleMainMenu"),
            isMenuOpen = Q.$numberEqual(menuSessVal, 1) ||
                Q.$stringEqual(menuSessVal, "1"),
            menuTemplate = Pageshare.Templates['assets/modules/mainMenu/mainMenu.hbs'];
        $("body").removeClass("open-sidebar");
        if ($('body').attr('id') === "premium") {
            window.sessionStorage.setItem("toggleMainMenu", 0);
            _self.close();
        } else {
            window.sessionStorage.setItem("toggleMainMenu", isMenuOpen ? 1 : 0);

            setTimeout(function () {
                $("body").removeClass("open-sidebar");
                $("body").toggleClass("open-sidebar", isMenuOpen);
            }, 200);
        }

        function toggleMainMenu() {
            var menuVal = window.sessionStorage.getItem("toggleMainMenu"),
                isOpen = Q.$numberEqual(menuVal, 1) ||
                    Q.$stringEqual(menuVal, "1");
            window.sessionStorage.setItem("toggleMainMenu", isOpen ? 0 : 1);
            $("body").toggleClass("open-sidebar", !isOpen);
            if (awr.agentDetect.$isFirefox() || awr.agentDetect.$isSafari()) {
                setTimeout(function () {
                    pageshare.mainMenu.reload();
                }, 1500);
            }

        }

        function openMainMenu() {
            console.error("someone toggled");
            window.sessionStorage.setItem("toggleMainMenu", 1);
            // window.sessionStorage.toggleMainMenu = "1";
            $("body").toggleClass("open-sidebar", true);


        }

        function closeMainMenu() {
            window.sessionStorage.setItem("toggleMainMenu", 0);
            // window.sessionStorage.toggleMainMenu = "0";
            $("body").toggleClass("open-sidebar", false);

        }

        function reload(collSet) {
            var collections = Q.$map(collSet, function () {
                    if (Q.$booleanFalse(Q.$setContainsString(['Principles', 'principles'], this.name))) {
                        return this;
                    }
                }),
                mainMenuKey = '#mainMenu',
                rendered,
                proceedWithReload = function proceedWR$(colls) {
                    Q.$forEachIndex(colls, function (nxt, i) {
                        nxt.isSelected = Q.$objectExist(pageshare.currentCollection) && Q.$exist(nxt.id) &&
                            Q.$stringEqual(nxt.id + '', pageshare.currentCollection.id + '');

                        nxt.$$visibleDocCount$$ = Q.$collect(nxt.docs, function (collected) {
                            collected = collected || 0;
                            var isVisible = Q.$booleanTrue(pageshare.docServer.isDocVisible(this)),
                                isUserAdmin = Q.$objectExist(pageshare.currentUser) &&
                                    Q.$booleanTrue(pageshare.currentUser.is_admin);
                            //legacy docs use public instead of visibility
                            if (Q.$or(isUserAdmin, isVisible)) {
                                collected++;
                            }
                            return collected;
                        });
                        nxt.$$visibleDocCount$$ = Q.$numberExist(nxt.$$visibleDocCount$$) ? nxt.$$visibleDocCount$$ : 0;
                    });
                    rendered = $(menuTemplate({
                        collections: colls,
                        userExist: Q.$objectExist(pageshare.currentUser)
                    }));
                    if (Q.$objectExist(awr.domAttrs) && Q.$functionExist(awr.domAttrs.$compile)) {
                        awr.domAttrs.$compile(rendered, {router: awr.router});
                    }
                    $(mainMenuKey).html(rendered);
                    if (pageshare.currentCollection && pageshare.collections) {
                        _self.resetSelected();
                    }
                    $(mainMenuKey).perfectScrollbar();
                    pageshare.activeLogin.toggleCommunityAuthUI();
                };
            proceedWithReload(collections);
        }

        _self.updateMenuScrollbar = function (timeout) {

            setTimeout(function () {
                $('#mainMenu').perfectScrollbar('update');
            }, timeout || 1);
        };

        _self.open = openMainMenu;

        _self.close = closeMainMenu;

        _self.toggleMainMenu = toggleMainMenu;

        _self.menuAction = function menuAction(e, actionName) {
            e.preventDefault();
            var externalLink = null, serverVariables = pageshare.serverVariables;
            if (actionName) {
                if (actionName === 'scroll') {
                    $("html, body").animate({scrollTop: 0}, "fast");
                } else if (actionName === 'collections') {
                    var collParent = $('#mainMenu').find('ul > li.collections.parent');
                    $(collParent).toggleClass('open', !$(collParent).hasClass('open'));
                } else if (serverVariables && serverVariables.legacyMainMenuModel) {
                    if (actionName === 'freeSoftware') {
                        externalLink = $.grep(serverVariables.legacyMainMenuModel, function (n, i) {
                            var name = n.title || '';
                            return name.toLowerCase().startsWith("free software");
                        });
                    } else if (actionName === 'principles') {
                        externalLink = $.grep(serverVariables.legacyMainMenuModel, function (n, i) {
                            var name = n.title || '';
                            return name.toLowerCase() === "principles";
                        });

                    }
                }

                externalLink = externalLink && externalLink.length ? externalLink[0] : null;
                if (externalLink) {
                    var splitArr = externalLink.url ? externalLink.url.split('/') : [];
                    if (actionName === 'principles' && splitArr.length) {
                        awr.router.go('coll-index', {params: {cId: splitArr[splitArr.length - 1]}});
                    } else {
                        window.location = externalLink.url;
                    }
                }


            }
        };

        _self.resetSelected = function resetSelected() {
            var mainMenuKey = '#mainMenu';
            if (pageshare.currentCollection && pageshare.collections) {
                var currentId = pageshare.currentCollection.id,
                    all = $(mainMenuKey).find('.parent').find('a'),
                    selected = $(mainMenuKey).find('.parent').find('a[awr-link="#c/' + currentId + '"]');
                $(all).removeClass('selected');
                $(selected).addClass('selected');
            }
        };

        _self.reload = function () {
            var collections = pageshare.collections;
            _self.reloadLock = awr.ux.initLock(_self.reloadLock);
            _self.reloadLock.setDuration(1000);
            awr.ux.execWithLock(_self.reloadLock, function () {
                reload(collections);
            });
        };

        _self.setSelected = function (col_id) {
            var container = $('#mainMenu'),
                selected = $(container).find('.c-item[data-c-id="' + col_id + '"]'),
                alreadySelected = $(container).find('.c-item.selected[data-c-id="' + col_id + '"]');
            if (Q.$stringExist(col_id + '') && Q.$arrayNotEmpty(selected) && !Q.$arrayNotEmpty(alreadySelected)) {
                $(container).find('.c-item').removeClass('selected');
                $(selected).addClass('selected');
            }
        };


    }

    window.pageshare = pageshare;
})(window, jQuery);





!(function (window, $) {
    var pageshare = window.pageshare || {};
    pageshare.searchBar = new SearchBar();
    function SearchBar() {
        var _self = this,
            searchBarTemp = Pageshare.Templates['assets/modules/searchBar/searchBar.hbs'];

        function init() {
            var rendered = $(searchBarTemp({}));
            $('.navbar .navbar-inner .container-fluid #mainlogo').after($(rendered));
        }

        _self.start = function () {
            init();
            $.each($('#mainMenu ul li.parent ul li'),function(){
                var nxtText = $(this).text();
                // console.log($(this).text().toLowerCase().indexOf("collections"));
                // if($(this).text().toLowerCase().indexOf("collections") === 7){
                    // console.log($(this).text() + "with index of" + $(this).text().toLowerCase().indexOf("collections"));
                    // $('.search-bar form').after($(this));
                    console.log($(this).find('a').text());
                // }

            });
        };


    }

    window.pageshare = pageshare;
})(window, jQuery);


!(function (window, $) {
    'use strict';
    var awr = window.awr || {},
        Q = awr.Q,
        pageshare = window.pageshare || {};
    pageshare.shelfCtrl = new ShelfCtrl();
    pageshare.shelfCtrl.currentShelfDom = null;


    function ShelfCoverService() {
        Q.$waitForComps({name: 'awr.imgCache', type: 'object'}).then(function onImgCacheReady() {
            awr.imgCache.initCache();
            awr.imgCache.createGroup('shelf-covers');
        }, function onTimeOutErr(err) {

        });
        function waitForBusyDoc(doc_id) {
            return new Promise(function (resolve, reject) {
                pageshare.docServer.waitForBusyDoc(doc_id, function whenDocReady() {
                    resolve('ready');
                }, "collection-" + doc_id);
            });
        }

        function getDocState(doc_id) {
            return new Promise(function (resolve, reject) {
                if (!( Q.$stringExist(doc_id + '') && (doc_id.startsWith('doc-') || doc_id.startsWith('d')))) {
                    reject('bad docId');
                }
                pageshare.docServer.getDocState(doc_id, function onComplete(state) {

                    resolve(state);
                });
            });
        }

        function setInReadyState(docId, coverURL, time) {

            time = Q.$numberExist(time) && time >= 0 ? time : 0;
            if (!(Q.$stringExist(docId + '') && Q.$stringExist(coverURL) )) {
                return;
            }
            var cover = $('#shelf').find('.cover[data-book-id="' + docId + '"]')[0],
                img = $(cover).find('img.cover-img');
            if (Q.$objectExist(awr.imgCache) && awr.imgCache.inCache('shelf-covers', coverURL)) {
                $(cover).find('.caption').removeClass('loading');
                $(cover).find('.caption').fadeOut('fast', function () {
                    img = awr.imgCache.getImg('shelf-covers', coverURL);
                    $(img).addClass('cover-img');
                    $(img).css('display', 'inline');
                    $(cover).find('img.cover-img').replaceWith(img);
                });
                return;
            } else if (Q.$objectExist(awr.imgCache)) {
                awr.imgCache.addToGroup('shelf-covers', coverURL);
            }
            setTimeout(function showCoverTimeout() {
                $(img).attr('src', coverURL);
                $(cover).find('.caption').fadeOut(500, function () {
                    $(img).fadeIn(1000);
                });
            }, time);
        }

        return {
            $waitForBusyDoc: waitForBusyDoc,
            $getDocState: getDocState,
            $setInReadyState: setInReadyState
        };
    }

    function ShelfDomService() {
        function removeShelf() {
            $("#shelf").remove();
            $(".book-content-separator").remove();
        }

        function getShelfDom() {
            var shelf = $('#shelf');
            return Q.$arrayNotEmpty(shelf) ? shelf[0] : Q.$objectExist(shelf) ? shelf : null;
        }

        function setCoversInLoadingMode() {
            $('#shelf').find('.cover .caption').addClass('loading');
        }

        function getCovers() {
            var covers = $('#shelf').find('.cover');
            return Q.$arrayExist(covers) ? covers : [];
        }

        function getCoverId(cover) {
            return $(cover).data('book-id');
        }

        function setAsSelected(doc) {
            if (!Q.$objectExist(doc)) {
                return;
            }
            $('#shelf').find('.cover').removeClass('selected');
            $('#shelf').find('.cover[data-book-id=' + doc.id + ']').addClass('selected');
            if (Q.$stringExist(doc.id) && doc.id.startsWith('doc-')) {
                $('#shelf').find('.cover[data-book-id=' + doc.id.replace('doc-', 'd') + ']').addClass('selected');
            }
        }

        function getCoverByDocId(coverId) {
            coverId = Q.$stringExist(coverId) ? coverId : '--null---';
            var cover = $('#shelf').find('.cover[data-book-id="' + coverId + '"]');
            return Q.$arrayNotEmpty(cover) ? cover[0] : Q.$objectExist(cover) ? cover : null;
        }

        function setInForbiddenMode(cover) {
            if (!Q.$objectExist(cover)) {
                return false;
            }
            $(cover).find('.caption').addClass('forbidden');
            $(cover).find('.caption').removeClass('loading');
            $(cover).find('.caption').removeClass('working');
            $(cover).addClass('forbidden');
            return true;

        }

        function notifyWhoIsOwner(currentCollection, currentUser) {
            if (Q.$stringEqual(currentCollection.id + '', 'aggregated-collection')) {
                return;
            }
            if (Q.$objectExist(currentUser) &&
                !Q.$stringEqual(currentUser.user_id + '', currentCollection.owner_id + '')) {
                $('#shelf .coll-owner-info').removeClass('hidden');
                if ($('body').hasClass('open-sidebar')) {
                    $('#shelf .coll-owner-info').css('right', '245px');
                } else {
                    $('#shelf .coll-owner-info').css('right', '15px');
                }
                $('#shelf .coll-owner-info .fa-remove').off('click');
                $('#shelf .coll-owner-info .fa-remove').on('click', function (e) {
                    e.preventDefault();
                    $('#shelf .coll-owner-info').addClass('hidden');
                });
                setTimeout(function () {
                    $('#shelf .coll-owner-info').fadeOut(1000);
                }, 4500);
                $('#shelf .cover.add-book').addClass('hidden');
            } else {
                $('#shelf .coll-owner-info').addClass('hidden');
                $('#shelf .cover.add-book').removeClass('hidden');
            }
        }

        function setInAdminMode(cover) {
            if (!Q.$objectExist(cover)) {
                return false;
            }
            $(cover).addClass('admin-only');
            $(cover).find('.caption').append("<span style='position:absolute;bottom:0;left:0;height:15px'" +
                " class='fa fa-unlock'>&nbsp;admin</span>");
            return true;
        }

        function setInWorkingMode(cover) {
            if (!Q.$objectExist(cover)) {
                return false;
            }
            $(cover).find('.caption').removeClass('loading');
            $(cover).find('.caption').removeClass('loading');
            $(cover).find('.caption').addClass('working');
            return true;
        }

        function setInSecureMode(cover) {
            if (!Q.$objectExist(cover)) {
                return false;
            }
            $(cover).remove();
            return true;
        }

        return {
            $setCoversInLoadingMode: setCoversInLoadingMode,
            $getShelfDom: getShelfDom,
            $getCovers: getCovers,
            $setInAdminMode: setInAdminMode,
            $setInForbiddenMode: setInForbiddenMode,
            $setInSecureMode: setInSecureMode,
            $getCoverId: getCoverId,
            $getCoverByDocId: getCoverByDocId,
            $setInWorkingMode: setInWorkingMode,
            $removeShelf: removeShelf,
            $notifyWhoIsOwner: notifyWhoIsOwner,
            $setAsSelected: setAsSelected
        }
    }

    function ShelfViewService(coverService, domService) {
        function setCollInView$(newColl) {
            pageshare.shelfCtrl.currentShelfDom = null;
            domService.$removeShelf();
            var currentCollection = pageshare.currentCollection,
                currentUser = pageshare.currentUser,
                processedRes = newColl,
                docs = newColl.docs;
            docs = Q.$arrayExist(docs) ? docs : [];
            docs = Q.$map(docs, function () {
                var nxt = Q.$objectExist(this.book) ? this.book : this;
                if (Q.$functionExist(pageshare.collServer.fixMissingLegacyDocAPI)) {
                    pageshare.collServer.fixMissingLegacyDocAPI(nxt);
                }
                return nxt;
            });
            processedRes.docs = docs;
            processedRes = processResult(processedRes);
            compileView(processedRes);
            loadCoverImages(processedRes.docs);
            if (Q.$objectExist(currentCollection) &&
                Q.$stringEqual(newColl.id + '', currentCollection.id + '')) {
                domService.$notifyWhoIsOwner(currentCollection, currentUser);
            }

            pageshare.shelfCtrl.currentShelfDom = domService.$getShelfDom();
        }

        function processResult(shelf) {
            var processed = [];
            var currentDoc = pageshare.currentDoc ? pageshare.currentDoc.book : {};
            Q.$forEachIndex(shelf.docs, function (doc, i) {
                doc = Q.$objectExist(doc.book) ? doc.book : doc;
                if (Q.$functionExist(pageshare.collServer.fixMissingLegacyDocAPI)) {
                    pageshare.collServer.fixMissingLegacyDocAPI(doc);
                }
                doc.isSelected = doc.id === currentDoc.id;
                var nxtName = doc.name.replace(/[\!\?\/\=\#\.]/g, '')
                        .replace(/\s/g, '_').toLowerCase(),
                    nxtId = doc.id.startsWith('doc-') ? doc.id.replace('oc-', '') : doc.id;
                doc.uiLink = "#v/" + nxtName + "/" + nxtId + "/index";
                processed.push(doc);
            });

            shelf.shelf_editable = pageshare.currentUser && shelf && pageshare.currentUser.user_id === shelf.owner_id;
            return {
                shelf_id: pageshare.currentCollection ? pageshare.currentCollection.id : "main",
                shelf_editable: shelf.shelf_editable,
                docs: processed
            };
        }

        function loadCoverImages(docs) {
            if (!Q.$arrayExist(docs)) {
                return;
            }
            domService.$setCoversInLoadingMode();
            var hiddenIds = Q.$map(docs, function () {
                    if (Q.$booleanFalse(isDocVisible(this))) {
                        return this.id;
                    }
                }),
                adminVisibles = Q.$map(docs, function () {
                    return isDocVisibleForAdmin(this) ? this.id : undefined;
                });

            Q.$forEachIndex(domService.$getCovers(), function (nextCover, i) {
                var nextCId = domService.$getCoverId(nextCover),
                    inHiddenArray = Q.$setContainsString(hiddenIds, nextCId),
                    inAdminArray = Q.$setContainsString(adminVisibles, nextCId);
                if (Q.$booleanTrue(inHiddenArray)) {
                    domService.$setInForbiddenMode(nextCover);
                }
                if (Q.$booleanTrue(inAdminArray)) {
                    domService.$setInAdminMode(nextCover);
                }
                if (Q.$booleanTrue(inHiddenArray) && Q.$booleanFalse(inAdminArray)) {
                    domService.$setInSecureMode(nextCover);
                }
            });
            Q.$forEachIndex(docs, function (nxt, d) {
                var nxt_id = nxt.id,
                    nextCoverImgUrl = nxt.file_url_cover;
                if (!Q.$stringExist(nxt_id + '')) {
                    return;
                }
                if (Q.$objectExist(awr.imgCache) && awr.imgCache.inCache('shelf-covers', nextCoverImgUrl)) {
                    coverService.$setInReadyState(nxt_id, nextCoverImgUrl, 0);
                }
                coverService.$getDocState(nxt_id).then(function onState(state) {
                    if (Q.$booleanTrue(state.is_busy)) {
                        domService.$setInWorkingMode(domService.$getCoverByDocId(nxt_id));
                        coverService.$waitForBusyDoc(nxt_id).then(function onDocReady() {
                            coverService.$setInReadyState(nxt_id, nextCoverImgUrl, 400);
                        });
                    } else {
                        coverService.$setInReadyState(nxt_id, nextCoverImgUrl, 400);
                    }
                }, function onNoState() {
                    if (Q.$stringExist(nextCoverImgUrl)) {
                        coverService.$setInReadyState(nxt_id, nextCoverImgUrl, 400);
                    }
                });
            });
        }

        function isDocVisibleForAdmin(doc) {
            return Q.$booleanFalse(pageshare.docServer.isUserDocOwner(doc)) &&
                Q.$booleanFalse(isDocVisibleByDefault(doc)) && Q.$booleanTrue(isUserAdmin());
        }

        function isUserAdmin() {
            return Q.$objectExist(pageshare.currentUser) && Q.$booleanTrue(pageshare.currentUser.is_admin);
        }

        function isDocVisible(doc) {
            return Q.$or(isUserAdmin(), isDocVisibleByDefault(doc));
        }

        function isDocVisibleByDefault(doc) {
            if (Q.$objectExist(pageshare.docServer)) {
                return pageshare.docServer.isDocVisible(doc);
            }
            awr.errorLog('shelfCtrl@App', 'App module docServer is missing, but required.',
                'Pageshare.docServer is required for determining doc visibility in shelf');
            return false;
        }

        function compileView(res) {
            res = res || {};
            var shelfTemplate = Pageshare.Templates['assets/modules/shelfCtrl/shelf.hbs'],
                currentDoc = Q.$objectExist(pageshare.currentDoc) && Q.$objectExist(pageshare.currentDoc.book) ?
                    pageshare.currentDoc.book : Q.$objectExist(pageshare.currentDoc) ? pageshare.currentDoc : null,
                currentId = getDocId(currentDoc),
                nxtId, rendered;
            res.docs = Q.$arrayNotEmpty(res.docs) ? Q.$map(res.docs, function () {
                nxtId = getDocId(this);
                this.isSelected = Q.$exist(nxtId) && Q.$exist(currentId) && Q.$exist(currentDoc) &&
                    Q.$stringEqual(currentId, nxtId);

                return this;
            }) : res.docs;
            rendered = $(shelfTemplate(res));
            if (Q.$objectExist(awr.domAttrs)) {
                awr.domAttrs.$compile(rendered, {router: awr.router});
            }
            $("#contents").prepend(rendered);
        }

        return {
            setCurrentCollectionInView: setCollInView$
        }
    }

    function getDocId(doc) {
        var id;
        if (!Q.$objectExist(doc)) {
            return null;
        }
        id = Q.$stringExist(doc.id) ? doc.id : Q.$objectExist(doc.book) && Q.$stringExist(doc.book.id) ?
            doc.book.id : null;
        id = Q.$stringExist(id) && id.startsWith('d') &&
        Q.$booleanFalse(id.startsWith('doc-')) ? id.replace('d', 'doc-') : id;
        return id;
    }

    function ShelfCtrl() {
        var _self = this,
            coverService = new ShelfCoverService(),
            domService = new ShelfDomService();
        _self.viewService = new ShelfViewService(coverService, domService);
        _self.close = function () {
            //keep the element it includes data-shelf-id for reload
            // $("#shelf").html('');
            $("#shelf").css('display', 'none');
            $(".book-content-separator").remove();
        };
        _self.reload = function () {
            _self.reloadLock = awr.ux.initLock(_self.reloadLock);
            _self.reloadLock.setDuration(50);
            awr.ux.execWithLock(_self.reloadLock, function execCompileUI() {
                reloadFn();
            });
        };
        _self.open = function open$() {
            _self.openLock = awr.ux.initLock(_self.openLock);
            _self.openLock.setDuration(50);
            awr.ux.execWithLock(_self.openLock, function execCompileUI() {
                initShelf();
            });
        };
        _self.resetSelected = function resetSelected$() {
            domService.$setAsSelected(pageshare.currentDoc);
        };
        function reloadFn() {
            var collServer = pageshare.collServer;
            pageshare.shelfCtrl.currentShelfDom = null;
            // initShelf();
            awr.Q.$waitForComps([{
                name: 'pageshare.collServer',
                type: 'object'
            }, {
                name: 'pageshare.currentCollection',
                type: 'object'
            }]).then(function onScc() {
                return !Q.$objectExist(pageshare.currentDoc) ? awr.Q.$waitForComps([{
                    name: 'pageshare.currentDoc',
                    type: 'object'
                }]).then(function onScc() {
                        if (Q.$objectExist(pageshare.currentDoc)) {
                            initShelf();
                        }
                    }, function onErr(err) {
                        initShelf();
                    }
                ) : initShelf();
            }, function onErr(err) {

            });
        }

        function initShelf() {
            var collection = pageshare.currentCollection;
            if (Q.$objectExist(collection)) {
                _self.viewService.setCurrentCollectionInView(collection);
            }
        }
    }

    window.pageshare = pageshare;

})(window, jQuery);


/**
 * @author: kavan soleimanbeigi
 * @date: 14.5.2017
 */
!(function (window, $) {
    'use strict';
    window.awr = window.awr || {};
    window.awr.bootQueue = window.awr.bootQueue || [];
    var awr = window.awr || {},
        Q = awr.Q,
        bootQueue = awr.bootQueue;

    var simpleSearchModule = {
        moduleName: 'simpleSearch@App',
        requires: [{
            name: 'awr.$$appEssentials',
            type: 'object'
        }, {
            name: 'pageshare.collServer',
            type: 'object'
        }],
        wTime: 1500,
        init: init,
        QAsContext: true
    };
    bootQueue.push(simpleSearchModule);

    function init() {
        var indexId;
        pageshare.simpleSearch = new SimpleSearch();
        function SimpleSearch() {
            var flatSearchSet = [];

            function start$(searchState) {
                var state = Q.$objectExist(searchState) ? searchState : null;
                var query = Q.$objectExist(state) && Q.$objectExist(state.params) &&
                Q.$stringExist(state.params.query + '') ? state.params.query : '';
                query = query.replace(/\_/g, ' ');
                indexId = Q.$objectExist(state) && Q.$objectExist(state.attrs) &&
                Q.$exist(state.attrs.current) && Q.$stringExist(state.attrs.current + '') ? state.attrs.current : 'index';

                query = window.decodeURI(query);

                var docsSetSet, flatFullSet, uniqueIds = [];
                pageshare.collServer.findAllCollections(function (colls) {
                    docsSetSet = Q.$map(colls, function () {
                        return this.docs;
                    });
                    flatFullSet = Q.$flatten(docsSetSet, function () {
                        if (Q.$stringExist(this.id + '') && !Q.$setContainsString(uniqueIds, this.id + '')) {
                            uniqueIds.push(this.id + '');
                            return this;
                        }
                    });
                    flatFullSet = Q.$arrayExist(flatFullSet) ? flatFullSet : [];
                    // query = 'Luisa-Claudia Sovijärvi';
                    flatSearchSet = pageshare.scoredDocSearch.searchByQuery(flatFullSet, query);
                    flatSearchSet = Q.$reduce(flatSearchSet, function () {
                        return Q.$stringEqual(this.allow_aggregating + '', '1');
                    });
                    pageshare.UI.show(function () {
                        pageshare.currentCollection = {
                            id: 'aggregated-collection',
                            owner_id: Q.$objectExist(pageshare.currentUser) ? pageshare.currentUser.id : '0',
                            docs: flatSearchSet
                        };
                        pageshare.shelfCtrl.open();
                        setTimeout(function () {
                            $.each($('#shelf .cover'), function eachCover() {
                                $(this).attr('awr-link', null);
                                $(this).off('click');
                                $(this).on('click', function onClk(event) {
                                    event.preventDefault();
                                    showDoc($(this).data('book-id') + '', state);
                                });
                            });
                        }, 250);
                        if (Q.$arrayNotEmpty(flatSearchSet)) {
                            Q.$qTry(function () {
                                showDoc(Q.$stringEqual(indexId + '', 'index') ? flatSearchSet[0].id + '' : indexId, state);
                            }, function onErr() {
                                showEmptyResultView();
                            });
                        } else {
                            showEmptyResultView();
                        }
                    });
                });
            }

            function showEmptyResultView() {
                $('#shelf').css('min-height', '250px');
                $('#shelf').append('<div class="empty-search" ' +
                    'style="width: 100%;text-align: center"><h3>' +
                    '<span class="fa fa-meh-o fa-2x">&nbsp;</span></h3><br/><h3>Sorry, but ' +
                    'there is no result to show for this search!</h3></div>');

                $('#ajax-content').html('');
            }

            function showDoc(origId, searchState) {
                var docId = origId + '';
                pageshare.UI.hide();
                setTimeout(function () {
                    docId = Q.$stringExist(docId) && docId.startsWith('d') &&
                    Q.$booleanFalse(docId.startsWith('doc-')) ? 'doc-' + (docId.replace('d', '')) : docId;
                    pageshare.docReader.openPreview({
                        docId: docId,
                        complete: function previewComp(preview) {
                            initPreview(preview, origId, searchState);
                        }
                    });
                }, 50);
            }

            function initPreview(preview, origId, state) {
                var currentDoc = pageshare.currentDoc, container = '<div class="open-doc"></div>';
                currentDoc = Q.$objectExist(currentDoc) && Q.$objectExist(currentDoc.book) ? currentDoc.book : currentDoc;
                $(container).html(preview);
                awr.domAttrs.$compile($(preview), {router: awr.router});
                $('#ajax-content').html($(preview).find('.open-doc'));
                if (Q.$objectExist(state)) {
                    state.attrs = Q.$objectExist(state.attrs) ? state.attrs : {};
                    state.attrs.current = Q.$stringExist(origId) ? origId : 'index';
                }
                if (Q.$objectExist(currentDoc)) {
                    currentDoc = pageshare.collServer.fixMissingLegacyDocAPI(currentDoc);
                    pageshare.currentDoc = currentDoc;
                    pageshare.docReader.buildDocInfoUI(currentDoc);
                }
                awr.router.go(state.name, state, false);
                pageshare.UI.show(function () {
                    pageshare.currentCollection = {
                        id: 'aggregated-collection',
                        owner_id: Q.$objectExist(pageshare.currentUser) ? pageshare.currentUser.id : '0',
                        docs: flatSearchSet
                    };
                    pageshare.shelfCtrl.open();
                    setTimeout(function () {
                        $.each($('#shelf .cover'), function eachCover() {
                            $(this).attr('awr-link', null);
                            $(this).off('click');
                            $(this).on('click', function onClk(event) {
                                event.preventDefault();
                                showDoc($(this).data('book-id') + '', state);
                            });
                        });
                        pageshare.shelfCtrl.resetSelected();
                    }, 250);
                });
            }

            return {
                start: start$
            }
        }
    }


})(window, jQuery);








!(function (window, $) {
    var pageshare = window.pageshare || {};
    pageshare.tagSearch = new TagSearch();
    pageshare.scoredDocSearch = new DocSearch();
    function DocSearch() {
        function DocData(doc) {
            var dataObj = doc && doc.attributes.attribute ? doc.attributes.attribute : {};
            dataObj.book_name = doc && doc.book_name ? doc.book_name : '';
            return dataObj;
        }
        function buildScoreTable(doc, query) {
            var data = new DocData(doc);
            return awr.ux.scoredSearch.buildScoreTable(data, query);
        }

        function compareNumbers(a, b) {
            return b > a ? 1 : b === a ? 0 : -1;
        }

        return {
            scoreTable: buildScoreTable,
            searchByQuery: function (flatDocArray, query, criteria) {
                if (!(query && query.length)) {
                    return [];
                }
                var sorted = [];
                for (var d in flatDocArray) {
                    var nxt = flatDocArray[d];
                    sorted[d] = nxt;
                    sorted[d].scoreTable = buildScoreTable(nxt, query);
                }
                sorted.sort(function (a, b) {
                    var aTable = a.scoreTable.score, bTable = b.scoreTable.score,
                        isKeySearch = criteria && criteria.length && criteria.startsWith('field:'), key = null;
                    if (isKeySearch) {
                        key = criteria.split(':').length > 0 ? criteria.split(':')[1] : null;
                    }
                    if (key) {
                        var keyCapitalized = key.substring(0, 1).toUpperCase() + key.substring(1);
                        if (typeof aTable[key] !== "undefined" && typeof bTable[key] !== "undefined") {
                            return compareNumbers(aTable[key], bTable[key]);
                        } else if ( typeof aTable[keyCapitalized] !== "undefined" &&
                            typeof bTable[keyCapitalized] !== "undefined") {
                            return compareNumbers(aTable[keyCapitalized], bTable[keyCapitalized]);
                        } else {
                            return compareNumbers(aTable.total, bTable.total);
                        }
                    } else {
                        return compareNumbers(aTable.total, bTable.total);
                    }
                });
                sorted = $.grep(sorted,function (n, i) {
                    return n.scoreTable.score.total;
                });
                return sorted;
            }
        };
    }

    function TagSearch() {
        var _self = this,
            searchViewTemp = Pageshare.Templates['assets/modules/tagSearch/tagSearch.hbs'],
            resultGroupTemp = Pageshare.Templates['assets/modules/tagSearch/resultGroup.hbs'];
        _self.searchManager = new DocSearch();
        _self.results = [];
        _self.initC = 0;

        function compileResultView() {
            var onCoverClick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                $('.doc-search .results-main').off('click', '.cover', onCoverClick);
                var previewMain = $('.doc-search .preview-main');
                $(previewMain).addClass('loading');
                $('.doc-search .results-main .cover').removeClass('p-selected');
                $(this).addClass('p-selected');
                pageshare.docReader.openPreview({
                    docId: $(this).data('book-id'),
                    complete: function complete(previewElement) {
                        setTimeout(function () {
                            _self.showPreview(previewElement);
                        }, 500);
                    }, fail: function () {

                    }
                });

            };
            $('.doc-search .results-main .cover').on('click', onCoverClick);
        }

        function init(opts) {
            opts = opts || {};
            var query = opts.query || '',
                group = opts.group || '',
                groupStr = group && group.length ? ' in ' + group : '';
            setTimeout(function () {
                pageshare.shelfCtrl.close();
                var rendered = $(searchViewTemp({
                    searchTitle: query + groupStr
                }));
                $('#ajax-content').html(rendered);
                _self.initC = 0;
            }, 200);
            var res_keys = [];
            var results = [];
            pageshare.docServer.findAllCollections(function (res) {
                for (var c_id in res) {
                    var nxtCol = res[c_id], counter = res.length;
                    if (nxtCol && nxtCol.id) {
                        (function (nxt_collection, nextCol_Id) {
                            pageshare.docServer.findDocsByCollection(nxt_collection.id,
                                function (res_by_col) {
                                    counter--;
                                    if (!(res_by_col && res_by_col.docs)) {
                                        return;
                                    }
                                    var nxtGroup;
                                    nxtGroup = $.grep(res_by_col.docs, function (n) {
                                        return res_keys.indexOf(n.id) < 0;
                                    });
                                    if (nxtGroup.length > 0) {
                                        results.push(nxtGroup);

                                    }
                                    /**
                                     * results = [resGroup1:[...doc], resGroup2:[..doc]]
                                     */
                                    $.each(results, function (i, result_group) {
                                        $.each(result_group, function (x, nextDoc) {
                                            if (res_keys.indexOf(nextDoc.id) < 0) {
                                                res_keys.push(nextDoc.id);
                                            }
                                        });
                                    });
                                    if (counter < 1) {
                                        $.each(results, function (i, result_group) {
                                            results[i] = $.grep(result_group, function (nextDoc, x) {
                                                return res_keys.indexOf(nextDoc.id + '') >= 0;
                                            });
                                        });
                                        if (typeof opts.ready === "function") {
                                            opts.ready(results);
                                        }
                                    }
                                });
                        })(nxtCol, c_id);

                    }
                }
            });
        }

        function flattenAndShowRes(query, criteria) {
            var flatten = [].concat.apply([], _self.results), res_keys = [];
            flatten = $.grep(flatten, function (n, i) {
                if (n && n.id && res_keys.indexOf(n.id) < 0) {
                    res_keys.push(n.id);
                    return true;
                }
                return false;
            });
            var results = _self.searchManager.searchByQuery(flatten, query, criteria);
            $('.doc-search .main .results-main .content').find('.result-group').remove();
            _self.insertResultsInUI(results, results[0], function () {
                $($('.doc-search .main .results-main .content .cover')[0])
                    .addClass('p-selected');
            });


        }

        _self.start = function (opts) {
            opts = opts || {};
            opts.query = 'Roosa Lehtinen';
            opts.group = 'Authors';
            var criteria = "field:" + opts.group;
            _self.initSearchViewLock = awr.ux.initLock(_self.initSearchViewLock);
            _self.initSearchViewLock.duration = 500;
            awr.ux.execWithLock(_self.initSearchViewLock, function exec() {
                init({
                    query: opts.query,
                    group: opts.group,
                    ready: function (results) {
                        _self.results = results;
                        flattenAndShowRes(opts.query, criteria);

                    }
                });
            });
        };

        _self.insertResultsInUI = function (docs, defaultPreview, success) {
            if (!docs || docs.length < 1) {
                return;
            }
            var rendered = $(resultGroupTemp({
                results: docs,
                sortMode: ''
            }));

            setTimeout(function () {
                $('.doc-search .main .results-main .content').append(rendered);
                compileResultView();
                var previewMain = $('.doc-search .preview-main');
                $(previewMain).removeClass('empty');
                if (defaultPreview && defaultPreview.id) {
                    pageshare.docReader.openPreview({
                        docId: defaultPreview.id,
                        complete: function complete(previewElementNew) {
                            _self.showPreview(previewElementNew);
                            if (typeof success === "function") {
                                success();
                            }
                        }, fail: function () {
                        }
                    });
                    defaultPreview = null;
                }
            }, 500);
        };
        _self.showPreview = function (previewElement) {
            var previewMain = $('.doc-search .preview-main');
            setTimeout(function () {
                var pCont = $(previewMain).find('.content');
                $(pCont).html($(previewElement));
                $(previewMain).removeClass('loading');
                if ($(pCont).height() < $(previewMain).height()) {
                    $(previewMain).height($(pCont).height() + 50);
                }

            }, 1500);
        };
        _self.resizeView = function (mode) {
            if (mode && mode === "large") {
                $('.doc-search .icon-group.lg-mode').addClass('selected');
                $('.doc-search .icon-group.md-mode').removeClass('selected');
                $('.doc-search .main .preview-main').addClass('large');
                $('.doc-search .main .results-main').addClass('large');
                $('.doc-search .main .results-main').removeClass('medium');
            } else {
                $('.doc-search .icon-group.md-mode').addClass('selected');
                $('.doc-search .icon-group.lg-mode').removeClass('selected');
                $('.doc-search .main .preview-main').removeClass('large');
                $('.doc-search .main .results-main').addClass('medium');
                $('.doc-search .main .results-main').removeClass('large');
            }
        };
    }

    window.pageshare = pageshare;
})(window, jQuery);


/*globals console*/
!(function (window, $) {
    'use strict';
    var pageshare = window.pageshare || {},
        awr = window.awr || {},
        Q = awr.Q;
    pageshare.UI = new UI();
    function UI() {
        var _self = this;

        function setScrollListener() {
            var scrollTrigger = 8,
                lastPosition = 0,
                timer = null;
            $(window).scroll(function () {
                var scrolled = window.scrollY > 0;
                $("body").toggleClass("scrolled", scrolled);
                if (!scrolled) {
                    $("body").removeClass("show-navi");
                    return;
                }
                var scrollDelta = window.scrollY - lastPosition;
                if (scrollDelta > 0) {
                    $("body").removeClass("show-navi");
                    $('#mainMenu').css('top', '0');
                    pageshare.mainMenu.updateMenuScrollbar(250);
                    lastPosition = window.scrollY;
                    clearTimeout(timer);
                } else if (-scrollDelta > scrollTrigger) {
                    $("body").addClass("show-navi");
                    $('#mainMenu').css('top', '58px');
                    pageshare.mainMenu.updateMenuScrollbar(250);
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        lastPosition = window.scrollY;
                    }, 1000);
                }
            });
        }

        _self.showNotFound = function shNotFoundVw() {
            showNotFoundView();

        };
        _self.reloadMainHeader = function reloadMainHeader() {
            pageshare.mainHeader.reload();
        };
        _self.reloadShelf = function reloadShelf() {
            pageshare.shelfCtrl.reload();
        };
        _self.reloadMainMenu = function reloadMainMenu() {
            if ($('body').attr('id') !== "premium") {
                // pageshare.mainMenu.close();
                pageshare.mainMenu.reload();

            }
        };
        _self.reloadCurrentDoc = function reloadDoc() {
            var currentDocExist = Q.$objectExist(pageshare.currentDoc) && Q.$exist(pageshare.currentDoc.id);
            if (!currentDocExist) {
                return;
            }
            pageshare.docReader.reload();
        };
        _self.reloadCurrentUser = function reloadUsr(local) {
            pageshare.userNav.reload(local);
        };
        _self.reload = reload;
        _self.show = function showUI(fn, args) {
            $('#shelf').addClass('hidden');
            pageshare.mainMenu.resetSelected();
            setTimeout(function openUI() {
                if (args && args.hideShelf === true) {
                    pageshare.shelfCtrl.close();
                }
                if (typeof fn === "function") {
                    try {
                        fn();

                    } catch (e) {
                        console.error("UI: bad callback for UI.show! \n " + e);
                    }
                }
                $('body > #contents').fadeIn(300);
                $('body > #loading').hide();
                $('body').removeClass('awr-busy');
                $('body').addClass('awr-ready');
            }, 100);
        };
        _self.hide = function hideUI(fn) {
            $('body > #contents').hide();
            $('body > #loading').show();
        };
        _self.compile = compile;
        _self.openDocInReader = function openDocInReader$(docId, pageNumber) {
            var parentColl = findParentCollForDoc(docId);
            if (Q.$objectExist(parentColl)) {
                pageshare.mainMenu.setSelected(parentColl.id);
            }
            _self.inReaderLock = awr.ux.initLock(_self.inReaderLock);
            _self.inReaderLock.setDuration(250);
            var promise = awr.ux.execWithLock(_self.inReaderLock, function execCompileUI() {

                return openInReader(docId, pageNumber);
            });
            return Q.$exist(promise) && Q.$functionExist(promise.then) ? promise : promise.rejectAsPromise('openInReader@Pageshare@App');
        };
        _self.initUI = initUI;
        _self.setDefaultEventHandlers = setDefaultEventHandlers;

        function findParentCollForDoc(docId) {
            var nxtRes, nxtBook, parentColl = Q.$reduce(pageshare.collections, function () {
                if (Q.$arrayNotEmpty(this.docs)) {
                    nxtRes = Q.$reduce(this.docs, function () {
                        nxtBook = this.book;
                        return Q.$setContainsString([this.id,
                                this.doc_id, 'doc-' + this.doc_id, 'd' + this.doc_id], docId) ||
                            ( Q.$objectExist(nxtBook) &&
                            Q.$setContainsString([nxtBook.id,
                                nxtBook.doc_id, 'doc-' + nxtBook.doc_id, 'd' + nxtBook.doc_id], docId));
                    });
                    if (Q.$arrayNotEmpty(nxtRes)) {
                        return true;
                    }
                }
                return false;
            });
            return Q.$arrayNotEmpty(parentColl) ? parentColl[0] : null;
        }

        function showNotFoundView() {

            var userId = Q.$objectExist(pageshare.currentUser) &&
                Q.$exist(pageshare.currentUser.user_id) ? pageshare.currentUser.user_id : null,
                collOwnerId = Q.$objectExist(pageshare.currentCollection) &&
                Q.$exist(pageshare.currentCollection.owner_id) ? pageshare.currentCollection.owner_id : null,
                keepShelf = Q.$exist(userId) && Q.$exist(collOwnerId) && Q.$stringEqual(userId + '', collOwnerId + '');
            _self.show(function () {
                $("#contents #ajax-content")
                    .html("<div class='not-found'>" +
                        "<strong>404 - Not Found!</strong>" +
                        "<h1 class='fa fa-meh-o text-warning'>" +
                        "&nbsp;No content to show here!</h1>" +
                        "</div>");
                if (Q.$booleanTrue(keepShelf)) {
                    Q.$qTry(function () {
                        pageshare.shelfCtrl.open();
                    }, function (e) {
                        console.error(e);
                    });

                } else {
                    Q.$qTry(function () {
                        pageshare.shelfCtrl.close();
                    }, function (e) {
                        console.error(e);
                    });
                }
                fixNotFoundShelfProblem();
            });

        }

        function compile(skipReloadState) {
            _self.compileLock = awr.ux.initLock(_self.compileLock);
            _self.compileLock.setDuration(200);
            awr.ux.execWithLock(_self.compileLock, function execCompileUI() {
                setTimeout(function () {
                    /*compile$ attrs has in addition to awr-links
                     *other useful things such as auto setting class toggle and remove handlers,
                     *  (currently these new features are used by premium search and editCollections)*/
                    awr.domAttrs.$compile($('body'), {router: awr.router});
                }, 500);
                if (skipReloadState === true) {
                    return;
                }
                //premium search
                if ($('body').attr('id') === "premium") {
                    pageshare.mainMenu.close();
                    pageshare.tagSearch.start();
                    pageshare.searchBar.start();
                }

            });
        }

        function reload(useLocalData, ready) {
            // pageshare.getAppData().then(function scc() {
            _self.reloadLock = awr.ux.initLock(_self.reloadLock);
            _self.reloadLock.setDuration(500);
            awr.ux.execWithLock(_self.reloadLock, function exec() {
                initUI(useLocalData, function onInitComplete() {
                    awr.router.reloadCurrentState();

                });
            });
            // });
        }

        function setDefaultEventHandlers() {
            setTimeout(function () {
                $(document).off('click', '#contents', contentsClickEvenHandler);
                $(document).on('click', '#contents', contentsClickEvenHandler);
            }, 500);
        }

        function contentsClickEvenHandler(e) {
            var target = $(e.target);
            if (target.is('.page-share') || target.parents('.page-share').length > 0) {
                return;
            }
            if ($(window).width() < 1600) {
                pageshare.mainMenu.close();
            }
            $(this).parent().find('.page-share').removeClass('open');

        }

        function initUI(useLocalData, complete) {
            pageshare = window.pageshare || {};
            awr = window.awr || {};
            Q = awr.Q;
            _self.hide();
            _self.show(function reloadFunctionList() {
                _self.reloadShelf();
                _self.reloadCurrentDoc();
                _self.reloadCurrentUser(useLocalData);

                //
                _self.compile();
                _self.reloadMainMenu();
                _self.reloadMainHeader();

                setScrollListener();
                setTimeout(function reloadTimeoutFn() {
                    _self.compile();
                    pageshare.mainMenu.resetSelected();
                    if (Q.$functionExist(complete)) {
                        complete();
                    }

                }, 200);

            });
        }

        function openInReader(docId, pageNumber) {
            $('#mainlogo > .text').text('PageShare');
            $('body').removeClass('has_book_info');
            pageshare.currentDoc = null;
            var badDocId = !Q.$exist(docId) || docId <= 0 || Q.$setContainsString(['0', '-1', 'null'], docId);
            if (badDocId) {
                console.warn('openInReader@UI@Pageshare: nothing for be opened in reader. \n\t + Details: Bad docId [' + docId + '].');
            }
            pageNumber = pageNumberExist(pageNumber) ? pageNumber : 'p1';
            return new Promise(function (resolve, reject) {
                if (Q.$booleanTrue(badDocId)) {
                    setTimeout(function () {
                        showNotFoundView();
                        pageshare.mainMenu.reload();
                    }, 300);
                    reject('openInReader@UI@App: Bad docId!');

                } else {
                    pageshare.docReader.openDoc(docId, function complete() {
                        var isBusy = Q.$booleanTrue(pageshare.currentDoc.book.isBusy);
                        pageshare.UI.show();
                        pageshare.UI.reloadShelf();
                        if (!isBusy) {
                            pageshare.docReader.goToPage(pageNumber.replace('p', ''));
                        } else {
                            pageshare.docReader.updatePageNumberInURL(pageshare.currentDoc, "1");
                        }
                        resolve(pageshare.currentDoc);
                    }, function onErr(e) {
                        showNotFoundView();
                        reject(e);
                    });
                }

            });
        }

        function fixNotFoundShelfProblem() {
            var currentUser = pageshare.currentUser,
                currentCollection = pageshare.currentCollection,
                currentState = awr.router.getCurrentState(),
                cId = Q.$objectExist(currentState.attrs) ? currentState.attrs.c : null,
                currentVisibleCount,
                isUserCollOwner,
                proceedWithFix = function proceedWithFix$() {
                    setTimeout(function () {
                        currentVisibleCount = Q.$objectExist(currentCollection) &&
                            Q.$collect(currentCollection.docs, function (collected) {
                                collected = collected || 0;
                                if (Q.$stringEqual(this.visibility + '', '1')) {
                                    collected++;
                                }
                                return collected;
                            });
                        isUserCollOwner = Q.$objectExist(currentUser) &&
                            Q.$stringEqual(currentCollection.owner_id + '', currentUser.user_id + '');
                        if (Q.$booleanTrue(isUserCollOwner) || currentVisibleCount > 0) {
                            pageshare.shelfCtrl.open();
                            // pageshare.shelfCtrl.reload();
                        }
                    }, 200);
                };
            if (!Q.$objectExist(currentCollection) && Q.$stringExist(cId)) {
                pageshare.collServer.loadAsCurrentCollection(cId, function onLoad(item) {
                    currentCollection = item;
                    pageshare.currentCollection = item;
                    proceedWithFix();
                }, function onErr() {
                    proceedWithFix();
                });
            } else {
                proceedWithFix();
            }
        }

        function pageNumberExist(pageNumber) {
            var isIndex = Q.$stringExist(pageNumber) && Q.$stringEqual(pageNumber, 'index'),
                isPNumber = Q.$stringExist(pageNumber) &&
                    pageNumber.startsWith('p') && Q.$numberExist(parseInt(pageNumber.replace('p', '')));
            return isIndex || isPNumber;
        }


    }

})(window, jQuery);


!(function (window, $) {
    var pageshare = window.pageshare || {};
    pageshare.userNav = new UserNav();
    function UserNav() {
        var _self = this;

        $('#sidebar-toggle').click(function () {
            _self.hideInfo();
        });

        $('#mainMenu').click(function () {
            _self.hideInfo();
        });

        $('#contents').click(function () {
            _self.hideInfo();
        });

        function cleanUserName(user_name) {
            return user_name && user_name.length > 0 ? capitalize(user_name.split(' ')[0]) : '';
        }

        function cleanFullName(user_name) {
            var name = user_name.split(' ');
            if (name && name.length > 0) {
                return name.length > 1 ?
                    capitalize(name[0]) + " " + capitalize(name[1]) :
                    capitalize(name[0]);
            }
            return " ";

        }

        function capitalize(str) {
            return str.substring(0, 1).toUpperCase() + str.substring(1);
        }

        function formatDate(date) {
            if (date instanceof Date) {
                var options = {
                    weekday: "long", year: "numeric", month: "short",
                    day: "numeric", hour: "2-digit", minute: "2-digit"
                };
                return date.toLocaleTimeString("en-us", options);
            } else {
                return "";
            }
        }

        function getContext(user) {
            return {
                userName: cleanUserName(user.user_name),
                fullName: cleanFullName(user.user_name),
                userEmail: user.user_email,
                lastLogin: formatDate(new Date(user.user_last_login)),
                userClass: "",
                logoutClass: "",
                loginClass: "hidden"
            };
        }

        _self.hideInfo = function hideInfo() {
            var user = pageshare.currentUser;
            if (user) {
                var el = $('#userNavInfo');
                $(el).removeClass('in');
                $(el).addClass('out');
            }
        };
        _self.showInfo = function showInfo() {
            var user = pageshare.currentUser;
            if (user) {
                var el = $('#userNavInfo');
                $(el).removeClass('out');
                $(el).addClass('in');
            }
        };
        _self.toggleInfo = function toggleInfo() {
            var user = pageshare.currentUser;
            // if (user) {
            var el = $('#userNavInfo');
            if ($(el).hasClass('out') || !$(el).hasClass('in')) {
                $(el).removeClass('out');
                $(el).addClass('in');
            } else {
                $(el).removeClass('in');
                $(el).addClass('out');
            }
            // }
        };
        _self.reload = function reload(local) {
            var template = Pageshare.Templates['assets/modules/userNav/userNav.hbs'];
            var rendered = "";
            if (!local) {
                pageshare.activeLogin.findCurrentUser(function complete(user) {
                    if (!user) {
                        rendered = $(template({
                            userClass: "hidden",
                            logoutClass: "hidden",
                            loginClass: "",
                            userLevel: "guest"
                        }));
                    } else {
                        rendered = $(template(getContext(user)));
                    }
                    $('#userNavContainer').html(rendered);
                    if (user && user.is_admin === true) {
                        $('#userNav .user-info .fa-user').addClass('hidden');
                        $('#userNav .user-info .fa.admin').removeClass('hidden');
                        $('#userNav .user-info .user-role').removeClass('hidden');
                        $('#userNav .user-info #inviteButton').removeClass('hidden');
                    } else {
                        $('#userNav .user-info .fa-user').removeClass('hidden');
                        $('#userNav .user-info .user-role').addClass('hidden');
                        $('#userNav .user-info .fa.admin').addClass('hidden');
                        $('#userNav .user-info #inviteButton').addClass('hidden');
                    }
                });
            } else {
                var user = pageshare.currentUser;
                if (!user) {
                    rendered = $(template({
                        userClass: "hidden",
                        logoutClass: "hidden",
                        loginClass: "",
                        userLevel: "guest"
                    }));
                } else {
                    rendered = $(template(getContext(user)));
                }
                $('#userNavContainer').html(rendered);
                if (user && user.is_admin === true) {
                    $('#userNav .user-info .fa-user').addClass('hidden');
                    $('#userNav .user-info .fa.admin').removeClass('hidden');
                    $('#userNav .user-info .user-role').removeClass('hidden');
                    $('#userNav .user-info #inviteButton').removeClass('hidden');
                } else {
                    $('#userNav .user-info .fa-user').removeClass('hidden');
                    $('#userNav .user-info .user-role').addClass('hidden');
                    $('#userNav .user-info .fa.admin').addClass('hidden');
                    $('#userNav .user-info #inviteButton').addClass('hidden');
                }
            }
        };

    }

    window.pageshare = pageshare;
})(window, jQuery);

