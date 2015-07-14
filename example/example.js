var ActiveCampaign = require("activecampaign");

var ac = new ActiveCampaign("", "");
ac.debug = true;

// TEST API credentials
ac.credentials_test().then(function(result) {
	// successful request
	if (result.success) {
		// VALID ACCOUNT
	} else {
		// INVALID ACCOUNT
	}
}, function(result) {
	// request error
});

// update general settings.
var post_test = ac.api("settings/edit", {
	dateformat: "%m/%d/%Y",
	timeformat: "%H:%M",
	datetimeformat: "%m/%d/%Y %H:%M"
}).then(function(result) {
	// successful request
	console.log(result);
}, function(result) {
	// request error
});

ac.version(2);
ac.track_actid = "";
ac.track_key = "";
ac.track_email = "test@test.com";

// return whitelisted domains for site tracking.
var tracking_test1 = ac.api("tracking/site/list", {});
tracking_test1.then(function(result) {
	// successful request
	console.log(result);
}, function(result) {
	// request error
});

// return saved events.
var tracking_test2 = ac.api("tracking/event/list", {});
tracking_test2.then(function(result) {
	// successful request
	console.log(result);
}, function(result) {
	// request error
});

// Add a new tracked event.
var eventdata = {
	event: "nodejs_test",
	eventdata: "test1"
};
var tracking_test3 = ac.api("tracking/log", eventdata);
tracking_test3.then(function(result) {
	// successful request
	console.log("tracking_test3 result");
	console.log(result);
}, function(result) {
	// request error
});

// RESELLERS ONLY - get the available account plans.
var account_plans = ac.api("account/plans", {});
account_plans.then(function(result) {
	// successful request
	console.log(result);
}, function(result) {
	// request error
});