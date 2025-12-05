import { setIcon } from 'obsidian';
import DiscordWebhooksPlugin from '../../main';
import EditWebhookModal from '../modals/EditWebhook';
import { Webhook } from '../../types';

export default class WebhookSection {
  constructor(
    private plugin: DiscordWebhooksPlugin,
    private refresh: () => void
  ) {}

  private openEditWebhookModal(webhook: Webhook, index: number) {
    const modal = new EditWebhookModal(
      this.plugin.app,
      webhook,
      index,
      this.saveWebhookChanges.bind(this)
    );
    modal.open();
  }

  private async saveWebhookChanges(index: number, updates: Partial<Webhook>) {
    this.plugin.settings.webhooks[index] = {
      ...this.plugin.settings.webhooks[index],
      ...updates
    };
    await this.plugin.saveSettings();
    this.refresh();
  }

  display(containerEl: HTMLElement) {
    const header = containerEl.createDiv('setting-item setting-item-heading');
    header.createDiv({ text: 'Webhooks', cls: 'setting-item-info' });

    const addButton = header
      .createDiv('setting-item-control')
      .createEl('button', {
        cls: 'clickable-icon extra-setting-button',
        attr: { 'aria-label': 'Add Webhook' }
      });
    setIcon(addButton, 'circle-plus');

    addButton.onclick = async e => {
      e.stopPropagation();
      const newWebhook: Webhook = {
        id: crypto.randomUUID(),
        name: 'New Webhook',
        url: ''
      };
      this.plugin.settings.webhooks.push(newWebhook);
      await this.plugin.saveSettings();

      this.openEditWebhookModal(
        newWebhook,
        this.plugin.settings.webhooks.length - 1
      );

      this.refresh();
    };

    const list = containerEl.createDiv('discord-webhooks-list');

    if (this.plugin.settings.webhooks.length === 0) {
      list.createEl('div', {
        text: "You don't have any saved webhooks. Start by adding one.",
        cls: 'mobile-option-setting-item'
      });
      return;
    }

    this.plugin.settings.webhooks.forEach((webhook, index) => {
      const item = list.createDiv('discord-webhooks-item');
      item.addClass('setting-item');

      const info = item.createDiv('setting-item-info');
      info.createDiv('setting-item-name').setText(webhook.name);

      const controls = item.createDiv('setting-item-control');

      const editButton = controls.createEl('button', {
        cls: 'clickable-icon',
        attr: { 'aria-label': 'Edit webhook' }
      });
      setIcon(editButton, 'pencil');
      editButton.onclick = e => {
        e.stopPropagation();
        this.openEditWebhookModal(webhook, index);
      };

      const deleteButton = controls.createEl('button', {
        cls: 'clickable-icon',
        attr: { 'aria-label': 'Delete webhook' }
      });
      setIcon(deleteButton, 'trash');
      deleteButton.onclick = async e => {
        e.stopPropagation();

        if (this.plugin.settings.selectedTextWebhookId === webhook.id) {
          this.plugin.settings.selectedTextWebhookId = '';
        }

        this.plugin.settings.webhooks.splice(index, 1);
        await this.plugin.saveSettings();
        this.refresh();
      };
    });
  }
}
