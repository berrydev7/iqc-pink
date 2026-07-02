"use client";

import { useState } from "react";
import { Sparkles, Download, ImageIcon, RefreshCw } from "lucide-react";

export default function Home() {
  const [text, setText] = useState("Kesendirian adalah teman terbaik ku😂😂");
  const [time, setTime] = useState("22.54");
  const [bubbleColor, setBubbleColor] = useState("#ffc5d5");
  const [textColor, setTextColor] = useState("#111111");
  
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, time, bubbleColor, textColor }),
      });

      if (!res.ok) {
        let errText = await res.text();
        let errMsg = `Error ${res.status}: `;
        try {
            const parsed = JSON.parse(errText);
            if (parsed.details) {
                errMsg += parsed.details;
            } else if (parsed.error) {
                errMsg += parsed.error;
            } else {
                errMsg += errText;
            }
        } catch(e) {
            errMsg += errText;
        }
        // slice to avoid massive HTML error dumps from Next.js, but keep enough info
        throw new Error(errMsg.slice(0, 200) + (errMsg.length > 200 ? "..." : ""));
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>IQC Generator</h1>
        <p className="subtitle">Create aesthetic iPhone chat quotes in seconds ✨</p>
      </header>

      <main className="main-content">
        <section className="glass-panel form-section">
          <h2>Customize</h2>
          <form onSubmit={handleGenerate} className="form-group">
            <div className="form-group">
              <label htmlFor="text">Message Text</label>
              <input
                id="text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your message..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Time</label>
              <input
                id="time"
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 22.54"
                required
              />
            </div>

            <div className="color-pickers">
              <div className="form-group">
                <label>Bubble Color</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={bubbleColor}
                    onChange={(e) => setBubbleColor(e.target.value)}
                  />
                  <span>{bubbleColor}</span>
                </div>
              </div>
              <div className="form-group">
                <label>Text Color</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                  />
                  <span>{textColor}</span>
                </div>
              </div>
            </div>

            {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

            <button type="submit" className="btn-generate" disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="loader-icon" size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Quote
                </>
              )}
            </button>
          </form>
        </section>

        <section className="glass-panel preview-section">
          <h2>Preview</h2>
          <div className="preview-area">
            {loading ? (
              <div className="loader"></div>
            ) : imageUrl ? (
              <>
                <img src={imageUrl} alt="Generated Quote" className="preview-image" />
                <a href={imageUrl} download="iqc-quote.png" className="btn-download">
                  <Download size={20} />
                  Download Image
                </a>
              </>
            ) : (
              <div className="placeholder">
                <ImageIcon size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
                <p>Your generated image will appear here.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
