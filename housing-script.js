// Create variable to store houses database in
let houses;

// Use fetch to retrieve database. Report any errors that occur in the fetch operation
// Once the houses have been successfully loaded and formatted as a JSON object
// using response.json(), run the initialize() function
fetch('houses.json').then(function(response){
                          if(response.ok){
                          response.json().then(function(json){
                                               houses = json;

                                               houses.sort( function( a, b ) {
                                                           a = a.name.toLowerCase();
                                                           b = b.name.toLowerCase();

                                                           return a < b ? -1 : a > b ? 1 : 0;
                                                           });
                                               houses.sort();

                                               initialize();
                                               });

                          } else {
                          console.log('Network request for houses.json failed with response ' + response.status + ': ' + response.statusText);
                          }
                          });


// Sets up the logic, declares necessary variables, contains functions
function initialize() {
    console.log("got to initialize");
    // grab the UI elements that we need to manipulate
    let tempAreaTarget = document.getElementsByName('Area');
    let areaTarget = [];
    for (let i = 0; i < tempAreaTarget.length; i++) {
        if (tempAreaTarget[i].checked) {
            areaTarget.push(tempAreaTarget[i].value);
        }
    }
    let builtTarget = document.querySelector('#built');
    let capTarget = document.querySelector('#capacity');
    let searchBtn = document.querySelector('button');
    let main = document.querySelector('main');

    // keep a record of what the last search terms entered were
    let lastAreaTarget;
    let lastCapTarget;
    let lastBuiltTarget;

    // these contain the results of filtering by category, and search term
    // finalGroup will contain the houses that need to be displayed after
    // the searching has been done. Each will be an array containing objects.
    // Each object will represent a house.
    let areaGroup;
    let finalGroup;

    // To start with, set finalGroup to equal the entire houses database
    // then run updateDisplay(), so ALL houses are displayed initially.
    finalGroup = houses;
    updateDisplay();

    // Set both to equal an empty array, in time for searches to be run
    areaGroup = [];
    finalGroup = [];

    // when the search button is clicked, invoke selectArea() to start
    // a search running to select the category of houses we want to display
    searchBtn.onclick = selectArea;


    // JENNY: lots of this is bad
    function selectArea(e) {
        console.log("got to select area");
        // Use preventDefault() to stop the form submitting — that would ruin
        // the experience
        e.preventDefault();

        // Set these back to empty arrays, to clear out the previous search
        areaGroup = [];
        finalGroup = [];

        // if the area other limits are the same as they were the last time a
        // search was run, the results will be the same, so there is no point running
        // it again — just return out of the function
        if( areaTarget == lastAreaTarget && capTarget == lastCapTarget && builtTarget == lastBuiltTarget ) {
            //console.log("trapped in the if");
            return;
        } else {
            // update the record of last category and search term
            lastAreaTarget = areaTarget;
            lastCapTarget = capTarget;
            lastBuiltTarget = builtTarget;

            // In this case we want to select all houses, then filter them further,
            // so we just set areaGroup to the entire JSON object, then run selectHouses()
            if(areaTarget.length == 6) {
                categoryGroup = houses;
                selectHouses();
                // If a specific area is chosen, we need to filter out the houses not in that
                // area, then put the remaining houses inside areaGroup, before running
                // selectHouses()
            } else {
                for( let j = 0; j < areaTarget.length; j++ ) {
                    for( let i = 0; i < houses.length ; i++) {
                        // If a houses type property is the same as the chosen category, we want to
                        // display it, so we push it onto the categoryGroup array
                        if(houses[i].area == areaTarget[j]) {
                            areaGroup.push(houses[i]);
                        }
                    }
                }
                console.log("areagroup created");
                console.log(areaGroup);
                // Run selectHouses() after the filtering has been done
                selectHouses();
            }
        }
    }

    // JENNY: this needs a lot of fixing, sorry
    // selectHouses() Takes the group of houses selected by selectCategory(), and further
    // filters them by the other checkboxes (if any have been entered)
    function selectHouses() {
        console.log("got to selecthouses");
        // If no further limits have been entered, just make the finalGroup array equal to the areaGroup
        // array — we don't want to filter the houses further — then run updateDisplay().
        if(capTarget.length == 4 && builtTarget.length == 4) {
            finalGroup = areaGroup;
            updateDisplay();
        } else {
            // Make sure the ##search term## is converted to lower case before comparison. We've kept the
            // house names all lower case to keep things simple
            //let lowerCaseSearchTerm = searchTerm.value.toLowerCase();
            // For each house in categoryGroup, see if the ##search term## is contained inside the house name
            // (if the indexOf() result doesn't return -1, it means it is) — if it is, then push the house
            // onto the finalGroup array
            //for(let i = 0; i < categoryGroup.length ; i++) {
                //if(categoryGroup[i].name.indexOf(lowerCaseSearchTerm) !== -1) {
                    //finalGroup.push(categoryGroup[i]);
                //}
            //}

            // run updateDisplay() after this second round of filtering has been done
            // TEMP FOR TEST
            finalGroup = areaGroup;
            updateDisplay();
        }


    }


    // start the process of updating the display with the new set of houses
    function updateDisplay() {
        console.log("got to updatedisplay");
        // remove the previous contents of the <main> element
        while (main.firstChild) {
            main.removeChild(main.firstChild);
        }

        // if no houses match the search term, display a "No results to display" message
        if(finalGroup.length === 0) {
            let para = document.createElement('p');
            para.textContent = 'No results to display!';
            main.appendChild(para);
            // for each house we want to display, pass its house object to fetchBlob()
        } else {
            for(let i = 0; i < finalGroup.length; i++) {
                fetchBlob(finalGroup[i]);
            }
        }
    }

    // fetchBlob uses fetch to retrieve the image for that house, and then sends the
    // resulting image display URL and house object on to showHouse() to finally
    // display it
    function fetchBlob(house) {
        console.log("got to fetchblob");
        // grab url from house.image property
        // TEMP URL
        let url = "images/" + house.image;
        // Use fetch to fetch the image, and convert the resulting response to a blob
        // Again, if any errors occur we report them in the console.
        fetch(url).then(function(response) {
                        if(response.ok) {
                        response.blob().then(function(blob) {
                                             // Convert the blob to an object URL — this is basically an temporary internal URL
                                             // that points to an object stored inside the browser
                                             objectURL = URL.createObjectURL(blob);
                                             // invoke showHouse
                                             showHouse(objectURL, house);
                                             });
                        } else {
                        console.log('Network request for "' + house.name + '" image failed with response ' + response.status + ': ' + response.statusText);
                        }
                        });
    }

    // Display a house inside the <main> element
    function showHouse(objectURL, house) {
        console.log("got to showhouse");
        // create <section>, <h2>, <p>, and <img> elements
        let section = document.createElement('section');
        let heading = document.createElement('h2');
        let subhead = document.createElement('h3');
        let image = document.createElement('img');
        let built = document.createElement('p');
        let reno = document.createElement('p');
        let capacity = document.createElement('p');
        let singles = document.createElement('p');
        let doubles = document.createElement('p');
        let triples = document.createElement('p');
        let bathroom = document.createElement('p');
        let access = document.createElement('p');
        let elevator = document.createElement('p');

        // JENNY: think we don't need this
        // give the <section> a classname equal to the house "type" property so it will display the correct icon
        //section.setAttribute('class', house.type);

        // Give the <h2> textContent equal to the house "name" property, but with the first character
        // replaced with the uppercase version of the first character
        heading.textContent = house.name.replace(house.name.charAt(0), house.name.charAt(0).toUpperCase());

        // Give the <h3> textContent equal to the house "area" property, but with the first character
        // replaced with the uppercase version of the first character
        subhead.textContent = house.area.replace(house.area.charAt(0), house.area.charAt(0).toUpperCase());

        // Set the src of the <img> element to the ObjectURL, and the alt to the house "name" property
        image.src = objectURL;
        image.alt = house.name;
        image.width = "367";

        // Give the <p>s textContent equal to the other house info
        built.textContent = "Built: " + house.built;
        reno.textContent = "Renovated: " + house.renovated;
        capacity.textContent = "Capacity: " + house.capacity;
        singles.textContent = "Singles: " + house.singles;
        doubles.textContent = "Doubles: " + house.doubles;
        triples.textContent = "Triples: " + house.triples;
        bathroom.textContent = "Number sharing a bathroom: " + house.bathroom;
        access.textContent = "Accessible: " + house.accessible;
        elevator.textContent = "Elevator: " + house.elevator;

        // append the elements to the DOM as appropriate, to add the house to the UI
        main.appendChild(section);
        section.appendChild(heading);
        section.appendChild(subhead);
        section.appendChild(image);
        section.appendChild(built);
        section.appendChild(reno);
        section.appendChild(capacity);
        section.appendChild(singles);
        section.appendChild(doubles);
        section.appendChild(triples);
        section.appendChild(bathroom);
        section.appendChild(access);
        section.appendChild(elevator);
    }
}
