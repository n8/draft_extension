chrome.extension.onMessage.addListener(function(data, sender, sendResponse) {

  el = document.activeElement;

  if(data == 'getCurrentValue'){

    if(el.nodeName == "DIV"){
      sendResponse(el.innerText);
    }
    else if(el.nodeName == "TEXTAREA"){
      sendResponse(el.value);
    }
    else{
      sendResponse(el.innerText);
    }
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

    if(el.nodeName == "DIV"){
      el.innerHTML = data;
    }
    else if(el.nodeName == "TEXTAREA"){
      el.value = data;
    }
  }
  
});