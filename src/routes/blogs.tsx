import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { AdminLayout } from '@/components/admin-layout'
import { requireAuth } from '@/utils/auth-guard'
import { Table } from '@/components/ui/table'
import { Button } from '@/components/ui/buttons'
import { EditBlogModal } from '@/components/modals/edit-blog-modal'
import { DeleteBlogModal } from '@/components/modals/delete-blog-modal'
import { useToast } from '@/contexts/toast-context'
import {
  getBlogsFn,
  createBlogFn,
  updateBlogFn,
  deleteBlogFn
} from '@/server/blogs'
import { getBlogCategoriesFn } from '@/server/categories'

type BlogsSearch = {
  page: number
  pageSize: number
}

export const Route = createFileRoute('/blogs')({
  loaderDeps: ({ search: { page, pageSize } }) => ({ page, pageSize }),
  validateSearch: (search: Record<string, unknown>): BlogsSearch => {
    return {
      page: Number(search?.page) || 1,
      pageSize: Number(search?.pageSize) || 10,
    }
  },
  loader: async ({ deps }) => {
    const { page, pageSize } = deps as BlogsSearch
    await requireAuth()
    
    const [blogsResult, categoriesResult] = await Promise.all([
      getBlogsFn({ data: { page, page_size: pageSize } }),
      getBlogCategoriesFn({ data: { page: 1, page_size: 100 } })
    ])
    
    if (!blogsResult.ok) {
      throw new Error(blogsResult.error || 'Failed to load blogs')
    }

    return {
      blogs: Array.isArray(blogsResult.data) ? blogsResult.data : blogsResult.data?.data || [],
      totalCount: Array.isArray(blogsResult.data) ? blogsResult.data.length : (blogsResult.data?.count || (blogsResult.data?.data?.length ?? 0)),
      categories: Array.isArray(categoriesResult.data) ? categoriesResult.data : categoriesResult.data?.data || []
    }
  },
  component: BlogsPage,
  errorComponent: ({ error }) => {
    return (
      <AdminLayout>
        <div className="p-6 text-center">
          <div className="bg-red-50 text-red-800 p-4 rounded-lg inline-block">
            <h3 className="text-lg font-bold mb-2">Error Loading Blogs</h3>
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

function BlogsPage() {
  const { addToast } = useToast()
  const navigate = useNavigate({ from: Route.fullPath })
  const { page, pageSize } = Route.useSearch()
  const { blogs, totalCount, categories } = Route.useLoaderData()
  const router = useRouter()

  const [editModal, setEditModal] = useState<{ isOpen: boolean; blog?: any }>({ isOpen: false })
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; blog?: any }>({ isOpen: false })
  const [actionLoading, setActionLoading] = useState(false)

  const updateParams = (newParams: Partial<BlogsSearch>) => {
    navigate({
      search: (prev) => ({ ...prev, ...newParams }),
    })
  }

  const getCategoryTitle = (categoryId: string) => {
    const category = categories.find((c: any) => c.id === categoryId)
    return category ? category.title : 'Unknown'
  }

  const columns = [
    { key: 'title', header: 'Title' },
    { 
      key: 'category_id', 
      header: 'Category',
      render: (item: any) => item.category || getCategoryTitle(item.category_id)
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (item: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.status === 'published' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
      )
    },
    { key: 'created_at', header: 'Created', render: (item: any) => new Date(item.created_at).toLocaleDateString() },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => setEditModal({ isOpen: true, blog: item })}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteModal({ isOpen: true, blog: item })}
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

  const handleSave = async (data: any) => {
    setActionLoading(true)
    try {
      if (editModal.blog) {
        // Update
        const result = await updateBlogFn({ data: { id: editModal.blog.id, ...data } })
        
        if (result.ok) {
          addToast('success', 'Blog updated successfully')
          await router.invalidate()
        } else {
          addToast('error', result.error || 'Failed to update blog')
        }
      } else {
        // Create
        const result = await createBlogFn({ data })
        
        if (result.ok) {
          addToast('success', 'Blog created successfully')
          await router.invalidate()
        } else {
          addToast('error', result.error || 'Failed to create blog')
        }
      }
      setEditModal({ isOpen: false })
    } catch {
      addToast('error', 'Failed to save blog')
    } finally {
      setActionLoading(false)
    }
  }



  const handleDelete = async () => {
    setActionLoading(true)
    console.log('🗑️ handleDelete called for blog:', deleteModal.blog?.id)
    try {
      console.log('📤 Calling deleteBlogFn...')
      const result = await deleteBlogFn({ data: { id: deleteModal.blog.id } })
      console.log('📥 deleteBlogFn returned:', result)
      
      if (result.ok) {
        console.log('✅ Delete successful, showing toast and invalidating router')
        addToast('success', 'Blog deleted successfully')
        await router.invalidate()
        console.log('✅ Router invalidated after blog deletion')
      } else {
        console.error('❌ Delete failed:', result.error)
        addToast('error', result.error || 'Failed to delete blog')
      }
      setDeleteModal({ isOpen: false })
    } catch (error) {
      console.error('❌ Delete exception:', error)
      addToast('error', 'Failed to delete blog')
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#2D3748]">Blogs</h1>
          <Button
            onClick={handleCreate}
            variant="primary"
            className="bg-[#1A365D] hover:bg-[#1A365D]/90"
          >
            <Plus className="w-4 h-4" />
            Add Blog
          </Button>
        </div>

        <Table
          data={blogs}
          columns={columns}
          currentPage={page}
          totalPages={Math.ceil(totalCount / pageSize)}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={(p) => updateParams({ page: p })}
          onPageSizeChange={(ps) => updateParams({ pageSize: ps, page: 1 })}
          isLoading={false}
        />

        <EditBlogModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false })}
          onSave={handleSave}
          blog={editModal.blog}
          categories={categories}
          isLoading={actionLoading}
        />

        <DeleteBlogModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false })}
          onConfirm={handleDelete}
          blog={deleteModal.blog}
          isLoading={actionLoading}
        />
      </div>
    </AdminLayout>
  )
}
