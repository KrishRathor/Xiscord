import Bot from "./services/bot";

async function init () {
    
    const bot =  new Bot();
    bot.connect();

}

init();