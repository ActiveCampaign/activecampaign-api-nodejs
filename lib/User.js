var AC_User = {
	
	whitelist: ["add", "delete_list", "delete", "edit", "list", "me", "view"],
	
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