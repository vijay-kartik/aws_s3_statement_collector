"use client";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FileList from "@/components/FileList";
import { s3Service } from "@/services/s3Service";
import type { S3File } from "@/types";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/Button";

export default function StatementUploader() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState<S3File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      fetchFiles();
      localStorage.setItem('hasVisitedBefore', 'true');
    } else {
      const cachedFiles = localStorage.getItem('cachedFiles');
      if (cachedFiles) {
        setFiles(JSON.parse(cachedFiles));
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        await handleUpload(acceptedFiles[0]);
      }
    },
  });

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const files = await s3Service.listFiles();
      setFiles(files);
      localStorage.setItem('cachedFiles', JSON.stringify(files));
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to load files');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const { url, fields } = await s3Service.getPresignedUrl(file.name, file.type);
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
      // Refresh the file list after successful upload
      await fetchFiles();
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Statement Collector
        </h1>
        <Button
          onClick={() => router.push('/subs')}
          variant="secondary"
          className="flex items-center gap-2"
        >
          <span>See Subscriptions</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Button>
      </div>

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

      <FileList 
        files={files}
        isLoading={isLoading}
        onRefresh={fetchFiles}
      />

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
