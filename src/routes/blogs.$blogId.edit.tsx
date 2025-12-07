import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout } from '@/components/admin-layout'
import { requireAuth } from '@/utils/auth-guard'
import { Button } from '@/components/ui/buttons'
import { ImageUpload } from '@/components/ui/image-upload'
import { useToast } from '@/contexts/toast-context'
import { updateBlogFn, getBlogsFn } from '@/server/blogs'
import { getBlogCategoriesFn } from '@/server/categories'

export const Route = createFileRoute('/blogs/$blogId/edit')({
  loader: async ({ params: { blogId } }) => {
    await requireAuth()
    const [blogResult, categoriesResult] = await Promise.all([
      getBlogsFn({ data: { id: blogId } }),
      getBlogCategoriesFn({ data: { page: 1, page_size: 100 } })
    ])

    if (!blogResult.ok || !blogResult.data) {
      throw new Error('Failed to load blog')
    }

    const blogData = Array.isArray(blogResult.data) ? blogResult.data[0] : (blogResult.data.data?.[0] || blogResult.data)

    return {
      blog: blogData,
      categories: Array.isArray(categoriesResult.data) ? categoriesResult.data : categoriesResult.data?.data || []
    }
  },
  component: EditBlogPage,
})

function EditBlogPage() {
  const { blog, categories } = Route.useLoaderData()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [title, setTitle] = useState(blog.title)
  const [content, setContent] = useState(blog.content)
  const [categoryId, setCategoryId] = useState(blog.category_id || '')
  const [status, setStatus] = useState<'draft' | 'published'>(blog.status)
  const [tags, setTags] = useState(blog.tags ? blog.tags.join(', ') : '')
  const [imageId, setImageId] = useState<string>(blog.image_ids?.[0] || '')

  // Handle category name to ID mapping if ID is missing
  useEffect(() => {
    if (!blog.category_id && blog.category) {
      const matchingCategory = categories.find((c: any) => c.title === blog.category)
      if (matchingCategory) {
        setCategoryId(matchingCategory.id)
      }
    }
  }, [blog, categories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !categoryId) return

    setIsLoading(true)
    try {
      const result = await updateBlogFn({
        data: {
          id: blog.id,
          title: title.trim(),
          content: content.trim(),
          category_id: categoryId,
          status,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          image_ids: imageId ? [imageId] : []
        }
      })

      if (result.ok) {
        addToast('success', 'Blog updated successfully')
        navigate({ to: '/blogs' })
      } else {
        addToast('error', result.error || 'Failed to update blog')
      }
    } catch {
      addToast('error', 'Failed to update blog')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate({ to: '/blogs' })}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-[#2D3748]">Edit Blog Post</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                  placeholder="Enter blog title"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent bg-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
                  placeholder="news, updates, travel"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent min-h-[300px]"
                  placeholder="Write your blog content here..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <ImageUpload
                    onUploadComplete={(id) => setImageId(id)}
                    onRemove={() => setImageId('')}
                    currentImageId={imageId}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Button
                type="button"
                onClick={() => navigate({ to: '/blogs' })}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
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
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
