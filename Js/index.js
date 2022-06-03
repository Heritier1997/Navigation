/* 
  app: The div where the navigation bar should be generated
  campus: variable for campus
  path: variable for path
  ids: Arrays of ids I created on each **li** tag to differentiate between parent element and child
*/
var app = document.getElementById("app");
var campus = "other";
var path = "/";
var ids = [];

// Generate navigation bar on document load with default campus and path
$(document).ready(function(){
  getJson(); // Read the json file
});


// When the "Get Data" button is clicked
$("#btn").click(function () {
  /*
    campusname: value of the select tag for campus
    pathname: value of the input tag for path

    if one of these variables is empty or undefined,
      get default campus (other) and path (/)
  */

  let campusname = document.getElementById("campus").value; 
  let pathname = document.getElementById("path").value; 

  if(campusname=="" || campusname== undefined || campusname== "none") campus = "other";
  else campus = campusname;
  if(pathname=="" || pathname== undefined || pathname== "none" || pathname.length== 0) path = "/";
  else path = pathname;
  
  getJson(); // Read json file based on campus and path entered 

});

// function to read the json file then initialize the result
function getJson() {
  fetch("../Files/navlinks.json")
    .then(response => response.json())
    .then(json => initialization(json, campus, path));
}

/*
  data: array for result of json file

  1. After reading the json file,
  2. Get only the campus and the path requested
  3. Populate the result on the data variable.
  4. Call the makeNavbar
*/
function initialization(json, campus, path) {
  let data = [];
  json.forEach(element => {
    if (element.campus.toLowerCase() == campus.toLowerCase() && element.url.toLowerCase().includes(path.toLowerCase())) {
      data.push(element);
    }
  });
  makeNavbar(data, campus);
}

/*
  makeNavar: function to generate ul, li and a tags
  ul: the ul tag on the index.html (The main list)
    - Always empty its contents on each call
  li: a new li tag
  a: a new a tag (Hyperlink) for Catalog Home with the title of the campus

  firstElement: to track the first object in the data array
  id: Get section of object without slashes "/"

  *****************************************************
  NOTE: CHILD SECTION = PARENT URL

  -- PARENT                           -- CHILD
  {                                   {
      "campus": "university",           "campus": "university",
      "section": "/",                   "section": "/aboutjwu/",
      "name": "About JWU",              "name": "Letter from President",
      "url": "/aboutjwu/"               "url": "/aboutjwu/letterfromthepresident/"
   }                                  }
   
  *****************************************************

  parentId = The id of the parent
  child = The id of the child

  It is a parent **li** tag if the object section is "/" or if it is the first element
  If so, call the isParent function and pass:
    - element: the object
    - ul: the ul tag (The main list)
    - id: the section as id attribute
  otherwise it is child tag **li** then call function createdList

  At the end call the removeId
*/

function makeNavbar(data, campus) {
  let ul = document.getElementById("ul");
  ul.innerHTML = null;
  let li = document.createElement("li");
  let a = document.createElement("a");
  a.setAttribute("href", "/");
  a.setAttribute("title", campus.charAt(0).toUpperCase() + campus.slice(1) + " navigation");
  a.innerHTML = "Catalog Home"

  li.appendChild(a);
  ul.appendChild(li);
  let firstElement = 0;

  data.forEach(element => {
    firstElement++;
    let id = element.section.replace(/\//g, "");
    let childId = element.url.replace(/\//g, "");
    let parentId = id;

    if (element.section == "/" || firstElement==1) {
      id = element.url.replace(/\//g, "");
      isParent(element, ul, id);
    } else {
      if ($("#" + parentId).length > 0) {
        createdList(element, parentId, childId);
      }
    }
  });

  removeId();
};


/*
  isParent: a function to set the **li** tag of the ul as a parent

  li: a new **li** tag
  a: Create hyperlink tag with provided object
*/
function isParent(element, ul, id) {
  let li = document.createElement("li");
  li.setAttribute("class", "active");
  let a = createdHyperlink(element);

  createdId(li, id);
  li.appendChild(a);
  ul.appendChild(li);
}

/* 
  Create hyperlink tag with provided object
*/
function createdHyperlink(element) {
  let a = document.createElement("a");
  a.href = element.url;
  a.innerHTML = element.name;
  a.setAttribute("title", element.campus.charAt(0).toUpperCase() + element.campus.slice(1) + " navigation");
  return a;
}

/*
  Create an "id" attribute on the provided element

  ids.push: Push the id to the array
*/
function createdId(element, id) {
  element.id = id;
  ids.push(id);
}

/* 
  function to check if an object should be marked as parent or child

  li: a new **li** tag
  createdid: Create id attribute for the child

  if the parent id is found, make the element a child
  otherwise create a parent id

  i: a new **i** tag for the right arrow icon

*/
function createdList(element, parentId, childId) {
  let li = document.createElement("li");
  createdId(li, childId);

  if ($("#" + parentId + " ul").length > 0) {
    let a = createdHyperlink(element);
    li.appendChild(a);
    document.querySelector("#" + parentId + " ul").appendChild(li);
  } else {
    let a = createdHyperlink(element);

    li.appendChild(a);
    let ul = document.createElement("ul");
    ul.appendChild(li);

    let i = document.createElement("i");
    i.setAttribute("class", "fas fa-caret-right");
    let div = document.createElement("div");
    if ($(".dropdown__parent ul #" + parentId).length > 0) {
      div.setAttribute("class", "dropdown__child");
    }else{
      div.setAttribute("class", "dropdown__parent");
    }
    
    div.appendChild(ul);
    document.querySelector("#" + parentId + " a").appendChild(i);
    document.querySelector("#" + parentId).appendChild(div);
  }
}


// Remove all ids attributes that were created to identify parent and child
function removeId() {
  ids.forEach(element => {
    $('li#' + element).removeAttr('id');
  });
}