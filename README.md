# ActiveCampaign Node.js API wrapper

Official Node.js wrapper for the ActiveCampaign API.

## Installation

Install using NPM:

	npm install activecampaign

If you don't use NPM, try this:

	git clone git://github.com/ActiveCampaign/activecampaign-api-nodejs.git activecampaign

## Requirements

1. Valid ActiveCampaign hosted account.

## Example Usage

```javascript
	var ActiveCampaign = require("activecampaign");

	var ac = new ActiveCampaign("https://ACCOUNT.api-us1.com", {{KEY}});

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

	// GET requests

	var account_view = ac.api("account/view", {});
	account_view.then(function(result) {
		// successful request
		console.log(result);
	}, function(result) {
		// request error
	});

	var contact_exists = ac.api("contact/view?email=test@example.com", {});
	contact_exists.then(function(result) {
		// successful request
		console.log(result);
	}, function(result) {
		// request error
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

	var list_add = ac.api("list/add", list);
	list_add.then(function(result) {
		// successful request
		console.log(result);
	}, function(result) {
		// request error
	});
```

## Full Documentation

[View our full API documentation](http://activecampaign.com/api).

## Reporting Issues

We'd love to help if you have questions or problems. Report issues using the [Github Issue Tracker](https://github.com/ActiveCampaign/activecampaign-api-nodejs/issues) or email [help@activecampaign.com](mailto:help@activecampaign.com).
