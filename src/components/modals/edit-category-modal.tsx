import { useState, useEffect } from 'react'
import { Modal as BaseModal } from './base-modal'
import { Button } from '@/components/ui/buttons'

interface EditCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { title: string }) => void
  category?: { id: string; title: string }
  isLoading?: boolean
  categoryType: 'Blog' | 'FAQ'
}

export function EditCategoryModal({ 
  isOpen, 
  onClose, 
  onSave, 
  category,
  isLoading = false,
  categoryType
}: EditCategoryModalProps) {
  const [title, setTitle] = useState('')

  useEffect(() => {
    if (isOpen) {
      if (category) {
        setTitle(category.title)
      } else {
        setTitle('')
      }
    }
  }, [category, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSave({ title: title.trim() })
    }
  }

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose}
      title={category ? `Edit ${categoryType} Category` : `Create ${categoryType} Category`}
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
            placeholder="Enter category title"
            required
            autoFocus
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
            disabled={isLoading || !title.trim()}
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