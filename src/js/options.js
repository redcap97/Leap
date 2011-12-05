var messages = {
  'invalidUrl'         : 'Please input the URL.',
  'invalidCommand'     : 'Please input the command name. (White spaces cannot be used.)',
  'duplicateCommand'   : 'The command name is already used.',
  'exportingSucceeded' : 'An exporting data was succeeded.',
  'importingSucceeded' : 'An importing data was succeeded.',
  'invalidData'        : 'The data is invalid.',
  'parsingError'       : 'A parsing error occurred.'
};

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
      jQuery.isArray(urlMap)){
    return false;
  }

  for(var command in urlMap){
    var urls = urlMap[command];

    if(!validateCommand(command)){
      return false;
    }

    if(!jQuery.isArray(urls) || urls.length === 0){
      return false;
    }

    for(var i = 0; i < urls.length; ++i){
      var url = urls[i];
      if(!validateUrl(url)){
        return false;
      }
    }
  }
  return true;
}

var splitUrls = function(urls){
  var urls = urls.split(/\r?\n/g);

  var results = new Array();
  for(var i = 0; i < urls.length; ++i){
    var url = urls[i].strip();
    if(validateUrl(url)){
      results.push(url);
    }
  }
  return results;
}

var showMessageOnDialog = function(message){
  $('#dialog-alert').text(message).show();
}

var saveCommand = function(){
  var urlMap = loadUrlMap();

  var command = $('#dialog-command').val();
  var oldCommand = $('#dialog-old-command').val();
  var urls = splitUrls($('#dialog-url').val());

  if(!validateCommand(command)){
    showMessageOnDialog(messages['invalidCommand']);
  }else if(urls.length === 0){
    showMessageOnDialog(messages['invalidUrl']);
  }else if((command !== oldCommand) && (command in urlMap)){
    showMessageOnDialog(messages['duplicateCommand']);
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

var showMessageOnExportImportSection = function(message, succeeded){
  $('#export-import-message')
    .text(message)
    .removeClass(succeeded ? "error" : "success")
    .addClass(succeeded ? "success" : "error")
    .show();
}

var exportData = function(){
  var urlMap = loadUrlMap();
  $('#data-area')
    .val(JSON.stringify(urlMap))
    .select();

  var showMessage = showMessageOnExportImportSection;
  showMessage(messages['exportingSucceeded'], true);
}

var importData = function(){
  var showMessage = showMessageOnExportImportSection;

  var urls = $('#data-area').val();
  try{
    var object = JSON.parse(urls);
    if(validateUrlMap(object)){
      saveUrlMap(object);
      resetCommandList();
      showMessage(messages['importingSucceeded'], true);
    }else{
      showMessage(messages['invalidData'], false);
    }
  }catch(e){
    showMessage(messages['parsingError'], false);
  }
}

var createOption = function(command, urls){
  var option = $('<option></option>');
  var caption = command + " [ " + urls.join(', ') + ' ]';

  return option.data('command', command).text(caption);
}

var resetCommandList = function(){
  var urlMap = loadUrlMap();

  $('#command-list').html('');
  for(var command in urlMap){
    $('#command-list').prepend(createOption(command, urlMap[command]));
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

$(function(){
  setupCommandList();
  setupDialog();
  setupImportExportSection();
});
