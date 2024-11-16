import toast from "react-hot-toast";

const wrapAsync = (asyncFunction) => {
    return async (...args) => {
      try {
        // Call the async function and pass the arguments
        await asyncFunction(...args);
      } catch (error) {
        // Handle error (e.g., log it, show a notification, etc.)
        console.error('An error occurred:', error);
        toast.error('An error occurred. Please try again later.');
      }
    };
  };

export default wrapAsync;