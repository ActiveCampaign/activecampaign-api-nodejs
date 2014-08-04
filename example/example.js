var ActiveCampaign = require("activecampaign");

var ac = new ActiveCampaign("", "");
ac.debug = true;
//ac.version(2);

/*ac.track_actid = "";
ac.track_key = "";
ac.track_email = "test@test.com";*/

var test = ac.api("settings/edit", {dateformat: "%m/%d/%Y", timeformat: "%H:%M", datetimeformat: "%m/%d/%Y %H:%M"}, function(response) {console.log(response);});
