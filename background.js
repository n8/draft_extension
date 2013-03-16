chrome.browserAction.onClicked.addListener(function(tab) {
  
  chrome.tabs.query({'active': true}, function(tabs){
    
    target_tab = tabs[0]

    chrome.tabs.sendMessage(tab.id, 'getCurrentValue', function(currentTargetValue){
      

        chrome.cookies.set( {"domain": "draftin.com", "url": "https://draftin.com", "name": "currentTargetValue", "value": escape(currentTargetValue)}, function(currentValueCookie){
          chrome.cookies.set( {"url": "https://draftin.com", "name": "currentTargetURL", "value": escape(target_tab.url)}, function(currentTargetURLCookie){

  
            chrome.tabs.create({url: "https://draftin.com/documents/"}, function(draft_tab){

        

              fetchDocumentContent(target_tab, draft_tab);
            });
          
          });
        });
 


        // chrome.cookies.set( {"domain": "127.0.0.1", "url": "http://127.0.0.1", "name": "currentTargetValue", "value": escape(currentTargetValue)}, function(currentValueCookie){
        //   chrome.cookies.set( {"url": "http://127.0.0.1", "name": "currentTargetURL", "value": escape(target_tab.url)}, function(currentTargetURLCookie){

  
        //     chrome.tabs.create({url: "http://127.0.0.1:3000/documents/"}, function(draft_tab){

        

        //       fetchDocumentContent(target_tab, draft_tab);
        //     });
          
        //   });
        // });
 

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




