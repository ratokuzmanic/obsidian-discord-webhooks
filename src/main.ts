import { Plugin, Notice } from 'obsidian';
import { DiscordWebhooksSettings } from './types';
import SettingsTab from './SettingsTab';
import Commands from './Commands';

const DEFAULT_SETTINGS: DiscordWebhooksSettings = {
  webhooks: [],
  selectedTextWebhookId: '',
  messages: []
};

export default class DiscordWebhooksPlugin extends Plugin {
  settings: DiscordWebhooksSettings;
  commands: Commands;

  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.addSettingTab(new SettingsTab(this.app, this));

    this.commands = new Commands(this);
    this.commands.registerCommands();

    this.registerEvent(
      this.app.workspace.on('file-menu', menu => {
        menu.addItem(item => {
          item
            .setTitle('Share selected text to Discord')
            .setIcon('share')
            .onClick(() => {
              const selectedText = document.getSelection()?.toString().trim();

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

              const webhookUrl = this.settings.webhooks.find(
                webhook => webhook.id === this.settings.selectedTextWebhookId
              )!.url;
              fetch(webhookUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  content: selectedText
                })
              })
                .then(() => new Notice('Sent to Discord'))
                .catch(() => new Notice('Something went wrong'));
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
