exports.run = async (client, message, args, level) => {
  
    const { Util } = require('discord.js')
    const code = args.join(' ') // Generate string input.
    if (code.includes('client.token')) return message.channel.send('No thanks.') // Prevent attempts to get the token.
    try {
      // eslint-disable-next-line no-eval
      const evaled = await (code.includes('await') ? eval('async function foo(){' + code + '}; foo()') : eval(code)) // Evaluate the code
      const clean = await client.clean(client, evaled) // Clean the code
      if (clean.length > 1950) {
        const messages = Util.splitMessage(clean)
        messages.forEach(value => message.channel.send(`\`\`\`js\n${value}\`\`\``))
      } else {
        message.channel.send(`\`\`\`js\n${clean}\n\`\`\``)
      }
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${await client.clean(client, err)}\n\`\`\``)
    }
  }
  
  exports.conf = {
    aliases: ['e', 'evaluate'],
    permLevel: 42
  }
  
  exports.help = {
    name: 'eval',
    category: 'System',
    description: 'Evaluates arbitrary javascript.',
    usage: 'eval [...code]',
    example: 'eval message.reply(\'No\')'
  }
  