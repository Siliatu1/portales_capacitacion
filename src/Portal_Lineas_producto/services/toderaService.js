import axios from "axios";

export const guardarTodera = async (data) => {

  return axios.post(
    "https://macfer.crepesywaffles.com/api/cap-toderas",
    {
      data
    }
  );

};