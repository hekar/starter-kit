module.exports = function (shipit) {
	require("shipit-deploy")(shipit);

	var config = require("./config");
	var pathStr = "PATH='$PATH:/usr/local/bin'";
	var currentPath = config.deploy.path + "/current";

	shipit.initConfig({
		default: {
			workspace: "tmp",
			deployTo: config.deploy.path,
			repositoryUrl: "https://github.com/snollygolly/koa-starter.git",
			ignores: [".git", "node_modules"],
			rsync: ["--del"],
			keepReleases: 2,
			key: "~/.ssh/id_rsa",
			shallowClone: true
		},
		production: {
			servers: config.deploy.username + "@" + config.deploy.hostname
		}
	});

	shipit.blTask("install", function () {
		return shipit.remote(pathStr + " && cd " + currentPath + " && npm install &> /dev/null");
	});

	shipit.blTask("start_screen", function () {
		return shipit.remote(pathStr + " && cd " + currentPath + " && screen -S " + config.deploy.screen + " -d -m npm start");
	});

	shipit.blTask("start_session", function () {
		return shipit.remote(pathStr + " && cd " + currentPath + " && npm start");
	});

	shipit.blTask("install_local_config", function () {
		return shipit.remoteCopy("config.json", currentPath);
	});

	shipit.blTask("install_remote_config", function () {
		return shipit.remote("cd " + config.deploy.path + " && cp config.json " + currentPath);
	});

	shipit.blTask("kill_screen", function () {
		return shipit.remote("if screen -ls | grep -q '" + config.deploy.screen + "'; then screen -S " + config.deploy.screen + " -p 0 -X stuff $'\\003'; fi;");
	});

	shipit.on("deployed", function () {
		shipit.start( "kill_screen", "install", "install_local_config", "start_screen");
		// if you"re having problems with the deploy being successful, but not actually starting the server, try this:
		//shipit.start("kill_screen", "install", "install_local_config", "start_session");
	});
};
