const { Message, Client } = require('discord.js');
/**
 * @param  {Client} client
 * @param  {Message} message
 * @param  {Array<string>} args
 * @param  {number} level
 */
exports.run = async (client, message, args, level) => {
    if (args[0] === undefined) return message.channel.send('A message is required');
    const msg = args.join(' ');
    message.channel.send(msg);
    message.delete(); // TODO: This should be made optional later on
};

exports.conf = {
    aliases: [],
    permLevel: 0,
};

exports.help = {
    name: 'say',
    category: 'Fun',
    description: 'Say something as the bot',
    usage: 'say <message>',
    example: 'say I love Swordbot!',
};
