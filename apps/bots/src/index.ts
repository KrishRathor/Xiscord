import Bot from "./services/bot";

async function init () {
    
    const bot =  new Bot('bot');
    bot.connect();

    bot.onMessage((msg, serverName, channelName) => {
        console.log(`from lib use`, msg);
        bot.sendMessage(`${msg} processed by bot`, serverName, channelName);
    })

}   

init();