import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { AdminLayout } from '@/components/admin-layout'
import { requireAuth } from '@/utils/auth-guard'
import { Table } from '@/components/ui/table'
import { Button } from '@/components/ui/buttons'
import { EditFaqModal } from '@/components/modals/edit-faq-modal'
import { DeleteFaqModal } from '@/components/modals/delete-faq-modal'
import { useToast } from '@/contexts/toast-context'
import {
  getFaqsFn,
  createFaqFn,
  updateFaqFn,
  deleteFaqFn
} from '@/server/faqs'
import { getFaqCategoriesFn } from '@/server/categories'

type FaqsSearch = {
  page: number
  pageSize: number
}

export const Route = createFileRoute('/faqs')({
  loaderDeps: ({ search: { page, pageSize } }) => ({ page, pageSize }),
  validateSearch: (search: Record<string, unknown>): FaqsSearch => {
    return {
      page: Number(search?.page) || 1,
      pageSize: Number(search?.pageSize) || 10,
    }
  },
  loader: async ({ deps }) => {
    const { page, pageSize } = deps as FaqsSearch
    await requireAuth()
    
    const [faqsResult, categoriesResult] = await Promise.all([
      getFaqsFn({ data: { page, page_size: pageSize } }),
      getFaqCategoriesFn({ data: { page: 1, page_size: 100 } }) // Fetch all categories for dropdown
    ])
    
    if (!faqsResult.ok) {
      throw new Error(faqsResult.error || 'Failed to load FAQs')
    }

    return {
      faqs: Array.isArray(faqsResult.data) ? faqsResult.data : faqsResult.data?.data || [],
      totalCount: Array.isArray(faqsResult.data) ? faqsResult.data.length : (faqsResult.data?.count || (faqsResult.data?.data?.length ?? 0)),
      categories: Array.isArray(categoriesResult.data) ? categoriesResult.data : categoriesResult.data?.data || []
    }
  },
  component: FaqsPage,
  errorComponent: ({ error }) => {
    return (
      <AdminLayout>
        <div className="p-6 text-center">
          <div className="bg-red-50 text-red-800 p-4 rounded-lg inline-block">
            <h3 className="text-lg font-bold mb-2">Error Loading FAQs</h3>
            <p>{error.message}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-900 rounded-md text-sm font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  },
})

function FaqsPage() {
  const { addToast } = useToast()
  const navigate = useNavigate({ from: Route.fullPath })
  const { page, pageSize } = Route.useSearch()
  const { faqs, totalCount, categories } = Route.useLoaderData()
  console.log('FAQs Data:', faqs)
  const router = useRouter()

  const [editModal, setEditModal] = useState<{ isOpen: boolean; faq?: any }>({ isOpen: false })
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; faq?: any }>({ isOpen: false })
  const [actionLoading, setActionLoading] = useState(false)

  const updateParams = (newParams: Partial<FaqsSearch>) => {
    navigate({
      search: (prev) => ({ ...prev, ...newParams }),
    })
  }

  const getCategoryTitle = (categoryId: string) => {
    const category = categories.find((c: any) => c.id === categoryId)
    return category ? category.title : 'Unknown'
  }

  const columns = [
    { key: 'question', header: 'Question' },
    { 
      key: 'answer', 
      header: 'Answer', 
      render: (item: any) => (
        <span className="block max-w-xs truncate" title={item.answer}>
          {item.answer}
        </span>
      ) 
    },
    { 
      key: 'category_id', 
      header: 'Category',
      render: (item: any) => item.category || getCategoryTitle(item.category_id)
    },
    { key: 'created_at', header: 'Created', render: (item: any) => new Date(item.created_at).toLocaleDateString() },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => setEditModal({ isOpen: true, faq: item })}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteModal({ isOpen: true, faq: item })}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ]

  const handleCreate = () => {
    setEditModal({ isOpen: true })
  }

  const handleSave = async (data: { question: string; answer: string; category_id: string }) => {
    setActionLoading(true)
    try {
      if (editModal.faq) {
        // Update
        const result = await updateFaqFn({ data: { id: editModal.faq.id, ...data } })
        
        if (result.ok) {
          addToast('success', 'FAQ updated successfully')
          router.invalidate()
        } else {
          addToast('error', result.error || 'Failed to update FAQ')
        }
      } else {
        // Create
        const result = await createFaqFn({ data })
        
        if (result.ok) {
          addToast('success', 'FAQ created successfully')
          router.invalidate()
        } else {
          addToast('error', result.error || 'Failed to create FAQ')
        }
      }
      setEditModal({ isOpen: false })
    } catch {
      addToast('error', 'Failed to save FAQ')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    setActionLoading(true)
    try {
      const result = await deleteFaqFn({ data: { id: deleteModal.faq.id } })
      
      if (result.ok) {
        addToast('success', 'FAQ deleted successfully')
        await router.invalidate()
      } else {
        addToast('error', result.error || 'Failed to delete FAQ')
      }
      setDeleteModal({ isOpen: false })
    } catch (error) {
      addToast('error', 'Failed to delete FAQ')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#2D3748]">FAQs</h1>
          <Button
            onClick={handleCreate}
            variant="primary"
            className="bg-[#1A365D] hover:bg-[#1A365D]/90"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </Button>
        </div>

        <Table
          data={faqs}
          columns={columns}
          currentPage={page}
          totalPages={Math.ceil(totalCount / pageSize)}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={(p) => updateParams({ page: p })}
          onPageSizeChange={(ps) => updateParams({ pageSize: ps, page: 1 })}
          isLoading={false}
        />

        <EditFaqModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false })}
          onSave={handleSave}
          faq={editModal.faq}
          categories={categories}
          isLoading={actionLoading}
        />

        <DeleteFaqModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false })}
          onConfirm={handleDelete}
          faq={deleteModal.faq}
          isLoading={actionLoading}
        />
      </div>
    </AdminLayout>
  )
}
