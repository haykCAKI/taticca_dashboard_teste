'use client';

import { useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  ChevronRight,
  FileText,
  Award,
  File as FileIcon,
  CheckCircle,
  XCircle,
  UploadCloud,
} from 'lucide-react';

// Mapeamento de nomes de ícones para componentes
const ICONS: Record<string, ReactNode> = {
  ChevronRight: <ChevronRight className="inline-block mr-2" />,
  FileText: <FileText className="inline-block mr-2" />,
  Award: <Award className="inline-block mr-2" />,
  FileIcon: <FileIcon className="inline-block mr-2" />,
  CheckCircle: <CheckCircle className="inline-block mr-2" />,
  XCircle: <XCircle className="inline-block mr-2" />,
  UploadCloud: <UploadCloud className="inline-block mr-2" />,
};

// Tipos para os dados carregados
export type NavItem = { label: string; icon: ReactNode };
export type AccountItem = { label: string; className?: string };
export type StatItem = { label: string; count: number; delta: string; icon: ReactNode; bg: string };
export type RecentFile = { name: string; topic: string; date: string; status: string };
export type Activity = { text: string; occurred: string; icon: ReactNode };
export type Deadline = { label: string; info: string; delta: string };

export function useDashboard() {
  // Estados para métricas
  const [pendingFiles, setPendingFiles] = useState<number>(0);
  const [acceptedFiles, setAcceptedFiles] = useState<number>(0);
  const [deniedFiles, setDeniedFiles] = useState<number>(0);
  const [pointsEarned, setPointsEarned] = useState<number>(0);

  // Estados para listas
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [accountItems, setAccountItems] = useState<AccountItem[]>([]);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);

  // Funções para recarregar partes específicas
  async function fetchMetrics() {
    const { data: metrics } = await supabase
      .from('dashboard_metrics')
      .select('metric_key, metric_value');
    metrics?.forEach(({ metric_key, metric_value }) => {
      switch (metric_key) {
        case 'pending_files':
          setPendingFiles(metric_value);
          break;
        case 'accepted_files':
          setAcceptedFiles(metric_value);
          break;
        case 'denied_files':
          setDeniedFiles(metric_value);
          break;
        case 'points_earned':
          setPointsEarned(metric_value);
          break;
      }
    });
  }

  async function fetchNav() {
    const { data: nav } = await supabase.from('nav_items').select('label, icon_name');
    setNavItems(nav?.map(r => ({ label: r.label, icon: ICONS[r.icon_name] || null })) ?? []);
  }

  async function fetchAccount() {
    const { data: acct } = await supabase
      .from('account_items')
      .select('label, class_name');
    setAccountItems(acct?.map(r => ({ label: r.label, className: r.class_name })) ?? []);
  }

  async function fetchStats() {
    const { data: statRows } = await supabase
      .from('stats')
      .select('label, count, delta, icon_name, bg');
    setStats(
      statRows?.map(r => ({
        label: r.label,
        count: r.count,
        delta: r.delta,
        icon: ICONS[r.icon_name] || null,
        bg: r.bg,
      })) ?? []
    );
  }

  async function fetchRecentFiles() {
    const { data: rec } = await supabase
      .from('recent_files')
      .select('name, topic, date, status');
    setRecentFiles(rec ?? []);
  }

  async function fetchActivities() {
    const { data: acts } = await supabase
      .from('activities')
      .select('text, when_text, icon_name');
    setActivities(
      acts?.map(r => ({ text: r.text, occurred: r.when_text, icon: ICONS[r.icon_name] || null })) ?? []
    );
  }

  async function fetchDeadlines() {
    const { data: dls } = await supabase.from('deadlines').select('label, info, delta');
    setDeadlines(dls ?? []);
  }

  // Carrega todos os dados de uma vez
  async function fetchData() {
    await Promise.all([
      fetchMetrics(),
      fetchNav(),
      fetchAccount(),
      fetchStats(),
      fetchRecentFiles(),
      fetchActivities(),
      fetchDeadlines(),
    ]);
  }

  useEffect(() => {
    // Fetch inicial
    fetchData();

    // Inscrição em Realtime para cada tabela
    const channel = supabase
      .channel('dashboard-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'dashboard_metrics' },
        () => fetchMetrics()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'nav_items' },
        () => fetchNav()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'account_items' },
        () => fetchAccount()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'stats' },
        () => fetchStats()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'recent_files' },
        () => fetchRecentFiles()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'activities' },
        () => fetchActivities()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'deadlines' },
        () => fetchDeadlines()
      )
      .subscribe();

    // Limpeza ao desmontar
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    pendingFiles,
    acceptedFiles,
    deniedFiles,
    pointsEarned,
    navItems,
    accountItems,
    stats,
    recentFiles,
    activities,
    deadlines,
  };
}
