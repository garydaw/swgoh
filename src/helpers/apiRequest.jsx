const API_URL= import.meta.env.VITE_API_URL;

export const apiRequest = async (endpoint, auth, method, data = null) => {
  
  if(auth && !JSON.parse(localStorage.getItem('isLoggedIn'))){
    return [];
  } else {
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
  }
};
