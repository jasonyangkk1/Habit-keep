import './globals.css'

export const metadata = {
  title: 'LifeFlow',
  description: '個人日程、心情、習慣追蹤',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'LifeFlow',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <head>
        {/* 精確控制 viewport，禁止放大，cover 讓全螢幕沒白邊 */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LifeFlow" />
        <meta name="theme-color" content="#F2F2F7" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {})
              })
            }
            // 攔截所有手勢縮放
            document.addEventListener('gesturestart',  e => e.preventDefault(), { passive: false })
            document.addEventListener('gesturechange', e => e.preventDefault(), { passive: false })
            document.addEventListener('gestureend',    e => e.preventDefault(), { passive: false })
            // 攔截雙指 pinch（touchmove 多點觸控）
            document.addEventListener('touchmove', e => {
              if (e.touches.length > 1) e.preventDefault()
            }, { passive: false })
          `
        }} />
      </body>
    </html>
  )
}
