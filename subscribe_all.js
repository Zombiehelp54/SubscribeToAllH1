function sendXHR(reqType,address){
   var r = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
   r.open(reqType, address, false);
   (reqType == "PATCH" ? r.setRequestHeader("X-CSRF-Token", current_user.get("csrf_token")) : 1)
   r.send();
   return r;
  }
  var programs = new Array();
  var pros = JSON.parse(sendXHR("GET","/programs/search.json?query=type%3Ahackerone&sort=published_at%3Adescending&page=1").responseText); // use `page=2` if you have already subscribed for programs in page 1
  for(i=0; i<pros.results.length; i++){
  programs.push(pros.results[i].url);
  }
  for(i=0;i<programs.length;i++){
	  try {
	sendSub = sendXHR("PATCH",programs[i]+"/policy_subscriptions");
	if(sendSub.status != 200) {
		for(x=429;x != 200 ;x=sendXHR("PATCH",programs[i]+"/policy_subscriptions").status){} // Keep repeating the request untill we are out of rate limit :D
		sendSub = sendXHR("PATCH",programs[i]+"/policy_subscriptions");
	}
   sub = JSON.parse(sendSub.responseText);
   (sub.subscription == false) ? sendXHR("PATCH",programs[i]+"/policy_subscriptions"): 1;
	  } 
	  catch (e){
		  console.log(e+" don't worry we are still in the loop");
	  }
  }
alert("done!");
