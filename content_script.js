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
      sendResponse();
    }
  }
  else{
    console.log(data);
    
    if(el.nodeName == "DIV"){
      el.innerHTML = data;
    }
    else if(el.nodeName == "TEXTAREA"){
      el.value = data;
    }
  }
  
});