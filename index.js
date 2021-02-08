/**
 * MIT License
 *
 * Copyright (c) 2021 Sword
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */
require('dotenv').config()

const Discord = require('discord.js')
const LCL = require('last-commit-log')
const { promisify } = require('util')
const readdir = promisify(require('fs').readdir) // No idea why we have to do this insanity here, but it's in my boilerplate code sooooo

const client = new Discord.Client()
client.config = require('./config')
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()

const lcl = new LCL()

require('./utils/functions')(client) // Some weird binding shit

// This is run at initilazation.

const init = async () => {
  // Grabs current setting set and applies it
  client.settings = { prefix: null, token: process.env.TOKEN, commit: null }
  switch (process.env.MODE) {
    case 'DEV':
      client.settings.prefix = client.config.sets.devPrefix
      break

    case 'PROD':
      client.settings.prefix = client.config.sets.prefix
      break

    default:
      console.log(`THERE IS NO VALID MODE SET IN THE .ENV FILE. ${client.config.name} WILL FORCIBLY SHUTDOWN.`)
      process.exit(5)
  }

  // fetch the commit and assign it to the settings for continuity

  client.settings.commit = await lcl.getLastCommit()


  // Searches for all commands & loads them
  const cmdFiles = await readdir('./commands/')
  console.log(`Loading a total of ${cmdFiles.length} commands.`)
  cmdFiles.forEach((f) => {
    if (!f.endsWith('.js')) return
    const response = client.loadCommand(f)
    if (response) console.log(response)
  })

  // Searches for all events & loads them
  const evtFiles = await readdir('./events/')
  console.log(` Loading a total of ${evtFiles.length} events.`)
  evtFiles.forEach((file) => {
    const eventName = file.split('.')[0]
    console.log(`Loading Event: ${eventName}`)
    const event = require(`./events/${file}`)

    client.on(eventName, event.bind(null, client))
  })

  client.levelCache = {}
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i]
    client.levelCache[thisLevel.level] = thisLevel.level
  }

  client.login(client.settings.token)
}

init()