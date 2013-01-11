var AC_Subscriber = {
		
	whitelist: ["add", "delete_list", "delete", "edit", "list", "paginator", "sync", "view"],
	
	view: function(Connector, params, post_data) {
		var action = "subscriber_view";
		var regex1 = new RegExp("^email=");
		var regex2 = new RegExp("^hash=");
		if (params.match(regex1)) {
			action = "subscriber_view_email";
		}
		else if (params.match(regex2)) {
			action = "subscriber_view_hash";
		}
		Connector.action = action;
		return Connector;
	}
		
};

module.exports = AC_Subscriber;