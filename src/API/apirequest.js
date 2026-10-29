const apiRequest = async (endpoint, options = {}) => {
  try {
    const URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        error: data.error || "SERVER_ERROR",
        message: data.message,
      };
    }

    return data;
  } catch (error) {
    if (error.status && error.error) {
      throw error;
    }

    throw {
      status: 0,
      error: "NETWORK_ERROR",
      message: "تعذر الاتصال بالخادم. تأكد من تشغيل الباك إند وحاول مرة أخرى.",
    };
  }
};

export default apiRequest;
