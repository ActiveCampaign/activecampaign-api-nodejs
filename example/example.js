var ActiveCampaign = require("activecampaign");

var ac = new ActiveCampaign("", "");
ac.debug = true;

// update general settings.
var post_test = ac.api("settings/edit", {dateformat: "%m/%d/%Y", timeformat: "%H:%M", datetimeformat: "%m/%d/%Y %H:%M"}, function(response) {console.log(response);});

ac.version(2);
ac.track_actid = "";
ac.track_key = "";
ac.track_email = "test@test.com";

// return whitelisted domains for site tracking.
var tracking_test1 = ac.api("tracking/site/list", {}, function(response) {console.log(response);});

// return saved events.
var tracking_test2 = ac.api("tracking/event/list", {}, function(response) {console.log(response);});
