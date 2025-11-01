import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, FileText, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function Upload() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      validateAndAddFiles(droppedFiles);
    }
  }, []);

  const validateAndAddFiles = (selectedFiles) => {
    const validPDFs = selectedFiles.filter(
      (f) => f.type === "application/pdf"
    );

    if (validPDFs.length === 0) {
      toast.error("Please upload PDF files only");
      return;
    }

    // Prevent duplicates
    const uniqueFiles = validPDFs.filter(
      (f) => !files.some((existing) => existing.name === f.name)
    );

    setFiles((prev) => [...prev, ...uniqueFiles]);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (name) => {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one PDF file");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      toast.success(data.message || "Files uploaded successfully");
      setFiles([]);
      navigate("/overview");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    toast.info("You have been logged out");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dashboard-bg via-background to-accent/10 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Upload Student PDFs
            </h1>
            <p className="text-muted-foreground">
              Upload multiple student mark sheets (PDF only)
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Card className="p-8">
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
              dragActive
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {files.length === 0 ? (
              <>
                <UploadIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Drop your PDFs here</h3>
                <p className="text-muted-foreground mb-4">or click to browse</p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf"
                  multiple
                  onChange={handleFileInput}
                />
                <Button asChild variant="outline">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Select PDFs
                  </label>
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Supported format: PDF • Multiple files allowed
                </p>
              </>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2 max-h-64 overflow-y-auto border p-3 rounded-lg bg-accent/10">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-accent/30 p-2 rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">{file.name}</span>
                      </div>
                      {!uploading && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFile(file.name)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full"
                  size="lg"
                >
                  {uploading ? (
                    <>Uploading...</>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Upload All PDFs
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </Card>

        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">Instructions</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Upload multiple student mark sheets (PDF format only)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Files are automatically stored inside a date-based folder on the server
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                The system will later process and extract data from uploaded PDFs
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
