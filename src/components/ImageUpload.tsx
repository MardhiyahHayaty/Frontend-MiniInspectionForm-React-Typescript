import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./ImageUpload.css";

interface ImageData {
  file: File;
  preview: string;
  label: string;
}

const ImageUpload: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      let newImages: ImageData[] = [...images];

      for (let i = 0; i < files.length; i++) {
        newImages.push({ file: files[i], preview: URL.createObjectURL(files[i]), label: "" });
      }

      setImages(newImages);
      event.target.value = ""; // Reset input file to prevent filename display
    }
  };

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    let newImages = [...images];
    newImages[index].label = event.target.value;
    setImages(newImages);
  };

  const handleRemoveImage = (index: number) => {
    let newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleImageClick = (imageUrl: string) => {
    Swal.fire({
      imageUrl: imageUrl,
      imageWidth: 600, // Lebar gambar dalam popup
      imageAlt: "Preview Gambar",
      showConfirmButton: false, // Tidak perlu tombol OK
      background: "#f3fcff", // Warna background
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (images.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Gagal Upload!",
        text: "Harap unggah minimal satu gambar!",
      });
      return;
    }

    //Cek apakah ada label yg kosong
    const emptyLabelIndex = images.findIndex((img) => img.label.trim() === "");
    if (emptyLabelIndex !== -1) {
      Swal.fire({
        icon: "error",
        title: "Label Kosong!",
        text: `Gagal upload! Label untuk gambar ke-${emptyLabelIndex + 1} belum diisi.`,
      });
      return;
    }

    const formData = new FormData();
    images.forEach((img, index) => {
      formData.append("images[]", img.file);
      formData.append("labels[]", img.label);
    });

    try {
      await axios.post("http://127.0.0.1:8000/api/inspection", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Upload Sukses!",
        text: "Semua gambar berhasil diunggah!",
      });

      setImages([]); // Reset setelah upload
    } catch (error) {
      console.error("Error uploading images:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Upload!",
        text: "Terjadi kesalahan saat mengunggah gambar. Silakan coba lagi.",
      });
    }
  };

  return (
    <div className="container">
      <h2>Form Upload Inspeksi</h2>
      <form onSubmit={handleSubmit}>
        {images.map((image, index) => (
          <div key={index} className="image-field">
            <img src={image.preview} alt="Preview" className="preview" onClick={() => handleImageClick(image.preview)} style={{ cursor: "pointer" }}/>
            <input
              type="text"
              placeholder="Tambahkan label..."
              value={image.label}
              onChange={(e) => handleLabelChange(e, index)}
              className="label-input"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="remove-btn"
            >
              ✖
            </button>
          </div>
        ))}
        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="file-input" />
        <button type="submit" className="submit-btn">Kirim</button>
      </form>
    </div>
  );
};


export default ImageUpload;
