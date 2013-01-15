# activecampaign-api-nodejs

Node.js wrapper for the ActiveCampaign API.

## Installation

Install using NPM:

`npm install activecampaign`

If you don't use NPM, try this:

`git clone git://github.com/ActiveCampaign/activecampaign-api-nodejs.git activecampaign`

## Requirements

1. Valid ActiveCampaign hosted account.

## Example Usage

<pre>
var ActiveCampaign = require("activecampaign");

var ac = new ActiveCampaign(ACTIVECAMPAIGN_URL, ACTIVECAMPAIGN_API_KEY);

// TEST API credentials
var test = ac.credentials_test(function(response) {
  console.log(response);
});

// GET requests

var account = ac.api("account/view", {}, function(response) {
	console.log(response);
	
  if (response.success) {

    // successful request

  }
  else {

    // request error
    console.log(response.error);

  }
});

var subscriber_exists = ac.api("subscriber/view?email=test@example.com", {}, function(response) {
	console.log(response);
});

// POST request

var list = {
	name: "List 3",
	sender_name: "My Company",
	sender_addr1: "123 S. Street",
	sender_city: "Chicago",
	sender_zip: "60601",
	sender_country: "USA"
};

var list_add = ac.api("list/add", list, function(response) {
	console.log(response);
});
</pre>

## Full Documentation

[View our full API documentation](http://activecampaign.com/api).

## Reporting Issues

We'd love to help if you have questions or problems. Report issues using the [Github Issue Tracker](https://github.com/ActiveCampaign/activecampaign-api-nodejs/issues) or email [help@activecampaign.com](mailto:help@activecampaign.com).