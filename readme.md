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

### Deployment

