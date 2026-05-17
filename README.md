# Discord Webhooks Plugin

![Made for Obsidian](https://img.shields.io/badge/Made%20for-Obsidian-483699?logo=obsidian)
![Code Style: Prettier](https://img.shields.io/badge/Code%20Style-Prettier-F7B93E?logo=prettier)

Save your [Discord](https://discord.com/) webhooks and use them to send selected text from the editor/preview or send preset messages (including rich embeds) to your Discord server.

## Features

➕ **Add, edit, and delete Discord webhooks** for easy reuse—no need to constantly enter webhook URLs.  
🎯 **Choose a default webhook** for sending selected text directly from the editor or preview via the editor menu.  
💬 **Create, edit, and delete preset messages** (including rich embeds) that can be sent through any saved webhook.  
⚡ **Send preset messages via Obsidian commands** with one command per message (works great with the [Buttons plugin](https://community.obsidian.md/plugins/buttons)).

## How to use

### Setting up webhooks

1. Open the plugin settings.
2. Click the `+` icon to create a new webhook.
3. Create a Discord webhook (see the [official guide](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks)) and copy its URL.
4. Name your webhook in the modal window and paste the URL. The name makes it easier to identify (e.g., **General** for your `#general` channel).
5. Click **Save**.

### Choosing a webhook for selected text

1. Open the plugin settings.
2. If you haven't added a webhook yet, create one following the steps above.
3. Select a webhook from the dropdown menu to use when sending selected text.

> **Note:** If you delete the chosen webhook, you'll need to select a new one before sending selected text again.

### Setting up messages

1. Open the plugin settings.
2. Click the `+` icon to create a new message.
3. Name your message—this name will appear in the command palette.
4. Select a webhook from the dropdown to send this message's payload.
5. Provide a JSON payload compatible with [Discord's message specification](https://discord.com/developers/docs/resources/webhook#execute-webhook).
   - Tools like [Discohook](https://discohook.app/) are great for building and previewing JSON.
6. Click **Save**.

> **Warning:** If you delete the chosen webhook, the message will be deleted as well.

### Sending content to Discord

#### Sending selected text

1. Open any note (editor or preview mode).
2. Select a chunk of text.
3. Open the editor menu (top right) and choose **Share selected text to Discord**.
4. The selected text will be sent as a webhook message.

#### Sending a saved message

1. Open the **Command Palette**.
2. Choose **Discord Webhooks: Send [Message name] message to Discord**.
3. The preset JSON payload will be sent via the selected webhook.

_Crafted entirely by a human without the use of generative AI._
