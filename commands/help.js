const Discord = require('discord.js');
exports.run = (client, message, args, level) => {
    // if no command, show all filtered
    if (!args[0]) {
        // filter commands
        const myCommands = message.guild
            ? client.commands.filter((cmd) => client.levelCache[cmd.conf.permLevel] <= level)
            : client.commands.filter((cmd) => client.levelCache[cmd.conf.permLevel] <= level && cmd.conf.guildOnly !== true);

        let currentCategory = '';
        let output = '';
        const sorted = myCommands
            .array()
            .sort((p, c) => (p.help.category > c.help.category ? 1 : p.help.name > c.help.name && p.help.category === c.help.category ? 1 : -1));
        sorted.forEach((c) => {
            const cat = c.help.category;
            if (currentCategory !== cat) {
                output += `\n\n${cat}: `;
                currentCategory = cat;
            }
            output += `\`${c.help.name}\` `;
        });
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.config.name} Commands`)
            .setDescription(output.slice(0, -1))
            .setColor('#d309df')
            .setFooter(`${client.config.name} - ${client.config.description}`);
        message.channel.send(embed);
    } else {
        // individual command help
        let command = args[0];
        if (client.commands.has(command)) {
            command = client.commands.get(command);
            if (level < client.levelCache[command.conf.permLevel]) return;
            const embed = new Discord.MessageEmbed()
                .setTitle(`${client.config.name} Command Help: \`${command.help.name}\``)
                .setDescription(`${command.help.description}`)
                .addField('Usage', `${client.settings.prefix}${command.help.usage}`, true)
                .setColor('#d309df')
                .setFooter(`${client.config.name} - ${client.config.description}`);

            // Check for special properties
            if (command.help.example) {
                embed.addField('Example', `${client.settings.prefix}${command.help.example}`, true);
            }
            if (!(command.conf.aliases.length === 0)) {
                embed.addField('Aliases', `${command.conf.aliases.join(', ')}`, true);
            }
            if (level === 42) {
                embed.addField('Level', command.conf.permLevel, true);
            }

            message.channel.send(embed);
        }
    }
};

exports.conf = {
    aliases: ['h', 'halp'],
    permLevel: 0,
};

exports.help = {
    name: 'help',
    category: 'System',
    description: 'Displays all the commands you can run, or more info about a specific command.',
    usage: 'help [command]',
};
