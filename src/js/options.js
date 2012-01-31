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

var saveCommand = function(){
  var urlMap = loadUrlMap();
  var writer = new MessageWriter($('#dialog-alert'));

  var command = $('#dialog-command').val();
  var oldCommand = $('#dialog-old-command').val();
  var urls = splitUrls($('#dialog-url').val());

  if(!validateCommand(command)){
    writer.show('invalidCommand', false);
  }else if(urls.length === 0){
    writer.show('invalidUrl', false);
  }else if((command !== oldCommand) && urlMap.hasOwnProperty(command)){
    writer.show('duplicateCommand', false);
  }else{
    delete urlMap[oldCommand];
    urlMap[command] = urls;
    saveUrlMap(urlMap);

    resetCommandList();
    exitDialog();
  }
}

var removeCommand = function(){
  var option = $('#command-list').children(':selected');
  var command = option.data('command');
  if(command === undefined){
    return;
  }

  editUrlMap(function(map){
    delete map[command];
  });
  option.remove();
}

var openDialogToEditCommand = function(){
  var option = $('#command-list').children(':selected');
  var command = option.data('command');
  if(command === undefined){
    return;
  }

  var urlMap = loadUrlMap();
  $('#dialog-command').val(command);
  $('#dialog-old-command').val(command);
  $('#dialog-url').val(urlMap[command].join("\n") + "\n");
  $('#dialog-header').text('Edit the command');

  $('#dialog').modal('show');
  $('#dialog-command').focus();
}

var openDialogToCreateCommand = function(){
  $('#dialog-command').val('');
  $('#dialog-old-command').val('');
  $('#dialog-url').val('');
  $('#dialog-header').text('Add new command');

  $('#dialog').modal('show');
  $('#dialog-command').focus();
}

var exitDialog = function(){
  $('#dialog-alert').hide();
  $('#dialog').modal('hide');
}

var exportData = function(){
  var urlMap = loadUrlMap();
  var writer = new MessageWriter($('#export-import-message'));

  $('#data-area')
    .val(JSON.stringify(urlMap))
    .select();

  writer.show('exportingSucceeded', true);
}

var importData = function(){
  var urls = $('#data-area').val();
  var writer = new MessageWriter($('#export-import-message'));

  try{
    var object = JSON.parse(urls);
    if(validateUrlMap(object)){
      saveUrlMap(object);
      resetCommandList();

      writer.show('importingSucceeded', true);
    }else{
      writer.show('invalidData', false);
    }
  }catch(e){
    writer.show('parsingError', false);
  }
}

var createOption = function(command, urls){
  var option = $('<option></option>');
  var caption = command + ' ( ' + urls.join(', ') + ' )';

  return option.data('command', command).text(caption);
}

var resetCommandList = function(){
  var urlMap = loadUrlMap();

  $('#command-list').html('');
  for(var command in urlMap){
    if(urlMap.hasOwnProperty(command)){
      $('#command-list').prepend(createOption(command, urlMap[command]));
    }
  }
  $('#command-list > option').dblclick(openDialogToEditCommand);
}

var setupButtons = function(){
  $('#add-btn').click(openDialogToCreateCommand);
  $('#edit-btn').click(openDialogToEditCommand);
  $('#remove-btn').click(removeCommand);
} 

var setupCommandList = function(){
  resetCommandList();
  setupButtons();
}

var setupDialog = function(){
  $('#dialog-btn-close').click(exitDialog);
  $('#dialog-btn-save').click(saveCommand);
  $('#dialog').modal({backdrop: true});
}

var setupImportExportSection = function(){
  $('#export-btn').click(exportData);
  $('#import-btn').click(importData);
}

var setupTabSection = function(){
  $('#tab-focus').click(function(){
    var checked = $(this).is(':checked');
    changeFocusOfNewTab(checked);
  });

  $('#tab-focus').attr('checked', canSwitchFocusToNewTab());
}

$(function(){
  setupCommandList();
  setupImportExportSection();
  setupTabSection();
  setupDialog();
});
