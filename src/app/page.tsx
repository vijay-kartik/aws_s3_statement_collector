"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StatementUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        await handleUpload(acceptedFiles[0]);
      }
    },
  });

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Get presigned URL from Next.js API
      const presignedResponse = await fetch("/api/s3-presigned", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filename: file.name, filetype: file.type }),
      });

      if (!presignedResponse.ok) {
        const errorText = await presignedResponse.text();
        throw new Error(`Failed to get presigned URL: ${presignedResponse.status} ${errorText}`);
      }

      const { url, fields } = await presignedResponse.json();
      console.log('Presigned URL:', url); // Debug log
      console.log('Fields:', fields); // Debug log

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', file);

      const uploadResponse = await fetch(url, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed: ${uploadResponse.status} ${errorText}`);
      }
      
      toast.success("File uploaded successfully! 🎉");
    } catch (error) {
      console.error("Upload error details:", error);
      toast.error(error instanceof Error ? error.message : "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Statement Collector
      </h1>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          transition-colors duration-200 mb-6`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" /*...*/>
            {/* Upload icon */}
          </svg>
          <p className="text-lg text-gray-600">
            {isDragActive ? "Drop PDF here" : "Drag & drop or click to select"}
          </p>
        </div>
      </div>

      <button
        onClick={() =>
          (
            document.querySelector('input[type="file"]') as HTMLInputElement
          )?.click()
        }
        disabled={isUploading}
        className={`w-full md:w-auto px-6 py-3 text-white rounded-lg transition-all
          ${
            isUploading
              ? "bg-blue-400 cursor-wait"
              : "bg-blue-500 hover:bg-blue-600"
          }
          relative overflow-hidden`}
      >
        <span className="flex items-center justify-center gap-2">
          {isUploading && (
            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          )}
          {isUploading ? "Uploading..." : "Upload Statement"}
        </span>

        {/* Progress bar animation */}
        {isUploading && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-blue-200 transition-all"
            style={{ width: `${uploadProgress}%` }}
          />
        )}
      </button>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        theme="colored"
      />
    </div>
  );
}
