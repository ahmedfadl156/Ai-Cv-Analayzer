import {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  
  return `${size.toFixed(1)} ${sizes[i]}`;
}

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}
export default function FileUploader({onFileSelect}: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0] || null;
    onFileSelect?.(file);
  }, [onFileSelect])
  const {getRootProps, getInputProps, isDragActive , acceptedFiles} = useDropzone({
    onDrop,
    multiple:false,
    accept: {'application/pdf': ['.pdf']},
    maxSize: 20 * 1024 * 1024
  })
  const file = acceptedFiles[0] || null;

  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className='space-y-4 cursor-pointer'>
        {file ? (
          <div className='uploader-selected-file'>
            <img src="images/pdf.png" className="size-10" alt="pdf" />
          <div className='flex justify-center items-center space-x-3'>
            <div>
            <p className='text-lg text-gray-500'>
              {file.name}
            </p>
            <p className='text-lg text-gray-500'>
              {formatSize(file.size)}
            </p>
            </div>
          </div>
          <button className='p-2 cursor-pointer' onClick={() => onFileSelect?.(null)}>
            <img src="icons/cross.svg" alt="remove" className='w-4 h-4'/>
          </button>
          </div>
        ) : (
          <div>
            <div className='mx-auto flex items-center justify-center w-16 h-16 mb-4'>
              <img src="icons/info.svg" alt="info" />
            </div>
            <p className='text-lg text-gray-500'>
              <span className='font-semibold'>Click to upload</span>
              or drag and drop file
            </p>
            <p className='text-lg text-gray-500'>
              PDF (max.{formatSize(20 * 1024 * 1024)})
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}
