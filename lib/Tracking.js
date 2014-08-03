var AC_Tracking = {

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

	log: function(Connector, params, post_data) {
		var request_url = "https://trackcmp.net/event";
		post_data.actid = this.track_actid;
		post_data.key = this.track_key;
		var visit_data = {};
		if (this.track_email) {
			visit_data.email = this.track_email;
		}
		if (typeof(post_data.visit) != "undefined") {
			
		}
		if (visit_data.length) {
			post_data.visit = visit_data;
		}
		return Connector;
	}
		
};

module.exports = AC_Tracking;