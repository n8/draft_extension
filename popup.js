var targetTab = null; 

// var host = "127.0.0.1";
// var protocol = "http";
// var protocol_and_host = protocol + "://" + host + ":3000";

var host = "draftin.com";
var protocol = "https";
var protocol_and_host = protocol + "://" + host;


var BGPage = chrome.extension.getBackgroundPage();


document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});


function click(e) {

  chrome.tabs.query({'active': true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs){
    
    targetTab = tabs[0];
    BGPage.setTargetTab(targetTab); 

    if(targetTab && targetTab.url && targetTab.url.substring(0, 9) != "chrome://"){

      chrome.tabs.sendMessage(targetTab.id, 'getCurrentValue', function(currentTargetValue){
        
        
        if(currentTargetValue != "NOT_SUPPORTED_ELEMENT"){
          
          valueToSet = escape(currentTargetValue); 


          // # make sure we dont blog the cookie limit or this wont work
          if(lengthInUtf8Bytes(valueToSet) > 4000){
            valueToSet = null;
          }

          chrome.cookies.set( {"domain": host, "url": protocol_and_host, "name": "currentTargetValue", "value": valueToSet}, function(currentValueCookie){

            chrome.cookies.set( {"url": protocol_and_host, "name": "currentTargetURL", "value": escape(targetTab.url)}, function(currentTargetURLCookie){

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

