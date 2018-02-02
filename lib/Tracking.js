var AC_Tracking = {

	version: 1,
	url_base: "",
	track_email: "",
	track_actid: "",
	track_key: "",

	whitelist: [
		"site_status",
		"event_status",
		"site_list",
		"event_list",
		"whitelist_",
		"whitelist_remove",
		"event_remove",
		"log"
	],

	site_status: function(Connector, params, post_data) {
		// version 2 only.
		Connector.url = this.url_base + "/track/site";
	},

	event_status: function(Connector, params, post_data) {
		// version 2 only.
		Connector.url = this.url_base + "/track/event";
	},

	site_list: function(Connector, params, post_data) {
		// version 2 only.
		Connector.url = this.url_base + "/track/site";
	},

	event_list: function(Connector, params, post_data) {
		// version 2 only.
		Connector.url = this.url_base + "/track/event";
	},

	whitelist_: function(Connector, params, post_data) {
		// version 2 only.
		Connector.url = this.url_base + "/track/site";
		Connector.request_method = "PUT";
	},

	whitelist_remove: function(Connector, params, post_data) {
		// version 2 only.
		Connector.url = this.url_base + "/track/site";
		Connector.request_method = "DELETE";
	},

	event_remove: function(Connector, params, post_data) {
		// version 2 only.
		Connector.url = this.url_base + "/track/event";
		Connector.request_method = "DELETE";
	},

	log: function(Connector, params, post_data) {
		post_data.actid = this.track_actid;
		post_data.key = this.track_key;
		var visit_data = {};
		if (this.track_email) {
			visit_data.email = this.track_email;
		}
		if (typeof(post_data.visit) != "undefined") {

		}
		if (Object.keys(visit_data).length) {
			post_data.visit = visit_data;
		}
		return Connector;
	}

};

export default AC_Tracking;
