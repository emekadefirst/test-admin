import { useState, useEffect } from 'react'
import { Modal as BaseModal } from './base-modal'
import { Button } from '@/components/ui/buttons'

interface EditFaqModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { question: string; answer: string; category_id: string }) => void
  faq?: { id: string; question: string; answer: string; category_id?: string; category?: string }
  categories: Array<{ id: string; title: string }>
  isLoading?: boolean
}

export function EditFaqModal({ 
  isOpen,
  onClose, 
  onSave, 
  faq,
  categories,
  isLoading = false 
}: EditFaqModalProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [categoryId, setCategoryId] = useState('')

  useEffect(() => {
    if (isOpen) {
      if (faq) {
        setQuestion(faq.question)
        setAnswer(faq.answer)
        
        if (faq.category_id) {
          setCategoryId(faq.category_id)
        } else if (faq.category) {
          // Find category ID by title if only title is provided
          const matchingCategory = categories.find(c => c.title === faq.category)
          if (matchingCategory) {
            setCategoryId(matchingCategory.id)
          }
        }
      } else {
        setQuestion('')
        setAnswer('')
        setCategoryId('')
      }
    }
  }, [faq, isOpen, categories])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim() && answer.trim() && categoryId) {
      onSave({ 
        question: question.trim(), 
        answer: answer.trim(), 
        category_id: categoryId 
      })
    }
  }

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose}
      title={faq ? 'Edit FAQ' : 'Create FAQ'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
            Question
          </label>
          <input
            id="question"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
            placeholder="Enter question"
            required
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
            Answer
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent min-h-[100px]"
            placeholder="Enter answer"
            required
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
            disabled={isLoading || !question.trim() || !answer.trim() || !categoryId}
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
