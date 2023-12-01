import "./chat.css"
import mobius from "../images/mobius.png"
import { getAllAssistant } from "../utils/allAssistants";
import { useState } from "react";
const Chatbot = () => {
    const [userId,setUserId] = useState("xyz")
    getAllAssistant(userId)
    return (
        <div className="container">
          <div className="left-panel">
            <div className="left-top">
            <img src={mobius} alt="Mobius" />
            
            <div>New Chat</div>
            </div>
            
          </div>
          <div className="right-panel">
            <div className="upper-right">
            <div>
                <label htmlFor="chatDropdown"></label>
                <select id="chatDropdown">
                    <option value="select">Select Layer</option>
                    <option value="pi">PI</option>
                    <option value="bob">BOB</option>
                    <option value="hrms">HRMS</option>
                    <option value="monet">MONET</option>
                </select>
            </div>
            </div>
            <div className="lower-right">
                <input type="text" id="query"/>
                <button className="">Send</button>
            </div>
          </div>
        </div>
      );
}
export default Chatbot