export interface DiscordWebhooksSettings {
  webhooks: Webhook[];
  selectedTextWebhookId: string;
  messages: Message[];
  isTesting: boolean;
  testWebhookUrl: string;
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
