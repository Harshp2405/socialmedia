import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
    onImageUpload: (file: File) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
    const [preview, setPreview] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file && file.type.startsWith('image/')) {
            setPreview(URL.createObjectURL(file));
            onImageUpload(file);
        }
    }, [onImageUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1,
    });

    return (
        <div
            {...getRootProps()}
            style={{
                border: '2px dashed #ccc',
                padding: '20px',
                textAlign: 'center',
                borderRadius: '10px',
                backgroundColor: isDragActive ? '#f0f8ff' : '#fafafa',
            }}
        >
            <input {...getInputProps()} />
            {isDragActive ? <p>Drop the image here...</p> : <p>Drag & drop or click to select an image</p>}
            {preview && <img src={preview} alt="Preview" style={{ marginTop: 10, maxWidth: '100%' }} />}
        </div>
    );
};

export default ImageUpload;
