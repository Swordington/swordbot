const config = {
    description: 'I shouldnt really exist', // Description of the bot
    name: 'Swordbot', // The bot name
    devs: ['248540313059196928', '320546614857170945'], // Array of level 42 users - Sword#0042, Toast#6582
    sets: { // Settings
      prefix: '_',
      devPrefix: '-'
    },
    defaults: {
      guildSettings: {
        blacklisted: false,
        modLog: false,
        actionLog: false,
        memberLog: false
      }
    },
    permLevels: [ // Permissions
      {
        level: 0, // Basic level command; return true automatically so all users can run commands
        name: 'User',
        check: () => true
      },
      {
        level: 2, // Moderator
        name: 'Server Mod',
        check: (message) => {
          try {
            const perms = message.member.permissions
            return (perms.has('KICK_MEMBERS', true))
          } catch (e) {
            // TODO: Add error reporting for these catch blocks
            return false
          }
        }
      },
      {
        level: 3, // Admin
        name: 'Server Admin',
        check: (message) => {
          try {
            const perms = message.member.permissions
            return (perms.has('MANAGE_SERVERS', true))
          } catch (e) {
            return false
          }
        }
      },
      {
        level: 5, // Guild Owner
        name: 'Server Owner',
        check: (message) => {
          try {
            const result = message.channel.type === 'text' ? (message.guild.ownerID === message.author.id) : false
            return result
          } catch (e) {
            return false
          }
        }
      },
      {
        level: 7, // Support
        name: 'Support Team',
        check: (message) => {
          try {
            // For this, we get the guild, then the member of the guild, and then finally check if that guild member A) Exists in the guild and B) Check if the guild member has the support role.
            const guild = message.client.guilds.fetch('793623405991559189')
            const guildMember = guild.members.fetch(message.author.id)
            if (guildMember === undefined) return false
            const hasRole = guildMember.roles.cache.has('793859785137192990') // Check for the Support Role
            return (hasRole)
          } catch (e) {
            return false
          }
        }
      },
      { // For bot dev members
        level: 42,
        name: 'Bot Dev',
        // checks if the message author is a member of the developers array.
        check: (message) => {
          if (config.devs.indexOf(message.author.id) > -1) {
            return true
          } else {
            return false
          }
        }
      }
    ]
  }
  
  module.exports = config
  