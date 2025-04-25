'use client'

import React, { useState, useEffect, ChangeEvent } from 'react'
import { ChevronDown, FileText, UploadCloud } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

// Tipos para persistência
interface FileItem { id: number; name: string; url: string }
interface Subcategory { id: number; title: string; files: FileItem[] }
interface Category { id: number; title: string; subcategories: Subcategory[] }

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [openCat, setOpenCat] = useState<number | null>(null)
  const [openSub, setOpenSub] = useState<number | null>(null)

  // Carrega categorias e subcategorias com arquivos
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select(
          `
            id,
            title,
            subcategories(id, title, file_items(id, name, url))
          `
        )
      if (error) {
        console.error(error)
        return
      }

      const formatted: Category[] = (data || []).map(cat => ({
        id: cat.id,
        title: cat.title,
        subcategories: (cat.subcategories || []).map(sub => ({
          id: sub.id,
          title: sub.title,
          files: (sub.file_items || []).map(f => ({ id: f.id, name: f.name, url: f.url })),
        })),
      }))

      setCategories(formatted)
    }

    fetchCategories()
  }, [])

  // Faz upload e insere registro
  async function handleUpload(e: ChangeEvent<HTMLInputElement>, subId: number) {
    const files = e.target.files
    if (!files) return

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const path = `${subId}/${file.name}`
      // Upload para Storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('uploads')
        .upload(path, file)
      if (uploadError) {
        console.error(uploadError)
        continue
      }

      // Obtém URL pública (sync)
      const { data: urlData } = supabase
        .storage
        .from('uploads')
        .getPublicUrl(uploadData.path)
      const publicUrl = urlData.publicUrl

      // Insere no DB
      const { error: insertError } = await supabase
        .from('file_items')
        .insert({ subcategory_id: subId, name: file.name, url: publicUrl })
      if (insertError) console.error(insertError)
    }

    // Recarrega lista para refletir novos uploads
    const currentCat = openCat
    setOpenCat(null)
    setOpenSub(null)
    setTimeout(() => setOpenCat(currentCat), 300)

    e.target.value = ''
  }

  return (
    <div className="mb-6">
      <h3 className="mb-2 text-sm font-semibold text-gray-500 uppercase">Categories</h3>
      {categories.map(cat => {
        const isCatOpen = openCat === cat.id
        return (
          <div key={cat.id} className="mb-1">
            <button
              onClick={() => setOpenCat(isCatOpen ? null : cat.id)}
              className="w-full flex items-center justify-between px-2 py-1 hover:bg-gray-100 rounded"
            >
              <span className="font-medium text-gray-700">{cat.title}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transform transition-transform ${isCatOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isCatOpen && (
              <div className="pl-6 mt-1">
                {cat.subcategories.map(sub => {
                  const isSubOpen = openSub === sub.id
                  return (
                    <div key={sub.id} className="mb-2">
                      <button
                        onClick={() => setOpenSub(isSubOpen ? null : sub.id)}
                        className="w-full flex items-center justify-between pr-2 py-1 text-gray-600 hover:bg-gray-50 rounded"
                      >
                        <span>{sub.title}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                            {sub.files.length}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transform transition-transform ${isSubOpen ? 'rotate-180' : ''}`}
                          />
                        </div>
                      </button>
                      {isSubOpen && (
                        <div className="mt-1 mb-2">
                          <input
                            type="file"
                            multiple
                            onChange={e => handleUpload(e, sub.id)}
                            className="mb-2"
                          />
                          {sub.files.length > 0 && (
                            <ul className="list-disc list-inside text-sm">
                              {sub.files.map(file => (
                                <li key={file.id} className="flex items-center space-x-2">
                                  <FileText className="w-4 h-4 text-gray-500" />
                                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {file.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
