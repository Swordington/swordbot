// eslint-disable-line no-unused-vars
const { exec } = require('child_process');
const { Util, Client, Message } = require('discord.js');
/**
 * @param  {Client} client
 * @param  {Message} message
 * @param  {Array<string>} args
 */
exports.run = async (client, message, args) => {
    try {
        let output = 'No output.';
        exec(args.join(' '), (err, stdout, stderr) => {
            if (err) output = err.stack || 'Error did not have a stack.';
            if (stdout && stdout.length !== 0) output = stdout;
            if (stderr && stderr.length !== 0) output = stderr;
            const messages = Util.splitMessage(output);
            if (typeof messages === 'string') return message.channel.send(`\`\`\`bash\n${messages}\`\`\``);
            messages.forEach((value) => message.channel.send(`\`\`\`bash\n${value}\`\`\``));
        });
    } catch (err) {
        message.channel.send(`\`\`\`bash\n${err}\`\`\``);
    }
};

exports.conf = {
    aliases: ['ex', 'exec'],
    permLevel: 42,
    requires: ['SEND_MESSAGES'],
};

exports.help = {
    name: 'shell',
    category: 'System',
    description: 'Executes bash.',
    usage: 'shell [...command]',
    example: 'shell rm -rf ~/swordbot', // good example :)
};
