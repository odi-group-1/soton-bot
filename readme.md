## Overview

1. You need to set up a Facebook business account, page and an app to control messages to that page
2. You need to set up an AI agent on API.AI and import our zipped dump into it.
3. You need to deploy your NodeJS app remotely and run on your local machine.
4. You need to get access to a Transportapi account and get your api key.

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

## Deployment

### Setup and Deployment on Heroku

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
called ```heroku``` with your local repository. Take note of the ```http``` url resulting
from this command - it is the ```<host>``` of ```<host>/webhook``` described in the 
_Facebook_ section.

Now it's as simple as ```git push heroku master``` from within ```soton-bot``` directory
to make the deployment. To ensure that at least one instance of the app is running, use
the command ```heroku ps:scale web=1```

It is essential to give Heroku the page access token generated by Facebook. Navigate to the
Heroku dashboard of your newly created app, click ```Reveal config vars``` and add the KEY
```FB_PAGE_ACCESS_TOKEN``` and VALUE as provided by Facebook.

### Local Development using ngrok

A key tool in Soton-Bot's development is ```ngrok``` which is a secure tunnel to localhost.
Recall the part of the setup on Facebook Developers Console that required a webhook? this
was to instruct Facebook where to deliver incoming messages to. Thus for local development
you will want to run Soton-Bot's code locally and have messenger messages delivered to
your local running version.

#### Running Soton-Bot locally

TODO: FB_PAGE_ACCESS_TOKEN

With the code stored locally (see ```Prepare Soton-Bot for deployment```) you will first
need to run ```npm install``` within the ```soton-bot``` directory to install dependencies.

To start running Soton-Bot, simply use the command ```npm start```

#### Starting ngrok

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


#### Switching Webhooks

1. Firstly navigate to your app on [developer.facebook.com](https://developers.facebook.com).
2. Click ```Webhooks``` tab and then ```Edit Subscription``` button.
3. Change the callback URL to the one provided by ngrok as above and add ```/webhook```.
4. Use the ```APP TOKEN``` to verify the webhook switch.

After a brief period, messages will be directed to your locally running instance of Soton-Bot
instead of the deployed Heroku version.

## API.AI Setup
The natural language processing of Soton Bot is achieved by a third party service hosted on [api.ai](https://api.ai/).

In order to set up the nlp agent we have made and pre-trained you must:  

1. Make a api.ai account
2. Make a clean agent
3. Import our agent dump
4. Connect the Node.js bot to api.ai agent

#### Making an account
Each agent is (as of 18.05.17) associated with a single account. Hence until this issue is solved you may want to share an account.
Maybe follow [this issue](https://discuss.api.ai/t/adding-additional-member-of-a-team-to-the-account/1155) on their Q & A forum to be updated.
 
#### Make a clean agent
When you log in for the first time, you should be prompted to make a agent. However, if not click on the top left (next to the cog) and click 'create new agent'.
Then simply give any name for the agent (this is just for you) and a description if you fancy. 

Leave everything else blank.
 
#### Import our agent dump
How to import an agent is covered in [api.ai's documentation](https://docs.api.ai/docs/concept-agents#export-and-import).
However in short:

1.Get the bot dump
  1. Download `<soton-bot-source>/bot_backup/final-bot-dump.zip`
2. Upload the dump
  1. Click the cog next to your agent's name (in the top left).
  2. Choose the 'Export and Import' tab.
  3. Click the 'RESTORE FROM ZIP' button and drag in the zip (which is just a dump of the agent).
    * Note: This will wipe anything you have made (if you strayed from the instructions 😛).

#### Connect the Node.js bot to api.ai agent
It's done! You now have a clone of our nlp agent. However you need to forward messages from the node application to nlp agent.
In order to do this, you need to include the api.ai 'Client access token' in the node.js bot:

1. Get the api.ai 'client access token'
    1. Go to the settings (cog in the top left corner)
    2. Go to the 'General' tab (should be the default tab)
    3. (Half way down the page) under 'API Keys' is the client access token. 
    4. Copy it
2. Connect the node bot to the api.ai agent
    1. Go to the file `<soton-bot-source>/config/staging.js`
    2. Paste the 'Client Access Token' in the `API_AI_CLIENT_ID`

...and now you are connected! 🎉

To see if the api.ai agent is receiving any traffic click the 'Analytics' section on the left and you should see more than 0 sessions.

#### Hello World!
Here are some **Top Tips** about api.ai.

Here is a great (slightly outdated) [video](https://www.youtube.com/watch?v=Om7tyGGemXI) on getting started in "*3* minutes". Sells it pretty nicely!
 

The world of NLP in api.ai exists of two elements: intents and entities

**[Intents](https://docs.api.ai/docs/concept-intents)** are the types of messages users will send to the agent.

**[Entities](https://docs.api.ai/docs/concept-entities)** are enums of things the agent can talk about (they can be [composite](https://docs.api.ai/docs/concept-entities#section-developer-composite-entities) e.g. "Building \<number\>")

You can test the agent's chat on the right hand column and the JSON that would be responded to an API call. (This is great for debugging)
 
 The Training\[beta\] section (from the left side bar) is where you can evaluate the intents that each message that a conversation is mapped to.
 If it seems weird, don't worry, it is a tad weird but you can get used to it pretty quick. Each 'Dialog'
is a conversation with a separate user (it tells the different conversations by differing userIds). More infor on this   [here](https://docs.api.ai/docs/training).

If you want to message the bot via CURL or a REST Client. You can GET the following URL (given you fill in the blanks):
```
 curl 'https://api.api.ai/api/query?v=20150910&query=<YOUR SENTANCE>&lang=en&sessionId=d741e727-33e8-4cd3-92bc-dd929e1dde0a&timezone=2017-05-18T18:00:28+0100'  -H 'Authorization:Bearer <YOUR API.AI CLIENT ACCESS TOKEN>'
```
Note: the `sessionId` can be anything really, it just keeps track of who is having the conversation. You can leave it as `d741e727-33e8-4cd3-92bc-dd929e1dde0a` for the curls.
but **it must be different for actual users**, which is implemented in our code.


**Others NLP services** 
 - [init.ai](https://www.init.ai/)
 - [wit.ai](https://wit.ai/)

## TransportAPI

1. Go [here](https://developer.transportapi.com/), sign up/in.
2. Copy over your App Id and Key to ```config/staging.js``` file's ```TRANSPORT_API_APP_ID``` and ```TRANSPORT_API_APP_KEY```.
