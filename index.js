const fs = require('node:fs');
// Require the necessary discord.js classes 
const { Client, Collection, Intents } = require('discord.js');

const { token } = require('./config.json');

// Create a new client instance 
const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.DIRECT_MESSAGES
    ],
    partials: [
        'CHANNEL'
    ]
});

let guild;

const eventFiles = fs.readdirSync('./events')
                    .filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
        guild = JSON.parse(fs.readFileSync('config.json'));
        client.on(event.name, async (...args) => await event.execute(client, guild['guildId'], ...args));
    }
}

// Login to Discord with your client's token
client.login(token);