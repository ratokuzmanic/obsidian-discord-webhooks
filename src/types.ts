export interface DiscordWebhooksSettings {
  webhooks: Webhook[];
  selectedTextWebhookId: string;
  messages: Message[];
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
}

export interface Message {
  id: string;
  name: string;
  webhookId: string;
  payload: string;
}
