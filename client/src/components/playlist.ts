// 文件路径：src/components/playlist.ts
// 你可以在这里无限添加歌曲，注意每首歌用大括号 {} 包起来，用逗号分隔
export const myPlaylist = [
  {
    id: 1,
    songName: '晴天',
    singer: '周杰伦',
    // 换成你刚才API里抓到的或者以后自己找的图片链接
    avatar: 'https://imge.kugou.com/mvhdpic/400/20200620/20200620174316264397.jpg', 
    // 你的音乐直链，请尽量确保是 https 开头的
    musicUrl: 'https://fsmvpc.tx.kugou.com/202606121835/a2be70bc445d66de9373cc35100217c9/v2/9c2ee96c98e7da251af731875d9e2cb4/KGTX/CLTX002/9c2ee96c98e7da251af731875d9e2cb4.mp4', 
  },
  {
    id: 2,
    songName: '测试歌曲二',
    singer: '某某歌手',
    avatar: 'https://via.placeholder.com/150', // 占位图
    musicUrl: 'https://www.w3school.com.cn/i/horse.mp3', // 测试用音频
  },
  // { ...继续添加下一首... }
];
