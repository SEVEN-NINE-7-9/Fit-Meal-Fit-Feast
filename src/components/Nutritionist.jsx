import React, { useState, useEffect, useRef } from "react";
import { FaPaperclip, FaMicrophone } from "react-icons/fa";
import { startRecording } from "../utils/recorder";

export default function Nutritionist() {
  const [chat, setChat] = useState([
    {
      id: 0,
      sender: "bot",
      text: `Hello! I am Fitmeal AI, your personal nutritionist. How can I assist you today?`,
    },
  ]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");

  const chatEndRef = useRef(null);
  const recorderRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (recorderRef.current) recorderRef.current.stop();
    };
  }, []);

  const typeBotMessage = (fullText, delay = 20) =>
    new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        setChat((prev) => {
          const copy = [...prev];
          copy[copy.length - 1].text = fullText.slice(0, i);
          return copy;
        });

        i++;
        if (i > fullText.length) {
          clearInterval(interval);
          resolve();
        }
      }, delay);
    });

  const sendMessage = async () => {
    if (!message.trim()) return;

    const msg = message;
    setError("");
    setChat((p) => [...p, { id: Date.now(), sender: "user", text: msg }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await res.json();
      const reply = data.reply;

      setChat((p) => [...p, { id: Date.now(), sender: "bot", text: "" }]);
      await typeBotMessage(reply);
      playAudio(reply);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
      setChat((p) => [
        ...p,
        { id: Date.now(), sender: "bot", text: `Sorry, something went wrong: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setChat((p) => [...p, { id: Date.now(), sender: "user", text: "📸 Analyzing image..." }]);

    try {
      const form = new FormData();
      form.append("image", file);

      const res = await fetch("http://localhost:5000/analyze-image", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to analyze image");
      }

      const data = await res.json();
      const reply = data.calories;

      setChat((p) => [...p, { id: Date.now(), sender: "bot", text: "" }]);
      await typeBotMessage(reply);
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError(err.message);
      setChat((p) => [
        ...p,
        { id: Date.now(), sender: "bot", text: `Could not analyze image: ${err.message}` },
      ]);
    }
  };

  const handleVoice = async () => {
    if (recording || recorderRef.current) return;

    try {
      setError("");
      setRecording(true);
      const recorder = await startRecording();
      recorderRef.current = recorder;

      timeoutRef.current = setTimeout(async () => {
        try {
          if (recorderRef.current) {
            const audioBlob = await recorderRef.current.stop();
            recorderRef.current = null;

            const form = new FormData();
            form.append("audio", audioBlob);

            const res = await fetch("http://localhost:5000/stt", {
              method: "POST",
              body: form,
            });

            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.error || "Speech-to-text failed");
            }

            const data = await res.json();
            setMessage(data.text || "");
          }
        } catch (err) {
          console.error("Error processing audio:", err);
          setError(err.message);
        } finally {
          setRecording(false);
        }
      }, 4000);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError(err.message);
      setRecording(false);
      recorderRef.current = null;
    }
  };

  const playAudio = async (text) => {
    try {
      const res = await fetch("http://localhost:5000/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        console.warn("TTS failed");
        return;
      }

      const data = await res.json();
      if (!data.audio_base64) {
        console.warn("No audio data returned");
        return;
      }

      const audioUrl = "data:audio/mp3;base64," + data.audio_base64;
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => console.warn("Playback failed:", err));
    } catch (err) {
      console.warn("Error playing audio:", err);
    }
  };

  return (
    <>
      <style>{`
        .page {
          min-height: 100vh;
          background: #f0fdf4;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        .heading {
          font-size: 32px;
          font-weight: bold;
        }
        .green-text {
          color: #16a34a;
        }
        .chat-box {
          background: white;
          width: 100%;
          max-width: 750px;
          margin-top: 20px;
          padding: 20px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .chat-window {
          height: 380px;
          overflow-y: auto;
          background: #f5f5f5;
          padding: 12px;
          border-radius: 12px;
        }
        .msg {
          padding: 12px;
          margin: 10px 0;
          border-radius: 14px;
          max-width: 70%;
          line-height: 1.4;
          font-size: 14px;
        }
        .user-msg {
          background: #bbf7d0;
          margin-left: auto;
        }
        .bot-msg {
          background: white;
          margin-right: auto;
        }
        .input-area {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        .file-btn {
          padding: 12px;
          background: #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
        }
        .text-input {
          flex: 1;
          padding: 10px;
          border: 1px solid gray;
          border-radius: 8px;
        }
        .send-btn {
          background: #16a34a;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
        }
        .error-msg {
          color: #dc2626;
          font-size: 12px;
          margin-top: 5px;
        }
        .recording-indicator {
          color: #dc2626;
          font-weight: bold;
          margin-left: 5px;
        }
      `}</style>
      <br />
      <br />
      <br />
      <div className="page">
        <h1 className="heading">
          Fitmeal <span className="green-text">AI</span>
        </h1>

        <div className="chat-box">
          <div className="chat-window">
            {chat.map((msg) => (
              <div
                key={msg.id}
                className={`msg ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}
              >
                {msg.text}
              </div>
            ))}

            {loading && <p><i>Typing...</i></p>}
            {recording && <p><i className="recording-indicator">🔴 Recording...</i></p>}
            <div ref={chatEndRef} />
          </div>

          {error && <div className="error-msg">⚠️ {error}</div>}

          <div className="input-area">
            <label className="file-btn">
              <FaPaperclip />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImage}
                disabled={loading || recording}
              />
            </label>

            <input
              className="text-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask something..."
              disabled={loading || recording}
            />

            <button
              onClick={handleVoice}
              disabled={loading}
              style={{
                background: recording ? "#dc2626" : "#16a34a",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
              title={recording ? "Recording..." : "Start recording"}
            >
              <FaMicrophone />
            </button>

            <button
              onClick={sendMessage}
              className="send-btn"
              disabled={loading || recording || !message.trim()}
              style={{
                opacity: loading || recording || !message.trim() ? 0.6 : 1,
                cursor: loading || recording || !message.trim() ? "not-allowed" : "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}