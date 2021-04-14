const { Message, Client } = require('discord.js');
/**
 * @param  {Client} client
 * @param  {Message} message
 */
module.exports = async (client, message) => {
    // Prevent execution by bots and checks for messages without the prefix.
    if (message.author.bot || !message.content.startsWith(client.settings.prefix)) return;

    // TODO: this should disregard blacklisted guilds later down the line

    // Create arguments and command from message.
    const args = message.content.slice(client.settings.prefix.length).trim().split(/ +/g);

    const command = args.shift().toLowerCase();

    // Fetches the user.
    if (message.guild && !message.member) await message.guild.fetchMember(message.author);

    // Get the message.permLevel.
    message.permLevel = client.permlevel(message);

    if (process.env.MODE === 'DEV' && message.permLevel !== 42) return;

    // Retrieve command
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

    if (!cmd) return; // if command does not exist do nothing

    // Check message.permLevel and throw error
    if (message.permLevel < client.levelCache[cmd.conf.permLevel]) return;

    message.author.permLevel = message.permLevel;
    console.log(
        `(${client.config.permLevels.find((l) => l.message.permLevel === message.permLevel).message.permLevel}) | ${message.author.username} [${
            message.author.id
        }] ran command ${cmd.help.name}`,
    );
    cmd.run(client, message, args, message.permLevel);
};
