const TelegramApi = require('node-telegram-bot-api');

const token = '6212123985:AAE1IX2KJ1gxUpTwu2b21aacMPgmPv7PiIc'; //* токен можно найти при создание его в бот фазере

const bot = new TelegramApi(token, {polling : true});  //* экспорт бота
 
const chats = {}

const AgainGameOptions = { 
    reply_markup : JSON.stringify({                                 //* добавление кнопок
        inline_keyboard : [
            [{text : 'Start new Game', callback_data: '/again'},]

        ]
    })
}

const gameOptions = { 
    reply_markup : JSON.stringify({                                 //* добавление кнопок
        inline_keyboard : [
            [{text : '1', callback_data: '1'}, {text : '2', callback_data: '2'},{text : '3', callback_data: '3'}],
            [{text : '4', callback_data: '4'},{text : '5', callback_data: '5'}, {text : '6', callback_data: '6'}],
            [{text : '7', callback_data: '7'},{text : '8', callback_data: '8'}, {text : '9', callback_data: '9'}],
            [{text : '0', callback_data: '0'}],

        ]
    })
}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `starting a game`)
    await bot.sendMessage(chatId, `i will give u a random number from 0 to 9 `)
    const rndNubmer = Math.floor(Math.random() * 10 )
    chats[chatId] = rndNubmer
    await bot.sendMessage(chatId, `guess number the num `, gameOptions)
}

const start = ( ) => {
    bot.setMyCommands([                                         //* сетет комнанды 
    {command : '/start', description : 'starting app'},
    {command : '/info', description : 'get info'},
    {command : '/game', description : 'start game'},
    ]
    )

    bot.on('message', async msg => {      //* срабатывает при отправлении сообщения msg делать async
    const text = msg.text;
    const chatId = msg.chat.id;
// bot.sendMessage(chatId, `ты написал ${text}`)  //* send message отправляет сообщение 1 передача чат айди второе сообщение ! 
    if (text === '/start') {
        await bot.sendMessage(chatId, `Добро пожаловать!`)
        return
    }
    if (text === '/info') {
        await bot.sendMessage(chatId, `your name is ${msg.from.first_name}`)
        return
    }
    if (text === '/game') {
        return startGame(chatId)
        
    }
        return bot.sendMessage(chatId, `idk your message`)

}) 
    bot.on('callback_query', async msg => {           //* срабатывает на любое нажатие кнопок
        const data = msg.data;
        const chatId = msg.message.chat.id
        if (data === '/again') {
            return startGame(chatId)
        }
        if (data === chats[chatId]) {
            return  bot.sendMessage(chatId, `congrats you choose right nubmer ${chats[chatId]}`,AgainGameOptions)
        }
        else { 
            return  bot.sendMessage(chatId, `you lose idiot ${chats[chatId]}`,AgainGameOptions)
        }
        

    })
}

start()
