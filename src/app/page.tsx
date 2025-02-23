"use client";

import { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FileList from "@/components/FileList";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { useFileStore } from "@/stores/file/store";

export default function StatementUploader() {
  const router = useRouter();
  const { 
    files,
    isLoading,
    uploadFile,
    fetchFiles
  } = useFileStore();

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      fetchFiles();
      localStorage.setItem('hasVisitedBefore', 'true');
    } else {
      fetchFiles(false); // Use cached data if available
    }
  }, [fetchFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        await uploadFile(acceptedFiles[0]);
      }
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Statement Collector</h1>
          </div>
          <Button
            onClick={() => router.push('/subs')}
            variant="secondary"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <span>See Subscriptions</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Button>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 sm:p-8 text-center cursor-pointer
            ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
            transition-colors duration-200 mb-6`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <Logo className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-base sm:text-lg text-gray-600">
              {isDragActive ? "Drop PDF here" : "Drag & drop or click to select"}
            </p>
          </div>
        </div>

        <FileList 
          files={files}
          isLoading={isLoading}
          onRefresh={() => fetchFiles(true)}
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
    </div>
  );
}
