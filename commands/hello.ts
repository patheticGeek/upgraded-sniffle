import type { Message, Client } from '@open-wa/wa-automate'
import { Command } from "../types";

class HelloCommand extends Command {
  constructor(client: Client) {
    super(client, {
      aliases: ['hi', 'hey'],
      name: "hello",
      description: "Greet the user"
    })
  }

  exec = async (message: Message) => {
    await this.client.reply(message.chatId, 'Hello there 👋', message.id)
  }
}

export default HelloCommand
