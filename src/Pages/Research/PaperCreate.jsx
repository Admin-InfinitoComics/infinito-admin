import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { BACKEND_URL } from "../../Utils/constant";

const PaperCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    abstract: "",
    keywords: "",
    introduction: "",
    objective: "",
    literature: "",
    methodology: "",
    experimentalResults: "",
    discussion: "",
    conclusion: "",
    references: "",
    publicationDate: "",
    category: "",
    authors: [
      {
        name: "",
        affiliation: "",
      },
    ],
    mentors: [
      {
        name: "",
      },
    ],
  });

  const [pdfFile, setPdfFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuthorChange = (index, field, value) => {
    const updatedAuthors = [...form.authors];
    updatedAuthors[index][field] = value;
    setForm({ ...form, authors: updatedAuthors });
  };

  const addAuthor = () => {
    setForm({
      ...form,
      authors: [...form.authors, { name: "", affiliation: "" }],
    });
  };

  const removeAuthor = (index) => {
    const updatedAuthors = [...form.authors];
    updatedAuthors.splice(index, 1);
    setForm({ ...form, authors: updatedAuthors });
  };

  // Mentor handlers
  const handleMentorChange = (index, value) => {
    const updatedMentors = [...form.mentors];
    updatedMentors[index].name = value;
    setForm({ ...form, mentors: updatedMentors });
  };

  const addMentor = () => {
    setForm({
      ...form,
      mentors: [...form.mentors, { name: "" }],
    });
  };

  const removeMentor = (index) => {
    const updatedMentors = [...form.mentors];
    updatedMentors.splice(index, 1);
    setForm({ ...form, mentors: updatedMentors });
  };

  const handlePdfChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (key === "authors" || key === "mentors") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      if (pdfFile) {
        formData.append("pdf", pdfFile);
      }

      await axios.post(`${BACKEND_URL}/research-papers`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      toast.success("Research paper created successfully!");
      setTimeout(() => navigate("/research"), 1500);
    } catch (err) {
      console.error("Error creating paper", err);
      // Show backend error message if available
      const backendMsg = err?.response?.data?.message || "Failed to create research paper.";
      toast.error(backendMsg);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white shadow-lg rounded-xl pt-24" style={{ overflow: "visible" }}>
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Create Research Paper
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            <option value="Business">Business</option>
            <option value="Psychology">Psychology</option>
            <option value="Design">Design</option>
            <option value="Technology">Technology</option>
            <option value="Humanities">Humanities</option>
            <option value="Communities">Communities</option>
            <option value="Philosophy">Philosophy</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Abstract */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Abstract
          </label>
          <textarea
            name="abstract"
            value={form.abstract}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Keywords
          </label>
          <input
            type="text"
            name="keywords"
            value={form.keywords}
            onChange={handleChange}
            placeholder="e.g. AI, Machine Learning, Healthcare"
            className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Authors (name and affiliation side by side) */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Authors</h2>
          <div className="space-y-4">
            {form.authors.map((author, i) => (
              <div
                key={i}
                className="bg-gray-50 border rounded-md p-4 shadow-sm flex gap-4 items-center"
              >
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={author.name}
                    onChange={(e) =>
                      handleAuthorChange(i, "name", e.target.value)
                    }
                    className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Affiliation
                  </label>
                  <input
                    type="text"
                    value={author.affiliation}
                    onChange={(e) =>
                      handleAuthorChange(i, "affiliation", e.target.value)
                    }
                    className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                {form.authors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAuthor(i)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addAuthor}
            className="mt-4 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-200 transition"
          >
            Add Another Author
          </button>
        </div>

        {/* Mentors (only name) */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Mentors</h2>
          <div className="space-y-4">
            {form.mentors.map((mentor, i) => (
              <div
                key={i}
                className="bg-gray-50 border rounded-md p-4 shadow-sm flex gap-4 items-center"
              >
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={mentor.name}
                    onChange={(e) =>
                      handleMentorChange(i, e.target.value)
                    }
                    className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                {form.mentors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMentor(i)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addMentor}
            className="mt-4 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-200 transition"
          >
            Add Mentor
          </button>
        </div>

        {/* Other sections */}
        {[
          "introduction",
          "objective",
          "literature",
          "methodology",
          "experimentalResults",
          "discussion",
          "conclusion",
        ].map((section) => (
          <div key={section}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {section.replace(/([A-Z])/g, " $1")}
            </label>
            <textarea
              name={section}
              value={form[section]}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={section !== "literature"}
            />
          </div>
        ))}

        {/* References */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            References
          </label>
          <textarea
            name="references"
            value={form.references}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Publication Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Publication Date
          </label>
          <input
            type="date"
            name="publicationDate"
            value={form.publicationDate}
            onChange={handleChange}
            className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* PDF Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Research Paper PDF
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none"
            required
          />
        </div>

        {/* Submit */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
          >
            Submit Research Paper
          </button>
        </div>

      </form>
    </div>
    
  );
};

export default PaperCreate;

