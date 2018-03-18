var AC_User = {

	version: 1,
	url_base: "",
	
	view: function(Connector, params, post_data) {
		var action = "user_view";
		var regex1 = new RegExp("^email=");
		var regex2 = new RegExp("^username=");
		if (params.match(regex1)) {
			action = "user_view_email";
		}
		else if (params.match(regex2)) {
			action = "user_view_username";
		}
		Connector.action = action;
		return Connector;
	}
		
};

module.exports = AC_User;
