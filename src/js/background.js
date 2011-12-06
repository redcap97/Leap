var openNewTab = function(url){
  chrome.tabs.create({
    url: url,
    selected: false
  });
}

var updateCurrentTab = function(url){
  chrome.tabs.getSelected(null, function(tab){
    if(tab.url.indexOf('chrome://newtab') !== -1){
      chrome.tabs.update(tab.id, {url: url});
    }else{
      openNewTab(url);
    }
  });
}

var convertToUrls = function(text){
  var urlMap = loadUrlMap();

  var urls = new Array();
  var commands = text.strip().split(/\s+/);

  for(var i = 0; i < commands.length; ++i){
    var command = commands[i];
    if(command in urlMap){
      urls.addAll(urlMap[command]);
    }
  }
  return urls;
}

chrome.omnibox.onInputEntered.addListener(function(text){
  var urls = convertToUrls(text);

  for(var i = 0; i < urls.length; ++i){
    if(i === 0){
      updateCurrentTab(urls[i]);
    }else{
      openNewTab(urls[i]);
    }
  }
});