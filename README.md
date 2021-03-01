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

Note that before the server can serve the production build, it need to be created with:

```bash
$npm run build
```

The production build is served at the API endpoint.

During development, all the api calls from the app will be proxied to http://localhost:8080 so as to imitate the functionality of the built  and served application.

## Structure

This web application is built with a client side rendered frontend and a REST backend. The frontend is built using React and the backend is a node application using `express` to both serve the application and handle API requests. The backend is connected to a PostgreSQL database through `sequelize` hosted on GCP that keeps the state of the application.

### Backend
The backend consists of ES6 modules connected so as to follow the MVC pattern, making scaling, maintenance and modification easier. The view consists of HTTP handlers called routes serving as API endpoints for the frontend to connect to. As the application itself should be stateless and keep no local data, the model layer only contains ORM information that allows it to talk to the database. The model layer is therefore more or less the same as an integration layer and the terms could be used interchangeably in this case. The controller layer consists of a module that simply connects the view (HTTP layer) with the model (Integration layer). 

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

 The frontend app is served as a static asset in the parent directory outside of the server directory and the server is connected to the router in the frontend app so as to only serve the necessary chunks of javascript and css.

 When a HTTP request reaches the server, it is first handled in the HTTP layer. The parameters should be passed to the server in the body as json. The handler validates these parameters using `express-validator`. If the validation fails, a response is sent to the client specifying what parameters are wrong and why. If the validation passes, the controller layer and the integration layer are contacted appropriately. Before any queries are sent to the database, a second layer of validation using `sequelize` has to be passed so as catch any invalid queries.