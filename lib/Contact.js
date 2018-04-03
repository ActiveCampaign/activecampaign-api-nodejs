var AC_Contact = {

	version: 1,
	url_base: "",

	view: function (Connector, params, post_data) {
		var action = "contact_view";
		var regex1 = new RegExp("^email=");
		var regex2 = new RegExp("^hash=");
		if (params.match(regex1)) {
			action = "contact_view_email";
		}
		else if (params.match(regex2)) {
			action = "contact_view_hash";
		}
		Connector.action = action;
		return Connector;
	}

};

export default AC_Contact;
