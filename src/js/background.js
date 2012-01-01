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

var openNewTab = function(url){
  var selected = canSwitchFocusToNewTab();

  chrome.tabs.create({
    url: url,
    selected: selected
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
  var commands = text.trim().split(/\s+/);

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
