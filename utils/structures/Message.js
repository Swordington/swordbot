const { Structures } = require('discord.js');

Structures.extend('Message', (Message) => {
    return class Msg extends Message {
        constructor(client, data, channel) {
            super(client, data, channel);
            this.util = {
                flags: (double, single) => {
                    const flags = this.content
                        .trim()
                        .replace(/(?: |^| --?)(?:([^=]*)=)?("([^"]*)")/g, (match, _g1, g2, g3) => match.replace(g2, g3.replace(/ /g, '  ')))
                        .split(/ +/g)
                        .reduce(
                            (flags, flag, i) => {
                                flag = flag.replace(/  /g, ' ');
                                const match = /^(--?)([^=]+)(?:=(.*))?$/.exec(flag);
                                if (match) flags[match[1] === '--' ? 'double' : 'single']?.set(match[2].toLowerCase(), match[3] || true);
                                return flags;
                            },
                            { double: new Map(), single: new Map() },
                        );
                    if (!double) return new Map([...flags.double, ...flags.single]);
                    const dKey = [...flags.double.keys()].find((k) => double.includes(k));
                    const sKey = [...flags.single.keys()].find((k) => single.includes(k));
                    return flags.double.get(dKey) || flags.single.get(sKey);
                },
            };
        }
    };
});
