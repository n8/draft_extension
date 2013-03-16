chrome.extension.onMessage.addListener(function(data, sender, sendResponse) {

  if(data == 'getCurrentValue'){
    var currentValue = getCurrentValue(document); 
    sendResponse(currentValue);
  }
  else if(data == "getDraftValue"){

    el = document.getElementById("document_content");

    if(el){
      sendResponse(el.value);
    }
    else{

    }
    if(el == null){
      el = document.getElementById("document_content_for_export");

      if(el){
        sendResponse(el.innerHTML);
      }
    }

  }
  else{
    setCurrentValue(document, data); 
  }
  
});

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;

  if (event.data.type && (event.data.type == "PASTE")) {
    // console.log("Content script received: " + event.data.text);

    chrome.extension.sendMessage({type: 'PASTE', value: event.data.text}, function(response) {
      
    });

  }
}, false);


function getCurrentValue(document){
  el = document.activeElement;

  if(el.nodeName == "DIV" || el.nodeName == "BODY"){
    return el.innerText;
  }
  else if(el.nodeName == "TEXTAREA"){
    return el.value;
  }
  else if(el.nodeName == "IFRAME"){
    var innerDoc = el.contentDocument || el.contentWindow.document;
    return getCurrentValue(innerDoc);
  }
}

function setCurrentValue(document, data){
  el = document.activeElement;

  if(el.nodeName == "DIV" || el.nodeName == "BODY"){
    el.innerText = data;
  }
  else if(el.nodeName == "TEXTAREA"){
    el.value = data;
  }
  else if(el.nodeName == "IFRAME"){
    var innerDoc = el.contentDocument || el.contentWindow.document;
    setCurrentValue(innerDoc, data);
  }
}