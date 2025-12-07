import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { AdminLayout } from '@/components/admin-layout'
import { requireAuth } from '@/utils/auth-guard'
import { Table } from '@/components/ui/table'
import { Button } from '@/components/ui/buttons'
import { EditCategoryModal } from '@/components/modals/edit-category-modal'
import { DeleteCategoryModal } from '@/components/modals/delete-category-modal'
import { useToast } from '@/contexts/toast-context'
import {
  getBlogCategoriesFn,
  createBlogCategoryFn,
  updateBlogCategoryFn,
  deleteBlogCategoryFn,
  getFaqCategoriesFn,
  createFaqCategoryFn,
  updateFaqCategoryFn,
  deleteFaqCategoryFn
} from '@/server/categories'

// ... (rest of imports and type definitions)

// ... (Route definition)

type CategoriesSearch = {
  page: number
  pageSize: number
  tab: 'blogs' | 'faqs'
}

export const Route = createFileRoute('/categories')({
  loaderDeps: ({ search: { page, pageSize, tab } }) => ({ page, pageSize, tab }),
  validateSearch: (search: Record<string, unknown>): CategoriesSearch => {
    return {
      page: Number(search?.page) || 1,
      pageSize: Number(search?.pageSize) || 10,
      tab: (search?.tab as 'blogs' | 'faqs') || 'blogs',
    }
  },
  loader: async ({ deps }) => {
    const { page, pageSize, tab } = deps as CategoriesSearch
    await requireAuth()
    const fn = tab === 'blogs' ? getBlogCategoriesFn : getFaqCategoriesFn
    const result = await fn({ data: { page, page_size: pageSize } })
    
    if (!result.ok) {
      throw new Error(result.error || 'Failed to load categories')
    }

    return {
      categories: Array.isArray(result.data) ? result.data : result.data?.data || [],
      totalCount: Array.isArray(result.data) ? result.data.length : (result.data?.count || (result.data?.data?.length ?? 0))
    }
  },
  component: CategoriesPage,
  errorComponent: ({ error }) => {
    return (
      <AdminLayout>
        <div className="p-6 text-center">
          <div className="bg-red-50 text-red-800 p-4 rounded-lg inline-block">
            <h3 className="text-lg font-bold mb-2">Error Loading Categories</h3>
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

function CategoriesPage() {
  const { addToast } = useToast()
  const navigate = useNavigate({ from: Route.fullPath })
  const { page, pageSize, tab } = Route.useSearch()
  const { categories, totalCount } = Route.useLoaderData()
  const router = useRouter()

  const [editModal, setEditModal] = useState<{ isOpen: boolean; category?: any }>({ isOpen: false })
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; category?: any }>({ isOpen: false })
  const [actionLoading, setActionLoading] = useState(false)

  const updateParams = (newParams: Partial<CategoriesSearch>) => {
    navigate({
      search: (prev) => ({ ...prev, ...newParams }),
    })
  }

  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'created_at', header: 'Created', render: (item: any) => new Date(item.created_at).toLocaleDateString() },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => setEditModal({ isOpen: true, category: item })}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteModal({ isOpen: true, category: item })}
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

  const handleSave = async (data: { title: string }) => {
    setActionLoading(true)
    try {
      if (editModal.category) {
        // Update
        const fn = tab === 'blogs' ? updateBlogCategoryFn : updateFaqCategoryFn
        const result = await fn({ data: { id: editModal.category.id, ...data } })
        
        if (result.ok) {
          addToast('success', 'Category updated successfully')
          router.invalidate()
        } else {
          addToast('error', result.error || 'Failed to update category')
        }
      } else {
        // Create
        const fn = tab === 'blogs' ? createBlogCategoryFn : createFaqCategoryFn
        const result = await fn({ data })
        
        if (result.ok) {
          addToast('success', 'Category created successfully')
          router.invalidate()
        } else {
          addToast('error', result.error || 'Failed to create category')
        }
      }
      setEditModal({ isOpen: false })
    } catch {
      addToast('error', 'Failed to save category')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    setActionLoading(true)
    try {
      const fn = tab === 'blogs' ? deleteBlogCategoryFn : deleteFaqCategoryFn
      const result = await fn({ data: { id: deleteModal.category.id } })
      
      if (result.ok) {
        addToast('success', 'Category deleted successfully')
        router.invalidate()
      } else {
        addToast('error', result.error || 'Failed to delete category')
      }
      setDeleteModal({ isOpen: false })
    } catch {
      addToast('error', 'Failed to delete category')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#2D3748]">Categories</h1>
          <Button
            onClick={handleCreate}
            variant="primary"
            className="bg-[#1A365D] hover:bg-[#1A365D]/90"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => updateParams({ tab: 'blogs', page: 1 })}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                tab === 'blogs'
                  ? 'border-[#1A365D] text-[#1A365D]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Blog Categories
            </button>
            <button
              onClick={() => updateParams({ tab: 'faqs', page: 1 })}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                tab === 'faqs'
                  ? 'border-[#1A365D] text-[#1A365D]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              FAQ Categories
            </button>
          </nav>
        </div>

        <Table
          data={categories}
          columns={columns}
          currentPage={page}
          totalPages={Math.ceil(totalCount / pageSize)}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={(p) => updateParams({ page: p })}
          onPageSizeChange={(ps) => updateParams({ pageSize: ps, page: 1 })}
          isLoading={false}
        />

        <EditCategoryModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false })}
          onSave={handleSave}
          category={editModal.category}
          isLoading={actionLoading}
          categoryType={tab === 'blogs' ? 'Blog' : 'FAQ'}
        />

        <DeleteCategoryModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false })}
          onConfirm={handleDelete}
          category={deleteModal.category}
          isLoading={actionLoading}
          categoryType={tab === 'blogs' ? 'Blog' : 'FAQ'}
        />
      </div>
    </AdminLayout>
  )
}