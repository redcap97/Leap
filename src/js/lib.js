var defaultUrlMap = {
  'gm': [
    'https://mail.google.com/mail/'
  ],
  'gr': [
    'http://www.google.com/reader/'
  ],
  'gd': [
    'https://docs.google.com/'
  ],
  'g' : [
    'https://mail.google.com/mail/',
    'http://www.google.com/reader/',
    'https://docs.google.com/'
  ]
};

String.prototype.strip = function(){
  return this.replace(/^\s*|\s*$/g, "");
}

Array.prototype.addAll = function(array){
  for(var i = 0; i < array.length; ++i){
    this.push(array[i]);
  }
}

var isObject = function(object){
  return (object instanceof Object);
}

var saveUrlMap = function(urlMap){
  localStorage.urlmap = JSON.stringify(urlMap);
}

var getOptionUrl = function(){
  return chrome.extension.getURL("options.html");
};

var loadUrlMap = function(){
  var str = localStorage.urlmap

  if(str === undefined){
    defaultUrlMap['leap'] = [getOptionUrl()];
    saveUrlMap(defaultUrlMap);
    return defaultUrlMap;
  }else{
    return JSON.parse(str);
  }
}

var editUrlMap = function(fn){
  var urlMap = loadUrlMap();
  fn(urlMap);
  saveUrlMap(urlMap);
}
