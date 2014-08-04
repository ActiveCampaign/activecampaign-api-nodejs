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
		"whitelist",
		"whitelist_remove",
		"event_remove",
		"log"
	],

	site_status: function(Connector, params, post_data) {
		// version 2 only.
		Connector.url = this.url_base + "/track/site";
	},

	log: function(Connector, params, post_data) {
		Connector.url = "https://trackcmp.net/event";
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

module.exports = AC_Tracking;