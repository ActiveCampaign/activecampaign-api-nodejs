var http = require("http"),
    request = require("request"),
    RSVP = require("rsvp");

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
					reject("Error:" + body)
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

export default Connector;
