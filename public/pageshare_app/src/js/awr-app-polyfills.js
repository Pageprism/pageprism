var awr = window.awr || {};

function _$registerWindowOnLoad() {

    function detectAndBootByWaitForComps(boot, fail) {
        var detector,
            agentOk = false;
        try {
            if (!(awr && awr.Q &&
                typeof awr.Q.$waitForComps === 'function')) {
                if (typeof fail === 'function') {
                    fail();
                    return;
                }
            }
            awr.Q.$waitForComps(['service:browserDetector'], 3000, true, true)
                .then(function () {
                    try {
                        detector = awr.Q.$import('service:browserDetector');
                        if (detector && detector.$detect().name !== 'ie') {
                            agentOk = true;
                        }
                    } catch (e) {
                        agentOk = false;
                    }
                    if (!agentOk) {
                        console.warn('This browser is not supported');
                        if (typeof fail === 'function') {
                            fail();
                        }
                        return;
                    }
                    if (agentOk && typeof boot === 'function') {
                        boot();
                    }
                }, function (err) {
                    if (typeof fail === 'function') {
                        fail();
                    }
                });

        } catch (e) {
            if (typeof fail === 'function') {
                fail();
            }
        }
    }


    function detectAndBootByWaitAndProceed(boot, fail) {
        var detector,
            agentOk = false;

        try {
            if (!(awr && awr.Q &&
                typeof awr.Q.$commonWaitAndProceedOperation === 'function')) {
                if (typeof fail === 'function') {
                    fail();
                    return;
                }
            }
            awr.Q
                .$commonWaitAndProceedOperation(['service:browserDetector'], function () {
                    try {
                        detector = awr.Q.$import('service:browserDetector');
                        if (detector && detector.$detect().name !== 'ie') {
                            agentOk = true;
                        }
                    } catch (e) {
                        agentOk = false;
                    }
                    if (!agentOk) {
                        console.warn('This browser is not supported');
                        if (typeof fail === 'function') {
                            fail();
                        }
                        return;
                    }
                    if (agentOk && typeof boot === 'function') {
                        boot();
                    }
                }, 3000, function () {
                    if (typeof fail === 'function') {
                        fail();
                    }
                })

        } catch (e) {
            if (typeof fail === 'function') {
                fail();
            }
        }
    }


    function winOnLoad() {
        var fn, waitForCont, contentStr;
        try {
            fn = awr.core.templates.app.app;
            if (typeof fn === 'function') {
                contentStr = fn({appName: 'AwrUXApplication'});
                //under 45 chars contains only the comments and rawhelper is not yet ready
                if (contentStr && contentStr.trim().length <= 45) {
                    waitForCont = setInterval(function () {
                        fn = awr.core.templates.app.app;
                        contentStr = fn({appName: 'uxDemoAppProd'});
                        if (contentStr && contentStr.trim().length > 45) {
                            clearInterval(waitForCont);
                            document.getElementById('$$root$$').outerHTML = contentStr;
                        }
                    }, 100);
                } else if (contentStr) {
                    document.getElementById('$$root$$').outerHTML = contentStr;
                } else {
                    console.error('onLoad@index@AWR: handlebars didn\'t load properly. Failed to init index.html (2)');
                }
            } else {
                console.error('onLoad@index@AWR: handlebars didn\'t load properly. Failed to init index.html (1)');
            }
        } catch (e) {
            console.error('onLoad@index@AWR: Failed to init index.html (0).\n\t + Details:' + e);
        }
    }

    function decideBootType(){
        if(!(awr && awr.Q && window.$)){
            return null;
        }
        if (typeof awr.Q.$commonWaitAndProceedOperation === 'function') {
            return detectAndBootByWaitAndProceed;
        }else if(typeof awr.Q.$waitForComps === 'function'){
            return detectAndBootByWaitForComps;
        }
        return null;
    }

    function callOnLoad() {
        var boot = decideBootType();
        if(typeof boot === 'function'){
            boot(winOnLoad, function () {
                if ($) {
                    $('#rootLoadingSpinner').css('display', 'none');
                    $(document.getElementById('$$root$$')).css('display', 'none');
                    $('#badBrowserSupport').css('display', 'block');
                }
            });
        }else{
            if ($) {
                $('#rootLoadingSpinner').css('display', 'none');
                $(document.getElementById('$$root$$')).css('display', 'none');
                $('#badBrowserSupport').css('display', 'block');
            }
        }
    }

    window.onload = callOnLoad;

    if (typeof window.onload !== "function") {
        window.onload = new function () {
            callOnLoad();
        };
    }

}

awr.$registerWindowOnLoad = _$registerWindowOnLoad;

if(typeof awr.$registerWindowOnLoad !== 'function'){
    awr.$registerWindowOnLoad = new function () {
        _$registerWindowOnLoad();
    };
}
!(function (global) {
    /*AWIAR TPL*/
    global.emptyTpls = global.emptyTpls || 0;
    global.emptyTpls++;
})(window);