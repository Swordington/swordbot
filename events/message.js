module.exports = async (client, message) => {
    // Require requirements to fulfill their requirements
    const Discord = require('discord.js')
  
    // Prevent execution by bots and checks for messages without the prefix.
    if (message.author.bot || !message.content.startsWith(client.settings.prefix)) return

  
    // TODO: this should disregard blacklisted guilds later down the line
  
    // Create arguments and command from message.
    const args = message.content.slice(client.settings.prefix.length).trim().split(/ +/g)
    // Had to comment this out since it breaks the bot
    /*
    const flags = {}
    for (const arg of args) {
        const match = /^--?([^=]+)(?:=(.*))?/.exec(arg)
        if (match) {
            flags[match[1]] = match[2] ?? true
            const index = args.indexOf(arg)
            if (index > -1) {
                args.splice(index, 1)
            }
        }
    }

    */
    const command = args.shift().toLowerCase()
  
    // Fetches the user.
    if (message.guild && !message.member) await message.guild.fetchMember(message.author)
  
    // Get the level.
    const level = client.permlevel(message)

    if (process.env.MODE === 'DEV' && level !== 42) return;
  
    // Retrieve command
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
  
    if (!cmd) return // if command does not exist do nothing
  
    // Check level and throw error
    if (level < client.levelCache[cmd.conf.permLevel]) return;

    message.author.permLevel = level
    console.log(`(${client.config.permLevels.find((l) => l.level === level).level}) | ${message.author.username} [${message.author.id}] ran command ${cmd.help.name}`)
    cmd.run(client, message, args, level)
}
