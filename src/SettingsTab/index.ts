import { App, PluginSettingTab } from 'obsidian';
import DiscordWebhooksPlugin from '../main';
import GeneralSection from './sections/General';
import WebhookSection from './sections/Webhooks';
import MessagesSection from './sections/Messages';

export default class DiscordWebhooksSettingTab extends PluginSettingTab {
  plugin: DiscordWebhooksPlugin;
  generalSection: GeneralSection;
  webhookSection: WebhookSection;
  messagesSection: MessagesSection;

  constructor(app: App, plugin: DiscordWebhooksPlugin) {
    super(app, plugin);
    const refresh = () => this.display();
    this.plugin = plugin;
    this.generalSection = new GeneralSection(plugin, refresh);
    this.webhookSection = new WebhookSection(plugin, refresh);
    this.messagesSection = new MessagesSection(plugin, refresh);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    if (this.plugin.settings.webhooks.length > 0) {
      this.generalSection.display(containerEl);
    }
    this.webhookSection.display(containerEl);
    if (this.plugin.settings.webhooks.length > 0) {
      this.messagesSection.display(containerEl);
    }
  }
}
