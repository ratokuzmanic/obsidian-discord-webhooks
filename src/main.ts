import { Plugin, Notice } from 'obsidian';
import { DiscordWebhooksSettings } from './types';
import SettingsTab from './SettingsTab';
import Commands from './Commands';
import { sendToDiscord } from './fetch';

const DEFAULT_SETTINGS: DiscordWebhooksSettings = {
  webhooks: [],
  selectedTextWebhookId: '',
  messages: [],
  isTesting: false,
  testWebhookUrl: ''
};

export default class DiscordWebhooksPlugin extends Plugin {
  settings: DiscordWebhooksSettings;
  commands: Commands;

  async onload() {
    this.settings = Object.assign(
      {},
      DEFAULT_SETTINGS,
      (await this.loadData()) as DiscordWebhooksSettings
    );
    this.addSettingTab(new SettingsTab(this.app, this));

    this.commands = new Commands(this);
    this.commands.registerCommands();

    this.registerEvent(
      this.app.workspace.on('file-menu', menu => {
        menu.addItem(item => {
          item
            .setTitle('Share selected text to Discord')
            .setIcon('share')
            .onClick(async () => {
              const selectedText = activeDocument
                .getSelection()
                ?.toString()
                .trim();

              if (!selectedText) {
                new Notice('You need to select text first.');
                return;
              }

              if (!this.settings.selectedTextWebhookId) {
                new Notice(
                  'You need to select a webhook to use for sharing selected text first (check out plugin settings).'
                );
                return;
              }

              const webhookUrl = this.settings.isTesting
                ? this.settings.testWebhookUrl
                : this.settings.webhooks.find(
                    webhook =>
                      webhook.id === this.settings.selectedTextWebhookId
                  )!.url;
              await sendToDiscord(
                webhookUrl,
                JSON.stringify({
                  content: selectedText
                })
              );
            });
        });
      })
    );
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.commands.registerCommands();
  }
}
