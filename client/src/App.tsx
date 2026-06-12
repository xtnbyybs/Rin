
import { AppProviders } from "./app/providers";
import { AppRoutes } from "./app/routes";
import { useAppBootstrap } from "./app/use-app-bootstrap";
import { MusicPlayer } from '@/components/MusicPlayer';

function AppContent() {
  const { config, profile } = useAppBootstrap();
  return (
    <AppProviders config={config} profile={profile}>
      <AppRoutes />
    </AppProviders>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>
        {/* 原有应用主体 */}
        <AppContent />
        {children}

        {/* 全局播放器，置于页面最底部 */}
        <MusicPlayer />
      </body>
    </html>
  );
}
