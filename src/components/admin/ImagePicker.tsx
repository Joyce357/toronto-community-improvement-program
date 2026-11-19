'use client'
// ─── Reusable admin image field ─────────────────────────────────────────────
// Two clear workflows for ANY image field:
//   A. Select from Gallery (media library, thumbnails)
//   B. Upload New Image (native file picker → shared upload pipeline)
// plus preview, filename, progress, success, replace, remove/reset and errors.

import { useEffect, useId, useRef, useState } from 'react'
import {
  ACCEPT_ATTR,
  UPLOAD_LIMITS_MB,
  uploadImage,
  validateImageClient,
  type UploadPurpose,
  type UploadedMedia,
} from '@/lib/uploadClient'

interface LibraryItem {
  id: string
  title: string | null
  imageUrl: string
  published: boolean
}

interface Props {
  label: string
  value: string
  onChange: (url: string) => void
  purpose?: UploadPurpose
  /** Alt text control (shown when provided) */
  alt?: string
  onAltChange?: (alt: string) => void
  /** Text for the reset button (e.g. “Reset to default”). Defaults to “Remove”. */
  resetLabel?: string
  /** Called after a successful upload (e.g. to refresh a library list). */
  onUploaded?: (media: UploadedMedia) => void
}

const btn =
  'inline-flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

export default function ImagePicker({
  label, value, onChange, purpose = 'homepage', alt, onAltChange, resetLabel = 'Remove', onUploaded,
}: Props) {
  const inputId = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
  const [progress, setProgress] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [libOpen, setLibOpen] = useState(false)
  const [libLoading, setLibLoading] = useState(false)
  const [libError, setLibError] = useState<string | null>(null)
  const [libItems, setLibItems] = useState<LibraryItem[] | null>(null)

  const uploading = progress !== null

  useEffect(() => () => { if (localPreview) URL.revokeObjectURL(localPreview) }, [localPreview])

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file
    if (!file) return
    setError(null)
    setSuccess(null)

    const problem = validateImageClient(file, purpose)
    if (problem) { setError(problem); return }

    setFileInfo({ name: file.name, size: file.size })
    setLocalPreview(URL.createObjectURL(file))
    setProgress(0)

    const result = await uploadImage(file, purpose, {
      onProgress: setProgress,
      registerInLibrary: true, // makes it selectable from the Gallery library later
    })
    setProgress(null)

    if (!result.ok) {
      setError(result.message)
      setLocalPreview(null)
      return
    }
    setLibItems(null) // refresh library next time it opens
    onChange(result.media.url)
    onUploaded?.(result.media)
    setSuccess('Image uploaded and selected. Remember to save your changes.')
  }

  async function openLibrary() {
    setLibOpen(true)
    if (libItems) return
    setLibLoading(true)
    setLibError(null)
    try {
      const res = await fetch('/api/admin/gallery?limit=100', { credentials: 'same-origin' })
      if (res.status === 401 || res.redirected) throw new Error('Your session has expired. Please sign in again.')
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error?.message || data?.error || 'Could not load the Gallery.')
      const items: LibraryItem[] = (data.items ?? []).map((i: LibraryItem) => ({
        id: i.id, title: i.title, imageUrl: i.imageUrl, published: i.published,
      }))
      // Published first
      items.sort((a, b) => Number(b.published) - Number(a.published))
      setLibItems(items)
    } catch (err) {
      setLibError((err as Error).message || 'Could not load the Gallery.')
    } finally {
      setLibLoading(false)
    }
  }

  function choose(item: LibraryItem) {
    setError(null)
    setFileInfo(null)
    setLocalPreview(null)
    onChange(item.imageUrl)
    if (onAltChange && !alt) onAltChange(item.title || '')
    setSuccess(`Selected “${item.title || 'Untitled photo'}” from the Gallery. Remember to save your changes.`)
    setLibOpen(false)
  }

  const shown = localPreview || value

  return (
    <div className="space-y-2">
      <p className="block text-xs font-bold text-[#4B5563]">{label}</p>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-28 h-40 sm:h-28 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[11px] text-gray-400 px-2 text-center">No image selected</span>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={openLibrary} disabled={uploading}
              className={`${btn} bg-white border-gray-300 text-[#111827] hover:bg-gray-50`}>
              Select from Gallery
            </button>
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              className={`${btn} bg-[#16A34A] border-[#16A34A] text-white hover:bg-[#15803D]`}
              aria-controls={inputId}>
              {uploading ? 'Uploading…' : value ? 'Replace Image' : 'Upload New Image'}
            </button>
            {value && !uploading && (
              <button type="button" onClick={() => { onChange(''); setFileInfo(null); setLocalPreview(null); setSuccess(null) }}
                className={`${btn} bg-white border-red-200 text-red-600 hover:bg-red-50`}>
                {resetLabel}
              </button>
            )}
          </div>

          <input id={inputId} ref={fileRef} type="file" accept={ACCEPT_ATTR} onChange={onFile}
            className="sr-only" aria-label={`${label}: choose an image file from your computer`} />

          <p className="text-[11px] text-[#6B7280]">
            JPEG, PNG or WebP · up to {UPLOAD_LIMITS_MB[purpose]} MB
            {fileInfo && <> · <span className="font-semibold">{fileInfo.name}</span> ({(fileInfo.size / 1024 / 1024).toFixed(2)} MB)</>}
          </p>

          {uploading && (
            <div role="progressbar" aria-valuenow={progress ?? 0} aria-valuemin={0} aria-valuemax={100}
              className="h-2 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full bg-[#16A34A] transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
          {error && <p role="alert" className="text-xs font-medium text-red-600">{error}</p>}
          {success && !error && <p role="status" className="text-xs font-medium text-green-700">{success}</p>}

          {onAltChange && (
            <div>
              <label className="block text-[11px] font-bold text-[#4B5563] mb-1">Image description (alt text, for accessibility)</label>
              <input value={alt ?? ''} onChange={(e) => onAltChange(e.target.value)} maxLength={200}
                placeholder="Briefly describe what the photo shows"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#16A34A]/40 focus:border-[#16A34A]" />
            </div>
          )}
        </div>
      </div>

      {libOpen && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
          role="dialog" aria-modal="true" aria-label="Select an image from the Gallery"
          onClick={() => setLibOpen(false)}>
          <div className="bg-white w-full sm:max-w-3xl max-h-[90vh] flex flex-col rounded-t-2xl sm:rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-sm font-extrabold text-[#111827]">Select from Gallery</h3>
              <button type="button" onClick={() => setLibOpen(false)} aria-label="Close"
                className="text-gray-500 hover:text-gray-800 text-xl leading-none px-2">×</button>
            </div>
            <div className="p-5 overflow-y-auto">
              {libLoading && <p className="text-sm text-gray-500">Loading Gallery…</p>}
              {libError && <p role="alert" className="text-sm text-red-600">{libError}</p>}
              {!libLoading && !libError && libItems && libItems.length === 0 && (
                <p className="text-sm text-gray-600">No Gallery images available yet.</p>
              )}
              {!libLoading && libItems && libItems.length > 0 && (
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {libItems.map((item) => (
                    <li key={item.id}>
                      <button type="button" onClick={() => choose(item)}
                        className={`group w-full text-left rounded-lg overflow-hidden border-2 ${item.imageUrl === value ? 'border-[#16A34A]' : 'border-transparent hover:border-gray-300'} bg-gray-50`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.imageUrl} alt={item.title || 'Gallery photo'} loading="lazy" className="w-full h-24 object-cover" />
                        <span className="block px-2 py-1.5 text-[11px] font-semibold text-[#111827] truncate">{item.title || 'Untitled photo'}</span>
                        {!item.published && <span className="block px-2 pb-1.5 text-[10px] font-bold text-amber-700">Unpublished (library only)</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

