var http = require("http"),
    request = require("request");

var Connector = {
		
	url: "",
	api_key: "",
	output: "json",
		
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
			url = replace(regex, "");
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
		var test_url = this.url + "&api_action=group_view&api_output=" + this.output + "&id=3";
		var test = this.curl(test_url, {}, function(response) {
			if (typeof test != "undefined" && test.result_code) {
				// successful
			}
			else {
				// failed
			}
		});
	},
	
	prepare_url: function(action, params) {
		var request_url = Connector.url + "&api_action=" + action + "&api_output=" + Connector.output;
		if (params) request_url += "&" + params;
		return request_url;
	},
	
	process_request: function(Connector, params, post_data, cb) {
		var request_url = Connector.prepare_url(Connector.action, params);
		var response = Connector.curl(request_url, post_data, function(response) {
			return cb(response);
		});
	},
	
	curl: function(url, post_data, cb) {
		// find the method from the URL		
		var regex = new RegExp("api_action=[^&]*");
		var matches = regex.exec(url);
		regex = new RegExp("[^=]*$");
		matches = regex.exec(matches[0]);
		method = matches[0];
		
		var request_method = "GET";
		body = "";
		
		if (post_data) {
			request_method = "POST";
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
			method: request_method,
			url: url,
			body: body
		};
		
		if (post_data) request_options.headers = {"content-type": "application/x-www-form-urlencoded"};

//console.log(request_options);return;

		request(request_options, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var result = JSON.parse(body);
				if (typeof result.result_code != "undefined") {
					result.success = result.result_code;
					if (!result.result_code) {
						result.error = result.result_message;
					}
				}
				else if (typeof result.succeeded != "undefined") {
					result.success = result.succeeded;
					if (!result.succeeded) {
						result.error = result.message;
					}
				}
				return cb(result);
			}
			else {
				console.log("Error: " + response.statusCode);
			}
		});

	}
		
};

module.exports = Connector;