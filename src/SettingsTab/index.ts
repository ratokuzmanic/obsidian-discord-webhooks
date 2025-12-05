import { App, PluginSettingTab } from 'obsidian';
import DiscordWebhooksPlugin from '../main';
import WebhookSection from './sections/Webhooks';
import SelectedTextWebhookSection from './sections/SelectedTextWebhook';

export default class DiscordWebhooksSettingTab extends PluginSettingTab {
  webhookSection: WebhookSection;
  selectedTextSection: SelectedTextWebhookSection;

  constructor(app: App, plugin: DiscordWebhooksPlugin) {
    super(app, plugin);
    const refresh = () => this.display();
    this.webhookSection = new WebhookSection(plugin, refresh);
    this.selectedTextSection = new SelectedTextWebhookSection(plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    this.webhookSection.display(containerEl);
    this.selectedTextSection.display(containerEl);
  }
}
