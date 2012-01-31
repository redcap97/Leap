/*
Copyright (C) 2011 Akira Midorikawa

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

const DEFAULT_URL_MAP = {
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

const MESSAGES = {
  'invalidUrl'         : 'Please input the URL.',
  'invalidCommand'     : 'Please input the command name. (White spaces cannot be used.)',
  'duplicateCommand'   : 'The command name is already used.',
  'exportingSucceeded' : 'An exporting data was succeeded.',
  'importingSucceeded' : 'An importing data was succeeded.',
  'invalidData'        : 'The data is invalid.',
  'parsingError'       : 'A parsing error occurred.'
};

var MessageWriter = function(object){
  this.object = object;
}

MessageWriter.prototype.write = function(key, succeeded){
  this.object
    .text(MESSAGES[key])
    .removeClass(succeeded ? "error" : "success")
    .addClass(succeeded ? "success" : "error")
    .show();
}

var validateCommand = function(str){
  return (typeof(str) === "string") &&
    (str.match(/^\S+$/) !== null);
}

var validateUrl = function(str){
  return (typeof(str) === "string") &&
    (str.match(/^\S+$/) !== null);
}

var validateUrlMap = function(urlMap){
  if(urlMap === null || !isObject(urlMap) ||
      Array.isArray(urlMap)){
    return false;
  }

  for(var command in urlMap){
    if(urlMap.hasOwnProperty(command)){
      var urls = urlMap[command];

      if(!validateCommand(command)){
        return false;
      }

      if(!Array.isArray(urls) || urls.length === 0){
        return false;
      }

      for(var i = 0; i < urls.length; ++i){
        if(!validateUrl(urls[i])){
          return false;
        }
      }
    }
  }
  return true;
}

var splitUrls = function(urls){
  var urls = urls.split(/\r?\n/g);

  var results = new Array();
  for(var i = 0; i < urls.length; ++i){
    var url = urls[i].trim();
    if(validateUrl(url)){
      results.push(url);
    }
  }
  return results;
}

Array.prototype.addAll = function(array){
  for(var i = 0; i < array.length; ++i){
    this.push(array[i]);
  }
}

var isObject = function(object){
  return (object instanceof Object);
}

var getOptionUrl = function(){
  return chrome.extension.getURL("options.html");
};

var saveUrlMap = function(urlMap){
  localStorage.urlmap = JSON.stringify(urlMap);
}

var loadUrlMap = function(){
  var str = localStorage.urlmap

  if(str === undefined){
    DEFAULT_URL_MAP['leap'] = [getOptionUrl()];
    saveUrlMap(DEFAULT_URL_MAP);
    return DEFAULT_URL_MAP;
  }else{
    return JSON.parse(str);
  }
}

var editUrlMap = function(fn){
  var urlMap = loadUrlMap();
  fn(urlMap);
  saveUrlMap(urlMap);
}

var changeFocusOfNewTab = function(selected){
  if(typeof(selected) === "boolean"){
    localStorage.canSwitchFocusToNewTab = selected.toString();
  }
}

var canSwitchFocusToNewTab = function(){
  var str = localStorage.canSwitchFocusToNewTab;

  if(str === undefined){
    changeFocusOfNewTab(true);
    return true;
  }else{
    return str === 'true';
  }
}
