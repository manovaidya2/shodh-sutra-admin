import React, { useRef, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export default function AdminAddCaseStudy() {
  const editorRef = useRef(null);
  const editorFileRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    image: "",
    content: "",
  });

  /* 🔹 Auto slug generate from title */
  useEffect(() => {
    if (formData.title) {
      setFormData((prev) => ({
        ...prev,
        slug:
          prev.slug ||
          prev.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
      }));
    }
  }, [formData.title]);

  /* 🔹 Input change */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* 🔹 Editor command */
  const formatText = (command, value = null) => {
    editorRef.current.focus();
    document.execCommand(command, false, value);
  };

  /* 🔹 Insert link */
  const insertLink = () => {
    const url = prompt("Enter link URL");
    if (url) formatText("createLink", url);
  };

  /* 🔹 Upload image inside editor */
  const handleEditorImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      formatText("insertImage", event.target.result);
    };
    reader.readAsDataURL(file);
  };

  /* 🔹 Featured image upload */
  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData({ ...formData, image: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  /* 🔹 Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      content: editorRef.current.innerHTML,
    };

    try {
      await axiosInstance.post("/case-studies", payload);
      alert("✅ Case Study Saved Successfully");

      setFormData({
        title: "",
        slug: "",
        shortDescription: "",
        image: "",
        content: "",
      });

      editorRef.current.innerHTML = "";
    } catch (error) {
      console.error(error);
      alert("❌ Server Error");
    }
  };

  return (
    <section className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 shadow border">

        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Add Case Study
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Case Study Title"
            className="w-full border rounded-xl px-4 py-2"
            required
          />

          {/* Slug */}
          <input
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="Slug (auto-generated)"
            className="w-full border rounded-xl px-4 py-2"
            required
          />

          {/* Short Description */}
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            placeholder="Short Description"
            rows="3"
            className="w-full border rounded-xl px-4 py-2"
          />

          {/* Featured Image */}
          <div>
            <label className="font-medium block mb-1">Featured Image</label>
            <input type="file" accept="image/*" onChange={handleMainImageUpload} />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-2 w-48 rounded-lg"
              />
            )}
          </div>

          {/* 🔹 EDITOR TOOLBAR */}
          <div className="flex flex-wrap gap-2 border rounded-xl p-3 bg-gray-50">

            <button type="button" onClick={() => formatText("bold")} className="editor-btn">Bold</button>
            <button type="button" onClick={() => formatText("italic")} className="editor-btn">Italic</button>
            <button type="button" onClick={() => formatText("underline")} className="editor-btn">Underline</button>
            <button type="button" onClick={() => formatText("strikeThrough")} className="editor-btn">Strike</button>

            <button type="button" onClick={() => formatText("justifyLeft")} className="editor-btn">Left</button>
            <button type="button" onClick={() => formatText("justifyCenter")} className="editor-btn">Center</button>
            <button type="button" onClick={() => formatText("justifyRight")} className="editor-btn">Right</button>
            <button type="button" onClick={() => formatText("justifyFull")} className="editor-btn">Justify</button>

            <button type="button" onClick={() => formatText("insertUnorderedList")} className="editor-btn">• Bullet</button>
            <button type="button" onClick={() => formatText("insertOrderedList")} className="editor-btn">1. Number</button>

            <select onChange={(e) => formatText("fontSize", e.target.value)} className="editor-select">
              <option value="">Font Size</option>
              <option value="2">Small</option>
              <option value="3">Normal</option>
              <option value="5">Large</option>
              <option value="6">X-Large</option>
            </select>

            <select onChange={(e) => formatText("formatBlock", e.target.value)} className="editor-select">
              <option value="">Heading</option>
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
              <option value="p">Paragraph</option>
            </select>

            {/* 🎨 Colors */}
            <input
              type="color"
              title="Text Color"
              onChange={(e) => formatText("foreColor", e.target.value)}
              className="w-10 h-8 border rounded"
            />

            <input
              type="color"
              title="Highlight"
              onChange={(e) => formatText("hiliteColor", e.target.value)}
              className="w-10 h-8 border rounded"
            />

            <button type="button" onClick={insertLink} className="editor-btn">Insert Link</button>

            <button
              type="button"
              onClick={() => editorFileRef.current.click()}
              className="editor-btn"
            >
              Upload Image
            </button>

            <button type="button" onClick={() => formatText("removeFormat")} className="editor-btn">Clear</button>
            <button type="button" onClick={() => formatText("undo")} className="editor-btn">Undo</button>
            <button type="button" onClick={() => formatText("redo")} className="editor-btn">Redo</button>

            <input
              type="file"
              accept="image/*"
              ref={editorFileRef}
              onChange={handleEditorImageUpload}
              className="hidden"
            />
          </div>

          {/* 🔹 EDITOR */}
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[300px] border rounded-xl p-4 focus:outline-none"
            suppressContentEditableWarning
          />

          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700"
          >
            Save Case Study
          </button>
        </form>
      </div>

      {/* Editor styles */}
      <style>
        {`
          .editor-btn {
            padding: 6px 10px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            background: white;
            cursor: pointer;
            font-weight: 600;
          }
          .editor-btn:hover {
            background: #ede9fe;
          }
          .editor-select {
            padding: 4px 8px;
            border-radius: 6px;
            border: 1px solid #d1d5db;
          }
          div[contenteditable="true"] ul {
            list-style-type: disc;
            padding-left: 1.5rem;
          }
          div[contenteditable="true"] ol {
            list-style-type: decimal;
            padding-left: 1.5rem;
          }
        `}
      </style>
    </section>
  );
}
