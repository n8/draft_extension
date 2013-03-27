

// Check whether new version is installed, if yes load in the content_script. 
// we do this so that currently open tabs work with the extension. 
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

// The target is the place with the textarea
var targetTab = null; 
var originalTargetURL = null;
var draftTab = null; 

// Dev settings
// var host = "127.0.0.1";
// var protocol = "http";
// var protocol_and_host = protocol + "://" + host + ":3000";

// Prod settings
var host = "draftin.com";
var protocol = "https";
var protocol_and_host = protocol + "://" + host;


// If either the target or Draft tabs are closed, remove the cookies
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
  removeCookies(tabId);
});

// If the original target's url has changed, all of this is stale. Remove the cookies
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo){
  if(targetTab && originalTargetURL != targetTab.url){
    removeCookies(tabId);
  }
});


function setTargetTab(tab){
  targetTab = tab; 
  originalTargetURL = targetTab.url; 
}

function setDraftTab(tab){
  draftTab = tab; 
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
  if((targetTab && targetTab.id == tab_id) || (draftTab && draftTab.id == tab_id)){
    chrome.cookies.remove({"url": protocol_and_host, 'name': "currentTargetValue"});
    chrome.cookies.remove({"url": protocol_and_host, 'name': "currentTargetURL"});
  }
}



