import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ArchIcons - 网络拓扑与云架构矢量设备图标库',
  description: '专为网络工程师、系统架构师打造的高清矢量架构拓扑设备图标库。支持 2.5D 等轴测、2D 逻辑拓扑与云架构服务，一键复制 SVG 源码与 PNG。',
  keywords: [
    '拓扑图图标',
    '网络设备图标',
    '2.5D等轴测图标',
    'Cisco图标',
    '华为拓扑图标',
    'aws icons svg',
    'drawio icons library',
    '架构师工具箱',
  ],
  authors: [{ name: 'icon.bin0sky.tech' }],
  metadataBase: new URL('https://icon.bin0sky.tech'),
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'ArchIcons - 拓扑设备矢量图标库',
    description: '高清矢量架构拓扑设备图标库，支持一键复制 SVG / PNG 与 Draw.io 导出。',
    url: 'https://icon.bin0sky.tech',
    siteName: 'ArchIcons',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        {/* Anti-Flicker Theme Initialization Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var saved=localStorage.getItem('archicons_theme_mode');var isDark=saved?saved==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(isDark){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="antialiased bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col font-sans transition-colors">
        {children}
        <script
          src="https://bin0sky.tech/shared/nav-pill.js"
          data-title="ArchIcons"
          data-category="apps"
          defer
        />
      </body>
    </html>
  );
}
