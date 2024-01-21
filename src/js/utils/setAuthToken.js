import axios from "axios";

const setAuthToken = (token) => {
  if (token) {
    // apply to every request
    console.log("ayo");
    axios.defaults.headers.common["Authorization"] = token;
    
  } else {
    // delete auth header
    console.log('ayena')
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
