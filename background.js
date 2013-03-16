target_tab = null; 
current_draft_tab = null; 

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
  if(target_tab.id == tabId){
    removeCookies(tabId);
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo){
  removeCookies(tabId);
});

chrome.browserAction.onClicked.addListener(function(tab) {
  
  chrome.tabs.query({'active': true}, function(tabs){
    
    target_tab = tabs[0]
    originalTargetURL = target_tab.url

    chrome.tabs.sendMessage(tab.id, 'getCurrentValue', function(currentTargetValue){
      

        chrome.cookies.set( {"domain": "draftin.com", "url": "https://draftin.com", "name": "currentTargetValue", "value": escape(currentTargetValue)}, function(currentValueCookie){
          chrome.cookies.set( {"url": "https://draftin.com", "name": "currentTargetURL", "value": escape(target_tab.url)}, function(currentTargetURLCookie){

  
            chrome.tabs.create({url: "https://draftin.com/documents/"}, function(draft_tab){

              current_draft_tab = draft_tab;

              // fetchDocumentContent(target_tab, draft_tab, originalTargetURL);
            });
          
          });
        });
 


        // chrome.cookies.set( {"domain": "127.0.0.1", "url": "http://127.0.0.1", "name": "currentTargetValue", "value": escape(currentTargetValue)}, function(currentValueCookie){
        //   chrome.cookies.set( {"url": "http://127.0.0.1", "name": "currentTargetURL", "value": escape(target_tab.url)}, function(currentTargetURLCookie){

  
        //     chrome.tabs.create({url: "http://127.0.0.1:3000/documents/"}, function(draft_tab){

        //       current_draft_tab = draft_tab;

        //       // fetchDocumentContent(target_tab, draft_tab);
        //     });
          
        //   });
        // });
 

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
    // chrome.cookies.remove({"url": "http://127.0.0.1", 'name': "currentTargetValue"});
    // chrome.cookies.remove({"url": "http://127.0.0.1", 'name': "currentTargetURL"});

    chrome.cookies.remove({"url": "https://draftin.com", 'name': "currentTargetValue"});
    chrome.cookies.remove({"url": "https://draftin.com", 'name': "currentTargetURL"});

  }
}

function fetchDocumentContent(targetTab, draftTab, original_target_url){

  // chrome.tabs.query({url: 'https://draftin.com/*'}, function(tabs){

  chrome.tabs.query({url: 'http://127.0.0.1/*'}, function(tabs){

    // make sure we are at the original target

    // alert(targetTab.url);

    chrome.tabs.get(targetTab.id, function(currentTargetTab){
      if(tabs.length > 0 && currentTargetTab.url == original_target_url){

        chrome.tabs.sendMessage(draftTab.id, 'getDraftValue', function(currentDraftValue){
   
          chrome.tabs.sendMessage(targetTab.id, currentDraftValue, function(response){

          });

        });


        // setTimeout(function(){fetchDocumentContent(targetTab, draftTab, original_target_url)}, 2000);
      }
    });

    
  });

  // chrome.tabs.query({url: 'http://127.0.0.1/*'}, function(tabs){
  //   // make sure we are at the original target

  //   if(tabs.length > 0 && targetTab.url === original_target_url){
  //     setTimeout(function(){fetchDocumentContent(targetTab, draftTab, targetTab.url)}, 2000);
  //   }
  // });
  
}




