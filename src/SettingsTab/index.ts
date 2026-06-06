import { App, PluginSettingTab } from 'obsidian';
import DiscordWebhooksPlugin from '../main';
import WebhookSection from './sections/Webhooks';
import MessagesSection from './sections/Messages';
import GeneralSection from './sections/General';

export default class DiscordWebhooksSettingTab extends PluginSettingTab {
  webhookSection: WebhookSection;
  messagesSection: MessagesSection;
  generalSection: GeneralSection;

  constructor(app: App, plugin: DiscordWebhooksPlugin) {
    super(app, plugin);
    const refresh = () => this.display();
    this.webhookSection = new WebhookSection(plugin, refresh);
    this.messagesSection = new MessagesSection(plugin, refresh);
    this.generalSection = new GeneralSection(plugin, refresh);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    this.webhookSection.display(containerEl);
    this.messagesSection.display(containerEl);
    this.generalSection.display(containerEl);
  }
}
