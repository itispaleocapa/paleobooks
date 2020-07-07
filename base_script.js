// one reader per file
let readers;
// one text per file
let texts = {};      
// will contain the file objects
let files;
// will contain the fields array (eq. [{type:"text",name:"title"},{type:"number",name:"price"}] )
let fields = [];

// will contain the number of files
let fileCount;
// completed file counter
let fileCounter = 0;

let result = {
  // will contain the result array containing the shrunken objects
  elements: [],
  // will contain the sql query
  sql: "",
}


function initialize(){
  fileCount = document.getElementsByClassName("fileInput").length;

  // files inputs
  let fileInputs = document.getElementsByClassName("fileInput");
  for(let i=0; i<fileCount; i++){
    fileInputs[i].addEventListener("change", (event) => {        
      files[i] = { 
        name: fileInputs[i].name,
        file: event.target.files[0] 
      };
    });
  }

  // readers
  readers = new Array(fileCount);
  for(let i=0; i<fileCount; i++){
    readers[i] = new FileReader();
    readers[i].name = fileInputs[i].name;
    readers[i].onload = function(event) { afterReading(event); }
  }

  files = new Array(fileCount);
}

function reset(){
  result = { elements: [], sql: "", };
  fields = [];
  texts = {};
  fileCounter = 0;
}

// 
function startConversion(name = true, fields = true){
  reset();

  if(name)
    getName();

  if(fields)
    parseFields();

  // start reading all the files
  read();

  //console.log(texts);
}

function read(){
  for(let i=0; i<fileCount; i++){
    if( files[i] ) {
      readers[i].readAsText( files[i].file );
      //console.log( texts[ files[i].name ] );
    }
  }
}

//
function getName(){
  tableName = document.getElementById("tableName").value;
}

// parse the fields text into an objects array
function parseFields(){
  let textFields = document.getElementById("fields").value.split("\n");

  for(let i=0; i<textFields.length; i++){
    let pp = textFields[i].split(",");
    let field = '{"type":"' + pp[0] + '","name":"' + pp[1] + '"}';
    //console.log(field);

    fields.push( JSON.parse(field) );
  }

  //console.log(fields);
}

//
function afterReading(event){
  let name = event.srcElement.name;
  texts[name] = event.target.result;
  // console.log(name, texts[name]);
  // console.log(name, texts);

  fileCounter++;
  if(fileCounter == fileCount)
    shrinkJson();
}

// 
function cutItem(/* args */){
  let result = {};

  for(let f=0; f<fields.length; f++){
    let field = fields[f];

    result[field.name] = window[field.name].apply(window, arguments);
  }

  return result;
}

//
function finalizeConversion(){
  jsonToSQL();

  download(tableName + ".sql", result.sql);
}

// convert the elements array in a sql query, use the fields array to get the order and the type of the single field
function jsonToSQL(){
  let sql = "INSERT INTO `" + tableName + "` (" 
  for(let f=0; f<fields.length; f++)
    sql += "`" + fields[f].name + "`,";

  sql = sql.substring(0, sql.length-1);
  sql += ") VALUES";
  console.log(sql);

  let elements = result.elements;

  //console.log(fields, elements);

  for(let i=0; i<elements.length; i++){
    let row = "\r\n    (";
    for(let f=0; f<fields.length; f++){
      let field = fields[f];

      if(elements[i][field.name] == null)
        row += "NULL" + ',';

      else if(field.type == "number")
        row += elements[i][field.name] + ',';

      else if(field.type == "text")
        row += '"' + elements[i][field.name] + '",';
    }

    row = row.substring(0, row.length-1) + "),";
    sql += row;
  }

  // remove last "," and add ";"
  sql = sql.substring(0, sql.length-1) + ";";

  //console.log(sql);

  result.sql = sql;
}

// download a text file
function download(filename, text) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

// remove all the duplicates
function removeDuplicates(elements){
  let ris = [];
  let seen = [];

  for(let i=0; i<elements.length; i++){

    let keys = Object.keys(elements[i]);

    let str = "-";
    for(let k=0; k<keys.length; k++)
      str += elements[i][keys[k]] + "-";

    if( !seen.includes(str) ){
      seen.push(str);
      ris.push(elements[i]);
    }
  }

  return ris;
}

initialize();