import { create } from '@open-wa/wa-automate'
import type { Client, Message } from '@open-wa/wa-automate'
import { registerCommands } from './registries'
import { Commands } from './types'
import { PREFIX } from './consts'
import env from './env'

async function handleMessage(client: Client, message: Message, commands: Commands, helpText: string) {
  if(!message.body || !message.body.startsWith(PREFIX)) return

  // if user sent "/hello there", this will get the first word next to "/" so "hello"
  const command = message.body.slice(1).split(' ')[0]

  // if help command return the help text
  if(command === 'help') return client.reply(message.chatId, helpText, message.id)

  try {
    const commandToRun = commands[command]
    if(commandToRun) await commandToRun.exec(message)
    else client.reply(message.chatId, "🤖 Command not found", message.id)
  } catch(err) {
    client.reply(message.chatId, "❌ Something went wrong", message.id)
  }
}

async function main() {
  const client = await create({
    headless: true,
    qrTimeout: 0, // 0 means it will wait forever for you to scan the qr code
    popup: env.PORT
  })

  const { commands, helpText } = await registerCommands(client)
  console.log('Commands registered:', Object.keys(commands))

  client.onMessage(message => handleMessage(client, message, commands, helpText))
}

main().catch((err) => console.error(err))
