import { Modal, Setting, App } from 'obsidian';
import { Message, Webhook } from '../../types';

export default class EditMessageModal extends Modal {
  private editedMessage: Message;

  constructor(
    app: App,
    private message: Message,
    private webhooks: Webhook[],
    private index: number,
    private onUpdate: (
      index: number,
      updates: Partial<Message>
    ) => Promise<void>
  ) {
    super(app);
    this.editedMessage = { ...this.message };
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createDiv({
      text: 'Edit message',
      cls: 'modal-title discord-webhooks'
    });
    const modalContent = contentEl.createDiv({ cls: 'modal-content' });

    new Setting(modalContent)
      .setName('Name')
      .setDesc(
        'A user-friendly name to reference a message. Will be used in a command.'
      )
      .addText(text =>
        text
          .setValue(this.editedMessage.name)
          .onChange(value => (this.editedMessage.name = value))
      );

    const options = Object.fromEntries(
      this.webhooks.map(webhook => [webhook.id, webhook.name])
    );

    new Setting(modalContent).setName('Webhook').addDropdown(dropdown => {
      dropdown
        .addOption('', 'Please select…')
        .addOptions(options)
        .setValue(this.editedMessage.webhookId)
        .onChange(id => {
          this.editedMessage.webhookId = id;
        });
    });

    new Setting(modalContent)
      .setName('JSON payload')
      .setDesc(
        "This will be sent as-is to the selected webhook URL. Must be valid according to Discord's current specification."
      )
      .addTextArea(text =>
        text
          .setValue(this.editedMessage.payload)
          .onChange(value => (this.editedMessage.payload = value))
      );

    const buttons = contentEl.createDiv({ cls: 'modal-button-container' });

    const saveButton = buttons.createEl('button', {
      text: 'Save',
      cls: 'mod-cta'
    });

    saveButton.addEventListener('click', e => {
      e.stopPropagation();
      void (async () => {
        await this.onUpdate(this.index, this.editedMessage);
        this.close();
      })();
    });

    const cancelButton = buttons.createEl('button', {
      text: 'Cancel',
      cls: 'mod-cancel'
    });

    cancelButton.addEventListener('click', e => {
      e.stopPropagation();
      this.close();
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
