// Create variable to store houses database
let houses;

// Use fetch to retrieve database. Report any errors that occur in the fetch operation
// Once the houses have been successfully loaded and formatted as a JSON object
// using response.json(), run the initialize() function
fetch('houses.json').then(function(response){
  if(response.ok){
    response.json().then(function(json){
      houses = json;
      initialize();
    });
  } else {
    console.log('Network request for houses.json failed with response ' + response.status + ': ' + response.statusText);
  }
});

// Sets up the logic, declares necessary variables, contains functions
function initialize(){

}
