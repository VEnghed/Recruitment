# TivoliRecruiter

An app for recruiting amusement park personnel.

## Get started

After cloning the repository, it can be used to serve both the development build, app and respond to
api calls. To start the development server:

```bash
$npm install
$npm run start
```
This will make the development server reachable on http://localhost:1337. 

To start serving the production build and the api:
```bash
$npm run serve
```
The production build will be reachable on http://localhost:8080

Note that before the server can serve the production build, it need to be created with:

```bash
$npm run build
```

During development, all the api calls from the app will be proxied to http://localhost:8080 so that they will function as normally.