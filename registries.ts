import type { Client } from "@open-wa/wa-automate"
import { Command, Commands } from "./types"
import { sync } from "glob"
import { resolve } from "path"
import env from "./env"

export async function registerCommands(client: Client) {
  const commands: Commands = {}
  let helpText = "⚠ Bot help ⚠\n\n"

  const commandFiles = sync(resolve("./commands/*"))

  commandFiles.forEach((filePath) => {
    try {
      const File = require(filePath).default
      if (File && File.prototype instanceof Command) {
        const command: Command = new File(client)
        commands[command.name] = command
        command.aliases.forEach((alias) => (commands[alias] = command))

        helpText += `*Command:* /${command.name}\n`
        helpText += `*Aliases:* ${command.aliases.join(", ")}\n`
        helpText += `${command.description}\n\n`
      }
    } catch (err) {}
  })

  helpText += `Made by ${env.AUTHOR}\n`
  if (env.AUTHOR_URL) helpText += `(${env.AUTHOR_URL})`

  return { commands, helpText }
}
