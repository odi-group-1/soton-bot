### Prerequisites

* NodeJS ttps://nodejs.org/en/ , type ```node --version```.
Ideally it should be 6 or newer.

* Heroku toolbelt https://devcenter.heroku.com/articles/heroku-cli

* A verified Facebook account and registered on https://developer.facebook.com

* Accepted as a developer/tested on the ```soton-bot``` app on facebook.

### Facebook Application

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

