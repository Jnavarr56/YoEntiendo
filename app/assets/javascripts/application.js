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
//****************************************CREATEPASSAGE-HELPERS******************************************************************************************
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//Retrieve Phrase Translation and Display 

let getPhrase = (textToTranslate, translatedTextDisplayElementID) => {
    document.getElementById(translatedTextDisplayElementID).parentElement.style.backgroundImage = 'url(http://icon-park.com/imagefiles/loading7_blue.gif)'; 
    axios.post('https://translation.googleapis.com/language/translate/v2?key=AIzaSyAlvb3KWXTU6DcFW8hHodSiQMNcZFe77eE', {
        q: textToTranslate, 
        target: 'en', 
        format: 'text', 
        source: 'es' 
    })
    .then((response) => {  
        console.log(response);
        document.getElementById(translatedTextDisplayElementID).innerText = response.data.data.translations[0].translatedText; 
        tinymce.activeEditor.setContent(document.getElementById(translatedTextDisplayElementID).innerText);
        document.getElementById(translatedTextDisplayElementID).parentElement.style.backgroundImage = ''; 
    })
    .catch((error) => {
        console.log(error);
    });
}
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//Process Article into Spans with Unique ID's.

let convertArticle = (articleInputIDArg, articleOutputIDArg) => {
    let articleInputAsArray = document.getElementById(articleInputIDArg).value.trim().split(' '); 
    let articleOutputDisplayElement = document.getElementById(articleOutputIDArg); 
    for (let x = 0; x < articleInputAsArray.length; x++) {
        let word = document.createElement('span'); 
        word.id = `i${x}`; 
        word.classList.add = 'validWord'; 
        if (x === articleInputAsArray.length - 1) {word.innerText = `${articleInputAsArray[x]}`;} 
        else {word.innerText = `${articleInputAsArray[x]} `;} 
        articleOutputDisplayElement.appendChild(word); 
    }
    for (let x = 0; x < articleOutputDisplayElement.children.length; x++) { 
        if (articleOutputDisplayElement.children[x].innerHTML.split('<br>').length > 1) { 
            articleOutputDisplayElement.children[x].nextElementSibling.innerHTML =  articleOutputDisplayElement.children[x].innerHTML.split('<br>')[articleOutputDisplayElement.children[x].innerHTML.split('<br>').length-1] + articleOutputDisplayElement.children[x].nextElementSibling.innerHTML;
            articleOutputDisplayElement.children[x].innerHTML = articleOutputDisplayElement.children[x].innerHTML.slice(0, articleOutputDisplayElement.children[x].innerHTML.lastIndexOf('<br>')+'<br>'.length)
        }
    }
}
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//Empty Text Element Containing other Text Elements (faster than innerHTML = '') [Helper]

let emptyTextElement = (elementID) => {
    while (document.getElementById(elementID).firstChild) {
        document.getElementById(elementID).removeChild(document.getElementById(elementID).firstChild);
    }
}
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//Clear selected text [Helper]

let clearSelectedText =  () => {
    if (window.getSelection) {
        if (window.getSelection().empty) {  
            window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) { 
            window.getSelection().removeAllRanges();
        }
    } else if (document.selection) {  
        document.selection.empty();
    }
}
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//Reinstate old event hover listeners [Helper]
//GET BACK DELETE
//*We might want to switch hoverElement.innerHTML to hoverElement since what is being plopped into it is already HTML.

let applyAnnotations = (annotationCodeStr, hoverElementID) => {
    let hoverElement = document.getElementById(hoverElementID); 
    let annotationArr = annotationCodeStr.split('$-$'); 
    for (let x = 0; x < annotationArr.length-1; x++) {
        let annotation = annotationArr[x].split('@-@'); 
        document.getElementById(annotation[0]).addEventListener('mouseover', (event)=> {
            /*Not first child?*/
            hoverElement.innerHTML = annotation[2]; 
            hoverElement.style.display = 'flex'; 

            hoverElement.style.left = `${event.clientX}px`; 
            hoverElement.style.top = `${event.clientY}px`;  
            
            document.getElementById(annotation[0]).addEventListener('mouseout', ()=> {
                /*Not first child?*/
                hoverElement.innerHTML = ''; 
                hoverElement.style.display = 'none'; 

            });
        });
    }
}
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//Empty all elements with a certain class [Helper]

let emptyWithClass = (emptyClass) => {
    tinyMCE.activeEditor.setContent('');
    let classesMarkedForEmpty = document.getElementsByClassName(emptyClass); 
    for (let x = 0; x < classesMarkedForEmpty.length; x++) {    
        if (classesMarkedForEmpty[x].nodeName === 'INPUT' || classesMarkedForEmpty[x].nodeName === 'TEXTAREA') {
            classesMarkedForEmpty[x].value = '';
        }
        else {
            classesMarkedForEmpty[x].innerHTML = '';
        }
    }
}
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//Download as text file.

let setDownloadTXT = (downloadLinkElementID, filename, text) => {
    let downloadLink = document.getElementById(downloadLinkElementID);
    downloadLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    downloadLink.setAttribute('download', `passage${filename}`);
}
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//Download as doc file.

let setDownloadDOC = (downloadLinkElementID, filename, htmlTextID, passageTitleElementID) => {
    let articleClone = document.getElementById(htmlTextID).cloneNode(true);
    let annotationHeader = document.createElement('h3');
    annotationHeader.innerText = 'Annotations:';
    let annotationBorder = document.createElement('h3');
    annotationBorder.innerText = '--------------------------------------------------------------------------------------------------------';
    articleClone.appendChild(annotationHeader);
    articleClone.appendChild(annotationBorder);
    let footnoteCount = 1;
    for (let x of articleClone.children) {
        if (x.classList.contains('annotation')) {
            x.previousElementSibling.innerHTML = `${footnoteCount}. ${x.previousElementSibling.innerHTML}`;
            x.style.display = 'initial';
            x.innerHTML = `<span>${footnoteCount}.</span> ${x.innerHTML}`;   
            x.firstElementChild.style.backgroundColor = x.previousElementSibling.style.backgroundColor;
            let annotation = document.createElement('p');
            annotation.appendChild(x);
            articleClone.appendChild(annotation);
            footnoteCount++;
        }
    }
    let preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    let postHtml = "</body></html>";
    let html = preHtml + articleClone.innerHTML + postHtml;
    let blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });
    let url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
    filename = `passage${filename}` + '.doc';
    let downloadLink = document.getElementById(downloadLinkElementID);
    if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename);
    } 
    else {
        downloadLink.href = url;
        downloadLink.download = filename;
    }
}
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//Takes an annotation code and turns it into a new one reflecting the deletion of an annotation

let deleteAnnotationCode = (joinedSelectionElementID, preDeleteAnnotationCode) => {
    let splitByWholeAnnotation = preDeleteAnnotationCode.split('$-$');
    splitByWholeAnnotation = splitByWholeAnnotation.slice(0, splitByWholeAnnotation.length - 1); 
    if (splitByWholeAnnotation.length === 1) {
        return '';
    }  
    else {
        let newAnnotationCodeString = '';
        for (let a = 0; a < splitByWholeAnnotation.length; a++) {
            let splitByParts = splitByWholeAnnotation[a].split('@-@');
            if (splitByParts[0] !== joinedSelectionElementID) {         
                newAnnotationCodeString += `${splitByWholeAnnotation[a]}$-$`;
            }
        }
        return newAnnotationCodeString;
    }
}
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//Takes an joinedSelected element ID and changes the HTML of the passage to reflect deletion of the corresponding annotation.

let deleteAnnotationElement = (joinedSelectionElementID) => {
    while (document.getElementById(joinedSelectionElementID).firstElementChild) {
        document.getElementById(joinedSelectionElementID).parentNode.insertBefore( 
            document.getElementById(joinedSelectionElementID).firstElementChild, 
            document.getElementById(joinedSelectionElementID)
        ); 
    }
    document.getElementById(joinedSelectionElementID).parentNode.removeChild(document.getElementById(joinedSelectionElementID));
}
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//Based on whole annotation code and ID of currently selected joinedSelection, get joinedSelection's corresponding annotation text.

let getSelectedAnnotationText = (annotationCodeStr, selectedSpanID) => {
    let annotationSplit = annotationCodeStr.split('$-$'); 
    annotationSplit = annotationSplit.slice(0, annotationSplit.length - 1);
    for (let x = 0; x < annotationSplit.length; x++) {
        let annotationDoubleSplit = annotationSplit[x].split('@-@');
        if (annotationDoubleSplit[0] === selectedSpanID) {
            return annotationDoubleSplit[2];
        }
    }
}
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------


//****************************************CREATEPASSAGE-CLASS********************************************************************************************
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//ALL METHODS MUST BE CALLED ON THE NEW PASSAGE PAGE:

class CreatePassage {

    constructor(emptyClassStr, colorElementID) {

        this.markForEmpty = emptyClassStr;      //REQUIRED: The HTML class attribute that marks certain display/input elements that are to be periodically emptied.
        this.annotationColor = colorElementID;  //REQUIRED: The ID of the color selector for the annotation background color.

        this.versions = [];                     //DEFAULT []: Holds objects representing versions of annotationCode + article HTML.
        this.versionsIndex = 0;                 //DEFAULT 0: Used to access different objects in this.versions.
        this.annotationCode = '';               //DEFAULT '':Stores the current annotationCode, even if not on latest version then.
        this.selectedElements = [];             //DEFAULT []: Holds span elements that are in current text selection.

        this.selectedSpan = '';                 //DEFAULT '': Hold ID of the annotation segment that is currently selected.
        this.selectedSpanAnnotation = '';       //DEFAULT '': Hold annotation text of the annotation segment that is currently selected.

        this.idCount = 1;                       //DEFAULT '': Hold annotation text of the annotation segment that is currently selected.
                                                /*WHEN USED ON EDIT PASSAGE PAGE WE MUST SET THIS TO THE HIGHEST ANNOTATION SEGMENT ID */

        this.articleTitle = ''                  //DEFAULT '': Will be set to the article title upon input.

    }

    setArticleProcessingTrigger(processArticleButtonIDArg, articleInputIDArg, articleOutputIDArg, articleTitleInputIDArg) {

        /*This method will set up article processing and connects: 
            - a button element ID     [to trigger an article processing]
            - a text input element ID [to intake the article title]
            - a text input element ID [to intake the article raw text]
        
        processArticleButtonIDArg => ID of element that is the button that will result in the article processing;
        articleInputIDArg => ID of element that is the text input element that the raw article text will be placed into.
        articleOutputIDArg, => ID of element that is the element that will hold the article output after processing. Does not have to be a text element.
        articleTitleInputIDArg => ID of the element that is the text input element that the article title will be placed into

        An article will be processed into the multi-span format we need.
        The first 'version' is created and stored within the class.
        The article title is stored within the class as well.*/
        
        let convertButton = document.getElementById(processArticleButtonIDArg); 
        let articleTextInput = document.getElementById(articleInputIDArg);  
        let articleTitleInput = document.getElementById(articleTitleInputIDArg);   

        convertButton.addEventListener('click', () => {

            this.versions = [];
            this.versionsIndex = 0;
            this.annotationCode = '';
            this.selectedElements = [];

            if (articleTextInput.value === '') {return;}
            else if (articleTitleInput.value === '') {alert('You cannot create a passage without a title.'); return;} 
            
            emptyWithClass(this.markForEmpty);
            emptyTextElement(articleOutputIDArg);

            convertArticle(articleInputIDArg, articleOutputIDArg);
            
            let preBindVersion = {passageHTML: document.getElementById(articleOutputIDArg).innerHTML, annotationCodeVersion: this.annotationCode};

            this.versions.push(preBindVersion); 
            this.versionsIndex = this.versions.length;

        });

    }

    setReturnSelectionTrigger(returnSelectionButtonIDArg, selectedTextDisplayElementIDArg) {

        /*This method will set up returning text selection functionality and connects: 
        - a button element ID          [to trigger a text return]
        - a text display element ID    [to plop the returned selection text into]

        returnSelectionButtonIDArg => ID of element that is the button that will capture a selection;
        selectedTextDisplayElementIDArg => ID of element that is the text display element that the selected text will be placed into.

        When text is selected and the => return button is hit, the returned text will be placed into a an element.
        All of the corresponding spans in the selection are stored in this.selectedElements.*/ 

        let returnButton = document.getElementById(returnSelectionButtonIDArg); 
        let selectionDisplayElement = document.getElementById(selectedTextDisplayElementIDArg); 
        
        returnButton.addEventListener('click', () => {

            this.selectedElements = []; 
            emptyWithClass(this.markForEmpty);
            
            let selection = window.getSelection();
            let a = parseInt(selection.anchorNode.parentElement.id.replace('i', "")); 
            let b = parseInt(selection.focusNode.parentElement.id.replace('i', "")); 
    
            let start; 
            let end;
            if (b > a) {start = a; end = b;}
            else if (a > b) {start = b; end = a;}
            else {

                this.selectedElements.push(document.getElementById(`i${a}`)); 
                selectionDisplayElement.innerText = document.getElementById(`i${a}`).innerText.trim();
                return;
            }
                    
            let selectedText = '';
            for (let x = start; x <= end; x ++) {
                this.selectedElements.push(document.getElementById(`i${x}`));
                selectedText += document.getElementById(`i${x}`).innerText;
            }
            selectionDisplayElement.innerText = selectedText.trim();

            console.log('-----');
            console.log('-----');
            console.log('SELECTED THESE ELEMENTS:')
            console.log(this.selectedElements);
            console.log('WITH THIS TEXT:');
            console.log(selectedText);
            console.log('-----');
            console.log('-----');

        });
    
    }

    setEntiendifyTrigger(entiendifyButtonIDArg, selectedTextDisplayElementIDArg, translatedTextDisplayElementIDArg) {

        /*This method will set up translation functionality for the text that has been selected/displayed in the selected-text-return-display element and connects:  
        - a button element ID         [to trigger a translation]
        - a text display element ID   [to grab the returned selection text from - IS ALSO A PARAMETER IN THE PREVIOUS METHOD*] 
        - a text display element ID   [to plop the translated selection text into] 
        
        entiendifyButtonIDArg => ID of element that is the button that will create a translation;
        *selectedTextDisplayElementIDArg => ID of element that is the text display element that the selected text will be grabbed from.
        translatedTextDisplayElementIDArg => ID of element that is the text display element the translation will be plopped into.
        
        When button is clicked, the displayed text selection will be translated and that translatiob text will be placed into a separate text display element.
        Will produce an alert then do nothing if there is no selected text.*/

        let entiendifyButton = document.getElementById(entiendifyButtonIDArg); 
        let selectedTextDisplayElement = document.getElementById(selectedTextDisplayElementIDArg); 
    
        entiendifyButton.addEventListener('click', () => {
            
            if (selectedTextDisplayElement.innerText === '') {alert('There is no selection to translate.'); return;}
            getPhrase(selectedTextDisplayElement.innerText, translatedTextDisplayElementIDArg);
            
        });
    
    }

    setTransferTranslatedToManualAreaTrigger(translatedTextDisplayElementID, transferButtonIDArg) {

        /*This method will set up a transfer of the translated text displayed in the translated-text-display-element to the text editor and connects:  
        - a button element ID         [to trigger a transfer of text]
        - a text display element ID   [to get to get the translated text from - IS ALSO A PARAMETER IN THE PREVIOUS METHOD*] 

        *translatedTextDisplayElementID => ID of the element that holdes the translated text that needs to be transfered.
        transferButtonIDArg=> ID of element that is the button that will capture cause a a transfer of translated text into the editor.

        When the button is clicked, the translated text currently displayed will be plopped into the editor.*/
    
        let transferButton = document.getElementById(transferButtonIDArg);
        let translatedTextElement = document.getElementById(translatedTextDisplayElementID);
        
        transferButton.addEventListener('click', () => {

            tinymce.activeEditor.setContent(translatedTextElement.innerText);

        });
    
    }
    //RE DOCUMENT
    setManualBindTrigger(articleOutputIDArg, manualInputAreaButtonIDArg, manualInputAreaIDArg, hoverElementID, deleteAnnotationButtonID) {

        /*This method is mainly responible for annotation creation functionality but does a lot more and will have to be explained line by line:
        
        articleOutputIDArg => ID of the element that is the text display elemnt holding the article HTML;
        manualInputAreaButtonIDArg => ID of the element that is the button that will be used to create the annotation.
        manualInputAreaIDArg => ID of element that is the text editor that will be used for annotation creation and editing
        hoverElementID => ID of element that is the text editor.
        deleteAnnotationButtonID => ID of the button that will delete annotations.
        */

        //TURN PLAIN TEXTAREA INTO MCE TEXT EDITOR
        tinymce.init({
            selector: `#${manualInputAreaIDArg}`, 
            entity_encoding : "raw",
            plugins: [
            'advlist autolink lists link image charmap print preview anchor textcolor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table contextmenu paste code help wordcount'
            ],
            toolbar: 'insert | undo redo |  formatselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
            
        });

        //TEXT DISPLAY ELEMENT HOLDING ARTICLE
        let articlePreBind = document.getElementById(articleOutputIDArg);

        //<----------------EVENT LISTENER FOR THE DELETE ANNOTATION BUTTON TRIGGERING THE DELETE ANNOTATION PROCESS-------------------------->A
        document.getElementById(deleteAnnotationButtonID).addEventListener('click', ()=>{

            //Ask user if they are sure they would like to delete the annotation.
            let confirmDelete = confirm('Are you sure you want to delete this annotation?'); 
            //A. If they are sure then proceed.
            if (confirmDelete) {

                //Convert the current annotation code (this.annotationCode) into one that contains
                //all of the annotations except for the one for the currently selected annotation (this.selectedSpan) 
                //because we are deleting that one.
                let preDeleteAnnotationCode = this.annotationCode; 
                this.annotationCode = deleteAnnotationCode(this.selectedSpan, preDeleteAnnotationCode); //<--DELETE ANNOTATION FROM ANNOTATIONCODE

                //Deletes the annotation from the article HTML and restores it the inner spans
                //to their original place.
                deleteAnnotationElement(this.selectedSpan); //<--DELETE ANNOTATION FROM ARTICLE HTML

                //Version Control: If we are not on the latest version, make version history everthing up until now and nothing more.
                if (this.versionsIndex !== this.versions.length -1) {this.versions = this.versions.slice(0, this.versionsIndex + 1);}
                
                //Create an object representing the current version and add it to our history and set update our history index.
                let currentVersion = {passageHTML: document.getElementById(articleOutputIDArg).innerHTML, annotationCodeVersion: this.annotationCode}; //<--Update version to post delete.
                this.versions.push(currentVersion);
                this.versionsIndex = this.versions.length - 1;

                //Unselect any other spans.
                this.selectedSpan = '';

            }
            //A. If user is not sure then do nothing.
            else {return;} 
            console.log(this);

            document.getElementById(deleteAnnotationButtonID).style.display = 'none';
        });
        //<---------------------------------------------------------------------------------------------------------------------------------->A


        //<-------------------------EVENT LISTENER FOR BUTTON TRIGGERING THE ANNOTATION SUBMIT PROCESS--------------------------------------------------------->B
        //<-------------------------EVENT LISTENER FOR BUTTON TRIGGERING THE ANNOTATION SUBMIT PROCESS--------------------------------------------------------->B
        //<-------------------------EVENT LISTENER FOR BUTTON TRIGGERING THE ANNOTATION SUBMIT PROCESS--------------------------------------------------------->B
        //<-------------------------EVENT LISTENER FOR BUTTON TRIGGERING THE ANNOTATION SUBMIT PROCESS--------------------------------------------------------->B
    
        //Set the button element that will submit an annotation.
        let bindButton = document.getElementById(manualInputAreaButtonIDArg);

        bindButton.addEventListener('click', () => {

            //Hide the delete button just in case.
            document.getElementById(deleteAnnotationButtonID).style.display = 'none';
            
            //A. Create a span that will hold the word spans that group into an annotation. 
            //Give it a class only used for marking these segments ('joinedSelection').
            //Give it an ID with an integer that will be unique over the course of this passage.
            //This integer comes from this.idCount which will be updated at the start of each passage edit so it will stay unique.   
            let joinedSelection = document.createElement('span'); 
            joinedSelection.classList.add('joinedSelection'); 
            joinedSelection.id = `j${this.idCount}`;

            //Loop through all of the span word elements that are in the current text selection (this.selectedElements)
            //and if any of them are already inside a span that has the class 'joinedSelection' then send an alert
            //to the user informing them that this is already part of an existing annotation.
            //Then clear the selected elements and empty several text input/display elements, and then do nothing.
            for (let a of this.selectedElements) {
                if (a.parentElement.classList.contains('joinedSelection')) {

                    alert('This text already has an annotation. Either edit this annotation\'s text, or delete it and start over.');

                    this.selectedElements = [];

                    clearSelectedText();
                    emptyWithClass(this.markForEmpty);
                    
                    return;
                }   
            }

            //A. Insert new span we created (with the class 'joinedSelection')right before the element that appears first in this.selectedElements,
            //first word span in our text selection.
            document.getElementById(this.selectedElements[0].id).parentNode.insertBefore(joinedSelection, document.getElementById(this.selectedElements[0].id)); 

            //Place all of the word span elements in this.selectedElements into the new 'joinedSelection element.
            //This grouping is a block that will have an annotation.
            for (let x = 0; x < this.selectedElements.length; x++) {joinedSelection.appendChild(this.selectedElements[x]);}

            //Now that our joinedSelection is in the HTML document we want to style it: 
            // - with it with a black font
            // - with the color selected in the color selection input
            joinedSelection.style.color = 'black';
            joinedSelection.style.backgroundColor = document.getElementById(this.annotationColor).value; //<--this.annotationColor points to a color input element and is set on construction.
            
            //Get the content that the user types into the text editor in an HTML format so that we can easily plot it into our hover element.
            let stored = tinyMCE.activeEditor.getContent({format : 'html'});

            //Define a hover element holding the corresponding annotation text when we mouseover a joinedSelection.
            let hoverElement = document.getElementById(hoverElementID);

            //<----------------------------------------------------->C
            //EVENT LISTENER FOR THE JOINEDSELECTION FOR HOVER:
            //When we hover over the joinedSelection we want
            //an element to pop-up where our mouse is and show 
            //the annotation.

            joinedSelection.addEventListener('mouseover', (event)=> {
                hoverElement.innerHTML = stored.toString(); //<--Add our annotation text to hover element.
                hoverElement.style.display = 'flex';                          //<--Make our hover element visible.
                
                hoverElement.style.left = `${event.clientX}px`;               //<--Make our hover element follow our mouse.
                hoverElement.style.top = `${event.clientY}px`;                //<--Make our hover element follow our mouse.
                
                joinedSelection.addEventListener('mouseout', ()=> {
                    /*Not first child?*/
                    hoverElement.innerHTML = '';            //<--Remove our annotation text from the hover element.
                    hoverElement.style.display = 'none';                      //<--Hide our hover element.

                });
            });
            //<---------------------------------------------------->C

        
            //<-----------------------------ADD EVENT LISTENER TO JOINEDSELECTIONS TO MAKE THEM SELECTABLE--------------------------------------->D
            joinedSelection.addEventListener('click', (event)=> {
                
                //If the joinedSelection being clicked is already the currently selected one, then unselect it (by making the this.selectedSpan nothing).
                //Remove any styling that indicates it is selected, and hide the delete button since nothing is selected.
                if (joinedSelection.id === this.selectedSpan) {

                    this.selectedSpan = '';
                    this.selectedSpanAnnotation = ''; 

                    //**
                    tinyMCE.activeEditor.setContent('');
                    //**

                    joinedSelection.style.borderStyle = 'none';
                    document.getElementById(deleteAnnotationButtonID).style.display = 'none';


                    //**
                    tinyMCE.activeEditor.setContent('');
                    //**

                    //**
                    document.getElementById('editAnnotation').style.display = 'none';
                    document.getElementById('cancelEditAnnotation').style.display = 'none';
                    //**

                    console.log(`Unselected span with ID ${joinedSelection.id}`);
                    console.log(this);

                }

                //If the joinedSelection being clicked is not already currently selected, and there is already a joinedSelection that is currently selected
                //then show the delete button (because there may be something to delete), style the clicked joinedSelection (to indicate it is now currently selected)
                //and set this.selectedSpan to the clicked joinedSelections ID.
                else if ((joinedSelection.id !== this.selectedSpan) && this.selectedSpan[0] === 'j') {

                    let notice = this.selectedSpan.slice(0, 2);
        
                    document.getElementById(deleteAnnotationButtonID).style.display = 'initial'; //<--Show delete buton.
                    document.getElementById(this.selectedSpan).style.borderStyle = 'none';       //<--Un style the previous selection.
                    joinedSelection.style.borderStyle = 'dashed';                                //<--Style the new selection.

                    //Record id of selected joinedSelection, and its corresponding annotation text.
                    this.selectedSpan = joinedSelection.id;
                    this.selectedSpanAnnotation = getSelectedAnnotationText(this.annotationCode, this.selectedSpan);

                    //**
                    tinyMCE.activeEditor.setContent(this.selectedSpanAnnotation);
                    //**

                    //**
                    document.getElementById('editAnnotation').style.display = 'initial';
                    document.getElementById('cancelEditAnnotation').style.display = 'initial';
                    //**

                    console.log(`Unselected span with ID ${notice}`);
                    console.log(`Selected span with ID ${joinedSelection.id}`);
                    console.log(this);

                }

                //If nothing is currently selected then select the joinedSelection that has been clicked.
                //Style it to show that it is being selected and show the delete button.
                //set this.selectedSpan to the id of our clicked joinedSelection.
                else {

                    document.getElementById(deleteAnnotationButtonID).style.display = 'initial'; //<--Show delete buton.
                    joinedSelection.style.borderStyle = 'dashed';                                //<--Style the new selection.

                    //Record id of selected joinedSelection, and its corresponding annotation text.
                    this.selectedSpan = joinedSelection.id;
                    this.selectedSpanAnnotation = getSelectedAnnotationText(this.annotationCode, this.selectedSpan);

                    //**
                    tinyMCE.activeEditor.setContent(this.selectedSpanAnnotation);
                    //**

                    //**
                    document.getElementById('editAnnotation').style.display = 'initial';
                    document.getElementById('cancelEditAnnotation').style.display = 'initial';
                    //**

                    console.log(`Selected span with ID ${joinedSelection.id}`);
                    console.log(this);

                }

            });
            //<---------------------------------------------------------------------------------------------------------------------------------->

            //Set add the annotation we just created to our whole annotation code and unselect any joinSelections.
            this.annotationCode += `${joinedSelection.id}@-@${joinedSelection.innerText}@-@${stored}$-$`;
            this.selectedElements = [];

            //Version Control: If we are not on the latest version, make version history everthing up until now and nothing more.
            if (this.versionsIndex !== this.versions.length - 1) {this.versions = this.versions.slice(0, this.versionsIndex + 1);}
            
            //Create an object representing the current version and add it to our history and set update our history index.
            let preBindVersion = {passageHTML: articlePreBind.innerHTML, annotationCodeVersion: this.annotationCode};
            this.versions.push(preBindVersion); 
            this.versionsIndex = this.versions.length - 1;

            //Empty various text input/display elements.
            emptyWithClass(this.markForEmpty);

            //Increase our unique id integer for the joinedSelections.
            this.idCount ++;

        });
        //<---------------------------------------------------------------------------------------------------------------------------------------------------->B
        //<---------------------------------------------------------------------------------------------------------------------------------------------------->B
        //<---------------------------------------------------------------------------------------------------------------------------------------------------->B
        //<---------------------------------------------------------------------------------------------------------------------------------------------------->B

    }

    setVersionControl(undoButtonIDArg, redoButtonIDArg, hoverElementID, articleOutputIDArg, deleteAnnotationButtonID) {

        let undoButton = document.getElementById(undoButtonIDArg); 
        let redoButton = document.getElementById(redoButtonIDArg); 
        
        undoButton.addEventListener('click', ()=> {
    
            if (this.versions.length <= 1 || this.versionsIndex === 0) {return;}
            else {
                
                this.selectedElements = [];
                emptyWithClass(this.markForEmpty);
                
                this.versionsIndex -= 1;
                let revertedVersion = this.versions[this.versionsIndex];
                
                document.getElementById(articleOutputIDArg).innerHTML = revertedVersion.passageHTML;
                this.annotationCode = revertedVersion.annotationCodeVersion;
                applyAnnotations(revertedVersion.annotationCodeVersion, hoverElementID);

                console.log(this);
                
                //--------------------------------------------------------------------------------
                //THIS IS JUST A REPITIION OF THE SELECTABLE EVENT LISTENER PROCESS IN THE LAST
                //METHOD
                //--------------------------------------------------------------------------------
                for (let joinedSelection of document.getElementsByClassName('joinedSelection')) {

                    joinedSelection.addEventListener('click', (event)=> {
        
                        if (joinedSelection.id === this.selectedSpan) {

                            this.selectedSpan = '';
                            this.selectedSpanAnnotation = ''; 
        
                            joinedSelection.style.borderStyle = 'none';
                            document.getElementById(deleteAnnotationButtonID).style.display = 'none';

                            //**
                            tinyMCE.activeEditor.setContent('');
                            //**

                            //**
                            document.getElementById('editAnnotation').style.display = 'none';
                            document.getElementById('cancelEditAnnotation').style.display = 'none';
                            //**
        
                            console.log(`Unselected span with ID ${joinedSelection.id}`);
                            console.log(this);
        
                        }
        
                        else if ((joinedSelection.id !== this.selectedSpan) && this.selectedSpan[0] === 'j') {
        
                            let notice = this.selectedSpan.slice(0, 2);
                
                            document.getElementById(deleteAnnotationButtonID).style.display = 'initial';
                            document.getElementById(this.selectedSpan).style.borderStyle = 'none';
                            joinedSelection.style.borderStyle = 'dashed';
        
                            this.selectedSpan = joinedSelection.id;
                            this.selectedSpanAnnotation = getSelectedAnnotationText(this.annotationCode, this.selectedSpan); 
                            
                            //**
                            tinyMCE.activeEditor.setContent(this.selectedSpanAnnotation);
                            //**

                            //**
                            document.getElementById('editAnnotation').style.display = 'initial';
                            document.getElementById('cancelEditAnnotation').style.display = 'initial';
                            //**
        
                            console.log(`Unselected span with ID ${notice}`);
                            console.log(`Selected span with ID ${joinedSelection.id}`);
                            console.log(this);
        
                        }
        
                        else {
        
                            document.getElementById(deleteAnnotationButtonID).style.display = 'initial';
                            joinedSelection.style.borderStyle = 'dashed';

                            this.selectedSpan = joinedSelection.id;
                            this.selectedSpanAnnotation = getSelectedAnnotationText(this.annotationCode, this.selectedSpan);

                            //**
                            tinyMCE.activeEditor.setContent(this.selectedSpanAnnotation);
                            //**

                            //**
                            document.getElementById('editAnnotation').style.display = 'initial';
                            document.getElementById('cancelEditAnnotation').style.display = 'initial';
                            //**
        
                            console.log(`Selected span with ID ${joinedSelection.id}`);
                            console.log(this);
        
                        }
        
                    });

                }
                //--------------------------------------------------------------------------------
                //--------------------------------------------------------------------------------
    
            }

        });

        redoButton.addEventListener('click', ()=> {

            if (this.versions.length <= 1 || this.versionsIndex === this.versions.length - 1) {return;}
            else {
                
                this.selectedElements = [];
                emptyWithClass(this.markForEmpty);
                
                this.versionsIndex += 1;
                let revertedVersion = this.versions[this.versionsIndex];
    
                document.getElementById(articleOutputIDArg).innerHTML = revertedVersion.passageHTML;
                this.annotationCode = revertedVersion.annotationCodeVersion;
                applyAnnotations(revertedVersion.annotationCodeVersion, hoverElementID);

                console.log(this);

                //--------------------------------------------------------------------------------
                //THIS IS JUST A REPITIION OF THE SELECTABLE EVENT LISTENER PROCESS IN THE LAST
                //METHOD
                //--------------------------------------------------------------------------------
                for (let joinedSelection of document.getElementsByClassName('joinedSelection')) {

                    joinedSelection.addEventListener('click', (event)=> {
                
                        if (joinedSelection.id === this.selectedSpan) {
        
                            this.selectedSpan = '';
                            this.selectedSpanAnnotation = ''; 
        
                            joinedSelection.style.borderStyle = 'none';
                            document.getElementById(deleteAnnotationButtonID).style.display = 'none';

                            //**
                            tinyMCE.activeEditor.setContent('');
                            //**

                            //**
                            document.getElementById('editAnnotation').style.display = 'none';
                            document.getElementById('cancelEditAnnotation').style.display = 'none';
                            //**
        
                            console.log(`Unselected span with ID ${joinedSelection.id}`);
                            console.log(this);
        
                        }
        
                        else if ((joinedSelection.id !== this.selectedSpan) && this.selectedSpan[0] === 'j') {
        
                            let notice = this.selectedSpan.slice(0, 2);
                
                            document.getElementById(deleteAnnotationButtonID).style.display = 'initial';
                            document.getElementById(this.selectedSpan).style.borderStyle = 'none';
        
                            joinedSelection.style.borderStyle = 'dashed';

                            this.selectedSpan = joinedSelection.id;
                            this.selectedSpanAnnotation = getSelectedAnnotationText(this.annotationCode, this.selectedSpan);

                            //**
                            tinyMCE.activeEditor.setContent(this.selectedSpanAnnotation);
                            //**

                            //**
                            document.getElementById('editAnnotation').style.display = 'initial';
                            document.getElementById('cancelEditAnnotation').style.display = 'initial';
                            //**
               
                            console.log(`Unselected span with ID ${notice}`);
                            console.log(`Selected span with ID ${joinedSelection.id}`);
                            console.log(this);
        
                        }
        
                        else {
        
                            document.getElementById(deleteAnnotationButtonID).style.display = 'initial';
                            joinedSelection.style.borderStyle = 'dashed';

                            this.selectedSpan = joinedSelection.id;
                            this.selectedSpanAnnotation = getSelectedAnnotationText(this.annotationCode, this.selectedSpan);

                            //**
                            tinyMCE.activeEditor.setContent(this.selectedSpanAnnotation);
                            //**

                            //**
                            document.getElementById('editAnnotation').style.display = 'initial';
                            document.getElementById('cancelEditAnnotation').style.display = 'initial';
                            //**
        
                            console.log(`Selected span with ID ${joinedSelection.id}`);
                            console.log(this);
        
                        }
        
                    });

                }
                //--------------------------------------------------------------------------------
                //--------------------------------------------------------------------------------
                //--------------------------------------------------------------------------------
    
            }
    
        });
    
    }

    createSaveAlias(saveButtonElementID, saveAliasButtonElementID, passageTitleInputElementID, passageTitleFieldID, passageContentFieldID, annotationsFieldID) {

        document.getElementById(saveAliasButtonElementID).addEventListener('click', ()=> {

            document.getElementById(passageTitleFieldID).value = document.getElementById(passageTitleInputElementID).value;
            document.getElementById(passageContentFieldID).value = this.versions[this.versions.length - 1].passageHTML;
            document.getElementById(annotationsFieldID).value = this.annotationCode;

            document.getElementById(saveButtonElementID).click();

        });
    }

    setClearTrigger(clearButtonIDArg) {

        let clearButton = document.getElementById(clearButtonIDArg); 

        clearButton.addEventListener('click', () => {

            this.selectedElements = [];
    
            emptyWithClass(this.markForEmpty);
            clearSelectedText();

            console.log(this.selectedElements);

        });
    }
    //**
    setAnnotationEdit(hoverElementID, articleMainID, annotationEditButtonIDArg, annotationCancelButtonIDArg, annotationDeleteButtonIDArg) {

        let editButton = document.getElementById(annotationEditButtonIDArg); 

        editButton.addEventListener('click', () => {

            let confirmEdit = confirm('Are you sure you want to make this edit?');

            if (confirmEdit) {
                
                let annotationWholeSplit = this.annotationCode.split('$-$');
                annotationWholeSplit = annotationWholeSplit.slice(0, annotationWholeSplit.length - 1);

                console.log(annotationWholeSplit);
                
                let stored = tinyMCE.activeEditor.getContent({format : 'html'});

                let newAnnotationCode = '';
                for (let x = 0; x < annotationWholeSplit.length; x++) {

                    console.log(annotationWholeSplit[x]);

                    let annotationIndivSplit = annotationWholeSplit[x].split('@-@');

                    if (annotationIndivSplit[0] === this.selectedSpan) {
                        annotationIndivSplit[2] = stored;
                    }

                    newAnnotationCode += `${annotationIndivSplit.join('@-@')}$-$`;

                }

                let joinedSelectionClone = document.getElementById(this.selectedSpan).cloneNode(true);
                joinedSelectionClone.style.borderStyle = 'none'; 
                joinedSelectionClone.style.backgroundColor = document.getElementById(this.annotationColor).value;
                document.getElementById(this.selectedSpan).parentNode.replaceChild(joinedSelectionClone, document.getElementById(this.selectedSpan));


                //<---------------------------------------------------------------------------------------------------------------------------------->
                //<---------------------------------------------------------------------------------------------------------------------------------->
                //<---------------------------------------------------------------------------------------------------------------------------------->
                //<---------------------------------------------------->
                let hoverElement = document.getElementById(hoverElementID);

                joinedSelectionClone.addEventListener('mouseover', (event)=> {
                    /*Not first child?*/
                    hoverElement.innerHTML = stored.toString(); 
                    hoverElement.style.display = 'flex';                          
                    
                    hoverElement.style.left = `${event.clientX}px`;               
                    hoverElement.style.top = `${event.clientY}px`;                
                    
                    joinedSelectionClone.addEventListener('mouseout', ()=> {
                        /*Not first child?*/
                        hoverElement.innerHTML = '';            
                        hoverElement.style.display = 'none';                      
    
                    });
                });
                //<---------------------------------------------------->
    
                //<---------------------------------------------------------------------------------------------------------------------------------->
                joinedSelectionClone.addEventListener('click', (event)=> {
                    
                    if (joinedSelectionClone.id === this.selectedSpan) {
    
                        this.selectedSpan = '';
                        this.selectedSpanAnnotation = ''; 
    
                        //**
                        tinyMCE.activeEditor.setContent('');
                        //**
    
                        joinedSelectionClone.style.borderStyle = 'none';
                        document.getElementById(deleteAnnotationButtonID).style.display = 'none';
    
                        //**
                        document.getElementById('editAnnotation').style.display = 'none';
                        document.getElementById('cancelEditAnnotation').style.display = 'none';
                        //**
    
                        console.log(`Unselected span with ID ${joinedSelectionClone.id}`);
                        console.log(this);
    
                    }
    
                    else if ((joinedSelectionClone.id !== this.selectedSpan) && this.selectedSpan[0] === 'j') {
    
                        let notice = this.selectedSpan.slice(0, 2);
            
                        document.getElementById(deleteAnnotationButtonID).style.display = 'initial'; 
                        document.getElementById(this.selectedSpan).style.borderStyle = 'none';       
                        joinedSelectionClone.style.borderStyle = 'dashed';                                
    
                        this.selectedSpan = joinedSelectionClone.id;
                        this.selectedSpanAnnotation = getSelectedAnnotationText(this.annotationCode, this.selectedSpan);
    
                        //**
                        tinyMCE.activeEditor.setContent(this.selectedSpanAnnotation);
                        //**
    
                        //**
                        document.getElementById('editAnnotation').style.display = 'initial';
                        document.getElementById('cancelEditAnnotation').style.display = 'initial';
                        //**
    
                        console.log(`Unselected span with ID ${notice}`);
                        console.log(`Selected span with ID ${joinedSelectionClone.id}`);
                        console.log(this);
    
                    }
    
                    else {
    
                        document.getElementById(deleteAnnotationButtonID).style.display = 'initial'; 
                        joinedSelectionClone.style.borderStyle = 'dashed';                                
    
                        this.selectedSpan = joinedSelectionClone.id;
                        this.selectedSpanAnnotation = getSelectedAnnotationText(this.annotationCode, this.selectedSpan);
    
                        //**
                        tinyMCE.activeEditor.setContent(this.selectedSpanAnnotation);
                        //**
    
                        //**
                        document.getElementById('editAnnotation').style.display = 'initial';
                        document.getElementById('cancelEditAnnotation').style.display = 'initial';
                        //**
    
                        console.log(`Selected span with ID ${joinedSelectionClone.id}`);
                        console.log(this);
    
                    }
    
                });
                //<---------------------------------------------------------------------------------------------------------------------------------->
                //<---------------------------------------------------------------------------------------------------------------------------------->
                //<---------------------------------------------------------------------------------------------------------------------------------->

                this.selectedSpan = '';
                this.selectedElements = '';

                this.annotationCode = newAnnotationCode;

                if (this.versionsIndex !== this.versions.length -1) {this.versions = this.versions.slice(0, this.versionsIndex + 1);}

                let afterEditVersion = {passageHTML: document.getElementById(articleMainID).innerHTML, annotationCodeVersion: newAnnotationCode};
                this.versions.push(afterEditVersion);
                this.versionsIndex = this.versions.length - 1;

                document.getElementById(annotationEditButtonIDArg).style.display = 'none';
                document.getElementById(annotationCancelButtonIDArg).style.display = 'none';
                document.getElementById(annotationDeleteButtonIDArg).style.display = 'none';
                for (a of document.getElementsByClassName('joinedSelection')) {
                    a.style.borderStyle = 'none';
                }

            }
            else {return;}

            console.log(this);

        });
    }

}
//---------------------------------------------------------------------------------------------------------------------------+
//---------------------------------------------------------------------------------------------------------------------------+
//---------------------------------------------------------------------------------------------------------------------------+
//---------------------------------------------------------------------------------------------------------------------------+
//---------------------------------------------------------------------------------------------------------------------------+
class ShowPassage {

    constructor(annotationCodeArg, hoverElementIDArg, passageTitleElementID) {
        this.annotationCode = annotationCodeArg;            //[HIDDEN] REQUIRED: This is the coded annotation string representing all of the annotations. 
                                                            //This string will be constructed on the backend by using Ruby to concatenate all 
                                                            //annotations related to the current passage and encoding it.
        this.hoverElementID = hoverElementIDArg;            //*REQUIRED*: This string is the id of the hover element, which MUST BE POSITIONED ABSOLUTELY.
        this.passageTitleElementID = passageTitleElementID; //REQUIRED: This string is the id of the element that contains the passage title.
    }

    instateAnnotations(passageID, downloadLinkElementTXTID, downloadLinkElementIDDoc, articleMainID) {

        let hoverElement = document.getElementById(this.hoverElementID); 
        let annotRawSplit = this.annotationCode.split("$-$");  
        let annotArrByAnnot = annotRawSplit.slice(0, annotRawSplit.length - 1);

        for (let x = 0; x < annotArrByAnnot.length; x++) { 

            let annotArrByPiece = annotArrByAnnot[x].split('@-@'); 

            let re = new RegExp('&lt;br&gt;', 'g');

            let annotSpan = document.createElement('span'); 
            annotSpan.id = `a${x}`; 
            annotSpan.classList.add('annotation'); 
            annotSpan.style.display = 'none'; 
            annotSpan.innerHTML = `${annotArrByPiece[2].replace(re, '\n')}\n`; 

            document.getElementById(annotArrByPiece[0]).parentNode.insertBefore(annotSpan, document.getElementById(annotArrByPiece[0]).nextElementSibling);  
            document.getElementById(annotArrByPiece[0]).addEventListener('mouseover', (event)=>{
                /*Not first child?*/
                hoverElement.innerHTML = annotArrByPiece[2]; 
                hoverElement.style.display = 'flex'; 
                hoverElement.style.left = `${event.clientX }px`; 
                hoverElement.style.top = `${event.clientY}px`; 
                document.getElementById(annotArrByPiece[0]).addEventListener('mouseout', ()=> {
                    /*Not first child?*/
                    hoverElement.innerHTML = ''; 
                    hoverElement.style.display = 'none'; 
                });
    
            });
        }

        let articleAsPureString = ''; 
        let footnotesAsPureString = '\n\n\n\nANNOTATIONS:\n-------------------------------\n'; 
        let re2 = new RegExp('\n\n\n', 'g'); 

        let footnoteCount = 0;
        for (let x = 0; x < document.getElementById(articleMainID).children.length; x++) { 

            let span = document.getElementById(articleMainID).children[x];

            if (span.classList.contains('joinedSelection')) { 

                articleAsPureString += `(${footnoteCount} ${span.innerText}) `;

            }
        
            if (span.classList.contains('annotation')) {

                footnotesAsPureString += `${footnoteCount}. ${span.innerText}\n`;

            }

            footnoteCount++;

        }

        articleAsPureString += footnotesAsPureString; 
        articleAsPureString = articleAsPureString.replace(re2, '\n\n'); 
        let re3 = new RegExp('\n\n\\\)', 'g');
        articleAsPureString = articleAsPureString.replace(re3, ')\n\n');

        setDownloadTXT(downloadLinkElementTXTID, passageID, articleAsPureString); 

        setDownloadDOC(downloadLinkElementIDDoc, passageID, articleMainID, this.passageTitleElementID); 

    }
    
}
//---------------------------------------------------------------------------------------------------------------------------+
//---------------------------------------------------------------------------------------------------------------------------+
//---------------------------------------------------------------------------------------------------------------------------+
//---------------------------------------------------------------------------------------------------------------------------+
//---------------------------------------------------------------------------------------------------------------------------+












let introAnimation1;
let introAnimation2;
let timeCheck;
let englishCounter = 0;
let spanishCounter = 0;
let english = [];
let spanish = [];
let delaySpanish = () => {
    introAnimation2 = setInterval(()=>{
        document.getElementById("spanishLogin").innerText = `${spanishCounter + 1}) ${spanish[spanishCounter]}`;
        document.getElementById("spanishLogin").style.backgroundColor = 'rgba(255, 255, 0, .4)';
        spanishCounter++;
        if (spanishCounter === spanish.length - 1) {
            spanishCounter = 0;
        }  
    }, 3000);
}
document.addEventListener('turbolinks:click', () => {
    console.log("CLEARING ANIMATION INTERVALS");
    clearInterval(timeCheck);
    clearInterval(introAnimation1);
    clearInterval(introAnimation2);
});


document.addEventListener('turbolinks:load', () => {
    let path = location.pathname.split('/');
    if (document.getElementById("error_explanation") !== null) {
        document.getElementById("error_explanation").firstElementChild.style.display = "none";
        document.getElementById("error_explanation").style.borderRadius = "15px";
        document.getElementById("error_explanation").style.backgroundColor = "white";
        document.getElementById("error_explanation").style.fontFamily = "Montserrat";

        console.log(document.getElementById("error_explanation"));

    }
    if (document.getElementsByClassName("login").length !== 0) {
        console.log('Login Page');
        document.body.style.animationPlayState = "running";
        let text = "de  of, from, by@la  the@el  the@a  to, at@los  the@un  a, an, one@las  the@del  of the, from the, by the@una  a, an, one@al  to the, at the@dos  two@uno  one@cada  each@tres  three@unos  some, a few@que  that, who, which, than@y  and@o  or@como  as, like@pero  but@si  if@porque  because@cuando  when@ni  nor, neither@donde  where@y  and@aunque  although, even though@sino  but, except@mientras  while@en  in, on, into@por  through, for (means), along, by@con  with@para  in order to, for (ends)@sin  without@sobre  about, above, on top of@entre  between, among@hasta  until@desde  from, since@durante  during, for (time)@contra  against@hacia  toward@según  according to@se  himself, herself, itself, yourself, yourselves, themselves@each other@lo  it, that@su  his, her, your@me  (to) me@le  (to) him, her, you@sus  his, her, your, their@yo  I@qué  what(?)@mi  my@nos  (to) us, ourselves@te  (to) you@eso  that@él  he, him@nada  nothing@esto  this@ella  she, her@usted  you@cómo  how(?)@les  (to) them, you@algo  something@ellos  they, them@mí  me@nosotros  we, us@tu  your@@ADVERBS:@no  no, not@más  more@ya  already, now, soon@muy  very@también  also@sí  yes@así  so, thus, like this,@like that@bien  well@solo (solamente)  only@ahora  now@siempre  always@tan  so@entonces  then@después  after, later@menos  less@aquí  here@antes  before, earlier@hoy  today@luego  then, later@además  besides, in addition@casi  almost@nunca  neverVERBS:@es  is, are@ha  has, have@son  are@está  is, are@hay  there is, there are@ser  to be@era  was, were@había  there was, there were@tiene  has, have@fue  was, were@puede  can@han  have@hacer  to make, to do@hace  make(s), do(es)@decir  to say@va  go(es)@estaba  was, were@sea  (might) be@ver  to see@están  are@sido  been@dijo  said@he  I have@creo  I believe@tienen  have@tenía  had@dice  says, say@vamos  we go, we are going@tener  to have@parece  seems, seem@poder  to be able to@pueden  can@este  this@todo  all@esta  this@todos  all, everyone@ese  that@mismo  same@otro  other, another@esa  that@bueno  good@otra  other, another@tanto  so much@otros  other, others@poco  little (not much)@mucho  much@gran  great, big@estos  these@general  general@todas  all, everyone@mayor  bigger, older@mejor  better@toda  all@tal  such@otras  other, others@estas  these@primera  first@algunos  some@los años  years@la vez  time (una vez = once)@la parte  part@la vida  life@el tiempo  time, weather@el día  day@el mundo  world@el estado  state@el gobierno  government@la casa  house@el hombre  man@el país  country@la forma  way@el año  year@el caso  case@el hecho  fact@el momento  moment@las cosas  things@España  Spain@el trabajo  work@los días  days@la política  policy, politics@las veces  times@la gente  people@el lugar  place@el ejemplo  example@las personas  people@la mujer  woman".split("@");
        for (let x = 0; x < text.length; x++) {
            let phrase = text[x].split(" ");
            english.push(phrase[0]);
            spanish.push(phrase.slice(1).join(" "));
        }
        englishCounter = 0;
        spanishCounter = 0;
        introAnimation1 = setInterval(()=> {
            document.getElementById("englishLogin").innerText = `${englishCounter + 1}) ${english[englishCounter]}`;
            document.getElementById("englishLogin").style.backgroundColor = 'rgba(255, 255, 0, .4)';
            englishCounter++;
            if (englishCounter === english.length - 1) {
                englishCounter = 0;
            }
        }, 3000); 
        setTimeout(delaySpanish(), 1500);
    }    
    else if (document.getElementById("forgotPasswordNav") !== null) {
        document.body.style.animationPlayState = "running";
        console.log('Forgot Password Page');
    }
    else if (document.getElementById("resendConfirmationNav") !== null) {
        document.body.style.animationPlayState = "running";
        console.log('Resend Account Confirmation Page');
    }
    else if ((path[1] === "users" && path.length === 2) && path[0] === "") {
        console.log('Profile Page');
    }
    else if (document.getElementById("dashboardMain") !== null) {
        document.body.style.animationPlayState = "running";
        timeCheck = setInterval(()=>{
            let current = new Date();
            document.getElementsByClassName("dashboardTime")[0].innerText = `Local: ${moment.tz(moment(), moment.tz.guess()).format('LLL')}`;
            document.getElementsByClassName("dashboardTime")[1].innerText = `Mexico City, Mexico: ${moment.tz(moment(), "America/Mexico_City").format('LLL')}`;
            document.getElementsByClassName("dashboardTime")[1].innerText = `Bogota, Colombia: ${moment.tz(moment(), "America/Bogota").format('LLL')}`;
            document.getElementsByClassName("dashboardTime")[3].innerText = `Caracas, Venezuela: ${moment.tz(moment(), "America/Caracas").format('LLL')}`;
            document.getElementsByClassName("dashboardTime")[2].innerText = `Buenos Aires, Argentina: ${moment.tz(moment(), "America/Argentina/Buenos_Aires").format('LLL')}`;
            document.getElementsByClassName("dashboardTime")[4].innerText = `Santiago de Chile, Chile: ${moment.tz(moment(), "America/Santiago").format('LLL')}`;
            document.getElementsByClassName("dashboardTime")[4].innerText = `Madrid, Span: ${moment.tz(moment(), "Europe/Madrid").format('LLL')}`;
        }, 1000);

    }
    else if (((path[0] === "") && (path[1] === "passages")) && path.length === 2) {
        console.log("Passages Index");
        for (let x = 0; x < document.getElementsByClassName("passageRow").length; x++) {
            document.getElementsByClassName("passageRow")[x].addEventListener('click', ()=>{
                window.location.href = document.getElementsByClassName("passageRow")[x].dataset.passageLink; 
            });
        }

        let passagesList = new List('tableForList', { 
            valueNames: ['author', 'date', 'dateUpdate', 'lastUpdater', 'title']
        });

        document.getElementById('searchPassages1').addEventListener('input', ()=>{
            console.log(document.getElementById('searchPassages1').value);
            passagesList.search(document.getElementById('searchPassages1').value);
        });

        

    }    
    else if (path[1] === "passages" && path[path.length - 1] === "new") {
        console.log("Passage New");
        let newPassage = new CreatePassage('empty', 'colors');
        newPassage.setArticleProcessingTrigger('convertArticleButton', 'articleInput', 'articleOutput', 'articleTitle');
        newPassage.setReturnSelectionTrigger('returnSelectionButton', 'selectedText');
        newPassage.setClearTrigger('clearSelection')
        newPassage.setEntiendifyTrigger('entiendifyButton', 'selectedText', 'translationInfo');
        newPassage.setTransferTranslatedToManualAreaTrigger('translationInfo', 'transferButton', 'manualArea');
        newPassage.setManualBindTrigger('articleOutput', 'manualBindButton', 'manualArea', 'infoDisplay', 'deleteAnnotation');
        newPassage.setVersionControl('undo', 'redo', 'infoDisplay', 'articleOutput', 'deleteAnnotation');
        newPassage.createSaveAlias('finalize', 'save',  'articleTitle', 'passage_title', 'passage_content', 'annotation_code');

        newPassage.setAnnotationEdit('infoDisplay', 'articleOutput', 'editAnnotation', 'cancelEditAnnotation', 'deleteAnnotation');
    }
    else if (path[1] === "passages" && parseInt(path[path.length - 1])) {
        console.log("Passage Show");
        let showCurrentPassage = new ShowPassage(document.getElementById('hiddenFeedAnnotationCodeString').innerHTML, 'infoDisplay', 'title');
        showCurrentPassage.instateAnnotations(document.getElementById('hiddenFeedCurrentPassageID').innerHTML,'downloadTXT', 'downloadDOC', 'display'); 
      }
    else if (path[1] === "passages" && path[path.length - 1] === "edit") {
        console.log("Passage Edit");
        let newPassage = new CreatePassage('empty', 'colors');
        newPassage.annotationCode = document.getElementById('hiddenFeedAnnotationCodeString').innerHTML;
        document.getElementById('annotsField').value = newPassage.annotationCode;
    }
    else if ((path[0] === "" && path[1] === "annotations") && path.length === 2) {
        console.log("Annotations Index");
        for (let x = 0; x < document.getElementsByClassName("annotationRow").length; x++) {
            document.getElementsByClassName("annotationRow")[x].addEventListener('click', ()=>{
                window.location.href = document.getElementsByClassName("annotationRow")[x].dataset.annotationLink;
            });
            
        }


        let annotationsList = new List("annotationsTableForList", { 
            valueNames: ['author', 'title', 'created', 'span', 'eng']
        }); 

        document.getElementById('searchPassages2').addEventListener('input', ()=>{
            annotationsList.search(document.getElementById('searchPassages2').value);
        });

        
    }
});


//createSaveAlias(saveButtonElementID, saveAliasButtonElementID, passageTitleInputElementID, passageTitleFieldID, passageContentFieldID, annotationsFieldID) {