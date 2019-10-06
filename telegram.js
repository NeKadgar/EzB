const TelegramBot = require('node-telegram-bot-api');
//Telegram part

var fs = require('fs');

var data = {}
data.csgo = []
data.dota = []

const TOKEN = '865299523:AAF6F8Axj7kikMVM1sC32pIeR_1s0VSr6go'
const bot = new TelegramBot(TOKEN, {polling: true})



bot.onText(/\/add (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  if (chatId == 405089115){
    gun = resp.split('/')
    if (gun[2] == '730'){
      fs.readFile('mybase.json',function(err,content){
        if(err) throw err;
        var parseJson = JSON.parse(content);
        parseJson.csgo.push({name:gun[0], price:gun[1]})
        fs.writeFile('mybase.json',JSON.stringify(parseJson),function(err){
          if(err) throw err;
        })
      })
    }
    if (gun[2] == '570'){
      fs.readFile('mybase.json',function(err,content){
        if(err) throw err;
        var parseJson = JSON.parse(content);
        parseJson.dota.push({name:gun[0], price:gun[1]})
        fs.writeFile('mybase.json',JSON.stringify(parseJson),function(err){
          if(err) throw err;
        })
      })
    }
  }
  bot.sendMessage(chatId, resp);
});
//==================


bot.onText(/\/remove (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  if (chatId == 405089115){
    gun = resp.split('/')
    if (gun[1] == '730'){
      fs.readFile('mybase.json',function(err,content){
        if(err) throw err;
        var parseJson = JSON.parse(content);
        parseJson.csgo.splice(gun[0], 1);
        fs.writeFile('mybase.json',JSON.stringify(parseJson),function(err){
          if(err) throw err;
        })
      })
    }
    if (gun[1] == '570'){
      fs.readFile('mybase.json',function(err,content){
        if(err) throw err;
        var parseJson = JSON.parse(content);
        parseJson.dota.splice(gun[0], 1);
        fs.writeFile('mybase.json',JSON.stringify(parseJson),function(err){
          if(err) throw err;
        })
      })
    }
  }
  bot.sendMessage(chatId, resp);
});



bot.onText(/\/show/, (msg) => {
  const chatId = msg.chat.id;
  if (chatId == 405089115){
    fs.readFile('mybase.json',function(err,content){
      if(err) throw err;
      var parseJson = JSON.parse(content);
      i = 0;
      for (item in parseJson.csgo){
        message = i + '. ' + parseJson.csgo[item].name + ' - ' + parseJson.csgo[item].price + '$ (csgo)';
        bot.sendMessage(chatId, message);
        i++;
      }
      i = 0;
      for (item in parseJson.dota){
        message = i + '. ' + parseJson.dota[item].name + ' - ' + parseJson.dota[item].price + '$ (dota)';
        bot.sendMessage(chatId, message);
        i++;
      }
    })
  }
});
