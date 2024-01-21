export const isAuthenticated = () => {
    if (typeof window == "undefined") {
      return false;
    }
    if (localStorage.getItem("jwtToken")) {
      return localStorage.getItem("jwtToken");
    } else {
      return false;
    }
  };
  export const isAdmin = () => {
    if (typeof window == "undefined") {
      return false;
    }
    if (localStorage.getItem("isAdmin")) {
      return localStorage.getItem("isAdmin");
    } else {
      return false;
    }
  };