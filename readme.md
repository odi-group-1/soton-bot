## Overview

1. You need to set up a Facebook business account, page and an app to control messages to that page
2. You need to set up an AI agent on API.AI and import our zipped dump into it.
3. You need to deploy your NodeJS app remotely and run on your local machine.

## Facebook Application

#### Facebook Business Account

You should create a business account. That business needs to have a page on Facebook.

1. Go to [Facebook Business Manager](https://business.facebook.com/) and Log in using your account.
2. Create a new business or if you already have a business page, it will log into it.
3. The owner of this business/you should create a Facebook Page from their personal account (Find more [here](https://www.facebook.com/help/104002523024878/)). The page will _be_ the Bot's Facebook Entity. We called our page _Soton Bot_.
4. Finally, claim that page for your business from Facebook Business Manager (or Settings of you Business Account).

#### Facebook App

We have to create our Facebook developer account, create an app, make it owned by our business, add Messenger to this app, let the app control our business page's messages and set up a webhook to forward the messaging events to our NodeJS application.

You can get a getting started guide [here](https://developers.facebook.com/docs/messenger-platform/guides/quick-start).

1. Go to [Facebook Developer's Console](https://developers.facebook.com/) and Log in/Register.
2. Create a new app.
3. Go to Settings > Advanced > Business Manager and select your business to be the owner of the app.
4. On the App page on this developer's console, Go to __+ Add Product__ and add __Messenger__
5. __Messenger__ will appear as an option on the right hand side. Click on it.
6. Scroll to __Token Generation__ and select your business page (in our case the page for _Soton Bot_). Take note of this token.
7. Scroll to __Webhooks__ section on the same page and select at least __messages__ and __messaging_postbacks__.
8. In the same __Webhooks__ section _"Select a page to subscribe your webhook to the page events"_. Select the business page that this bot will control the messages for. In our case it's the _Soton Bot_ page.
9. Then click on __Webhooks__ on the left hand menu and add your webhook address in as well as your own app token. (In our case it will be _'< host >/webhook'_ and your chosen app token (APP_TOKEN) from _'config/staging.js'_).

#### Whitelisting

Facebook does not allow sending links or objects (like images) from websites from non Whitelisted domains or domains that are not https (for default actions in messenger templates).

You can find detailed information [here](https://developers.facebook.com/docs/messenger-platform/thread-settings/domain-whitelisting).

We need to whitelist all the domain names of links that we send via the bot. Typing in the following command should work.

You can find FB_PAGE_ACCESS_TOKEN from logging into your Facebook developers console > your app > Messenger on left side menu > Token Generation > select your business page for this bot > copy the token

```
curl -X POST -H "Content-Type: application/json" -d '{
  "setting_type" : "domain_whitelisting",
  "whitelisted_domains" : ["http://data.southampton.ac.uk/", "https://www.openstreetmap.org/", "http://staticmap.openstreetmap.de/", "http://bus.southampton.ac.uk/", "https://media.giphy.com/"],
  "domain_action_type": "add"
}' "https://graph.facebook.com/v2.8/me/thread_settings?access_token=FB_PAGE_ACCESS_TOKEN"
```

## API.AI Setup

## Deployment

#### Setup and Deployment on Heroku

Heroku has documentation to get started with a NodeJS application [here](https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction)

The remainder of this section is based on the above resource but Specific to ```SOTON-BOT```.

#### Requirements

In order to deploy a NodeJS application to Heroku you will need:

1. A free ```Heroku``` account - [register](https://signup.heroku.com/dc)
2. ```Node.js``` and ```npm``` installed locally - [download](https://nodejs.org/en/download/)
3. Heroku Command Line Interface - [download](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up)
4. ```git``` installed locally - [download](https://git-scm.com/downloads)    
    
#### Setup

With the above requirements met, launch a terminal/command prompt and type ```heroku login```. 
You will be prompted for an email and password, use those with which you registered in the requirements section.
 
Also check that all required dependencies have been met with the following commands:
```node -v```
```npm -v```
```git --version```

#### Prepare SOTON-BOT for deployment

You will need a copy of ```SOTON-BOT``` from github. Clone the repository using:
```git clone https://github.com/odi-group-1/soton-bot```

Once cloned, enter the main directory ```soton-bot``` using: ```cd soton-bot```

This location contains a ```package.json``` which is used by Node's dependency manager.
If you are just deploying to Heroku and not doing local development or testing you do not
need to perform an ```npm install``` as Heroku will do this for you on the remote server.

#### Deploy SOTON-BOT

First create an app instance in Heroku using ```heroku create``` (Optionally you could 
pass a parameter naming the instance). Creating an app also associates a ```git``` remote
called ```heroku``` with your local repository.

Now it's as simple as ```git push heroku master``` from within ```soton-bot``` directory
to make the deployment. To ensure that at least one instance of the app is running, use
the command ```heroku ps:scale web=1```





