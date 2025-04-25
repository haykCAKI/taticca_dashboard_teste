'use client'

import React, { useState, useEffect, ChangeEvent } from 'react'
import Link from 'next/link'
import { Search, Bell } from 'lucide-react'
import { useDashboard } from '@/hooks/useDashBoard'
import { supabase } from '@/lib/supabaseClient'

// Modelagem dos dados vindos do Supabase
interface FileItem {
  id: number
  name: string
  url: string
  uploaded_at: string
}
interface Subcategory {
  id: number
  title: string
  file_items: FileItem[]
}
interface Category {
  id: number
  title: string
  description: string
  subcategories: Subcategory[]
}

export default function CategoriesPage() {
  const { navItems, accountItems } = useDashboard()
  const [categories, setCategories] = useState<Category[]>([])
  const [filter, setFilter] = useState('')

  // Busca categorias com descrição, subcategorias e arquivos
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('categories')
        .select(
          `
            id,
            title,
            description,
            subcategories (
              id,
              title,
              file_items (
                id,
                name,
                url,
                uploaded_at
              )
            )
          `
        )
      if (error) {
        console.error('Error fetching categories:', error)
        return
      }
      setCategories(data || [])
    }
    load()
  }, [])

  // Filtra pelo título de categoria ou subcategoria
  const visible = categories.filter(cat =>
    cat.title.toLowerCase().includes(filter.toLowerCase()) ||
    cat.subcategories.some(sub =>
      sub.title.toLowerCase().includes(filter.toLowerCase())
    )
  )

  // Classes de fundo alternadas
  const bgClasses = ['bg-blue-50', 'bg-green-50', 'bg-yellow-50', 'bg-purple-50', 'bg-red-50']

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 p-6 flex flex-col">
        <h2 className="mb-8 text-xl font-bold">
          <Link href="/">Dashboard</Link>
        </h2>
        <nav className="space-y-4 mb-6">
          {navItems.map(({ label, icon }) => (
            <Link
              key={label}
              href={label === 'Dashboard' ? '/' : `/${label.toLowerCase()}`}
              className="flex items-center space-x-2 hover:text-black"
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
          <div className="flex items-center space-x-2 text-blue-600 font-medium">
            <span>Categories</span>
          </div>
        </nav>
        <div className="mb-4 uppercase text-sm font-semibold text-gray-500">Your Account</div>
        <nav className="space-y-2">
          {accountItems.map(({ label, className }) => (
            <a
              key={label}
              href="#"
              className={`px-2 py-1 rounded hover:bg-gray-100 ${className ?? 'text-gray-700'}`}
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Cabeçalho */}
        <header className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Categorias</h1>
            <p className="text-sm text-gray-500">Navegue por todas as categorias de documentos</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Gerenciar Categorias
          </button>
        </header>

        {/* Filtro de busca */}
        <div className="p-6">
          <div className="relative w-1/3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Filtrar categorias..."
              value={filter}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded focus:ring focus:border-blue-300"
            />
          </div>
        </div>

        {/* Cards de Categorias */}
        <main className="p-6 grid grid-cols-2 gap-6 overflow-y-auto">
          {visible.map((cat, idx) => {
            const totalFiles = cat.subcategories.reduce((acc, sub) => acc + sub.file_items.length, 0)
            return (
              <div
                key={cat.id}
                className={`${bgClasses[idx % bgClasses.length]} border rounded-lg shadow-sm p-6`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{cat.title}</h3>
                  <span className="text-sm bg-white px-3 py-1 rounded-full shadow">{totalFiles} Arquivos</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{cat.description}</p>
                <div className="space-y-4">
                  {cat.subcategories.map(sub => (
                    <div key={sub.id} className="bg-white border rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">{sub.title}</h4>
                      <ul className="space-y-1">
                        {sub.file_items.map(f => (
                          <li key={f.id} className="flex justify-between items-center">
                            <span className="text-gray-800">{f.name}</span>
                            <span className="text-gray-600 text-sm">
                              {new Date(f.uploaded_at).toLocaleDateString()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </main>
      </div>
    </div>
  )
}
