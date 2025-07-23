import { createContext, useContext, useState } from "react";
import axios from "axios";

const VideoContext = createContext();

export const useVideo = () => useContext(VideoContext);

export const VideoProvider = ({ children }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const summarizeVideo = async (videoUrl) => {
    setLoading(true);
    const res = await axios.post("http://localhost:5050/api/videos/summarize", { videoUrl });
    setSummary(res.data.summary);
    setLoading(false);
  };

  return (
    <VideoContext.Provider value={{ summary, loading, summarizeVideo }}>
      {children}
    </VideoContext.Provider>
  );
};

