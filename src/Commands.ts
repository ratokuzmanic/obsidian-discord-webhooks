import { MarkdownView, Notice } from 'obsidian';
import DiscordWebhooksPlugin from './main';

export default class Commands {
  private plugin: DiscordWebhooksPlugin;
  private registeredCommands: Set<string>;
  private lastTextSelection: string = '';

  constructor(plugin: DiscordWebhooksPlugin) {
    this.plugin = plugin;
    this.registeredCommands = new Set();
  }

  enable() {
    document.addEventListener('selectionchange', this.captureSelection);
  }

  disable() {
    document.removeEventListener('selectionchange', this.captureSelection);
  }

  private captureSelection = () => {
    const view = this.plugin.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view || view.getMode() !== 'preview') {
      return;
    }

    const preview = view.containerEl.querySelector(
      '.markdown-preview-view, .markdown-reading-view'
    );
    if (!preview) return;

    const selection = document.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!preview.contains(range.commonAncestorContainer)) return;

    const text = selection.toString().trim();
    this.lastTextSelection = text;
  };

  registerCommands(): void {
    this.unregisterCommands();

    if (this.plugin.settings.defaultWebhookId !== '') {
      const selectionCommandId = `discord-webhooks-selection`;
      const webhook = this.plugin.settings.webhooks.find(
        webhook => webhook.id === this.plugin.settings.defaultWebhookId
      )!;
      this.plugin.addCommand({
        id: selectionCommandId,
        name: `Send selected text to Discord using "${webhook.name}" webhook`,
        checkCallback: (checking: boolean) => {
          if (this.lastTextSelection) {
            if (!checking) {
              fetch(webhook.url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  content: this.lastTextSelection
                })
              })
                .then(() => new Notice('Sent to Discord'))
                .catch(() => new Notice('Something went wrong'));
            }
            return true;
          }
          return false;
        }
      });
      this.registeredCommands.add(selectionCommandId);
    }
  }

  unregisterCommands(): void {
    this.registeredCommands.forEach(commandId =>
      this.plugin.app.commands.removeCommand(`discord-webhooks:${commandId}`)
    );
    this.registeredCommands.clear();
  }
}
