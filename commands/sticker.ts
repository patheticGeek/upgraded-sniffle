import {
  Message,
  Client,
  MessageTypes,
  decryptMedia,
} from "@open-wa/wa-automate"
import env from "../env"
import { Command } from "../types"

const mediaMessageTypes = [MessageTypes.IMAGE, MessageTypes.VIDEO]

const stickerMetadata = {
  author: env.AUTHOR,
  pack: `${env.AUTHOR}'s Pack`,
}

class HelloCommand extends Command {
  constructor(client: Client) {
    super(client, {
      aliases: ["s"],
      name: "sticker",
      description:
        "Reply to or caption a image/video/gig message to make a sticker of it",
    })
  }

  exec = async (_: string, message: Message) => {
    if (mediaMessageTypes.includes(message.type)) {
      return this.sendMessageAsSticker(message)
    } else if (
      message.type === MessageTypes.TEXT &&
      message.quotedMsg &&
      mediaMessageTypes.includes(message.quotedMsg.type)
    ) {
      return this.sendMessageAsSticker(message.quotedMsg)
    }

    throw new Error("Message does not contain or quote any media")
  }

  sendMessageAsSticker = async (message: Message) => {
    await this.client.sendText(message.chatId, "Processing sticker")
    const mediaData = await decryptMedia(message)
    const dataUrl = `data:${message.mimetype};base64,${mediaData.toString(
      "base64"
    )}`

    if (message.type === MessageTypes.IMAGE) {
      this.client.sendImageAsSticker(message.chatId, dataUrl, stickerMetadata)
    } else if (message.type === MessageTypes.VIDEO) {
      this.client.sendMp4AsSticker(
        message.chatId,
        dataUrl,
        undefined,
        stickerMetadata
      )
    }
  }
}

export default HelloCommand
