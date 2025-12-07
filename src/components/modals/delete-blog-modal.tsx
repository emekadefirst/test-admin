import { Modal as BaseModal } from './base-modal'
import { Button } from '@/components/ui/buttons'

interface DeleteBlogModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  blog?: { id: string; title: string }
  isLoading?: boolean
}

export function DeleteBlogModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  blog,
  isLoading = false 
}: DeleteBlogModalProps) {
  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Delete Blog"
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          Are you sure you want to delete the blog "{blog?.title}"? This action cannot be undone.
        </p>

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
            onClick={onConfirm}
            disabled={isLoading}
            variant="primary"
            size="sm"
            className="bg-red-600 hover:bg-red-700 border-red-600 px-8"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
