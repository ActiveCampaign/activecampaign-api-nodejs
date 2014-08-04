var Connector = require(__dirname + "/Connector");

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

		credentials_test: function(cb) {
			Connector.credentials_test(function(response) {
				return cb(response);
			});
		},
		
		api: function(path, post_data, cb) {
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
			var AC_Object = require(__dirname + "/" + object_name);

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

			Connector.process_request(Connector, params, post_data, function(response) {
				return cb(response);
			});

		}
		
	};
	
};

module.exports = ActiveCampaign;