const API_URL= "http://localhost:5000/api/"

export const apiRequest = async (endpoint, method = 'GET', data = null) => {

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message;
      throw new Error(errorMessage || 'Request failed');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
