import React, { useState } from "react";
import axios from "axios";

const NASA_API_KEY = "DEMO_KEY"; // Din API-nøkkel

// Tilfeldig dato mellom 2010 og i dag
const getRandomDate = () => {
  const start = new Date(2010, 0, 1);
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().split("T")[0];
};

const Bilder = () => {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Hent tilfeldig bilde fra APOD
  const fetchRandomImage = async () => {
    setLoading(true);
    try {
      const date = getRandomDate();
      const res = await axios.get(
        `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${date}`
      );
      if (res.data.media_type === "image") {
        setImages([res.data]);
      } else {
        fetchRandomImage();
      }
    } catch (error) {
      console.error("Feil:", error);
    } finally {
      setLoading(false);
    }
  };

  // Søk etter bilder via tekst
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://images-api.nasa.gov/search?q=${encodeURIComponent(searchTerm)}&media_type=image`);
      const items = res.data.collection.items;
      const formatted = items.map(item => ({
        url: item.links[0].href,
        title: item.data[0].title,
        description: item.data[0].description
      }));
      setImages(formatted);
    } catch (error) {
      console.error("Feil:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>NASA Bilder</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Skriv f.eks. Jupiter"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", width: "200px" }}
        />
        <button onClick={handleSearch} style={{ marginLeft: "1rem" }}>
          Søke
        </button>
        <button onClick={fetchRandomImage} style={{ marginLeft: "1rem" }}>
          Tilfeldig bilde
        </button>
      </div>

      {loading && <p>Laster inn...</p>}

      <div>
        {images.map((img, idx) => (
          <div key={idx} style={{ marginBottom: "2rem" }}>
            <img src={img.url} alt={img.title || "NASA bilde"} style={{ maxWidth: "100%" }} />
            <h4>{img.title}</h4>
            <p>{img.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bilder;
