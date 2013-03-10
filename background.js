chrome.browserAction.onClicked.addListener(function(tab) {
  
  chrome.tabs.query({'active': true}, function(tabs){
    
    target_tab = tabs[0]

    chrome.tabs.sendMessage(tab.id, 'getCurrentValue', function(currentValue){

      chrome.cookies.set({"url": "http://127.0.0.1", "name": "currentTargetValue", "value": currentValue}, function(cookie){
        chrome.tabs.create({url: "http://127.0.0.1:3000/documents"}, function(draft_tab){
          setTimeout(function(){fetchDocumentContent(target_tab, draft_tab)}, 2000);
        });
      });   

    });

  });

});

function fetchDocumentContent(targetTab, draftTab){

  chrome.tabs.sendMessage(draftTab.id, 'getDraftValue', function(currentDraftValue){
   
    chrome.tabs.sendMessage(targetTab.id, currentDraftValue, function(response){

    });

  });

  chrome.tabs.query({url: 'http://127.0.0.1/*'}, function(tabs){
    if(tabs.length > 0){
      setTimeout(function(){fetchDocumentContent(targetTab, draftTab)}, 2000);
    }
  });
  
}




