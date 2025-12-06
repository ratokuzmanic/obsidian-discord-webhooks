import { Notice } from 'obsidian';

export const sendToDiscord = async (
  url: string,
  payload: string
): Promise<void> => {
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload
    });
    new Notice('Sent to Discord');
  } catch {
    new Notice('Something went wrong');
  }
};
