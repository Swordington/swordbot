const { Message, Client, MessageEmbed } = require('discord.js');
/**
 * @param  {Client} client
 * @param  {Message} message
 * @param  {Array<string>} args
 * @param  {number} level
 */
exports.run = async (client, message, args, level) => {
    const embed = new MessageEmbed().setTitle('<a:loading:831529809975705670> Ping?');
    const msg = await message.channel.send(embed);

    embed
        .setColor('GREEN')
        .setTitle('Pong!')
        .setDescription(
            `Latency is \`${msg.createdTimestamp - message.createdTimestamp}ms\`. Discord API Latency is \`${Math.round(client.ws.ping)}ms\`.`,
        )
        .setFooter(`${client.config.name} | Requested by: ${message.author.tag}`);

    msg.edit(embed);
    // msg.edit(`Pong! Latency is \`${msg.createdTimestamp - message.createdTimestamp}ms\`.\nAPI Latency is \`${Math.round(client.ws.ping)}ms\`.`)
};

exports.conf = {
    aliases: [],
    permLevel: 0,
};

exports.help = {
    name: 'ping',
    category: 'System',
    description: 'Checks the bot & API latency.',
    usage: 'ping',
    example: 'ping',
};
