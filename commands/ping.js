exports.run = async (client, message, args, level) => {

  const msg = await message.channel.send('Ping?')
  msg.edit(`Pong! Latency is \`${msg.createdTimestamp - message.createdTimestamp}ms\`.\nAPI Latency is \`${Math.round(client.ws.ping)}ms\`.`)
}

exports.conf = {
  aliases: [],
  permLevel: 0
}

exports.help = {
  name: 'ping',
  category: 'System',
  description: 'Checks the bot & API latency.',
  usage: 'ping',
  example: 'ping'
}
