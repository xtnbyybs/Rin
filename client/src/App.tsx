import { AppProviders } from "./app/providers";
import { AppRoutes } from "./app/routes";
import { useAppBootstrap } from "./app/use-app-bootstrap";

// 1. 引入你刚才创建的音乐播放器组件
// 🚨 注意：请确保这里的相对路径与你实际存放文件的位置一致
// 假设你把它放在了同级的 components 文件夹里：
import { MusicPlayer } from "./components/MusicPlayer"; 

function App() {
  const { config, profile } = useAppBootstrap();

  return (
    <AppProviders config={config} profile={profile}>
      {/* 博客的所有页面内容 */}
      <AppRoutes />
      
      {/* 2. 把音乐播放器挂载在这里，作为全局悬浮组件 */}
      <MusicPlayer />
    </AppProviders>
  )
}

export default App
