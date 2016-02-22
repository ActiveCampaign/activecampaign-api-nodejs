var AC_Segment = {

	version: 1,
	url_base: "",

	whitelist: ["list"],

	list: function(Connector, params, post_data) {
		// version 2 only.
		Connector.url = this.url_base + "/segment/list";
	}
		
};

module.exports = AC_Segment;