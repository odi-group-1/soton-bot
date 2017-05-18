### Prerequisites

* NodeJS ttps://nodejs.org/en/ , type ```node --version```.
Ideally it should be 6 or newer.

* Heroku toolbelt https://devcenter.heroku.com/articles/heroku-cli

* A verified Facebook account and registered on https://developer.facebook.com

* Accepted as a developer/tested on the ```soton-bot``` app on facebook.

### Facebook Application

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

### Whitelisting

### API.AI Setup
The natural language processing of Soton Bot is achieved by a third party service hosted on [api.ai](https://api.ai/).

In order to set up the nlp agent we have made and pre-trained you must:  

1. Make a api.ai account
2. Make a clean agent
2. Import our agent dump

##### 1 - Making an account
Each agent is (as of 18.05.17) associated with a single account. Hence until this issue is solved you may want to share an account.
Maybe follow [this issue](https://discuss.api.ai/t/adding-additional-member-of-a-team-to-the-account/1155) on their Q & A forum to be updated.
 
##### 2 - Make a clean agent
When you log in for the first time, you should be prompted to make a agent. However, if not click on the top left (next to the cog) and click 'create new agent'.
Then simply give any name for the agent (this is just for you) and a description if you fancy. 

Leave everything else blank.
 
##### 3 - Import our agent dump
How to import an agent is covered in [api.ai's documentation](https://docs.api.ai/docs/concept-agents#export-and-import).
However in short:

1. Click the cog next to your agent's name (in the top left).
2. Choose the 'Export and Import' tab.
3. Click the 'RESTORE FROM ZIP' button and drag in the zip (which is just a dump of the agent).
..* Note: This will wipe anything you have made (if you strayed from the instructions 😛).
   
##### 4 - Hello World!
It's done! You now have a clone of our nlp agent. 

**Top Tips about api.ai**
Here is a great (slightly outdated) [video](https://www.youtube.com/watch?v=Om7tyGGemXI) on getting started in "*3* minutes". Sells it pretty nicely! 
The world of NLP in api.ai exists of two elements: intents and entities
**[Intents](https://docs.api.ai/docs/concept-intents)** are the types of messages users will send to the agent.
**[Entities](https://docs.api.ai/docs/concept-entities)** are enums of things the agent can talk about (they can be [composite](https://docs.api.ai/docs/concept-entities#section-developer-composite-entities) e.g. "Building \<number\>")

You can test the agent's chat on the right hand column and the JSON that would be responded to an API call. (This is great for debugging)
 
 The Training\[beta\] section (from the left side bar) is where you can evaluate the intents that each message that a conversation is mapped to.
 If it seems weird, don't worry, it is a tad weird but you can get used to it pretty quick. Each 'Dialog'
is a conversation with a separate user (it tells the different conversations by differing userIds). More infor on this   [here](https://docs.api.ai/docs/training).

**Others NLP services** 
 - [init.ai](https://www.init.ai/)
 - [wit.ai](https://wit.ai/)

### Deployment

