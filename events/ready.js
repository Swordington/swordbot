// Only triggered when the client fires the ready event
module.exports = async (client) => {
    console.log(`${client.user.tag}, ready to serve ${client.users.cache.size} users.`)
  
    let text
    switch (process.env.MODE) {
      case 'DEV':
        text = `in dev mode | v.${client.settings.commit.shortHash}`
        break
      case 'PROD':
        text = `${client.config.name} | ${client.settings.prefix}help`
        break
      default:
        // If default is triggered something somewhere went very wrong.
        client.destroy()
        console.log('THERE IS NO VALID MODE SET IN THE .ENV FILE. JANET WILL FORCIBLY SHUTDOWN.')
        process.exit(5)
    }
    client.user.setActivity(text, {
      type: 'PLAYING'
    })
  }
  