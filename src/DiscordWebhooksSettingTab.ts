import { App, PluginSettingTab, setIcon } from 'obsidian';
import DiscordWebhooksPlugin from './main';
import { WebhookModal } from './WebhookModal';
import { Webhook } from './types';

export default class DiscordWebhooksSettingTab extends PluginSettingTab {
    plugin: DiscordWebhooksPlugin;

    constructor(app: App, plugin: DiscordWebhooksPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    private addSettingsHeader(
        containerEl: HTMLElement,
        title: string,
        buttonAriaLabel: string,
        onAdd: () => void
    ): void {
        const heading = containerEl.createDiv({
            cls: 'setting-item setting-item-heading'
        });

        heading.createEl('div', {
            text: title,
            cls: 'setting-item-info'
        });

        const controls = heading.createEl('div', {
            cls: 'setting-item-control'
        });
        const addButton = controls.createEl('button', {
            cls: 'clickable-icon extra-setting-button',
            attr: {
                'aria-label': buttonAriaLabel
            }
        });
        setIcon(addButton, 'circle-plus');
        addButton.addEventListener('click', async (e) => {
            e.stopPropagation();
            onAdd();
        });
    }

    private openWebhookModal(webhook: Webhook, index: number): void {
        const modal = new WebhookModal(
            this.app,
            webhook,
            index,
            this.updateWebhook.bind(this)
        );
        modal.open();
    }

    private async updateWebhook(index: number, updates: Partial<Webhook>): Promise<void> {
        this.plugin.settings.webhooks[index] = {
            ...this.plugin.settings.webhooks[index],
            ...updates
        };
        await this.plugin.saveSettings();
        this.display();
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        this.addSettingsHeader(
            containerEl,
            'Webhooks',
            'Add webhook',
            async () => {
                const newWebhook: Webhook = {
                    id: crypto.randomUUID(),
                    name: 'New Webhook',
                    url: ''
                };
                this.plugin.settings.webhooks.push(newWebhook);
                await this.plugin.saveSettings();

                this.openWebhookModal(newWebhook, this.plugin.settings.webhooks.length - 1);
                this.display();
            }
        );

        const webhooksList = containerEl.createDiv('webhooks-list');

        if (this.plugin.settings.webhooks.length === 0) {
            webhooksList.createEl('div', {
                text: "You don't have any saved webhooks, start by adding the first one.",
                cls: 'mobile-option-setting-item'
            });
        }

        this.plugin.settings.webhooks.forEach((webhook, index) => {
            const webhookContainer = webhooksList.createDiv('webhook-item');
            webhookContainer.addClass('setting-item');

            const info = webhookContainer.createDiv('setting-item-info');
            const title = info.createDiv('setting-item-name');
            title.setText(webhook.name || 'Unnamed Webhook');

            const control = webhookContainer.createDiv('setting-item-control');
            control.style.display = 'flex';
            control.style.alignItems = 'center';
            control.style.gap = '8px';

            const editButton = control.createEl('button', {
                cls: 'clickable-icon',
                attr: {
                    'aria-label': 'Edit webhook'
                }
            });
            setIcon(editButton, 'pencil');

            editButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openWebhookModal(webhook, index);
            });

            const deleteButton = control.createEl('button', {
                cls: 'clickable-icon',
                attr: {
                    'aria-label': 'Delete webhook'
                }
            });
            setIcon(deleteButton, 'trash');

            deleteButton.addEventListener('click', async (e) => {
                e.stopPropagation();
                this.plugin.settings.webhooks.splice(index, 1);
                await this.plugin.saveSettings();
                this.display();
            });
        });
    }
};
