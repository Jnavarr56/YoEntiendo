// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require activestorage
//= require turbolinks
//= require_tree .

//= require js.cookie
//= require jstz
//= require browser_timezone_rails/set_time_zone


document.addEventListener('turbolinks:load', () => {
    let path = location.pathname.split('/');
    
    if (path[0] === "" && path[1] === "") {
        document.body.classList.addClass = "bodyAnimation";

    }

    /*
    if (path[1] === "passages" && parseInt(path[path.length - 1])) {
      let showCurrentPassage = new ShowPassage(document.getElementById('hiddenFeedAnnotationCodeString').innerHTML, 'infoDisplay', 'title');
      showCurrentPassage.instateAnnotations(document.getElementById('hiddenFeedCurrentPassageID').innerHTML,'downloadTXT', 'downloadDOC', 'display'); 
    }
    if (path[1] === "passages" && path[path.length - 1] === "new") {
        let newPassage = new CreatePassage('empty', 'colors');
        newPassage.setArticleProcessingTrigger('convertArticleButton', 'articleInput', 'articleOutput', 'articleTitle');
        newPassage.setReturnSelectionTrigger('returnSelectionButton', 'selectedText');
        newPassage.setClearTrigger('clearSelection')
        newPassage.setEntiendifyTrigger('entiendifyButton', 'selectedText', 'translationInfo');
        newPassage.setTransferTranslatedToManualAreaTrigger('translationInfo', 'transferButton', 'manualArea');
        newPassage.setManualBindTrigger('articleOutput', 'manualBindButton', 'manualArea', 'infoDisplay', 'deleteAnnotation');
        newPassage.setVersionControl('undo', 'redo', 'infoDisplay', 'articleOutput', 'deleteAnnotation');
        newPassage.createSaveAlias('finalize', 'save',  'articleTitle', 'passage_title', 'passage_content', 'annotsField');

        newPassage.setAnnotationEdit('infoDisplay', 'articleOutput', 'editAnnotation', 'cancelEditAnnotation', 'deleteAnnotation');
    }
    if (path[1] === "passages" && path[path.length - 1] === "edit") {
        let newPassage = new CreatePassage('empty', 'colors');
        newPassage.annotationCode = document.getElementById('hiddenFeedAnnotationCodeString').innerHTML;

        document.getElementById('annotsField').value = newPassage.annotationCode;

        
        
    }*/
});


