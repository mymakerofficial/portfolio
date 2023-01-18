import {H3Event, send} from "h3";

export interface MediaFromUrlResponse {
    contentType: string,
    blob: Blob,
}
export const loadMediaFromUrl = async (url: string): Promise<MediaFromUrlResponse> => {
    const response = await fetch(url).then(response => {
        return response.blob().then((blob): MediaFromUrlResponse => {
            return {
                contentType: response.headers.get("Content-Type") || '',
                blob: blob,
            }
        })
    });

    if (!response || !response.blob || !response.contentType) {
        throw new Error('Error fetching media');
    }

    return response;
}

export const h3SendMediaFromUrl = async (event: H3Event, url: string) => {
    const response = await loadMediaFromUrl(url);

    return send(event, Buffer.from(await response.blob.arrayBuffer()), response.contentType);
}