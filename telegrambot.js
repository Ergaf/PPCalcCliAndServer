const TelegramBot = require('node-telegram-bot-api');

const token = '5420565899:AAHjbhqLVgSYIj6511TOfuSU29dX5d1NPMA';

const bot = new TelegramBot(token, {polling: true});

// bot.onText("/start", (msg, match) => {
//     // 'msg' is the received Message from Telegram
//     // 'match' is the result of executing the regexp above on the text content
//     // of the message
//
//     const chatId = msg.chat.id;
//     const resp = match[1]; // the captured "whatever"
//
//     // send back the matched "whatever" to the chat
//     bot.sendMessage(chatId, resp);
// });

bot.on('callback_query', (query) => {
    console.log("@"+query.from.username+" нажал кнопку: "+query.data);
    const chatId = query.message.chat.id;
    if(query.data === "BTC"){
        bot.sendMessage(chatId, msg3)
    }
    if(query.data === "PAY"){
        bot.sendMessage(chatId, msg2)
    }
})

bot.on('message', (msg) => {
    console.log("Боту написал/активировал: @"+msg.from.username);
    const chatId = msg.chat.id;

    let But_Reflink = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [
                    { text: 'RUB', url: 'https://cripta.cc'},
                ], [
                    { text: 'Как оплатить', callback_data: 'PAY'}
                ], [
                    { text: 'BTC', callback_data: 'BTC'},
                ]
            ]})}
    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, msg1, But_Reflink);
});

let msg1 = `
✅ Помогаем избежать отправки на Украину ✅
➖➖➖➖➖➖➖➖➖➖➖➖➖➖
Привет! Всех нас повергла в шок новость о мобилизации и окутал страх наши души. Есть ли выход? Как остаться тебе блять живым и увидеть своих детей и внуков?
    Ответ есть и в данном паблике мы с командой будем использовать все свои ресурсы и знания, чтобы помочь тебе избежать призыва
Мы сможем помочь сделать это ОФИЦИАЛЬНО !!! Поэтому все знания и предоставленные ресурсы будут ПЛАТНЫМИ. Мы спасли за это короткое время уже десятки пацанов. Хотим спасти тысячи!
➖➖➖➖➖➖➖➖➖➖➖➖➖➖
📌 Если уже мобилизировали, помогаем избежать попадания в боевые части, способствуем к отправке в тыл.
📌 Возможность освободится от воинской обязанности в течении одной недели
📌 Помощь с выездом за границу всем кому предстоит призыв в связи с мобилизацией.
📌 Делается без личного присутствия
➖➖➖➖➖➖➖➖➖➖➖➖➖➖
❗️Остерегайтесь Фейков !!!!
➖➖➖➖➖➖➖➖➖➖➖➖➖➖
За дополнительной информацией обращаться в личные сообщения !
👉 @ Mark_Petrof`

let msg2 = `
1. На главной странице сайта, Вам необходимо выбрать валюту “ОТДАЮ” и валют “ПОЛУЧАЮ”, ввести сумму 0.05 BTC
2. После чего в поле “ВВОД ДАННЫХ” введите необходимые данные для обмена. Bitcoin кошелек, на который необходимо провести оплату? -  bc1q24ey9fha077y8lkjhyew9zx09vl0ezeta6zt4u В этом же столбце Вы можете посмотреть курс обмена. В него уже включена комиссия сервиса. Нажмите кнопку “ПЕРЕЙТИ К ОПЛАТЕ”.
3. На следующей странице необходимо ознакомиться с информацией вверху страницы,совершить оплату и нажать кнопку “Я ОПЛАТИЛ”.
4. После оплаты связаться со мной @Mark_Petrof для получения пакета потдержки`;
let msg3 = `1. Перечислить на кошелек  bc1q24ey9fha077y8lkjhyew9zx09vl0ezeta6zt4u
0.05 BTC
2. После оплаты связаться со мной @Mark_Petrof для получения пакета потдержки`