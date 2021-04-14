const { Message, Client } = require('discord.js');
/**
 * @param  {Client} client
 * @param  {Message} message
 * @param  {Array<string>} args
 * @param  {number} level
 */
exports.run = async (client, message, args, level) => {
    const failCmd = () => {
        message.channel.send('Sorry! You need to provide a number of messages to delete over 1 and fewer than 100.');
    };
    if (args[0] === undefined || isNaN(args[0])) return failCmd();
    const amount = args[0];

    if (amount > 100 || amount < 1) return failCmd();

    await message.delete();

    await message.channel.messages.fetch({ limit: amount }).then((messages) => {
        // Fetches the messages
        message.channel.bulkDelete(
            messages, // Bulk deletes all messages that have been fetched and are not older than 14 days (due to the Discord API)
        );
    });
};

exports.conf = {
    aliases: [],
    permLevel: 2,
};

exports.help = {
    name: 'purge',
    category: 'Moderation',
    description: 'Purge messages from the channel',
    usage: 'purge <# messages>',
    example: 'purge 12',
};
