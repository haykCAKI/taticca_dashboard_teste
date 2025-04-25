'use client'

import React from 'react'
import {
  Search,
  Bell,
  FileText,
  MoreVertical,
  UploadCloud,
  ArrowRight,
} from 'lucide-react'
import { useDashboard } from '@/hook/useDashBoard'
import { Categories } from '@/components/Categories'

export default function SmartRepositoryPage() {
  const {
    navItems,
    accountItems,
    stats,
    recentFiles,
    activities,
    deadlines,
  } = useDashboard()

  return (
    <div className="flex h-screen text-gray-800 bg-gray-50">
      {/* ─── SIDEBAR ─────────────────────────────────────────── */}
      <aside className="w-64 border-r border-gray-200 p-6 flex flex-col">
        <h2 className="mb-8 text-xl font-bold">Smart Repository</h2>

        {/* Nav */}
        <nav className="space-y-4 mb-6">
          {navItems.map(({ label, icon }) => (
            <a
              key={label}
              href="#"
              className="flex items-center space-x-2 text-gray-700 hover:text-black"
            >
              {icon}
              <span>{label}</span>
            </a>
          ))}
        </nav>

        {/* Categories */}
        <Categories />

        {/* Account */}
        <div className="mb-4 text-sm font-semibold text-gray-500 uppercase">
          Your Account
        </div>
        <nav className="space-y-2">
          {accountItems.map(({ label, className }) => (
            <a
              key={label}
              href="#"
              className={`px-2 py-1 rounded hover:bg-gray-100 ${
                className ?? 'text-gray-700'
              }`}
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>

      {/* ─── MAIN CONTENT ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="relative w-1/3">
            <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-full">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 font-semibold">
                AD
              </div>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-8">
          {/* ─── STATS CARDS (coloridos) ────────────────────────── */}
          <div className="grid grid-cols-4 gap-6">
            {stats.map(({ label, count, delta, icon, bg }) => (
              <div key={label} className={`p-4 rounded-lg shadow-sm ${bg}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{label}</h3>
                  <div className="p-2 bg-white rounded">{icon}</div>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold">{count}</span>
                  <span className="text-sm text-gray-600">{delta}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ─── RECENT FILES ──────────────────────────────────── */}
          <section className="rounded-lg bg-white shadow-sm p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Files</h2>
              <button className="flex items-center text-blue-600">
                View All <ArrowRight className="ml-1 w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="py-2 px-4">File</th>
                    <th className="py-2 px-4">Topic</th>
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentFiles.map(({ name, topic, date, status }) => (
                    <tr
                      key={name}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="flex items-center space-x-2 py-2 px-4">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <span>{name}</span>
                      </td>
                      <td className="py-2 px-4">{topic}</td>
                      <td className="py-2 px-4">{date}</td>
                      <td className="py-2 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            status === 'Accepted'
                              ? 'bg-green-100 text-green-800'
                              : status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ─── UPLOAD + WIDGETS ───────────────────────────────── */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-white p-6 shadow-sm">
              <UploadCloud className="mb-4 w-12 h-12 text-gray-400" />
              <p className="mb-4 text-gray-600">Drag and drop your files here</p>
              <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Select Files
              </button>
            </div>

            {/* Recent Activity */}
            <section className="space-y-4 rounded-lg bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-md font-semibold">Recent Activity</h3>
              <ul className="max-h-40 space-y-2 overflow-y-auto text-sm text-gray-700">
                {activities.map(({ text, occurred, icon }, i) => (
                  <li key={i} className="flex items-center">
                    {icon}
                    <span>{text}</span>
                    <span className="ml-auto text-xs text-gray-500">
                      {occurred}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Deadlines */}
            <section className="space-y-3 rounded-lg bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-md font-semibold">
                Upcoming Deadlines
              </h3>
              <ul className="text-sm">
                {deadlines.map(({ label, info, delta }, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded px-2 py-1 hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{label}</p>
                      <p className="text-gray-500">{info}</p>
                    </div>
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">
                      {delta}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
