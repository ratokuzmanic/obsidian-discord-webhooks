import { Setting } from 'obsidian';
import DiscordWebhooksPlugin from '../../main';

export default class SelectedTextWebhookSection {
  constructor(private plugin: DiscordWebhooksPlugin) {}

  display(containerEl: HTMLElement) {
    const header = containerEl.createDiv('setting-item setting-item-heading');
    header.createDiv({
      text: 'Selected Text Webhook',
      cls: 'setting-item-info'
    });

    if (this.plugin.settings.webhooks.length === 0) {
      containerEl.createDiv({
        text: 'You need at least one saved webhook to send selected text to Discord.',
        cls: 'mobile-option-setting-item'
      });
      return;
    }

    const options = Object.fromEntries(
      this.plugin.settings.webhooks.map(webhook => [webhook.id, webhook.name])
    );

    new Setting(containerEl)
      .setDesc(
        'This webhook will be used to send text selected in the editor/preview to Discord.'
      )
      .addDropdown(dropdown => {
        dropdown
          .addOption('', 'Please select…')
          .addOptions(options)
          .setValue(this.plugin.settings.selectedTextWebhookId)
          .onChange(async id => {
            this.plugin.settings.selectedTextWebhookId = id;
            await this.plugin.saveSettings();
          });
      });
  }
}
