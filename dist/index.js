(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ActiveCampaign = factory());
}(this, (function () { 'use strict';

var AC_Account = {

	version: 1,
	url_base: "",

	whitelist: ["add", "cancel", "edit", "list", "name_check", "plans", "status", "status_set", "view"]

};

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

var AC_Automation = {

	version: 1,
	url_base: "",

	whitelist: [
		"list",
		"contact_add",
		"contact_remove",
		"contact_list",
		"contact_view"
	]

};

var AC_Campaign = {

	version: 1,
	url_base: "",

	whitelist: [
    "create",
    "delete_list",
    "delete",
    "list",
    "paginator",
    "report_bounce_list",
    "report_bounce_totals",
    "report_forward_list",
    "report_forward_totals",
    "report_link_list",
    "report_link_totals",
    "report_open_list",
    "report_open_totals",
    "report_totals",
    "report_unopen_list",
    "report_unsubscription_list",
    "report_unsubscription_totals",
    "send",
    "status"
	]

};

var http = require("http");
var request = require("request");
var RSVP = require("rsvp");

var Connector = {

	version: 1,
	url: "",
	url_tracking: "https://trackcmp.net/event",
	api_key: "",
	output: "json",
	debug: false,
	request_method: "GET",

	construct: function(url, api_key, api_user, api_pass) {

		var base = "";
		var regex = new RegExp("https:\/\/www.activecampaign.com");
		if (!url.match(regex)) {
			// not a reseller
			base = "/admin";
		}
		regex = new RegExp("\/$");
		if (url.match(regex)) {
			// remove trailing slash
			url = url.replace(regex, "");
		}
		if (api_key) {
			this.url = url + base + "/api.php?api_key=" + api_key;
		}
		else if (api_user && api_pass) {
			this.url = url + base + "/api.php?api_user=" + api_user + "&api_pass=" + api_pass;
		}
		this.api_key = api_key;

	},

	credentials_test: function() {
		var test_url = this.url + "&api_action=user_me&api_output=" + this.output;
		return Connector.curl(test_url, {});
	},

	prepare_url: function(action, params) {
		var request_url = Connector.url;
		if (action == "tracking_log") {
			request_url = this.url_tracking;
		}
		// tracking_log is a completely different URL.
		if (this.version == 1 && action != "tracking_log") {
			request_url = Connector.url + "&api_action=" + action + "&api_output=" + Connector.output;
		}
		if (params) {
			var separator = "?";
			if (request_url.match(/\?/)) {
				separator = "&";
			}
			request_url += separator + params;
		}
		if (this.debug) {
			console.log("API request URL: " + request_url);
		}
		return request_url;
	},

	process_request: function(Connector, params, post_data) {
		var request_url = Connector.prepare_url(Connector.action, params);
		return Connector.curl(request_url, post_data);
	},

	/**
	 * Parses an object and makes it into a URL query string for use with the API request.
	 *
	 * @param  array  params  The object of URL data in key=value format. Example: {"one":1, "two":2, "three": {"three1":31}}
	 * @return string         The encoded URL query string.
	 */
	http_build_query: function(params) {
		var params_str = "";
		for (var i in params) {
			if (typeof(params[i]) == "object") {
				for (var j in params[i]) {
					var obj_length = Object.keys(params[i]).length;
					params_str += i + encodeURIComponent("[" + j + "]") + "=" + encodeURIComponent(params[i][j]);
					params_str += "&";
				}
			} else {
				var obj_length = Object.keys(params).length;
				params_str += i + "=" + encodeURIComponent(params[i]);
				params_str += "&";
			}
		}
		// Trim off trailing "&" character.
		params_str = params_str.substring(0, params_str.length - 1);
		return params_str;
	},

	curl: function(url, post_data) {
		this.request_method = "GET";
		if (this.version == 1) {
			// find the method from the URL
			var regex = new RegExp("api_action=[^&]*");
			var matches = regex.exec(url);
			if (matches) {
				// get everything that's NOT an equals sign, until the end of the string.
				regex = new RegExp("[^=]*$");
				matches = regex.exec(matches[0]);
				method = matches[0];
			}
		} else if (this.version == 2) {
			var separator = "?";
			if (url.match(/\?/)) {
				separator = "&";
			}
			url += separator + "api_key=" + this.api_key;
		}

		body = "";

		if (Object.keys(post_data).length) {
			if (this.request_method == "GET") {
				// if it's "PUT" or "DELETE" we can leave it as is.
				this.request_method = "POST";
			}
			for (key in post_data) {
				value = post_data[key];
				if (typeof(value) !== "string") {
					value = JSON.stringify(value);
				}
				if (value !== undefined) {
					body += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
				}
			}
			if (body.length > 0) {
				body = body.substring(0, body.length - 1);
			}
		}

		var request_options = {
			method: this.request_method,
			url: url,
			body: body
		};

		if (post_data) {
			request_options.headers = {"content-type": "application/x-www-form-urlencoded"};
		}

		if (this.debug) {
			console.log("Request options:");
			console.log(request_options);
		}

		var apiWhitelist = ["segment_list", "tracking_event_remove", "contact_list", "form_html", "tracking_site_status", "tracking_event_status", "tracking_whitelist", "tracking_log", "tracking_site_list", "tracking_event_list"];

		var api_request = new RSVP.Promise(function(fulfill, reject) {
			request(request_options, function(error, response, body) {
				try {
					JSON.parse(body);
				} catch (e) {
					apiWhitelist.forEach(function(value) {
						if (request_options.url.indexOf(value) !== -1) {
							fulfill(body);
							return;
						}
					});
					reject("Error:" + body);
					return;
				}
				var result = JSON.parse(body);
				if (!error && response.statusCode == 200) {
					if (typeof result.result_code != "undefined") {
						result.success = result.result_code;
						if (!result.result_code) {
							result.error = result.result_message;
						}
					} else if (typeof result.succeeded != "undefined") {
						result.success = result.succeeded;
						if (!result.succeeded) {
							result.error = result.message;
						}
					}
					fulfill(result);
				} else {
					reject(result);
				}
			});
		});

		return api_request;

	}

};

var AC_Contact = {

	version: 1,
	url_base: "",

	whitelist: ["add", "delete_list", "delete", "edit", "list", "paginator", "sync", "view", "tag_add", "tag_remove"],

	view: function(Connector, params, post_data) {
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

var AC_Deal = {

	version: 1,
	url_base: "",

	whitelist: [
		"add",
		"edit",
		"delete",
		"get",
		"list",
		"note_add",
		"note_edit",
		"pipeline_add",
		"pipeline_edit",
		"pipeline_delete",
		"pipeline_list",
		"stage_add",
		"stage_edit",
		"stage_delete",
		"stage_list",
		"task_add",
		"task_edit",
		"tasktype_add",
		"tasktype_edit",
		"tasktype_delete"
	]

};

var AC_Design = {

	version: 1,
	url_base: "",

	whitelist: ["edit", "view"]

};

var AC_Form = {

	version: 1,
	url_base: "",

	whitelist: ["getforms"]

};

var AC_Graph = {

	version: 1,
	url_base: "",

	whitelist: [
		"interaction_rate"
	]

};

var AC_Group = {

	version: 1,
	url_base: "",

	whitelist: ["add", "delete_list", "delete", "edit", "list", "view"]

};

var AC_List = {

	version: 1,
	url_base: "",

	whitelist: ["add", "delete_list", "delete", "edit", "field_add", "field_delete", "field_edit", "field_view", "list", "paginator", "view"]

};

var AC_Message = {

	version: 1,
	url_base: "",

	whitelist: [
    "add",
    "delete_list",
    "delete",
    "edit",
    "list",
    "template_add",
    "template_delete_list",
    "template_delete",
    "template_edit",
    "template_export",
    "template_import",
    "template_list",
    "template_view",
    "view"
  ]

};

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

var AC_Settings = {

	version: 1,
	url_base: "",

	whitelist: ["edit"]

};

var AC_Tags = {

	version: 1,
	url_base: "",

	whitelist: ["list"]
};

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

var AC_User = {

	version: 1,
	url_base: "",

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

var AC_Webhook = {

	version: 1,
	url_base: "",

	whitelist: ["add", "delete_list", "delete", "edit", "list", "view", "events"]

};

var classes = {
	Account: AC_Account,
	Auth: AC_Auth,
	Automation: AC_Automation,
	Campaign: AC_Campaign,
	Connector,
	Contact: AC_Contact,
	Deal: AC_Deal,
	Design: AC_Design,
	Form: AC_Form,
	Graph: AC_Graph,
	Group: AC_Group,
	List: AC_List,
	Message: AC_Message,
	Segment: AC_Segment,
	Settings: AC_Settings,
	Tags: AC_Tags,
	Tracking: AC_Tracking,
	User: AC_User,
	Webhook: AC_Webhook
};

var ActiveCampaign = function(url, api_key, api_user, api_pass) {

	if (!url) throw new Error("Please provide your API URL.");
	if (!api_key && !api_user && !api_pass) throw new Error("Please provide an authentication method (key or user/pass).");

	Connector.construct(url, api_key, api_user, api_pass);

	return {

		url_base: url,
		track_email: "",
		track_actid: "",
		track_key: "",
		version_number: 1,
		debug: false,

		version: function(version) {
			this.version_number = version;
			if (version == 2) {
				this.url_base = this.url_base + "/2";
			}
		},

		credentials_test: function() {
			return Connector.credentials_test();
		},

		api: function(path, post_data = {}) {
			Connector.debug = this.debug;
			if (this.debug) {
				console.log("debug mode enabled");
			}
			// IE: "contact/view"
			var components = path.split("/");
			var component = components[0];

			if (components.length > 2) {
				// IE: "contact/tag/add?whatever"
				// shift off the first item (the component, IE: "contact").
				components.shift();
				// IE: convert to "tag_add?whatever"
				var method_str = components.join("_");
				components = [component, method_str];
			}

			var regex = new RegExp("\\?");
			if (components[1].match(regex)) {
				// query params appended to method
				// IE: contact/edit?overwrite=0
				var method_arr = components[1].split("?");
				var method = components[1] = method_arr[0];
				var params = method_arr[1];
			}
			else {
				// just a method provided
				// IE: "contact/view
				if (typeof(components[1]) != "undefined") {
					var method = components[1];
					var params = "";
				}
				else {
					throw new Error("Invalid API method.");
				}
			}

			// adjustments
			if (component == "branding") {
				component = "design";
			} else if (component == "sync") {
				component = "contact";
				method = "sync";
			} else if (component == "singlesignon") {
				component = "auth";
			} else if (component == "subscriber") {
				component = "contact";
			}

			if (method == "whitelist") {
				method = "whitelist_";
			}

			var object_name = component.charAt(0).toUpperCase() + component.substring(1); // IE: "contact" becomes "Contact"

			// IE: require(__dirname/Account)
			var AC_Object = classes[object_name];

			// so we can use it later
			Connector.action = components[0] + "_" + components[1];

			// check against whitelist
			if (AC_Object.whitelist.indexOf(method) == -1) {
				throw new Error("Invalid API method.");
			}

			AC_Object.url_base = this.url_base;
			Connector.version = AC_Object.version = this.version_number;

			if (object_name == "Tracking") {
				// pass the ActiveCampaign object tracking vars into the Tracking object.
				AC_Object.track_email = this.track_email;
				AC_Object.track_actid = this.track_actid;
				AC_Object.track_key = this.track_key;
			}

			if (typeof AC_Object[method] != "undefined") {
				// (optional) make any method-specific adjustments before submitting
				AC_Object[method](Connector, params, post_data);
			}

			return Connector.process_request(Connector, params, post_data);

		}

	};

};

return ActiveCampaign;

})));
