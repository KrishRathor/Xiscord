import Bot from "./services/bot";

async function init () {
    
    const bot =  new Bot();
    bot.connect();

    bot.onMessage((msg) => {
        console.log(`from lib use`, msg);
        bot.sendMessage(msg);
    })

}   

init();