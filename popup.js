var targetTab = null; 

// Dev settings
var host = "127.0.0.1";
var protocol = "http";
var protocol_and_host = protocol + "://" + host + ":3000";

// Prod settings
// var host = "draftin.com";
// var protocol = "https";
// var protocol_and_host = protocol + "://" + host;

// So that we can easily set things in the background and log errors to the background's console
var BGPage = chrome.extension.getBackgroundPage();


// Listens for clicks of the popup menu in the Chrome extension
document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});


function click(e) {

  BGPage.console.log(1);

  // look for the active tab, thats our target. That has our textarea
  chrome.tabs.query({'active': true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs){
    BGPage.console.log(2);

    targetTab = tabs[0];
    BGPage.setTargetTab(targetTab); 

    // we're good if we have a target tab and it's not a chrome specific tab
    if(targetTab && targetTab.url && targetTab.url.substring(0, 9) != "chrome://"){

      BGPage.console.log('connecting');

      port = chrome.tabs.connect(targetTab.id);
       BGPage.console.log('connected');
      port.postMessage("getCurrentValue");

      port.onMessage.addListener(function(currentTargetValue) {

      // ask the content script for the current value of the target tab's textarea
      // chrome.tabs.sendMessage(targetTab.id, 'getCurrentValue', function(currentTargetValue){
        alert("asd");
        BGPage.console.log(4);

        // if the content script doesn't come up with something, it's because it's not supported or the user hasn't clicked into a textare. they might need some documentation
        if(currentTargetValue != "NOT_SUPPORTED_ELEMENT"){
          
          BGPage.console.log(5);

          valueToSet = escape(currentTargetValue); 


          // # make sure we dont blog the cookie limit or this wont work
          if(lengthInUtf8Bytes(valueToSet) > 4000){
            valueToSet = null;
          }

          // set the referring url and current value of the text area for Draft to use
          chrome.cookies.set( {"domain": host, "url": protocol_and_host, "name": "currentTargetValue", "value": valueToSet}, function(currentValueCookie){

            BGPage.console.log(6);

            chrome.cookies.set( {"url": protocol_and_host, "name": "currentTargetURL", "value": escape(targetTab.url)}, function(currentTargetURLCookie){

              BGPage.console.log(7);

              url = null; 
              if(e.target.id == "previous_document"){
                url = protocol_and_host + "/documents";
              }
              else{
                url = protocol_and_host + "/documents/new";
              }

              chrome.tabs.create({url: url}, function(draftTab){
                BGPage.setDraftTab(draftTab); 
              });
            
            });
          });

        }
        else{
          chrome.tabs.create({url: protocol_and_host + "/extension_help"}, function(tab){
            
          });
        }

      });
    }
    else{
      chrome.tabs.create({url: protocol_and_host + "/extension_help"}, function(tab){
        
      });
    }

    window.close();
  });  
}


// http://stackoverflow.com/questions/5515869/string-length-in-bytes-in-javascript
function lengthInUtf8Bytes(str) {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  var m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}

