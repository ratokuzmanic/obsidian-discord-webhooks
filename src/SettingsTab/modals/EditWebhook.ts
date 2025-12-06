import { Modal, Setting, App } from 'obsidian';
import { Webhook } from '../../types';

export default class EditWebhookModal extends Modal {
  private editedWebhook: Webhook;

  constructor(
    app: App,
    private webhook: Webhook,
    private index: number,
    private onUpdate: (
      index: number,
      updates: Partial<Webhook>
    ) => Promise<void>
  ) {
    super(app);
    this.editedWebhook = Object.create(this.webhook);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createDiv({
      text: 'Edit webhook',
      cls: 'modal-title discord-webhooks'
    });
    const modalContent = contentEl.createDiv({ cls: 'modal-content' });

    new Setting(modalContent)
      .setName('Webhook name')
      .setDesc('Enter a user-friendly name to differentiate webhooks')
      .addText(text =>
        text
          .setValue(this.editedWebhook.name)
          .onChange(value => (this.editedWebhook.name = value))
      );

    new Setting(modalContent)
      .setName('Webhook URL')
      .addText(text =>
        text
          .setValue(this.editedWebhook.url)
          .onChange(value => (this.editedWebhook.url = value))
      );

    const buttons = contentEl.createDiv({ cls: 'modal-button-container' });

    const saveButton = buttons.createEl('button', {
      text: 'Save',
      cls: 'mod-cta'
    });

    saveButton.addEventListener('click', e => {
      e.stopPropagation();
      void (async () => {
        await this.onUpdate(this.index, this.editedWebhook);
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
