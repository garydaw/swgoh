
export class ApiError extends Error {
  constructor(status, statusText) {
    super(`API returned ${status}${statusText ? `: ${statusText}` : ''}`);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiRequest(path, options = {}) {
  const configuredBaseUrl = process.env.API_BASE_URL;

  if (!configuredBaseUrl) {
    throw new Error('API_BASE_URL is not configured');
  }

  const baseUrl = configuredBaseUrl.replace(/\/+$/, '');
  const endpoint = path.replace(/^\/+/, '');

  const response = await fetch(`${baseUrl}/${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      Authorization: `Bearer ${process.env.DISCORD_API_SECRET}`
    }
  });

  if (!response.ok) {
    throw new ApiError(response.status, response.statusText);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
