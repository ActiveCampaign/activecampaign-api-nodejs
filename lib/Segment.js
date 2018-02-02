/**
 * Code example:

	var ActiveCampaign = require("activecampaign");
	var Connector = require(__dirname + "/node_modules/activecampaign/lib/Connector");

	var ac = new ActiveCampaign("{URL}", "{KEY}");
	ac.debug = true;
	ac.version(2);

	var params = {
		"filters": {
			"name": "",
			"list_id": 1,
			"automation_id": 12
		},
		"sort": "id",
		"sort_direction": "ASC",
		"page": 1
	}

	params = Connector.http_build_query(params);
	var segments = ac.api("segment/list?" + params, {});

	segments.then(function(result) {
		// successful request
		console.log(result);
	}, function(result) {
		// request error
	});

 *
 */

var AC_Segment = {

	version: 1,
	url_base: "",

	whitelist: ["list"],

	list: function(Connector, params, post_data) {
		// version 2 only.
		Connector.url = this.url_base + "/segment/list";
	}

};

export default AC_Segment;
