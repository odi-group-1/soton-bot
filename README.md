# Soton Bot
### Prerequisites

* NodeJS ttps://nodejs.org/en/ , type ```node --version```.
Ideally it should be 6 or newer.

* Heroku toolbelt https://devcenter.heroku.com/articles/heroku-cli

* A verified Facebook account and registered on https://developer.facebook.com

* Accepted as a developer/tested on the ```soton-bot``` app on facebook.

### Development Setup

1. Clone the repo in ```soton-bot``` folder.
2. In ```soton-bot``` enter ```npm install``` in the terminal
to install the dependencies.
3. You need the env variable ```FB_PAGE_ACCESS_TOKEN``` set to the facebook page access token found on the app page on 
facebook developer. This is so that we __DO NOT put our app secrets/tokens in the repo itself__. You can add the token 
as an environment variable in either of the following ways -
    - In a terminal before running the app, ```export FB_PAGE_ACCESS_TOKEN=<page_token>```
    - In IDE like IntelliJ IDEA add a run configuration with env variable.
4. Execute ```node_modules/.bin/nodemon index.js``` to start the server. It will watch for changes and restart as needed.
