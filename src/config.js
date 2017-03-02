"use strict";

const rc = require('rc');

module.exports = rc("kramtig", {
	site: {
		name: "Kramtig",
		port: 8080,
		secret: "koa-starter-kit-is-awesome",
		oauth: {
			host: "http://127.0.0.1",
			github: {
				clientID: "OAUTH CLIENT ID FOR GITHUB",
				clientSecret: "OAUTH CLIENT SECRET FOR GITHUB"
			}
		},
		analytics: "UA-00000000-0"
	},
	deploy: {
		username: "username",
		hostname: "hostname",
		path: "~/app",
		screen: "app"
	}
});
