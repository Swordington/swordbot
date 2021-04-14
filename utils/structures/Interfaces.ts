declare module 'discord.js' {
    interface Message {
        util: {
            flags(double: string, single?: string): string;
        };
        permLevel: number;
    }
}
