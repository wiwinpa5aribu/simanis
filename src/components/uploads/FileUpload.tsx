/**
 * Komponen FileUpload
 *
 * Komponen generik untuk upload file dengan validasi tipe dan ukuran.
 * Menampilkan progress bar saat upload dan error handling yang jelas.
 *
 * Props:
 * - accept: tipe file yang diterima (contoh: "image/*", "application/pdf")
 * - maxSizeMB: ukuran maksimal file dalam MB
 * - onUpload: callback yang dipanggil saat file dipilih
 * - onProgress: callback untuk update progress upload (opsional)
 * - label: label untuk input file
 * - disabled: status disabled
 */

import { useState, useRef, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X, FileIcon } from "lucide-react";

interface FileUploadProps {
  accept?: string;
  maxSizeMB?: number;
  onUpload: (file: File) => void | Promise<void>;
  onProgress?: (progress: number) => void;
  label?: string;
  disabled?: boolean;
  currentFile?: string; // URL file saat ini (untuk preview)
}

export function FileUpload({
  accept = "image/*",
  maxSizeMB = 5,
  onUpload,
  onProgress,
  label = "Upload File",
  disabled = false,
  currentFile,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentFile || null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Validasi ukuran file
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `Ukuran file melebihi batas maksimal ${maxSizeMB}MB`;
    }

    // Validasi tipe file
    if (accept && accept !== "*") {
      const acceptedTypes = accept.split(",").map((t) => t.trim());
      const fileType = file.type;
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

      const isAccepted = acceptedTypes.some((type) => {
        if (type.endsWith("/*")) {
          // Wildcard type (contoh: image/*)
          const baseType = type.split("/")[0];
          return fileType.startsWith(baseType + "/");
        } else if (type.startsWith(".")) {
          // Extension (contoh: .pdf)
          return fileExtension === type.toLowerCase();
        } else {
          // Exact type (contoh: image/jpeg)
          return fileType === type;
        }
      });

      if (!isAccepted) {
        return `Tipe file tidak didukung. Hanya menerima: ${accept}`;
      }
    }

    return null;
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state
    setError(null);
    setProgress(0);

    // Validasi file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);

    // Buat preview untuk gambar
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    // Upload file
    try {
      setUploading(true);

      // Simulasi progress jika onProgress disediakan
      if (onProgress) {
        const interval = setInterval(() => {
          setProgress((prev) => {
            const next = prev + 10;
            if (next >= 90) {
              clearInterval(interval);
              return 90;
            }
            onProgress(next);
            return next;
          });
        }, 100);
      }

      await onUpload(file);

      setProgress(100);
      if (onProgress) onProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengupload file");
      setSelectedFile(null);
      setPreview(currentFile || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    setProgress(0);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="file-upload">{label}</Label>

        {/* Input File */}
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            id="file-upload"
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled || uploading}
            className="hidden"
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || uploading}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {selectedFile ? "Ganti File" : "Pilih File"}
          </Button>
        </div>

        {/* Info File */}
        {selectedFile && (
          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
            <div className="flex items-center gap-2">
              <FileIcon className="h-4 w-4" />
              <div className="text-sm">
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            {!uploading && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Preview Gambar */}
        {preview && (
          <div className="relative w-full max-w-xs mx-auto">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto rounded-md border"
            />
          </div>
        )}

        {/* Progress Bar */}
        {uploading && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground text-center">
              Mengupload... {progress}%
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Hint */}
        <p className="text-xs text-muted-foreground">
          Maksimal ukuran file: {maxSizeMB}MB. Format yang diterima: {accept}
        </p>
      </div>
    </div>
  );
}
