import DiscordWebhooksPlugin from './main';
import { sendToDiscord } from './fetch';

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
      const webhookUrl = this.plugin.settings.isTesting
        ? this.plugin.settings.testWebhookUrl
        : this.plugin.settings.webhooks.find(
            webhook => webhook.id === message.webhookId
          )!.url;
      this.plugin.addCommand({
        id: commandId,
        name: `Send ${message.name} message to Discord`,
        callback: async () => await sendToDiscord(webhookUrl, message.payload)
      });
      this.registeredCommands.add(commandId);
    });
  }

  unregisterCommands(): void {
    this.registeredCommands.forEach(commandId =>
      this.plugin.removeCommand(commandId)
    );
    this.registeredCommands.clear();
  }
}
