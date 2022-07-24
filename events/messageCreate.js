module.exports = {
	name: 'messageCreate',
	async execute(client, guildId, message) {
        let targetGuild = await client.guilds.fetch(guildId);
        let concernChannel = await targetGuild.channels.fetch()
            .then(channels => {
                const targetChannel = channels.find(channel => 
                    {
                        return channel.name.toLowerCase().includes("core-group-chat") && channel.type == 'GUILD_TEXT';
                    })
                return targetChannel;
            })
        if (concernChannel) {
            if (message.channel.type === "DM" && message.author.id !== client.user.id) {
                concernChannel.send({ content: message.content.trim() });
                return message.reply('CORE Messenger shared your thoughts to the CORE group 🙏');
            } 
        } else if (message.author.id !== client.user.id) {
            return message.reply('CORE Messenger cannot find the #core-group-chat\nDM one of the CORE leaders about this.');
        }
	},
};
