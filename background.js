var target_tab = null; 
var current_draft_tab = null; 
var originalTargetURL = null;

var host = "127.0.0.1";
var protocol = "http";
var protocol_and_host = protocol + "://" + host + ":3000";

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
  removeCookies(tabId);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo){
  if(originalTargetURL != target_tab.url){
    removeCookies(tabId);
  }
});

chrome.browserAction.onClicked.addListener(function(tab) {
  
  chrome.tabs.query({'active': true}, function(tabs){
    
    target_tab = tabs[0]
    originalTargetURL = target_tab.url

    chrome.tabs.sendMessage(tab.id, 'getCurrentValue', function(currentTargetValue){
      
        chrome.cookies.set( {"domain": host, "url": protocol_and_host, "name": "currentTargetValue", "value": escape(currentTargetValue)}, function(currentValueCookie){
          chrome.cookies.set( {"url": protocol_and_host, "name": "currentTargetURL", "value": escape(target_tab.url)}, function(currentTargetURLCookie){

  
            chrome.tabs.create({url: protocol_and_host + "/documents/"}, function(draft_tab){

              current_draft_tab = draft_tab;

            });
          
          });
        });
    });

  });

});

chrome.extension.onMessage.addListener(function(data, sender, sendResponse) {

  if(data.type == 'PASTE'){

    chrome.tabs.sendMessage(target_tab.id, data.value, function(response){
    });

    chrome.tabs.update(target_tab.id, {'active': true}, function(response){

    });
  }

});


function removeCookies(tab_id){
  if(target_tab.id == tab_id){
    chrome.cookies.remove({"url": protocol_and_host, 'name': "currentTargetValue"});
    chrome.cookies.remove({"url": protocol_and_host, 'name': "currentTargetURL"});
  }
}



