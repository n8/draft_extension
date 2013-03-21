

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
  chrome.tabs.query({}, function(tabs){
    for (var i = 0; i < tabs.length; i++) {
      try{
        chrome.tabs.executeScript(tabs[i].id, {file: "content_script.js"});
      }
      catch(err){
        // Ignore
      }
    }
  });
});


var targetTab = null; 
var originalTargetURL = null;

// var host = "127.0.0.1";
// var protocol = "http";
// var protocol_and_host = protocol + "://" + host + ":3000";

var host = "draftin.com";
var protocol = "https";
var protocol_and_host = protocol + "://" + host;

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
  removeCookies(tabId);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo){
  if(targetTab && originalTargetURL != targetTab.url){
    removeCookies(tabId);
  }
});


setTargetTab = function(tab){
  targetTab = tab; 
  originalTargetURL = targetTab.url; 
}

chrome.extension.onMessage.addListener(function(data, sender, sendResponse) {

  if(data.type == 'PASTE'){

    chrome.tabs.sendMessage(targetTab.id, data.value, function(response){
    });

    chrome.tabs.update(targetTab.id, {'active': true}, function(response){

    });
  }

});


function removeCookies(tab_id){
  if(targetTab.id == tab_id){
    chrome.cookies.remove({"url": protocol_and_host, 'name': "currentTargetValue"});
    chrome.cookies.remove({"url": protocol_and_host, 'name': "currentTargetURL"});
  }
}



