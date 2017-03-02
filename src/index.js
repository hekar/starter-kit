"use strict";

const config = require("./config");

const koa = require("koa");
const hbs = require("koa-hbs");
const serve = require("koa-static-folder");

// for passport support
const session = require("koa-generic-session");
const bodyParser = require("koa-bodyparser");
const passport = require("koa-passport");
const routes = require("./routes");

const app = koa();

exports.app = app;
exports.passport = passport;

require("./models/auth");
require("./helpers/handlebars");

app.proxy = true;

app.keys = [config.site.secret];
app.use(session());
app.use(bodyParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(serve("./assets"));
app.use(hbs.middleware({
	viewPath: `${__dirname}/views`,
	layoutsPath: `${__dirname}/views/layouts`,
	partialsPath: `${__dirname}/views/partials`,
	defaultLayout: "main"
}));

app.use(function* error(next) {
	try {
		yield next;
	} catch (err) {
		this.status = err.status || 500;
		this.body = err.message;
		this.app.emit("error", err, this);
	}
});

app.use(routes);

console.log(`${config.site.name} is now listening on port ${config.site.port}`);
app.listen(config.site.port);

process.on("SIGINT", function exit() {
	process.exit();
});
