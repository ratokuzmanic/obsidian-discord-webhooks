import { Setting } from 'obsidian';
import DiscordWebhooksPlugin from '../../main';

export default class GeneralSection {
  constructor(
    private plugin: DiscordWebhooksPlugin,
    private refresh: () => void
  ) {}

  display(containerEl: HTMLElement) {
    const options = Object.fromEntries(
      this.plugin.settings.webhooks.map(webhook => [webhook.id, webhook.name])
    );

    new Setting(containerEl)
      .setName('Selected Text Webook')
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

    new Setting(containerEl)
      .setName('Testing Mode')
      .setDesc(
        'When enabled, everything is sent to a test webhook instead of its usual destination.'
      )
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.isTesting)
          .onChange(async value => {
            this.plugin.settings.isTesting = value;
            await this.plugin.saveSettings();
            this.refresh();
          })
      );

    if (this.plugin.settings.isTesting) {
      new Setting(containerEl).setName('Test Webhook URL').addText(text => {
        text
          .setPlaceholder('https://discord.com/api/webhooks/...')
          .setValue(this.plugin.settings.testWebhookUrl)
          .onChange(async value => {
            this.plugin.settings.testWebhookUrl = value;
            await this.plugin.saveSettings();
          });
        text.inputEl.addClass('discord-webhooks-input');
      });
    }
  }
}
