var AC_Auth = {

	version: 1,
	url_base: "",

	whitelist: ["singlesignon"],

	singlesignon: function(Connector, params, post_data) {
		var action = "singlesignon";
		Connector.action = action;
		return Connector;
	}

};

module.exports = AC_Auth;