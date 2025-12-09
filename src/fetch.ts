import { Notice, requestUrl } from 'obsidian';

export const sendToDiscord = async (
  url: string,
  payload: string
): Promise<void> => {
  try {
    await requestUrl({
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: payload
    });
    new Notice('Sent to Discord');
  } catch (e) {
    console.error(e);
    new Notice('Could not send to Discord');
  }
};
