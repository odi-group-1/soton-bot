# Setup and Deployment on Heroku

Heroku has documentation to get started with a NodeJS application [here](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction)

The remainder of this section is based on the above resource but Specific to ```Soton-Bot```.

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

## Prepare Soton-Bot for deployment

You will need a copy of ```Soton-Bot``` from github. Clone the repository using:
```git clone https://github.com/odi-group-1/soton-bot```

Once cloned, enter the main directory ```Soton-Bot``` using: ```cd Soton-Bot```

This location contains a ```package.json``` which is used by Node's dependency manager.
If you are just deploying to Heroku and not doing local development or testing you do not
need to perform an ```npm install``` as Heroku will do this for you on the remote server.

## Deploy Soton-Bot

First create an app instance in Heroku using ```heroku create``` (Optionally you could 
pass a parameter naming the instance). Creating an app also associates a ```git``` remote
called ```heroku``` with your local repository.

Now it's as simple as ```git push heroku master``` from within ```Soton-Bot``` directory
to make the deployment. To ensure that at least one instance of the app is running, use
the command ```heroku ps:scale web=1```


# Local Development using ngrok

A key tool in Soton-Bot's development is ```ngrok``` which is a secure tunnel to localhost.
Recall the part of the setup on Facebook Developers Console that required a webhook? this
was to instruct Facebook where to deliver incoming messages to. Thus for local development
you will want to run Soton-Bot's code locally and have messenger messages delivered to
your local running version.

## Running Soton-Bot locally

TODO: FB_PAGE_ACCESS_TOKEN

With the code stored locally (see ```Prepare Soton-Bot for deployment```) you will first
need to run ```npm install``` within the ```soton-bot``` directory to install dependencies.

To start running Soton-Bot, simply use the command ```npm start```

### Starting ngrok

ngrok is available [here](https://ngrok.com/download).

With the archive unzipped, you will need to run it with the parameters as shown:
```ngrok http 5000``` where the port number ```5000``` is dictated by the port property 
in ```config/staging.js```. Below is an example of the output when ngrok is running.

You will need the ```https``` url - ```https://a211a676.ngrok.io``` in this example to
replace the heroku webhook when redirecting messages for local development.

```ngrok by @inconshreveable                                                                               (Ctrl+C to quit)
   
   Session Status                online
   Version                       2.2.4
   Region                        United States (us)
   Web Interface                 http://127.0.0.1:4040
   Forwarding                    http://a211a676.ngrok.io -> localhost:5000
   Forwarding                    https://a211a676.ngrok.io -> localhost:5000
   
   Connections                   ttl     opn     rt1     rt5     p50     p90
                                 0       0       0.00    0.00    0.00    0.00
```


### Switching Webhooks

TODO