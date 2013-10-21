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

  var divs = document.querySelectorAll('.extension_button');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});


function click(e) {

  // look for the active tab, thats our target. That has our textarea
  chrome.tabs.query({'active': true, windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs){
    
    targetTab = tabs[0];
    BGPage.setTargetTab(targetTab); 

    // we're good if we have a target tab and it's not a chrome specific tab
    if(targetTab && targetTab.url && targetTab.url.substring(0, 9) != "chrome://"){
      
      getMethod = null; 

      if(e.target.id == "edit_current_page"){
        getMethod = 'getArticle';
      }
      else{
        getMethod = 'getCurrentValue';
      }

 
      // ask the content script for the current value of the target tab's textarea
      chrome.tabs.sendMessage(targetTab.id, getMethod, function(currentTargetValue){
        
        // if the content script doesn't come up with something, it's because it's not supported or the user hasn't clicked into a textare. they might need some documentation
        if(currentTargetValue != "NOT_SUPPORTED_ELEMENT"){
          
          if(e.target.id == "previous_document"){
            var url = protocol_and_host + "/documents";
            chrome.cookies.set( {"url": protocol_and_host, "name": "currentTargetURL", "value": escape(targetTab.url)}, function(currentTargetURLCookie){
              openURL(url);
            });
          }
          else{

            $.getJSON(protocol_and_host + "/site/authenticity_token.json", function(data){

              // convert so that html turns into markdown
              var creatUrl = protocol_and_host + "/documents.json?convert=true";

              $.post(creatUrl, {authenticity_token: data.token, document: {content: currentTargetValue["content"], name: currentTargetValue["title"]}}, function(createData){

                var editURL = protocol_and_host + "/documents/" + createData.id + "/edit";

                if(e.target.id == "new_document"){

                  // So Draft knows where to return the user
                  chrome.cookies.set( {"url": protocol_and_host, "name": "currentTargetURL", "value": escape(targetTab.url)}, function(currentTargetURLCookie){
                    openURL(editURL);
                  });
                }
                else{
                  openURL(editURL);
                }
              });

            }).fail(function(){
              // User needs to be logged into use this
              openURL(protocol_and_host + "/draft/users/sign_in");
            });

          }

          return true;
        }
        else{
          openURL(protocol_and_host + "/extension_help");
        }

      });
    }
    else{
      openURL(protocol_and_host + "/extension_help");
    }

  });  
}


// http://stackoverflow.com/questions/5515869/string-length-in-bytes-in-javascript
function lengthInUtf8Bytes(str) {
  // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
  var m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}

function openURL(url){
  chrome.tabs.create({url: url}, function(draftTab){
    BGPage.setDraftTab(draftTab); 
  });

  window.close();
}



