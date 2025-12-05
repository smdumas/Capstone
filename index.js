import axios from "axios"
import { header, nav, main, footer } from "./components";
import * as store from "./store";
import Navigo from "navigo";

import { camelCase } from "lodash";

const router = new Navigo("/");

function render(state = store.home) {
  document.querySelector("#root").innerHTML = `
      ${header(state)}
      ${nav(store.nav)}
      ${main(state)}
      ${footer()}
    `;

  router.updatePageLinks()
}

router.hooks({
  // We pass in the `done` function to the before hook handler to allow the function to tell Navigo we are finished with the before hook.
  // The `match` parameter is the data that is passed from Navigo to the before hook handler with details about the route being accessed.
  // https://github.com/krasimir/navigo/blob/master/DOCUMENTATION.md#match
  before: (done, match) => {
    // We need to know what view we are on to know what data to fetch
    const view = match?.data?.view ? camelCase(match.data.view) : "home";
    // Add a switch case statement to handle multiple routes
    switch (view) {
      // Add a case for each view that needs data from an API
      case "home":
        axios.get(`https://api.openweathermap.org/data/2.5/weather?APPID=${process.env.OPEN_WEATHER_MAP_API_KEY}&units=imperial&q=st%20louis`).then(response => {

          console.log("Weather response.data", response.data)
          store.home.weather = {
            city: response.data.name,
            temp: response.data.main.temp,
            feelsLike: response.data.main.feels_like,
            description: response.data.weather[0].main
          };
          done()
        }).catch((error) => {
          console.log("response", response);
          done();
        });
        break;
      // case "family":
      //   // New Axios get request utilizing already made environment variable
      //   axios
      //     .get(`${process.env.FAMILY_PLACE_API_URL}/family`)
      //     .then(response => {
      //       // We need to store the response to the state, in the next step but in the meantime let's see what it looks like so that we know what to store from the response.
      //       console.log("response", response);
      //       store.FAMILY.family = response.data;
      //       done();
      //     })
      //     .catch((error) => {
      //       console.log("response", response);
      //       done();
      //     });
      //   break;
      default:
        // We must call done for all views so we include default for the views that don't have cases above.
        done();
      // break is not needed since it is the last condition, if you move default higher in the stack then you should add the break statement.
    }
  },
  already: (match) => {
    const view = match?.data?.view ? camelCase(match.data.view) : "home";

    render(store[view]);
  },
  after: (match) => {
    const view = match?.data?.view ? camelCase(match.data.view) : "home";

    router.updatePageLinks();

    // add menu toggle to bars icon in nav bar
    document.querySelector(".fa-bars").addEventListener("click", () => {
      document.querySelector("nav > ul").classList.toggle("hidden--mobile");
    });

    if (view === "contact") {
      // Add an event handler for the submit button on the form
      document.querySelector("form").addEventListener("submit", event => {
        event.preventDefault();

        // Get the form element
        const inputList = event.target.elements;
        console.log("Input Element List", inputList);

        // Create an empty array to hold the location
        // const location = [];

        // Iterate over the city array

        // for (let input of inputList) {
        //   // If the value of the checked attribute is true then add the value to the location array
        //   // if (input.checked) {
        //     location.push(input.value);
        //   }
        // }

        // Create a request body object to send to the API
        const requestData = {
          fname: inputList.fname.value,
          lname: inputList.lname.value,
          phone: inputList.phone.value,
          email: inputList.email.value,

        };
        // Log the request body to the console
        console.log("request Body", requestData);

        axios
          // Make a POST request to the API to create a new family
          .post(`${process.env.FAMILY_PLACE_API_URL}/contact`, requestData)
          .then(response => {
            //  Then push the new Family onto the Family state family attribute, so it can be displayed in the Family list
            store.contact.contacts.push(response.data);
            router.navigate("/contact");
          })
          // If there is an error log it to the console
          .catch(error => {
            console.log("It puked", error);
          });
      });
    }

  }
});


router.on({
  "/": () => render(),
  // The :view slot will match any single URL segment that appears directly after the domain name and a slash
  '/:view': function (match) {
    // If URL is '/about-me':
    // match.data.view will be 'about-me'
    // Using Lodash's camelCase to convert kebab-case to camelCase:
    // 'about-me' becomes 'aboutMe'
    // the statement below is a ternary statement if match is true if not camelCase
    const view = match?.data?.view ? camelCase(match.data.view) : "home";

    // If the store import/object has a key named after the view
    if (view in store) {
      // Then the invoke the render function using the view state, using the view name
      render(store[view]);
    } else {
      // If the view name is not in the store, then display viewNotFound view
      render(store.viewNotFound);
      console.log(`View ${view} not defined`);
    }
  }
}).resolve();

// router.on("/", () => render());
// router.on("/Family", () => render(store.Family))
// router.resolve();


// do multiple routes
// router.on("/", () => render());
// router.on("/Family", () => render(store.Family))
// router.on("/order", () => render(store.order))
// router.resolve();


// router.on("/", () => render()).resolve();

// delete the render for now since it it not being used and use router in place of it.
// render();



// from now own I will need to use the  npm run start and not live-server
// // add menu toggle to bars icon in nav bar
// document.querySelector(".fa-bars").addEventListener("click", () => {
//   document.querySelector("nav > ul").classList.toggle("hidden--mobile");
// });


