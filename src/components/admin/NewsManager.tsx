// ─── Community Stories & News Manager (Admin) ─────────────────────────────────────────
'use client'

import { useState, useTransition, useRef, ChangeEvent } from 'react'
import { uploadImage } from '@/lib/uploadClient'
import Image from 'next/image'
import type { NewsPost } from '@/types'
import { NEWS_CATEGORIES, getNewsCategoryStyle } from '@/lib/validations'
import StatusBadge from './StatusBadge'
import EmptyState from './EmptyState'

interface NewsManagerProps {
  initialPosts: NewsPost[]
  totalCount: number
}

interface FormState {
  title: string
  slug: string
  category: string
  excerpt: string
  content: string
  author: string
  featuredImage: string
  imagePublicId: string
  featured: boolean
  published: boolean
  publishedAt: string
}

const defaultFormState: FormState = {
  title: '',
  slug: '',
  category: 'Community Impact',
  excerpt: '',
  content: '',
  author: 'TCIP Team',
  featuredImage: '',
  imagePublicId: '',
  featured: false,
  published: true,
  publishedAt: '',
}

export default function NewsManager({ initialPosts, totalCount }: NewsManagerProps) {
  const [posts, setPosts] = useState<NewsPost[]>(initialPosts)
  const [total, setTotal] = useState(totalCount)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'FEATURED'>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null)
  const [formData, setFormData] = useState<FormState>(defaultFormState)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [bannerMsg, setBannerMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Image upload state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [, startTransition] = useTransition()

  // Auto-generate slug from title
  const handleTitleChange = (newTitle: string) => {
    setFormData((prev) => {
      const generatedSlug = prev.slug === '' || !editingPost
        ? newTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
        : prev.slug
      return { ...prev, title: newTitle, slug: generatedSlug }
    })
  }

  // Open modal for Create
  const openCreateModal = () => {
    setEditingPost(null)
    setFormData({
      ...defaultFormState,
      publishedAt: new Date().toISOString().split('T')[0],
    })
    setErrors({})
    setBannerMsg(null)
    setIsModalOpen(true)
  }

  // Open modal for Edit
  const openEditModal = (post: NewsPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      category: post.category || 'Community Impact',
      excerpt: post.excerpt || '',
      content: post.content,
      author: post.author || 'TCIP Team',
      featuredImage: post.featuredImage || '',
      imagePublicId: post.imagePublicId || '',
      featured: post.featured,
      published: post.published,
      publishedAt: post.publishedAt
        ? new Date(post.publishedAt).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    })
    setErrors({})
    setBannerMsg(null)
    setIsModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setEditingPost(null)
    setFormData(defaultFormState)
    setErrors({})
  }

  // Handle Cloudinary Image Upload
  const handleImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: 'Please choose a JPEG, PNG, or WebP image.' }))
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image size exceeds 8 MB limit.' }))
      return
    }

    setUploadingImage(true)
    setErrors((prev) => {
      const next = { ...prev }
      delete next.image
      return next
    })

    try {
      const result = await uploadImage(file, 'news')
      if (!result.ok) {
        setErrors((prev) => ({ ...prev, image: result.message }))
      } else {
        const media = result.media
        setFormData((prev) => ({
          ...prev,
          featuredImage: media.url,
          imagePublicId: media.publicId || '',
        }))
      }
    } catch {
      setErrors((prev) => ({ ...prev, image: 'Upload failed unexpectedly. Please try again.' }))
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Remove image from form
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      featuredImage: '',
      imagePublicId: '',
    }))
  }

  // Save (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSaving(true)

    try {
      const url = editingPost ? `/api/admin/news/${editingPost.id}` : '/api/admin/news'
      const method = editingPost ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.fields) {
          setErrors(data.fields)
        }
        setBannerMsg({ type: 'error', text: data.error || 'Failed to save story.' })
      } else {
        const savedPost: NewsPost = data.post
        setBannerMsg({
          type: 'success',
          text: editingPost ? 'Story updated successfully!' : 'Community story published successfully!',
        })

        startTransition(() => {
          if (editingPost) {
            setPosts((prev) => prev.map((p) => (p.id === savedPost.id ? savedPost : p)))
          } else {
            setPosts((prev) => [savedPost, ...prev])
            setTotal((prev) => prev + 1)
          }
        })
        closeModal()
      }
    } catch {
      setBannerMsg({ type: 'error', text: 'Network error while saving story.' })
    } finally {
      setIsSaving(false)
    }
  }

  // Quick Toggle Published
  const handleTogglePublished = async (post: NewsPost) => {
    const nextPublished = !post.published
    try {
      const res = await fetch(`/api/admin/news/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: nextPublished }),
      })

      const data = await res.json()
      if (res.ok) {
        setPosts((prev) => prev.map((p) => (p.id === post.id ? data.post : p)))
        setBannerMsg({
          type: 'success',
          text: `Story status updated to ${nextPublished ? 'Published' : 'Draft'}.`,
        })
      }
    } catch {
      setBannerMsg({ type: 'error', text: 'Failed to update publication status.' })
    }
  }

  // Quick Toggle Featured
  const handleToggleFeatured = async (post: NewsPost) => {
    const nextFeatured = !post.featured
    try {
      const res = await fetch(`/api/admin/news/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: nextFeatured }),
      })

      const data = await res.json()
      if (res.ok) {
        setPosts((prev) => prev.map((p) => (p.id === post.id ? data.post : p)))
        setBannerMsg({
          type: 'success',
          text: `Story ${nextFeatured ? 'is now Featured' : 'removed from Featured'}.`,
        })
      }
    } catch {
      setBannerMsg({ type: 'error', text: 'Failed to update featured status.' })
    }
  }

  // Delete Post
  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id))
        setTotal((prev) => Math.max(0, prev - 1))
        setBannerMsg({ type: 'success', text: 'Story deleted successfully.' })
        setDeleteConfirmId(null)
      } else {
        const data = await res.json()
        setBannerMsg({ type: 'error', text: data.error || 'Failed to delete story.' })
      }
    } catch {
      setBannerMsg({ type: 'error', text: 'Network error while deleting story.' })
    } finally {
      setIsDeleting(false)
    }
  }

  // Filtered list
  const filteredPosts = posts.filter((post) => {
    const matchSearch =
      search === '' ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      (post.author && post.author.toLowerCase().includes(search.toLowerCase())) ||
      (post.category && post.category.toLowerCase().includes(search.toLowerCase())) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(search.toLowerCase()))

    const matchStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'PUBLISHED'
        ? post.published
        : statusFilter === 'DRAFT'
        ? !post.published
        : post.featured

    const matchCategory =
      categoryFilter === 'ALL' || post.category === categoryFilter

    return matchSearch && matchStatus && matchCategory
  })

  const inputClass = `w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900
    bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] transition-all`

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Community Stories & News</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage published news, impact stories, and community updates ({total} total).
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803D] transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Story
        </button>
      </div>

      {/* Notification banner */}
      {bannerMsg && (
        <div
          className={`text-sm px-4 py-3 rounded-xl flex items-center justify-between font-medium ${
            bannerMsg.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          <span>{bannerMsg.text}</span>
          <button
            onClick={() => setBannerMsg(null)}
            className="text-xs font-bold underline opacity-80 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search stories by title, author, or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] bg-gray-50/50"
          />
          <svg
            className="w-4 h-4 absolute left-3 top-2.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 text-xs text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30"
          >
            <option value="ALL">All Categories</option>
            {NEWS_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700">
            {(['ALL', 'PUBLISHED', 'DRAFT', 'FEATURED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-white shadow-xs text-gray-900 font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon="📰"
              title="No news posts found"
              message={
                search || statusFilter !== 'ALL' || categoryFilter !== 'ALL'
                  ? 'Try adjusting your filters or search term.'
                  : 'Get started by creating your first community story.'
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Story</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Author</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Featured</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPosts.map((post) => {
                  const catStyle = getNewsCategoryStyle(post.category)
                  return (
                    <tr key={post.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Story title & image */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {post.featuredImage ? (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-200 bg-gray-50">
                              <Image
                                src={post.featuredImage}
                                alt={post.title}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl shrink-0">
                              📰
                            </div>
                          )}
                          <div className="min-w-0 max-w-xs sm:max-w-md">
                            <p className="font-bold text-gray-900 truncate">{post.title}</p>
                            <p className="text-xs text-gray-500 font-mono truncate">/news/{post.slug}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                        >
                          {post.category || 'Community Impact'}
                        </span>
                      </td>

                      {/* Author */}
                      <td className="px-4 py-4 text-xs text-gray-600 whitespace-nowrap">
                        {post.author || 'TCIP Team'}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePublished(post)}
                          className="cursor-pointer transition-opacity hover:opacity-80"
                          title="Click to toggle publish status"
                        >
                          <StatusBadge status={post.published ? 'PUBLISHED' : 'DRAFT'} />
                        </button>
                      </td>

                      {/* Featured */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleFeatured(post)}
                          className={`px-2 py-0.5 rounded-md text-xs font-semibold border transition-colors cursor-pointer ${
                            post.featured
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-gray-100 text-gray-400 border-gray-200 hover:text-gray-600'
                          }`}
                        >
                          {post.featured ? '★ Featured' : '☆ Normal'}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 text-xs text-gray-500 whitespace-nowrap font-medium">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString('en-CA', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '—'}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => openEditModal(post)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit story"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(post.id)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete story"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── CREATE / EDIT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingPost ? 'Edit Story' : 'Create Story'}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Fill in the details for your article or community impact story.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Story Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. TCIP Hosts Annual Youth Leadership Summit"
                  className={inputClass}
                  required
                />
                {errors.title && <p className="text-xs text-red-600 mt-1 font-medium">{errors.title}</p>}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center rounded-xl border border-gray-300 bg-white overflow-hidden">
                  <span className="px-3 py-2.5 bg-gray-50 text-xs text-gray-500 font-mono border-r border-gray-300">
                    /news/
                  </span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="tcip-hosts-annual-youth-leadership-summit"
                    className="flex-1 px-3 py-2 text-xs font-mono text-gray-900 focus:outline-none"
                    required
                  />
                </div>
                {errors.slug && <p className="text-xs text-red-600 mt-1 font-medium">{errors.slug}</p>}
              </div>

              {/* Category & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={inputClass}
                  >
                    {NEWS_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="e.g. TCIP Team"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Featured Image (Cloudinary) */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Story Featured Image
                </label>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                  {formData.featuredImage ? (
                    <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border border-gray-200 bg-white">
                      <Image
                        src={formData.featuredImage}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 px-3 py-1.5 rounded-lg bg-black/75 text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-gray-300 rounded-lg bg-white text-center">
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs font-bold text-gray-800 mb-1">
                        {uploadingImage ? 'Uploading to Cloudinary…' : 'Upload story hero photo'}
                      </p>
                      <p className="text-[11px] text-gray-500">JPEG, PNG, or WebP. Max 8 MB.</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="mt-3 px-4 py-2 rounded-lg text-xs font-bold text-white bg-gray-900 hover:bg-black transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                      >
                        {uploadingImage ? 'Uploading…' : 'Select Photo'}
                      </button>
                    </div>
                  )}
                  {errors.image && <p className="text-xs text-red-600 font-medium">{errors.image}</p>}
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Summary / Excerpt
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Short 1-2 sentence teaser for cards and previews…"
                  className={inputClass}
                />
                {errors.excerpt && <p className="text-xs text-red-600 mt-1 font-medium">{errors.excerpt}</p>}
              </div>

              {/* Story Content */}
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                  Story Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the full story body here…"
                  className={inputClass}
                  required
                />
                {errors.content && <p className="text-xs text-red-600 mt-1 font-medium">{errors.content}</p>}
              </div>

              {/* Publication Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 items-center">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded text-[#16A34A] focus:ring-[#16A34A]"
                  />
                  Published
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-[#16A34A] focus:ring-[#16A34A]"
                  />
                  Featured Story
                </label>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                    Publication Date
                  </label>
                  <input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                    className="w-full px-2.5 py-1 text-xs rounded-lg border border-gray-300 bg-white"
                  />
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || uploadingImage}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803D] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? 'Saving…' : editingPost ? 'Update Story' : 'Publish Story'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-red-200 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-lg font-bold text-gray-900">Delete Story</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Are you sure you want to permanently delete this story? This will remove the article from the public site and cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Deleting…' : 'Yes, Delete Story'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
