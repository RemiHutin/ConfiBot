# ConfiBot

ConfiBot is a discord bot. He can play many games with you!

## How to setup the bot

- You need to install Node.js: https://nodejs.org/en/
- Create a new discord application: https://discordapp.com/developers/applications. You will need the id and the authorization token of your application, you can find them in the "General Information" tab. Don't share the authorization token with anyone!
- Invite the bot to your server: https://discordapp.com/oauth2/authorize?&client_id=000000000000000001&scope=bot&permissions=8.
  Replace 000000000000000001 with the id of your discord application.
- Clone this repository. 
- Create a new file named `auth.json`, containing:
```js
{
  "token": "your authorization token here" 
}
```
- Install the dependencies with `npm install`.
- Run the bot with `node bot.js`.
