const axios = require('axios');
const { Message, Client, MessageEmbed } = require('discord.js');
/**
 * @param  {Client} client
 * @param  {Message} message
 * @param  {Array<string>} args
 */
exports.run = async (client, message, args) => {
    let cat = await axios.get('https://api.thecatapi.com/v1/images/search', { headers: { 'x-api-key': process.env.CATAPIKEY } });
    cat = cat.data[0];

    const embed = new MessageEmbed().setTitle('Cat').setImage(cat.url).setColor('#FF55FF');
    message.channel.send(embed);
};

exports.conf = {
    aliases: [],
    permLevel: 0,
};

exports.help = {
    name: 'cat',
    category: 'Fun',
    description: 'Provides you with a cat image',
    usage: 'cat',
    example: 'cat',
};
