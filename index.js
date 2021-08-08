const config = require('./config.json');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');


// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(config.TOKEN, {polling: true});

// Creates a temporary array which includes all the files from the 
// directory. The array changes while running the bot.
let temp_files = fs.readdirSync(config.DIRECTORY);


// Interacts with the user when the user gives /start command.
// Creates a button containing a command, when pushed, user sends the
// corresponding message.
bot.onText(/\/start/, (msg) => {
    
    bot.sendMessage(msg.chat.id, "Welcome!", {
        "reply_markup": {
            "keyboard": [["/video"]]
            }
        });       
});


// Interacts with the user when given a /video command.
 bot.onText(/\/video/, (msg) => {
     
    // Checks the time of the message and refers it to current time.
    // Is used to ignore messages while the bot is offline.
    // In this instance, the users messages are ignored if they are
    // older than five seconds.
    if (Date.now() - parseInt(msg.date)*1000 > 5000) {
        return;
    }
    
    // Checks how many files the array contains currently
    var file_amount = temp_files.length;

    // If the array is empty, it will be refilled.
    if (file_amount == 0) {
        bot.sendMessage(msg.chat.id, "This isn't enough?")
        temp_files = fs.readdirSync(config.DIRECTORY);
    }

    // Creates a random index.
    var random = Math.floor(Math.random() * file_amount)

    // Determines the path for the video that will be sent to the user.
    let file = config.DIRECTORY + "\\" + temp_files[random]

    // Deletes the corresponding video from the files array to avoid
    // duplicate videos in the current loop.
    temp_files.splice(random,1)

    // Sends the video to the user and adds a caption to it.
    bot.sendVideo(msg.chat.id, fs.readFileSync(file),{caption: "Enjoy your video :)"})

    

 });




