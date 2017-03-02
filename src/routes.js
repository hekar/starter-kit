"use strict";

const config = require("./config");

const passport = require("./index.js").passport;
const Router = require("koa-router");

const routes = new Router();

const main = require("./controllers/main.js");
const account = require("./controllers/account.js");


routes.get("/", main.index);

// Authentication routes
routes.get("/login", account.login);
routes.get("/logout", account.logout);
routes.get("/account", account.index);

// Github OAuth2
routes.get("/auth/github",
	passport.authenticate("github")
);

routes.get("/auth/github/callback",
	passport.authenticate("github", {
		successRedirect: "/account",
		failureRedirect: "/"
	})
);

module.exports = routes.middleware();
