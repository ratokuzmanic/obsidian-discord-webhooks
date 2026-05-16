import { setIcon } from 'obsidian';
import DiscordWebhooksPlugin from '../../main';
import EditMessageModal from '../modals/EditMessage';
import { Webhook, Message } from '../../types';

export default class MessagesSection {
  constructor(
    private plugin: DiscordWebhooksPlugin,
    private refresh: () => void
  ) {}

  private openEditMessageModal(
    message: Message,
    webhooks: Webhook[],
    index: number
  ) {
    const modal = new EditMessageModal(
      this.plugin.app,
      message,
      webhooks,
      index,
      (index, updates) => this.saveMessageChanges(index, updates)
    );
    modal.open();
  }

  private async saveMessageChanges(index: number, updates: Partial<Message>) {
    this.plugin.settings.messages[index] = {
      ...this.plugin.settings.messages[index],
      ...updates
    };
    await this.plugin.saveSettings();
    this.refresh();
  }

  display(containerEl: HTMLElement) {
    const header = containerEl.createDiv('setting-item setting-item-heading');
    header.createDiv({ text: 'Messages', cls: 'setting-item-info' });

    const addButton = header
      .createDiv('setting-item-control')
      .createEl('button', {
        cls: 'clickable-icon extra-setting-button',
        attr: { 'aria-label': 'Add message' }
      });
    setIcon(addButton, 'circle-plus');

    addButton.onclick = async e => {
      e.stopPropagation();
      const newMessage: Message = {
        id: crypto.randomUUID(),
        name: 'New Message',
        webhookId: '',
        payload: ''
      };
      this.plugin.settings.messages.push(newMessage);
      await this.plugin.saveSettings();

      this.openEditMessageModal(
        newMessage,
        this.plugin.settings.webhooks,
        this.plugin.settings.messages.length - 1
      );

      this.refresh();
    };

    const list = containerEl.createDiv('discord-webhooks-list');

    if (this.plugin.settings.messages.length === 0) {
      list.createDiv({
        text: "You don't have any saved messages. Start by adding one.",
        cls: 'mobile-option-setting-item'
      });
      return;
    }

    this.plugin.settings.messages.forEach((message, index) => {
      const item = list.createDiv('discord-webhooks-item');
      item.addClass('setting-item');

      const info = item.createDiv('setting-item-info');
      info.createDiv('setting-item-name').setText(message.name);

      const controls = item.createDiv('setting-item-control');

      const editButton = controls.createEl('button', {
        cls: 'clickable-icon',
        attr: { 'aria-label': 'Edit message' }
      });
      setIcon(editButton, 'pencil');
      editButton.onclick = e => {
        e.stopPropagation();
        this.openEditMessageModal(
          message,
          this.plugin.settings.webhooks,
          index
        );
      };

      const deleteButton = controls.createEl('button', {
        cls: 'clickable-icon',
        attr: { 'aria-label': 'Delete message' }
      });
      setIcon(deleteButton, 'trash');
      deleteButton.onclick = async e => {
        e.stopPropagation();
        this.plugin.settings.messages.splice(index, 1);
        await this.plugin.saveSettings();
        this.refresh();
      };
    });
  }
}
