
import { POLLINATIONS_BASE_URL, HARDCODED_POLLINATIONS_KEY } from '../constants';

export const generatePollinationsImage = async (
  prompt: string,
  seed: number
): Promise<{ url: string; blob: Blob }> => {
  const encodedPrompt = encodeURIComponent(prompt);
  
  /**
   * FIX: "Failed to fetch" is typically a CORS error caused by the 'Authorization' header 
   * in a browser environment when the server doesn't explicitly allow it in the OPTIONS preflight.
   * 
   * To fix this while still using the key, we move the API key to a query parameter.
   * This allows the browser to perform a simple GET request without a preflight check.
   */
  const url = `${POLLINATIONS_BASE_URL}${encodedPrompt}?width=1024&height=1408&nologo=true&model=flux&seed=${seed}&auth=${HARDCODED_POLLINATIONS_KEY}`;
  
  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Pollinations API Error (${response.status}): ${errorText || response.statusText}`);
  }

  // Retrieve the binary image data.
  const blob = await response.blob();
  // Create a local object URL to display the image immediately.
  const blobUrl = URL.createObjectURL(blob);
  
  return { url: blobUrl, blob };
};

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
