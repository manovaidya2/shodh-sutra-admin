import React, { useRef, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function AdminAddBlog() {
  const editorRef = useRef(null);
  const editorFileRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    date: "",
    image: "", // main blog image
    shortDescription: "",
    content: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Rich text editor formatting
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  // Editor image upload (insert into content)
  const handleEditorImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      formatText("insertImage", base64);
    };
    reader.readAsDataURL(file);
  };

  // Main blog image upload with preview
  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData({ ...formData, image: event.target.result });
    };
    reader.readAsDataURL(file);
  };

  // Submit blog to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    const htmlContent = editorRef.current.innerHTML;
    const blogData = { ...formData, content: htmlContent };

    try {
      const response = await axiosInstance.post("/blogs", blogData);
      if (response.data.success) {
        alert("Blog saved successfully!");

        // Reset form
        setFormData({
          title: "",
          slug: "",
          category: "",
          date: "",
          image: "",
          shortDescription: "",
          content: "",
        });
        editorRef.current.innerHTML = "";
      } else {
        alert(response.data.message || "Failed to save blog");
      }
    } catch (error) {
      console.error(error);
      alert("Server error. Check console.");
    }
  };

  return (
    <section className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 border shadow">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Add New Blog</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Text Inputs */}
          {["title", "slug", "category", "date"].map((field) => (
            <input
              key={field}
              type={field === "date" ? "date" : "text"}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              required={field === "title" || field === "slug"}
            />
          ))}

          {/* Short Description */}
          <textarea
            name="shortDescription"
            placeholder="Short Description"
            rows="3"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* Main Blog Image Upload */}
          <div>
            <label className="block mb-2 font-medium">Blog Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageUpload}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Preview"
                className="mt-2 w-48 h-auto rounded-lg"
              />
            )}
          </div>

          {/* Editor Toolbar */}
          <div className="flex flex-wrap gap-2 border rounded-xl p-3 bg-gray-50">
            {/* Formatting */}
            <button type="button" onClick={() => formatText("bold")} className="editor-btn">Bold</button>
            <button type="button" onClick={() => formatText("italic")} className="editor-btn">Italic</button>
            <button type="button" onClick={() => formatText("underline")} className="editor-btn">Underline</button>
            <button type="button" onClick={() => formatText("strikeThrough")} className="editor-btn">Strike</button>

            {/* Alignment */}
            <button type="button" onClick={() => formatText("justifyLeft")} className="editor-btn">Left</button>
            <button type="button" onClick={() => formatText("justifyCenter")} className="editor-btn">Center</button>
            <button type="button" onClick={() => formatText("justifyRight")} className="editor-btn">Right</button>
            <button type="button" onClick={() => formatText("justifyFull")} className="editor-btn">Justify</button>

            {/* Lists */}
            <button type="button" onClick={() => formatText("insertUnorderedList")} className="editor-btn">• Bullet List</button>
            <button type="button" onClick={() => formatText("insertOrderedList")} className="editor-btn">1. Numbered List</button>

            {/* Font & Heading */}
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

            {/* Colors */}
            <input type="color" title="Text Color" onChange={(e) => formatText("foreColor", e.target.value)} className="w-10 h-8 rounded border"/>
            <input type="color" title="Highlight" onChange={(e) => formatText("hiliteColor", e.target.value)} className="w-10 h-8 rounded border"/>

            {/* Links */}
            <button type="button" onClick={() => { const url = prompt("Enter link URL"); if(url) formatText("createLink", url); }} className="editor-btn">Insert Link</button>

            {/* Editor Image Upload */}
            <button type="button" onClick={() => editorFileRef.current.click()} className="editor-btn">Upload Image</button>
            <input
              type="file"
              accept="image/*"
              ref={editorFileRef}
              onChange={handleEditorImageUpload}
              className="hidden"
            />

            {/* Undo/Redo/Clear */}
            <button type="button" onClick={() => formatText("removeFormat")} className="editor-btn">Clear</button>
            <button type="button" onClick={() => formatText("undo")} className="editor-btn">Undo</button>
            <button type="button" onClick={() => formatText("redo")} className="editor-btn">Redo</button>
          </div>

          {/* Rich Text Editor */}
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[300px] border border-gray-300 rounded-xl p-4 mt-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            suppressContentEditableWarning={true}
            style={{ whiteSpace: "pre-wrap" }}
          ></div>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700"
          >
            Publish Blog
          </button>
        </form>
      </div>

      <style>
        {`
          .editor-btn {
            padding: 6px 10px;
            font-weight: 600;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            background: white;
            cursor: pointer;
          }
          .editor-btn:hover { background: #ecfdf5; }
          .editor-select {
            padding: 0.25rem 0.5rem;
            border-radius: 6px;
            border: 1px solid #d1d5db;
            cursor: pointer;
            background: white;
          }
          div[contenteditable="true"] ul { list-style-type: disc; padding-left: 1.5rem; }
          div[contenteditable="true"] ol { list-style-type: decimal; padding-left: 1.5rem; }
        `}
      </style>
    </section>
  );
}
