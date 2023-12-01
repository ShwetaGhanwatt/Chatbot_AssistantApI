import { useState } from "react";
import axios from "axios";

const backend = process.env.REACT_APP_BACKEND;
console.log("backend",backend)
const openai = process.env.REACT_APP_OPENAI;
export const getAllAssistant = (userId) => {
  let assistants = []
  console.log(`${backend}/getuserAssistant?user_id=${userId}`)
  axios.get(`${backend}/getuserAssistant?user_id=${userId}`).then((response) => {
    console.log(response.data.assistant_objects);
  })
  axios.get(`${backend}/getAssistant`).then((response) => {
    console.log(response.data);
  })

}





