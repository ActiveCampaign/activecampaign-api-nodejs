var Connector = require(__dirname + "/Connector");

var ActiveCampaign = function(url, api_key, api_user, api_pass) {

	if (!url) throw new Error("Please provide your API URL.");
	if (!api_key && !api_user && !api_pass) throw new Error("Please provide an authentication method (key or user/pass).");

	Connector.construct(url, api_key, api_user, api_pass);

	return {
		
		credentials_test: function(cb) {
			Connector.credentials_test(function(response) {
				return cb(response);
			});
		},
		
		api: function(path, post_data, cb) {
			// IE: "subscriber/view"
			var components = path.split("/");
			var component = components[0];

			var regex = new RegExp("\\?");
			if (components[1].match(regex)) {
				// query params appended to method
				// IE: subscriber/edit?overwrite=0
				var method_arr = components[1].split("?");
				var method = method_arr[0];
				var params = method_arr[1];
			}
			else {
				// just a method provided
				// IE: "subscriber/view
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
			}
			else if (component == "sync") {
				component = "subscriber";
				method = "sync";
			}
			else if (component == "singlesignon") {
				component = "auth";
			}

			var object_name = component.charAt(0).toUpperCase() + component.substring(1); // IE: "subscriber" becomes "Subscriber"
			// IE: require(__dirname/Account)
			var AC_Object = require(__dirname + "/" + object_name);
			
			if (method == "list") {
				method = "list_";
			}
			
			// so we can use it later
			Connector.action = components[0] + "_" + components[1];
			
			// check against whitelist
			if (AC_Object.whitelist.indexOf(method) == -1) {
				throw new Error("Invalid API method.");
			}
			
			if (typeof AC_Object[method] != "undefined") {
				// (optional) make any method-specific adjustments before submitting
				AC_Object[method](Connector, params, post_data);
			}
			
			Connector.process_request(Connector, params, post_data, function(response) {
				return cb(response);
			});

		}
		
	};
	
};

module.exports = ActiveCampaign;