module.exports = (client) => {
  
    client.unloadCommand = async (commandName) => {
      let command
      if (client.commands.has(commandName)) {
        command = client.commands.get(commandName)
      } else if (client.aliases.has(commandName)) {
        command = client.commands.get(client.aliases.get(commandName))
      }
      if (!command) return `The command ${commandName} doesn't seem to exist, nor is it an alias.`
  
      if (command.shutdown) {
        await command.shutdown(client)
      }
      const mod = require.cache[require.resolve(`../commands/${command.help.name}`)]
      delete require.cache[require.resolve(`../commands/${command.help.name}.js`)]
      for (let i = 0; i < mod.parent.children.length; i++) {
        if (mod.parent.children[i] === mod) {
          mod.parent.children.splice(i, 1)
          break
        }
      }
      return false
    }
    // Command Loader
    client.loadCommand = (commandName) => {
      try {
        console.log(`Loading Command: ${commandName}`)
        const props = require(`../commands/${commandName}`)
        if (props.init) {
          props.init(client)
        }
        client.commands.set(props.help.name, props)
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.help.name)
        })
        return false
      } catch (e) {
        return `Unable to load command ${commandName}: ${e}`
      }
    }
  
    // Awaits a message and returns the result
    client.awaitMessage = async (msg, question, limit = 120000) => {
      const filter = m => m.author.id === msg.author.id
      await msg.channel.send(question)
      try {
        const collected = await msg.channel.awaitMessages(filter, {
          max: 1,
          time: limit,
          errors: ['time']
        })
        return collected.first().content
      } catch (e) {
        console.log(e)
        return false
      }
    }
    // Clean text of various characters
  
    client.clean = async (client, text) => {
      if (text && text.constructor.name === 'Promise') {
        text = await text
      }
      if (typeof (text) !== 'string') {
        text = require('util').inspect(text, {
          depth: 0
        })
      }
      if (typeof (text) === 'string') {
        text = text
          .replace(/`/g, '`' + String.fromCharCode(8203))
          .replace(/@/g, '@' + String.fromCharCode(8203))
          .replace(client.token, 'TOKEN') // FIXME: This should replace all .env variables
      }
      return text
    }
  
    // Level Checker
    client.permlevel = message => {
      let permlvl = 0
      const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1)
      while (permOrder.length) {
        const currentLevel = permOrder.shift()
        if (message.guild && currentLevel.guildOnly) continue
        if (currentLevel.check(message)) {
          permlvl = currentLevel.level
          break
        }
      }
      return permlvl
    }
  
    client.menuGenerator = async (reactions, message) => {
      const reactMenu = message.createReactionCollector(
        (reaction, user) => (reactions.includes(reaction.emoji.name) && user.id !== client.user.id),
        { time: 120000 }
      )
      reactMenu.on('end', () => reactMenu.message.clearReactions().catch())
      for (const reaction of reactions) {
        await message.react(reaction).catch()
      }
      return reactMenu
    }
  }
  