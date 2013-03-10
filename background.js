chrome.browserAction.onClicked.addListener(function(tab) {
  
  chrome.tabs.query({'active': true}, function(tabs){
    tab = tabs[0]
    guid  = [tab.id, tab.url, (new Date).getTime()].join('-');

    $.get("http://127.0.0.1:3000/site/authenticity_token", function(authenticity_token){

      chrome.tabs.sendMessage(tab.id, 'getCurrentValue', function(currentValue){
        
        $.post("http://127.0.0.1:3000/site/extension", { referral_guid: guid, content: currentValue, authenticity_token: authenticity_token }, function(document_id){
          // alert(document_id);
          chrome.tabs.create({url: "http://127.0.0.1:3000/documents/" + document_id + "/edit"});
          setTimeout(function(){fetchDocumentContent(guid, authenticity_token)}, 2000);
        });


        
      });

    });

  });

});


function fetchDocumentContent(guid, authenticity_token){
  guid_parts = guid.split("-");

  chrome.tabs.sendMessage(parseInt(guid_parts[0]), 'getCurrentValue', function(currentValue){

    $.post("http://127.0.0.1:3000/documents/sync_with_extension", { referral_guid: guid, content: currentValue, authenticity_token: authenticity_token }, function(data){

      chrome.tabs.sendMessage(parseInt(guid_parts[0]), data, function(response){

      });
    });
  });

  chrome.tabs.query({url: 'http://127.0.0.0.1'}, function(tab){
    setTimeout(function(){fetchDocumentContent(guid, authenticity_token)}, 2000);
  });
  
}


