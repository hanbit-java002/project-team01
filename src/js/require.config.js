require.config({
	baseUrl: window._ctx.root,

    paths: {
        "async"         : "/plugins/requirejs/async",


        "jquery"        : "/plugins/jquery/jquery.min",
		"jquery.easing" : "/plugins/jquery.easing/jquery.easing.min",
        "bootstrap"     : "/plugins/bootstrap/js/bootstrap.min",
        "clipboard"     : "/plugins/clipboard/clipboard.min",
		"slick"         : "/plugins/slick/js/slick.min",

        "common"        : "/js/common",
    },

    shim: {
		"jquery.easing": {
			deps: ["jquery"],
		},
        "bootstrap": {
            deps: ["jquery"],
        },
    },

    deps: [],
});
