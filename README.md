I had a little extra fun with this project. The Dad Joke Api seemed like the perfect thing to use to
play with the Dall•E model.

Hosted on Heroku at https://jokester-2e3b570a64c7.herokuapp.com/joke/nbFBdiydxkb

## Run locally w/ Image generation
* add `.env` based on `.example.env` 
* `npm run dev`


## Dev Mode?
Uses lerna to orchestrate build watchers for the client and server into the root 
dist folder

### Server
* uses typescript compiler with the watch flag to build src code into the dist
folder
* uses nodemon to watch the dist/server folder to restart node on file change

### Client
* uses vite build watch

