import { Plugin } from 'obsidian';
import { DiscordWebhooksSettings } from './types';
import DiscordWebhooksSettingTab from './DiscordWebhooksSettingTab';
import Commands from './Commands';

const DEFAULT_SETTINGS: DiscordWebhooksSettings = {
  webhooks: [],
  defaultWebhookId: '',
  messages: []
};

export default class DiscordWebhooksPlugin extends Plugin {
  settings: DiscordWebhooksSettings;
  commands: Commands;

  async onload() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    this.addSettingTab(new DiscordWebhooksSettingTab(this.app, this));

    this.commands = new Commands(this);
    this.commands.enable();
    this.commands.registerCommands();
  }

  onunload() {
    this.commands.disable();
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.commands.registerCommands();
  }
}
