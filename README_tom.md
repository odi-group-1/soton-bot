# Setup and Deployment on Heroku

Heroku has documentation to get started with a NodeJS application [here](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction)

The remainder of this section is based on the above resource but Specific to ```SOTON-BOT```.

## Requirements

In order to deploy a NodeJS application to Heroku you will need:

1. A free ```Heroku``` account - [register](https://signup.heroku.com/dc)
2. ```Node.js``` and ```npm``` installed locally - [download](https://nodejs.org/en/download/)
3. Heroku Command Line Interface - [download](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up)
4. ```git``` installed locally - [download](https://git-scm.com/downloads)    
    
## Setup

With the above requirements met, launch a terminal/command prompt and type ```heroku login```. 
You will be prompted for an email and password, use those with which you registered in the requirements section.
 
Also check that all required dependencies have been met with the following commands:
```node -v```
```npm -v```
```git --version```

## Prepare SOTON-BOT for deployment

You will need a copy of ```SOTON-BOT``` from github. Clone the repository using:
```git clone https://github.com/odi-group-1/soton-bot```

Once cloned, enter the main directory ```soton-bot``` using: ```cd soton-bot```

This location contains a ```package.json``` which is used by Node's dependency manager.
If you are just deploying to Heroku and not doing local development or testing you do not
need to perform an ```npm install``` as Heroku will do this for you on the remote server.

## Deploy SOTON-BOT

First create an app instance in Heroku using ```heroku create``` (Optionally you could 
pass a parameter naming the instance). Creating an app also associates a ```git``` remote
called ```heroku``` with your local repository.

Now it's as simple as ```git push heroku master``` from within ```soton-bot``` directory
to make the deployment. To ensure that at least one instance of the app is running, use
the command ```heroku ps:scale web=1```



