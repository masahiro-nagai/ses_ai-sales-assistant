'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Users, Send, PenTool, Settings, HelpCircle, Briefcase } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const navItems = [
  { name: 'ダッシュボード', href: '/', icon: LayoutDashboard },
  { name: '企業マスター', href: '/companies', icon: Building2 },
  { name: '候補者マスター', href: '/candidates', icon: Users },
  { name: '案件マスター', href: '/cases', icon: Briefcase },
  { name: '送信ログ', href: '/logs', icon: Send },
  { name: 'メッセージ作成', href: '/messages/new', icon: PenTool },
  { name: '使い方', href: '/help', icon: HelpCircle },
  { name: '設定', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const initializeListeners = useAppStore((state) => state.initializeListeners);

  useEffect(() => {
    initializeListeners();
  }, [initializeListeners]);

  return (
    <div className= "w-64 bg-white border-r border-gray-200 flex flex-col h-full" >
    <div className="h-16 flex items-center px-6 border-b border-gray-200" >
      <h1 className="text-lg font-bold text-indigo-600" > SES AI Sales </h1>
        </div>
        < nav className = "flex-1 py-4 px-3 space-y-1 overflow-y-auto" >
          {
            navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
              key= { item.name }
              href = { item.href }
              className = {`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
            }
            >
              <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-700' : 'text-gray-400'}`} />
          { item.name }
          </Link>
          );
})}
</nav>
  </div>
  );
}
