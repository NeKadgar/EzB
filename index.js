var Pusher = require('pusher-client');
var totp = require('notp').totp;
var base32 = require('thirty-two');
var axios = require('axios');

const TOKEN = '865299523:AAF6F8Axj7kikMVM1sC32pIeR_1s0VSr6go'
var fs = require('fs');
//Socket part
q = 0;

var pusher = new Pusher('c0eef4118084f8164bec65e6253bf195', {
        encrypted: true,
        wsPort: 443,
        wssPort: 443,
        host: 'notifier.bitskins.com'
    });

pusher.connection.bind('connected', function() {
        // connected to realtime updates
        console.log(" -- connected to websocket");
    });

pusher.connection.bind('disconnected', function() {
        // not connected to realtime updates
        console.log(" -- disconnected from websocket");
    });

var events_channel = pusher.subscribe("inventory_changes"); // use the relevant channel, see docs below

events_channel.bind("listed", function(data) {
        // use the relevant event type, see docs below
        // print out any data received for the given event type
        if (data.app_id == 730){
          fs.readFile('mybase.json',function(err,content){
            if(err) throw err;
            var parseJson = JSON.parse(content);
            i = 0;
            for (item in parseJson.csgo){
              if (parseJson.csgo[item].name == data.market_hash_name){
                if (parseJson.csgo[item].price >= data.price){
                  url = 'https://api.telegram.org/bot'+ TOKEN +'/sendMessage?chat_id=405089115&text=' + data.market_hash_name + data.price +' $ ' + 'your price = ' + parseJson.csgo[item].price + '$'
                  axios.get(url)
                  .then(function (response) {
                    // handle success
                    if (response.data.status == 'success'){
                        console.log('чекай сообщение')
                    }
                    else {
                      console.log('error');
                    }
                  })
                }
              }
              i++;
            }
          })
        }

        if (data.app_id == 570){
          fs.readFile('mybase.json',function(err,content){
            if(err) throw err;
            var parseJson = JSON.parse(content);
            i = 0;
            for (item in parseJson.dota){
              if (parseJson.dota[item].name == data.market_hash_name){
                if (parseJson.dota[item].price >= data.price){
                  url = 'https://api.telegram.org/bot'+ TOKEN +'/sendMessage?chat_id=405089115&text=' + data.market_hash_name + data.price +' $ ' + 'your price = ' + parseJson.dota[item].price + ' $'
                  axios.get(url)
                  .then(function (response) {
                    // handle success
                    if (response.data.status == 'success'){
                        console.log('чекай сообщение')
                    }
                    else {
                      console.log('error');
                    }
                  })
                }
              }
              i++;
            }
          })
        }
        //console.log(" -- got data: " + JSON.stringify(data));
        console.log(q);
        q++
});

//==========


function get_code() {
  return totp.gen(base32.decode('YMLGKHWOINVTEI2X'))
}

function get_balance() {
  api_key = '40fb6c4e-9a9f-4261-ab21-207f9ad5da64'
  url = 'https://bitskins.com/api/v1/get_account_balance/?api_key=' + api_key + '&code=' + get_code()
  axios.get(url)
  .then(function (response) {
    // handle success
    if (response.data.status == 'success'){
        return response.data.data.available_balance
    }
    else {
      console.log('error');
    }
  })
}

function buy_item(item_id, price){
  api_key = '40fb6c4e-9a9f-4261-ab21-207f9ad5da64'
  url = 'https://bitskins.com/api/v1/buy_item/?api_key=' + api_key +'&code='+ get_code() +'&item_ids='+ item_id +'&prices='+ price +'&app_id=730&auto_trade=false&allow_trade_delayed_purchases=true'
  axios.get(url)
  .then(function (response) {
    // handle success
    console.log(response.status)
    if (response.data.status == 'success'){
        console.log(response)
    }
    else {
      console.log('error');
    }
  })
  .catch(function (error) {
    console.log(error.data);
  })
}
buy_item('15757926931BSL1666160711', 0.0001)
console.log(get_code());
console.log(get_balance());
