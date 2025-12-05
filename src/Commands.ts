import { Notice } from 'obsidian';
import DiscordWebhooksPlugin from './main';

export default class Commands {
  private plugin: DiscordWebhooksPlugin;
  private registeredCommands: Set<string>;

  constructor(plugin: DiscordWebhooksPlugin) {
    this.plugin = plugin;
    this.registeredCommands = new Set();
  }

  registerCommands(): void {
    this.unregisterCommands();

    this.plugin.settings.messages.forEach(message => {
      if (!message.webhookId) return;

      const commandId = `discord-webhook-${message.id}`;
      const webhookUrl = this.plugin.settings.webhooks.find(
        webhook => webhook.id === message.webhookId
      )!.url;
      this.plugin.addCommand({
        id: commandId,
        name: `Send ${message.name} message to Discord`,
        callback: () =>
          fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: message.payload
          })
            .then(() => new Notice('Sent to Discord'))
            .catch(() => new Notice('Something went wrong'))
      });
      this.registeredCommands.add(commandId);
    });
  }

  unregisterCommands(): void {
    this.registeredCommands.forEach(commandId =>
      this.plugin.app.commands.removeCommand(`discord-webhooks:${commandId}`)
    );
    this.registeredCommands.clear();
  }
}
