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
  }

  unregisterCommands(): void {
    this.registeredCommands.forEach(commandId =>
      this.plugin.app.commands.removeCommand(`discord-webhooks:${commandId}`)
    );
    this.registeredCommands.clear();
  }
}
