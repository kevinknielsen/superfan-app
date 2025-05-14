import { Label } from "@/components/ui/label";
import { X, Upload } from "lucide-react";
import React, { ChangeEvent } from "react";

interface FileUploadProps {
  label: string;
  accept: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  preview?: string | null;
  onRemove?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, accept, onChange, error, preview, onRemove }) => {
  return (
    <div>
      <Label className={error ? "text-red-500" : ""}>{label}</Label>
      <div className="mt-2">
        {preview ? (
          <div className="relative w-40 h-40 group">
            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <label
            htmlFor={label}
            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">{accept}</p>
            </div>
            <input id={label} type="file" accept={accept} className="hidden" onChange={onChange} />
          </label>
        )}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default FileUpload; 