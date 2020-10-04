class AceEditor extends TPFEditorAbstractClass{
    //Should render an ace editor in the HTML Div Element and also accept a unique ID and store this ID in it's state. 
    //If ID isn't provided, generate a new one while initalizing.
    constructor(div, options = {theme: "monokai"}, lsId = 0){ 
        super();
        this.div = div;
        this.options = options;
        //check if unique id is already a key in localStorage 
        if(localStorage.getItem(lsId) === null){
            this.lsId = lsId;
        }else{
            this.lsId = lsId + 1;
        }
        //ace editor object (value set after calling mount function)
        this._editor;    
    }

    //Should be able to mount to any HTML Div Element passed to it while initializing (the logic for this should be written in a method named mount).
    //<div> element needs to have a position of absolute or relative with a fixed size to have the editor work
    mount(){
        if(this.div.style.position != "absolute" && this.div.style.position != "relative" ){
            throw Error('<div> element must have a style of {position: absolute} or {position: relative}');
        }

        let rect = this.div.getClientRects();
        if(rect[0].width === 0 || rect[0].height === 0){
            throw Error('<div> element must have a fixed size');
        }
        this._editor = ace.edit(this.div);
    }
    
    //Should accept and apply custom styles when initializing and 
    //call the method style which should have the logic for applying the styles to the editor's container as well as to the editor itself based on the received input and the options available in ace
    style(){
        //get all possible options in ace editor
        const optionName = Object.keys(this._editor.getOptions());
        //check if passed options have valid option names
        //NOTE: have yet to check for valid option values
        const sessionOption = Object.keys(this.options);
        sessionOption.forEach( k => {
            if(!(optionName.includes(k))){
                throw Error(`${k} is not a valid option name`);
            }
            if(k === 'mode'){
                this.options.mode = `ace/mode/${this.options.mode}`;
            }
            if(k === 'theme'){
                this.options.theme = `ace/theme/${this.options.theme}`;
            }
        });

        this._editor.setOptions(this.options);
    }
    
    //Should implement the method getContent which would retrieve the content from the ace editor and return as a formatted string
    // (we need to agree upon this format, it's not decided yet)
    getContent(){
        let savedContent = JSON.parse(localStorage.getItem(this.lsId));
        this._editor.setValue(savedContent);        
    }
    //Should give an option to save the content, when the user clicks on save, execute the method persistContent 
    //which would have the logic to save the content in localStorage with the id with which the editor was instantiated
    persistContent(){
        localStorage.setItem(this.lsId, JSON.stringify(this._editor.getValue()));
    }
    //Should implement the method minimize which would make the container div element of the editor invisible 
    //(display:none) and call the onSwitch method with value as 'minimize'
    minimize(callback){
        this.div.style.display = "none";
        callback('minimize');
    }
    //Should implement the method close which would remove the values stored in localStorage and destroy the instance of the editor and 
    //call the onSwitch method with the value as 'close'
    //NOTE: only done initial testing; not sure if this is implemented right 
    close(callback){
        localStorage.removeItem(this.lsId);
        this._editor.destroy();
        callback('close');
    }
}

//Example of Implementation:
//let code = document.getElementById("code");
//oneEditor = new AceEditor(code, {mode: "javascript", theme: "monokai"});
//oneEditor.mount();
//oneEditor.style();


/*function onSwitch(status){
    let test = document.getElementById("text");
    test.innerHTML = `Status: ${status}`;
}*/

//let saveButton = document.getElementById("save");
//if(saveButton){
//    saveButton.onclick = oneEditor.persistContent.bind(oneEditor);
//}

//let getButton = document.getElementById("get");
//if(getButton){
//    getButton.onclick = oneEditor.getContent.bind(oneEditor);
//}

//let minimizeButton = document.getElementById("minimize");
//if(minimizeButton){
//    minimizeButton.onclick = function(){threeEditor.minimize(onSwitch);}
//}

//let closeButton = document.getElementById("close");
//if(closeButton){
//    closeB.onclick = function(){threeEditor.close(onSwitch)};
//}