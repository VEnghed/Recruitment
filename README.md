# TivoliRecruiter

An app for recruiting amusement park personnel.

## Get started

After cloning the repository, it can be used to serve both the development build, app and respond to
api calls. To start the development server:

```bash
$npm install
$npm run dev
```
This will make the development server reachable on http://localhost:1337. 

To start serving the production build and the API:
```bash
$npm run start
```
The production build will be reachable on http://localhost:8080

Note: Bfore the server can serve the production build, it need to be created with:

```bash
$npm run build
```

The production build is served at the API endpoint.

During development, all the api calls from the app will be proxied to http://localhost:8080 so as to imitate the functionality of the built  and served application.

The app is hosted on Heroku and can be found [here](https://recruiter-of-bots.herokuapp.com/). This is kept up to date with the version on the main branch of the repository. Heroku listens to the webhook that is called each time there is a push made to the main branch and will then pull from the main branch, build the application and host it there. 

## Structure

This web application is built with a client side rendered frontend and a REST backend. The frontend is built using React and the backend is a node application using `express` to both serve the application and handle API requests. The backend is connected to a PostgreSQL database through `sequelize` hosted on GCP that keeps the state of the application.

### Backend
The backend consists of ES6 modules connected so as to follow the MVC pattern, making scaling, maintenance and modification easier. The view consists of HTTP handlers called routes serving as API endpoints for the frontend to connect to. As the application itself should be stateless and keep no local data, the model layer only contains ORM information that allows it to talk to the database. The model layer is therefore more or less the same as an integration layer and the terms could be used interchangeably in this case. The controller layer consists of a module that simply connects the view (HTTP layer) with the model (Integration layer). 

The backend is built so as to make modification easy, for example: If you would like to change from PostgreSQL to some other database, you would only have to change make changes to the database and model layer. 

📦server  
 ┣ 📂controller  
 ┃ ┗ 📜controller.js  
 ┣ 📂database  
 ┃ ┗ 📜db.js  
 ┣ 📂model  
 ┃ ┣ 📜applicationStatus.js  
 ┃ ┣ 📜availability.js  
 ┃ ┣ 📜competence.js  
 ┃ ┣ 📜competenceProfile.js  
 ┃ ┣ 📜person.js  
 ┃ ┗ 📜role.js  
 ┣ 📂routes  
 ┃ ┣ 📂auth  
 ┃ ┃ ┗ 📜auth.js  
 ┃ ┣ 📜applicationRoute.js  
 ┃ ┣ 📜index.js  
 ┃ ┣ 📜recruiterRoute.js  
 ┃ ┗ 📜userRoute.js  
 ┣ 📂util  
 ┃ ┗ 📜validator.js  
 ┗ 📜server.js  

 The HTTP handlers are defined in the routes directory, split into routers depending on what type of resource the handler is for. The authentication middleware is also placed in the HTTP layer too, as it makes use of the request and response objects but does not specify a handler so it is placed in a directory of its own. The model directory contains the ORM mapping schemas used for database connectivity and makes up the integration layer along with the database directory where the different ways of querying the database is defined. The entrypoint for the backend application is the `server.js`. 

 When a HTTP request reaches the server, it is first handled in the HTTP layer. The parameters should be passed to the server in the body as json. The handler validates these parameters using `express-validator`. If the validation fails, a response is sent to the client specifying what parameters are wrong and why. If the validation passes, the controller layer and the integration layer are contacted appropriately. Before any queries are sent to the database, a second layer of validation using the built-in `sequelize`-validation has to be passed so as to catch any invalid queries.

 The database is currently hosted on [GCP](https://cloud.google.com/) but could be moved anywhere, just update the environment variables with the appropriate parameters.

  The frontend app is served as a static asset located in the `build` directory located in the parent directory of the server and is connected to the router in the frontend app so as to only serve the necessary chunks of javascript and css. 

  ### Frontend

The frontend consists of a React application that was bootstrapped using `create-react-app` and its source code is located within the src directory. Each page is represented by its own component in the components directory, where the component itself is located alog with styling. `index.js` is the entrypoint and hydrates the DOM with the `App` component in which routing to the other components is defined.

📦src  
 ┣ 📂components    
 ┃ ┣ 📂applicationpageview  
 ┃ ┃ ┣ 📜applicationpage.css  
 ┃ ┃ ┗ 📜applicationpage.js  
 ┃ ┣ 📂header  
 ┃ ┃ ┣ 📜header.css  
 ┃ ┃ ┗ 📜header.js  
 ┃ ┣ 📂login  
 ┃ ┃ ┣ 📜login.css  
 ┃ ┃ ┗ 📜login.js  
 ┃ ┣ 📂recruiterpage  
 ┃ ┃ ┣ 📜recruiter.css  
 ┃ ┃ ┗ 📜recruiter.js  
 ┃ ┣ 📂register  
 ┃ ┃ ┣ 📜register.css  
 ┃ ┃ ┗ 📜register.js  
 ┃ ┗ 📜success.js  
 ┣ 📜App.css  
 ┣ 📜App.js  
 ┣ 📜App.test.js  
 ┣ 📜index.css  
 ┣ 📜index.js    
 ┗ 📜logo.svg

If a page has to be changed, it is done by modifying the the corresponding component. If a page is to be added, create the component and add it to the router in `App.js`. The server will serve the new page automatically after building the application.

