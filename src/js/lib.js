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
