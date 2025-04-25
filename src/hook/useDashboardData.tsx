// src/hooks/useDashboardData.ts
'use client'
import { useState, useEffect, ReactNode } from 'react'
import { useDashboardMetrics } from './useDashBoardMetrics'
import {
  ChevronRight,
  FileText,
  Award,
  File as FileIcon,
  CheckCircle,
  XCircle,
  UploadCloud,
} from 'lucide-react'

// Types for various data structures
export type NavItem = { label: string; icon: ReactNode }
export type AccountItem = { label: string; className?: string }
export type StatItem = {
  label: string
  count: number
  delta: string
  icon: ReactNode
  bg: string
}
export type RecentFile = {
  name: string
  topic: string
  date: string
  status: 'Accepted' | 'Pending' | 'Denied'
}
export type Activity = {
  text: string
  when: string
  icon: ReactNode
}
export type Deadline = { label: string; info: string; delta: string }

/**
 * Hook that aggregates all dashboard data into separate stateful values.
 */
export function useDashboardData() {
  // numeric metrics
  const { pendingFiles, acceptedFiles, deniedFiles, pointsEarned } = useDashboardMetrics()

  // static nav items
  const [navItems] = useState<NavItem[]>([
    { label: 'Dashboard', icon: <ChevronRight className="inline-block mr-2" /> },
    { label: 'All Files', icon: <FileText className="inline-block mr-2" /> },
    { label: 'Achievements', icon: <Award className="inline-block mr-2" /> },
    { label: 'Notes', icon: <FileIcon className="inline-block mr-2" /> },
  ])

  // static account menu
  const [accountItems] = useState<AccountItem[]>([
    { label: 'Profile' },
    { label: 'Settings' },
    { label: 'Logout', className: 'text-red-600' },
  ])

  // stats cards, update when metrics change
  const [stats, setStats] = useState<StatItem[]>([])
  useEffect(() => {
    setStats([
      {
        label: 'Pending Files',
        count: pendingFiles,
        delta: '+3 today',
        icon: <FileText className="w-6 h-6 text-yellow-500" />,
        bg: 'bg-yellow-50',
      },
      {
        label: 'Accepted Files',
        count: acceptedFiles,
        delta: '+14 this week',
        icon: <CheckCircle className="w-6 h-6 text-green-500" />,
        bg: 'bg-green-50',
      },
      {
        label: 'Denied Files',
        count: deniedFiles,
        delta: '-2 vs last week',
        icon: <XCircle className="w-6 h-6 text-red-500" />,
        bg: 'bg-red-50',
      },
      {
        label: 'Points Earned',
        count: pointsEarned,
        delta: '+18 this week',
        icon: <Award className="w-6 h-6 text-purple-500" />,
        bg: 'bg-purple-50',
      },
    ])
  }, [pendingFiles, acceptedFiles, deniedFiles, pointsEarned])

  // recent files
  const [recentFiles] = useState<RecentFile[]>([
    { name: 'Annual_Report_2024.pdf', topic: 'Annual Statements', date: 'Apr 10, 2024', status: 'Accepted' },
    { name: 'Q1_Financial_Report.xlsx', topic: 'Financial Reports', date: 'Apr 18, 2024', status: 'Pending' },
    { name: 'Tax_Compliance_2024.docx', topic: 'Tax Documents', date: 'Apr 20, 2024', status: 'Denied' },
  ])

  // activities
  const [activities] = useState<Activity[]>([
    { text: 'You uploaded Annual_Report_2024.pdf', when: 'about 1 year ago', icon: <UploadCloud className="inline-block mr-2 text-blue-500" /> },
    { text: 'Admin approved Annual_Report_2024.pdf', when: 'about 1 year ago', icon: <CheckCircle className="inline-block mr-2 text-green-500" /> },
    { text: 'You earned the Consistent Contributor badge', when: 'about 1 year ago', icon: <Award className="inline-block mr-2 text-purple-500" /> },
  ])

  // deadlines
  const [deadlines] = useState<Deadline[]>([
    { label: 'Annual Report Submission', info: '3 files required', delta: '11 months left' },
    { label: 'Q2 Financial Report', info: '2 files required', delta: '10 months left' },
    { label: 'Tax Documentation', info: '1 file required', delta: '12 months left' },
  ])

  return { navItems, accountItems, stats, recentFiles, activities, deadlines }
}
