import { create, Client, Message } from "@open-wa/wa-automate"
import { registerCommands } from "./registries"
import { Commands } from "./types"
import { PREFIX } from "./consts"
import env from "./env"
import { getMessageText } from "./utils/message"

async function handleMessage(
  client: Client,
  message: Message,
  commands: Commands,
  helpText: string
) {
  const messageText = getMessageText(message)

  if (!messageText || !messageText.startsWith(PREFIX)) return

  // if user sent "/hello there", this will get the first word next to "/" so "hello"
  const command = messageText.slice(1).split(" ")[0]

  // if help command return the help text
  if (command === "help")
    return client.reply(message.chatId, helpText, message.id)

  try {
    const commandToRun = commands[command]
    if (commandToRun) {
      await client.simulateTyping(message.chatId, true)
      await commandToRun.exec(messageText, message)
    }
  } catch (err) {
    if (err instanceof Error) {
      client.reply(message.chatId, `❌ ${err.message}`, message.id)
    } else {
      client.reply(message.chatId, "❌ Something went wrong", message.id)
    }
  } finally {
    await client.simulateTyping(message.chatId, false)
  }
}

async function main() {
  const client = await create({
    headless: true,
    qrTimeout: 0, // 0 means it will wait forever for you to scan the qr code
    popup: env.PORT,
  })

  const { commands, helpText } = await registerCommands(client)
  console.log("Commands registered:", Object.keys(commands))

  if (env.REPLY_TO_ANY) {
    client.onAnyMessage((message) =>
      handleMessage(client, message, commands, helpText)
    )
  } else {
    client.onMessage((message) =>
      handleMessage(client, message, commands, helpText)
    )
  }
}

main().catch((err) => console.error(err))
