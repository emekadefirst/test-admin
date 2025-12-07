import { useState, useEffect } from 'react'
import { Modal as BaseModal } from './base-modal'
import { Button } from '@/components/ui/buttons'
import { ImageUpload } from '@/components/ui/image-upload'

interface EditBlogModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { 
    title: string
    content: string
    category_id: string
    status: 'draft' | 'published'
    tags: string[]
    image_ids: string[]
  }) => void
  blog?: { 
    id: string
    title: string
    content: string
    category_id?: string
    category?: string
    status: 'draft' | 'published'
    tags: string[]
    image_ids: string[]
  }
  categories: Array<{ id: string; title: string }>
  isLoading?: boolean
}

export function EditBlogModal({ 
  isOpen, 
  onClose, 
  onSave, 
  blog,
  categories,
  isLoading = false 
}: EditBlogModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [tags, setTags] = useState('')
  const [imageId, setImageId] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      if (blog) {
        setTitle(blog.title)
        setContent(blog.content)
        setStatus(blog.status)
        setTags(blog.tags ? blog.tags.join(', ') : '')
        setImageId(blog.image_ids?.[0] || '')
        
        if (blog.category_id) {
          setCategoryId(blog.category_id)
        } else if (blog.category) {
          const matchingCategory = categories.find(c => c.title === blog.category)
          if (matchingCategory) {
            setCategoryId(matchingCategory.id)
          }
        }
      } else {
        setTitle('')
        setContent('')
        setCategoryId('')
        setStatus('draft')
        setTags('')
        setImageId('')
      }
    }
  }, [blog, isOpen, categories])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && content.trim() && categoryId) {
      onSave({ 
        title: title.trim(), 
        content: content.trim(), 
        category_id: categoryId,
        status,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        image_ids: imageId ? [imageId] : []
      })
    }
  }

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose}
      title={blog ? 'Edit Blog' : 'Create Blog'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
            placeholder="Enter blog title"
            required
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent bg-white"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent bg-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
              placeholder="news, updates, travel"
            />
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent min-h-[200px]"
            placeholder="Enter blog content..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image
          </label>
          <ImageUpload
            onUploadComplete={(id) => setImageId(id)}
            onRemove={() => setImageId('')}
            currentImageId={imageId}
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !title.trim() || !content.trim() || !categoryId}
            variant="primary"
            size="sm"
            className="bg-[#1A365D] hover:bg-[#1A365D]/90 px-8"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </BaseModal>
  )
}
