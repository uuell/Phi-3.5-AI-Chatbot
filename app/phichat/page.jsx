"use client";

import { useState, useEffect, useRef } from "react";
import {handleSendMessage} from "../lib/action";
import Image from "next/image.js";
import send from "../send.png";
import styles from "./page.module.css";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the chat history whenever it updates
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSend = () => {
    handleSendMessage(inputText, chatHistory, setChatHistory, setInputText, setIsLoading);
  }

  return (
    <>
      <div className={styles.logoContainer}>
        <h3>Phi-3.5</h3>
        <div className={styles.logoMicrosoft}>Mircrosoft</div>
      </div>
      <div className={styles.container}>
        {
          chatHistory.length === 0 ? <h1 className={styles.header}>Hello, Ask Me Anything</h1> : null
        }
        <div className={styles.chatContainer} ref={chatContainerRef}>
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`
                ${styles.message} 
                ${styles[message.role]} 
              `}
            >
              <div className={`
                ${message.role === "user" ? styles["message-user-input"] : styles["message-user-output"]}
              `}>
                {message.content}
              </div>
            </div>
          ))}
          {
            isLoading && (
              <div className={styles.dots}></div>
            ) 
          }
        </div>
        <div className={styles.inputContainer}>
          <textarea
            name="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Phi"
            className={styles.input}
            rows={2}
          />
            <Image 
              src={send}
              alt="Send"
              width={20}
              height={20}
              className={styles.button}
              onClick={handleSend}
            />
        </div>

      </div>
    </>
  );
}
