import { Message, MessageTypes } from "@open-wa/wa-automate"

export function getMessageText(message: Message) {
  switch (message.type) {
    case MessageTypes.TEXT:
      return message.body
    case MessageTypes.IMAGE:
      return message.caption
    case MessageTypes.VIDEO:
      return message.caption
    default:
      return null
  }
}
