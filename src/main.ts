import { Plugin } from 'obsidian';
import { DiscordWebhooksSettings } from './types';
import DiscordWebhooksSettingTab from './DiscordWebhooksSettingTab';

const DEFAULT_SETTINGS: DiscordWebhooksSettings = {
  webhooks: [],
  messages: []
};

export default class DiscordWebhooksPlugin extends Plugin {
  settings: DiscordWebhooksSettings;

  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.addSettingTab(new DiscordWebhooksSettingTab(this.app, this));
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
