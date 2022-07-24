const fs = require('node:fs');
// Require the necessary discord.js classes 
const { Client, Intents } = require('discord.js');
const cron = require('cron').CronJob;
const { MessageEmbed } = require('discord.js')

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

// Reminds to share concerns on the 14th and 27th of the month at 6 pm EST  
const reminder = new cron('0 22 14,27 * *', async function() {
	let targetGuild = await client.guilds.fetch(guild['guildId']);
	if (targetGuild) {
		let banterChannel = await targetGuild.channels.fetch()
			.then(channels => {
				const targetChannel = channels.find(channel => 
					{
						return channel.name.toLowerCase().includes("banter") && channel.type == 'GUILD_TEXT';
					})
				return targetChannel;
			})

		const reminderEmbed = new MessageEmbed()
			.setTitle("Hello, I'm the CORE Messenger")
			.setDescription("I'll share your private thoughts to the CORE group anonymously.")
			.setColor('#add8e6')
			.addFields(
				{
					name: "To share your thoughts to CORE Group Anonymously", 
					value: "**DM** it to me. I'll send it to the CORE Group channel."
				}
			);
		await banterChannel.send({ embeds: [reminderEmbed]})
	}
})

reminder.start();