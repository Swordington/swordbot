const { Message, Client } = require('discord.js');
/**
 * @param  {Client} client
 * @param  {Message} message
 * @param  {Array<string>} args
 * @param  {number} level
 */
exports.run = async (client, message, args, level) => {
    // eslint-disable-line no-unused-vars

    if (!args[0]) return message.channel.send('You must provide a command to reload');
    if (args[0] === 'reload') return message.reply('you deserve the worst that hell as to offer.');
    const command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
    let response = await client.unloadCommand(args[0]);
    if (response) return message.channel.send(`Error Unloading: \`${response}\``);

    response = client.loadCommand(command.help.name);
    if (response) return message.channel.send(`Error Loading: \`${response}\``);

    message.channel.send(`The command \`${command.help.name}\` has been reloaded`);
};

exports.conf = {
    aliases: ['re'],
    permLevel: 42,
    requires: ['SEND_MESSAGES'],
};

exports.help = {
    name: 'reload',
    category: 'System',
    description: 'Reloads a command.',
    usage: 'reload [command]',
};
