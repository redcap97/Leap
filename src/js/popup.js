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

var copyUrlFromCurrentTab = function(){
  chrome.tabs.getSelected(null, function(tab){
    $('#popup-url').val(tab.url + "\n");
  });
}

var copyUrlsFromCurrentWindow = function(){
  chrome.windows.getCurrent(function(w){
    chrome.tabs.getAllInWindow(w.id, function(tabs){
      urls = tabs.map(function(tab){ return tab.url; });
      $('#popup-url').val(urls.join("\n") + "\n");
    });
  });
}

var copyUrlsFromAllWindows = function(){
  chrome.windows.getAll({populate: true}, function(ws){
    var urls = [];
    for(var i = 0; i < ws.length; ++i){
      urls.addAll(ws[i].tabs.map(function(tab){ return tab.url; }));
    }
    $('#popup-url').val(urls.join("\n") + "\n");
  });
}

var exitPopup = function(){
  window.close();
  return false;
}

var saveCommand = function(){
  var urlMap = loadUrlMap();
  var writer = new MessageWriter($('#popup-alert'));

  var command = $('#popup-command').val();
  var urls = splitUrls($('#popup-url').val());

  if(!validateCommand(command)){
    writer.write('invalidCommand', false);
  }else if(urls.length === 0){
    writer.write('invalidUrl', false);
  }else if(urlMap.hasOwnProperty(command)){
    writer.write('duplicateCommand', false);
  }else{
    urlMap[command] = urls;
    saveUrlMap(urlMap);
    exitPopup();
  }
  return false;
}

$(function(){
  $('#popup-btn-current-tab').click(copyUrlFromCurrentTab);
  $('#popup-btn-current-window').click(copyUrlsFromCurrentWindow);
  $('#popup-btn-all-windows').click(copyUrlsFromAllWindows);

  $('#popup-btn-add').click(saveCommand);
  $('#popup-btn-cancel').click(exitPopup);

  $('#popup-command').focus();
  $('#link-options-page').attr('href', getOptionUrl());

  copyUrlFromCurrentTab();
});
