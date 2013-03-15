chrome.browserAction.onClicked.addListener(function(tab) {
  
  chrome.tabs.query({'active': true}, function(tabs){
    
    target_tab = tabs[0]

    chrome.tabs.sendMessage(tab.id, 'getCurrentValue', function(currentTargetValue){
      
      chrome.tabs.create({url: "http://127.0.0.1:3000/documents"}, function(draft_tab){

        chrome.cookies.remove({"url": "http://127.0.0.1", "name": "currentTargetValue"}, function(oldcookie){

          chrome.cookies.set({"url": "https://127.0.0.1", "name": "currentTargetValue", "value": currentTargetValue}, function(cookie){
          
          });
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




