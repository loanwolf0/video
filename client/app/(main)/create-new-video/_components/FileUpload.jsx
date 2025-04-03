import { generateScript } from "@/configs/AiModel";
import axios from "axios";
import { useState } from "react";

export default function UploadFile({onHandleInputChange}) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

//   onClick={() => { setSelectedTopic(suggestion), onHandleInputChange('topic', suggestion) }}

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setUploading(true);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const {data} =  await axios.post('/api/supabase-upload', formData)

      if (data.error) throw new Error(data.error);

      setFileUrl(data.url);
      onHandleInputChange('audio', data.url)
      alert("Upload successful!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed! Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {fileUrl && (
        <p>
          Uploaded: <a href={fileUrl} target="_blank">{fileUrl}</a>
        </p>
      )}
    </div>
  );
}
