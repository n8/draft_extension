chrome.browserAction.onClicked.addListener(function(tab) {
  
  chrome.tabs.query({'active': true}, function(tabs){
    
    target_tab = tabs[0]

    chrome.tabs.sendMessage(tab.id, 'getCurrentValue', function(currentTargetValue){
      

        chrome.cookies.set( {"domain": "draftin.com", "url": "https://draftin.com", "name": "currentTargetValue", "value": escape(currentTargetValue)}, function(currentValueCookie){
          chrome.cookies.set( {"url": "https://draftin.com", "name": "currentTargetURL", "value": escape(target_tab.url)}, function(currentTargetURLCookie){

  
            chrome.tabs.create({url: "https://draftin.com/documents/"}, function(draft_tab){

        

              fetchDocumentContent(target_tab, draft_tab, target_tab.url);
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

function fetchDocumentContent(targetTab, draftTab, original_target_url){

  chrome.tabs.sendMessage(draftTab.id, 'getDraftValue', function(currentDraftValue){
   
    chrome.tabs.sendMessage(targetTab.id, currentDraftValue, function(response){

    });

  });

  chrome.tabs.query({url: 'https://draftin.com/*'}, function(tabs){
    // make sure we are at the original target

    if(tabs.length > 0 && targetTab.url === original_target_url){
      setTimeout(function(){fetchDocumentContent(targetTab, draftTab, targetTab.url)}, 2000);
    }
  });

  // chrome.tabs.query({url: 'http://127.0.0.1/*'}, function(tabs){
  //   // make sure we are at the original target

  //   if(tabs.length > 0 && targetTab.url === original_target_url){
  //     setTimeout(function(){fetchDocumentContent(targetTab, draftTab, targetTab.url)}, 2000);
  //   }
  // });
  
}




