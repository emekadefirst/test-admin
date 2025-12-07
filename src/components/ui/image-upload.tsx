import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/buttons'
import { useToast } from '@/contexts/toast-context'
import { uploadFileFn } from '@/server/files'

interface ImageUploadProps {
  onUploadComplete: (imageId: string) => void
  onRemove: () => void
  currentImageId?: string
  className?: string
}

export function ImageUpload({ onUploadComplete, onRemove, className = '' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addToast } = useToast()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    console.log('📁 File selected:', file)
    
    if (!file) return

    // Basic validation
    if (!file.type.startsWith('image/')) {
      console.error('❌ Invalid file type:', file.type)
      addToast('error', 'Please upload an image file')
      return
    }

    console.log('✅ File validated:', { name: file.name, type: file.type, size: file.size })

    // Create local preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      console.log('📤 Calling uploadFileFn...')
      const result = await uploadFileFn({ data: formData })
      console.log('📥 Upload result:', result)
      
      if (result && result.id) {
        console.log('✅ Upload successful, ID:', result.id)
        onUploadComplete(result.id)
        // If the API returns a URL, we could use that instead of the local preview
        if (result.url) {
          setPreviewUrl(result.url)
        }
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('❌ Upload failed:', error)
      addToast('error', 'Failed to upload image')
      setPreviewUrl(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onRemove()
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-4">
        {previewUrl ? (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200 group">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#1A365D] hover:bg-gray-50 transition-colors"
          >
            <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-xs text-gray-500 font-medium">Upload Image</span>
          </div>
        )}

        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full sm:w-auto"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Select Image'}
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: JPG, PNG, GIF. Max size: 5MB.
          </p>
        </div>
      </div>
    </div>
  )
}
