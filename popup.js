var targeTab = null; 
// var current_draft_tab = null; 

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

  chrome.tabs.query({'active': true}, function(tabs){
    
    targetTab = tabs[0];
    BGPage.setTargetTab(targetTab); 

    chrome.tabs.sendMessage(targetTab.id, 'getCurrentValue', function(currentTargetValue){
      

      chrome.cookies.set( {"domain": host, "url": protocol_and_host, "name": "currentTargetValue", "value": escape(currentTargetValue)}, function(currentValueCookie){
        chrome.cookies.set( {"url": protocol_and_host, "name": "currentTargetURL", "value": escape(targetTab.url)}, function(currentTargetURLCookie){

          url = null; 
          if(e.target.id == "previous_document"){
            url = protocol_and_host + "/documents/";
          }
          else{
             url = protocol_and_host + "/documents/new";
          }

          chrome.tabs.create({url: url, index: targetTab.index + 1}, function(draftTab){

          });
        
        });
      });
    });

    window.close();
  });  
}

