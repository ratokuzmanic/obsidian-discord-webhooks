export interface DiscordWebhooksSettings {
  webhooks: Webhook[];
  messages: Message[];
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
}

export interface Message {
  webhookId: string;
  payload: string | JSON;
}
