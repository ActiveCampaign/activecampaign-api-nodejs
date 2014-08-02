var ActiveCampaign = require("activecampaign");

var ac = new ActiveCampaign("", "");
ac.debug = true;

//console.log(ac);

var contact_exists = ac.api("contact/view?email=test@test.com", {}, function(response) {
console.log(response);
/*
  var contact;
  if(response){
    if(response.lists[30]){     //If subscriner is already subscribed, does nothing
      return;
    }
    contact = {
      email: response.email,
      'p[123]': 30,                                       //adds subscriber to list
      'status[123]': 1,
    };
    if(response.first_name){  
      contact.first_name = response.first_name;
    }
    if(response.last_name){
      contact.last_name = response.last_name;
    }
    if(response.fields[4]){
      contact.fields[28, 0] = response.fields[4].val;     //adds field name if available
    }

    var contact_delete = ac.api('contact/delete', {'id': response.id}, function(nestedresponse){
      console.log(nestedresponse);
    });
  }

// If contact is not in the list, the following blocks of code should still execute, but they don't  

  contact.email = "test@example.org";
  contact.p[123] = 30;
  contact.status[123] = 1;

  // Add the contact to the subscribed list

  var contact_add = ac.api("contact/add", contact, function(response){
    console.log(response);
  });
*/
});