require.config({
	baseUrl: window._ctx.root,

    paths: {
        "async"         : "plugins/requirejs/async",

		"urlsearchparams" : "plugins/url-search-params/url-search-params",

        "jquery"        : "plugins/jquery/jquery.min",
        "bootstrap"     : "plugins/bootstrap/js/bootstrap.min",
        "clipboard"     : "plugins/clipboard/clipboard.min",

        "common"        : "/js/common",
    },

    shim: {
        "bootstrap": {
            deps: ["jquery"],
        },
    },

    deps: ["urlsearchparams"],
});
