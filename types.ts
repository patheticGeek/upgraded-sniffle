import type { Message, Client } from '@open-wa/wa-automate'

export interface CommandOptions {
  name: string
  description: string
  aliases?: string[]
}

export abstract class Command {
  public aliases: string[];
  public name: string;
  public description: string;
  public client: Client;

  constructor(client: Client, options?: CommandOptions) {
    this.client = client
    this.name = options?.name || ''
    this.description = options?.description || ''
    this.aliases = options?.aliases || []
  }

  public abstract exec(message: Message): unknown | Promise<unknown>;
}

export class Event {
  constructor(_client: Client) {}
}

export type Commands = Record<string, Command>
