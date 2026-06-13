// 文件路径：src/components/playlist.ts

export interface SongItem {
  id: number;
  songName: string;
  singer: string;
  avatar: string;    // 🌐 音乐城或外部 API 的图片链接
  musicUrl: string;  // 💾 你仓库中 public/music/ 文件夹下的 MP3 路径
}

export const myPlaylist: SongItem[] = [
  {
    id: 1,
    songName: '天使的翅膀',
    singer: '安琥',
    // 🌐 换成你希望通过网络调用的 Logo 链接
    avatar: 'https://p3.music.126.net/jLEkebownHPo0QhXMnwCFA==/109951166562831996.jpg?param=800y800',
    // 💾 保持你上传到本地 public/music/ 下的音频路径
    musicUrl: '/music/tianshi.mp3'
  },
  {
    id: 2,
    songName: '游京 (我闻着饼香)',
    singer: 'Dj阿农',
    avatar: 'https://p3.music.126.net/ENeEcRyp5fu_x0MYfxzQag==/109951170281627001.jpg?param=800y800',
    musicUrl: '/music/youjing.mp3'
  },
  {
    id: 3,
    songName: '曾经是情侣 (Live)',
    singer: '梁博',
    avatar: 'https://p3.music.126.net/GLiLYkBs9Gq7TXOkMz1g0w==/109951164137683554.jpg?param=800y800',
    musicUrl: '/music/cengjing.mp3'
  },
  {
    id: 4,
    songName: '失控 (DJ版)',
    singer: '井迪儿',
    avatar: 'https://p3.music.126.net/2ikHR2NS_VKKAQtIsw_izQ==/109951172729017624.jpg?param=800y800',
    musicUrl: '/music/shikong.mp3'
  },
  {
    id: 5,
    songName: '桃花诺',
    singer: 'G.E.M.邓紫棋',
    avatar: 'https://p3.music.126.net/_v7ezNPQOEJ3aFir8MZmzQ==/19050138463061697.jpg?param=800y800',
    musicUrl: '/music/taohuanuo.mp3'
  },
  {
    id: 6,
    songName: '起风了',
    singer: '冯沁苑(买辣椒也用券)',
    avatar: 'https://p3.music.126.net/diGAyEmpymX8G7JcnElncQ==/109951163699673355.jpg?param=800y800',
    musicUrl: '/music/qifengle.mp3'
  },
  {
    id: 7,
    songName: '执迷不悟',
    singer: '小乐哥',
    avatar: 'https://p3.music.126.net/NQCtUkal5sPxK1Y25SW3-Q==/109951165303077538.jpg?param=800y800',
    musicUrl: '/music/zhimibuwu.mp3'
  },
  {
    id: 8,
    songName: '绿色',
    singer: '陈雪凝',
    avatar: 'https://p3.music.126.net/R4ZP3AJ9xV0vvw8LX7AbMA==/109951163860425334.jpg?param=800y800',
    musicUrl: '/music/lvse.mp3'
  }
];
