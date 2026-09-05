import React, { useRef, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  error?: string;
  accept?: string;
}

export function FileUpload({ file, onFileSelect, error, accept = '.pdf,.pptx' }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [localError, setLocalError] = useState<string>('');

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFile = (selectedFile: File) => {
    setLocalError('');
    if (selectedFile.size > MAX_SIZE) {
      setLocalError('File size exceeds 10MB limit.');
      return;
    }
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'pptx') {
      setLocalError('Only PDF or PPTX files are allowed.');
      return;
    }
    onFileSelect(selectedFile);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const formatSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-1">Presentation File</label>
      
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-brand-500 bg-brand-500/10' : error || localError ? 'border-red-500 bg-red-500/5' : 'border-gray-700 bg-gray-800 hover:border-gray-500 hover:bg-gray-750'
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={accept}
            onChange={onChange}
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-200 font-medium mb-1">Upload your PPT</p>
          <p className="text-gray-400 text-sm mb-2">Drag & drop or Browse</p>
          <p className="text-gray-500 text-xs">PDF / PPTX • Max 10 MB</p>
        </div>
      ) : (
        <div className="border border-gray-700 bg-gray-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="p-2 bg-brand-500/20 rounded-lg text-brand-400 flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-gray-200 truncate">{file.name}</p>
              <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onFileSelect(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      
      {(error || localError) && (
        <p className="mt-2 text-sm text-red-500">{localError || error}</p>
      )}
    </div>
  );
}
