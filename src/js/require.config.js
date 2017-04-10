require.config({
    baseUrl: "js",

    paths: {
        "async"         : "/plugins/requirejs/async",

		"urlsearchparams" : "/plugins/url-search-params/url-search-params",

        "jquery"        : "/plugins/jquery/jquery.min",
        "bootstrap"     : "/plugins/bootstrap/js/bootstrap.min",
        "clipboard"     : "/plugins/clipboard/clipboard.min",

        "common"        : "common",
    },

    shim: {
        "bootstrap": {
            deps: ["jquery"],
        },
    },

    deps: ["urlsearchparams"],
});
