export const useHttpClient = () => {
  const fetch = async (url, options) => {
    const res = await window.fetch(url, {
      ...options,
      next: {
        revalidate: 300
      }
    });

    // GUEST MODE: Don't redirect to login on 401
    if (res.status === 401) {
      console.log('Guest Mode: 401 error, but not redirecting to login');
      // Still return the response for error handling
    }

    return res;
  };

  return {
    fetch
  };
};
