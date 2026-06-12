// 文件路径：src/components/playlist.ts

// 1. 显式定义歌曲数据的标准类型结构，防止打包时报错
export interface SongItem {
  id: number;
  songName: string;
  singer: string;
  avatar: string;
  musicUrl: string;
}

export const myPlaylist: SongItem[] = [
  {
    id: 1,
    songName: '先说爱的人为什么先离开',
    singer: '田园',
    avatar: 'https://p3.music.126.net/A5zsSALgQ6H3L7CBNJu5kw==/109951170221051685.jpg?param=800y800',
    musicUrl: 'https://m801.music.126.net/20260613012835/a12d5f7440ee234f4950f040554e1fe0/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/56898307819/d988/e735/57e4/3e6f28491449865e747f5a588bcf8598.mp3?vuutv=Vg1xADMuk2Stzex6Ri432BYktlhODGhaKP1r0ipKaO3fmUaFylXDT84PSniyRkj50/qC6FBUvNqs5cs/qxVGiE5OB/Jz0LPLdaOvzr0lKrY='
  },
  {
    id: 2,
    songName: '天使的翅膀',
    singer: '安琥',
    avatar: 'https://p3.music.126.net/jLEkebownHPo0QhXMnwCFA==/109951166562831996.jpg?param=800y800',
    musicUrl: 'https://m802.music.126.net/20260613012931/daa2999518e9a8e31b14ad1a249ac3e6/jd-musicrep-ts/bac6/ff21/61c2/99e6fc0e2601846b270292ee7a379646.?vuutv=CTGh0GFt+agM1rkx7f/AD5J+71UEm4z2L6mBeV+aRO40En4Y0abKhqcEe06QcHWjiZvJ0joYrPV5xRiW6rzxwoDlM+e60OHiCfievvdNPF4='
  },
  {
    id: 3,
    songName: '春泥',
    singer: '小昕',
    avatar: 'https://p3.music.126.net/IUM11VTZlzd_lR7pDdevwA==/109951172973359416.jpg?param=800y800',
    musicUrl: 'https://m801.music.126.net/20260613013004/b35d70a6b2433690cec42026e47c10b6/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/79297503926/5c0e/13f4/43e9/520c87bc644200193f9c3184dff1becd.mp3?vuutv=cr5ShdN1DisNL6FsiKzai36cAko9+Hqe2SYcoaw5gfBZPJYUFECg9qJevUprgw2+GAqXRU3Zmc+HGJ8ToANqmwLBmdb3GAAWKoLn8dgHTMAqhcQgCot7sYQy5T29hQsy'
  },
  {
    id: 4,
    songName: '游京 (我闻着饼香)',
    singer: 'Dj阿农',
    avatar: 'https://p3.music.126.net/ENeEcRyp5fu_x0MYfxzQag==/109951170281627001.jpg?param=800y800',
    musicUrl: 'https://m802.music.126.net/20260613013033/a8a6b3d66f536cdc2c5c577eabcf6b46/jd-musicrep-ts/3f46/8c27/f5b2/939fb4e0d278da1a2f0072ce8b778d3d.mp3?vuutv=njsN0k6v8SI1dkI614HKcGhFtJNqUUo3z0pteGUVt57m845bEGMSpYZONfKTZ+xJ0Mr0KI89DgIvSUr5sSpsi41aPJ0XPZBFYS0PpV21bNM='
  },
  {
    id: 5,
    songName: '曾经是情侣 (Live)',
    singer: '梁博',
    avatar: 'https://p3.music.126.net/GLiLYkBs9Gq7TXOkMz1g0w==/109951164137683554.jpg?param=800y800',
    musicUrl: 'https://m801.music.126.net/20260613012853/1055e152d0a96de8f01a84c3715c9508/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/23733231609/1d6a/c449/ff8d/1bee6d7ad965ab4c5cb2daaf1cec0644.mp3?vuutv=yOOxqYIkQY0D78aeiKXCjaUWXbsc71UQv91owfSYehm+mp23zDc99XUadJnf35DFxQ7zpPokic3bpydwpBC4OsRQxUQXd9yGGKM/4LDFu+s='
  },
  {
    id: 6,
    songName: '失控 (DJ版)',
    singer: 'Mr-DJ小廖Remix',
    avatar: 'https://p3.music.126.net/2ikHR2NS_VKKAQtIsw_izQ==/109951172729017624.jpg?param=800y800',
    musicUrl: 'https://m801.music.126.net/20260613012443/d8245ac8cf824c6e04834cdca1ee8c3c/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/78356275866/aab4/e16f/42ac/11943e54b341bd33a49b3a7717dc6027.mp3?vuutv=0Ktg0fOJFUdQzaW0XY/BNV1wJehLlekzxOiCthEu9+8fcgYuToRs2rWAX5fWeoFz2PvIzxc/jv5Z+ALYZyiH3lA8L61w0Ikr01FBITCEacQ='
  },
  {
    id: 7,
    songName: '唯一',
    singer: 'G.E.M.邓紫棋',
    avatar: 'https://p3.music.126.net/aJWtwvdYRXvKUpAE2C6NoA==/109951168919708423.jpg?param=800y800',
    musicUrl: 'https://m801.music.126.net/20260613011403/11145631582eaa0bc7165250eff1e647/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/30494978901/348f/592a/21a7/352a294583ee8acd2fe4c87b837653f2.mp3?vuutv=gtvNJ6xcg2nJk2z2EmPvnu+BILhzyhWQmwQkLfcAYo7N2zLe55VX3vFBTlDXnu6lS7gReONqR7StNF2f1KBWXNZVoQeqDZruo5kO6Xow12s='
  },
  {
    id: 8,
    songName: '桃花诺',
    singer: 'G.E.M.邓紫棋',
    avatar: 'https://p3.music.126.net/_v7ezNPQOEJ3aFir8MZmzQ==/19050138463061697.jpg?param=800y800',
    musicUrl: 'https://m802.music.126.net/20260613013223/adb1ed71ea1cf68577a01ba82adcf0ff/jd-musicrep-ts/72a9/85d8/851b/3df521519ada40a39f8b58353f120315.mp3?vuutv=FivdmInWbTJPuBsdMG3stVKy9jTV0wP6KGyuA/weDyS4fseDr4K46XTTKv8M2wXVQLbaoREB3OgVfES82t1lYIOPWsU1ngkttWfTLrF/hQIlqOzXkMBRAC+Kr/xoimql'
  },
  {
    id: 9,
    songName: '暖一杯茶',
    singer: '邵帅',
    avatar: 'https://p3.music.126.net/dAP3RXAs9dA73zNYz_3XSg==/109951164151547523.jpg?param=800y800',
    musicUrl: 'https://m801.music.126.net/20260613013243/abacd2a7b41e3681d08c8c0bda6fa5cb/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/14096570456/2c66/0d75/bb46/eb1ef1f4360fc474fe702f578af39121.mp3?vuutv=dR4Ukvzmq0FWxqKHWvsLDz1knbrXgYvhUqK++IZBx9qLeQ5LjaNT9+UgTfhWsXhlGiQrRl/BKUA8/QAwkUoViRzsg8njtAE45dg6yi5MX4s='
  },
  {
    id: 10,
    songName: '起风了',
    singer: '冯沁苑(买辣椒也用券)',
    avatar: 'https://p3.music.126.net/diGAyEmpymX8G7JcnElncQ==/109951163699673355.jpg?param=800y800',
    musicUrl: 'https://m801.music.126.net/20260613012535/66bc3b55b7421bb704359d1d7b5574d2/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/28481711284/6dc0/f58f/bc29/cd16662177fd431d137cb5837c1be8d1.mp3?vuutv=sDlfgChUX1X1e8AQ+T+8RrprJMyR/FedHd9X+OFr9KkGnMfjh3ICYv1CYAFsc7f+nAhXlEsdUzpIIRr/2KVwNlJwGWW9Z88d41LCsPD9As2lgkmbjqPA1CDrKHe/0QjC'
  },
  {
    id: 11,
    songName: '无人之岛',
    singer: '任然',
    avatar: 'https://p3.music.126.net/mIUtHBPTJ52H78_FhHzcWg==/19188676928210304.jpg?param=800y800',
    musicUrl: 'https://m802.music.126.net/20260613013315/ab8e147410c38d71c81bcaa5361787ea/jd-musicrep-ts/d58d/3ef8/b61b/0943fc2693a68f70a301820c274c21f0.?vuutv=pLvkEnEchA9UXqnIrhfq+kJaVH/U/ypJdYKFO0Un92mtVkPWuyhsHBOTFBA5YNYzYkJgeeDmqyXUognbwKUkG556l+0H+TyMA5AFpl1Sioo='
  },
  {
    id: 12,
    songName: '执迷不悟',
    singer: '鱿籽酱',
    avatar: 'https://p3.music.126.net/NQCtUkal5sPxK1Y25SW3-Q==/109951165303077538.jpg?param=800y800',
    musicUrl: 'https://m8.music.126.net/20260613013403/34b7a924f61486ff96672ac90406003d/ymusic/obj/w5zDlMODwrDDiGjCn8Ky/3932161208/c5f3/ec14/4ae7/e570bb582e2dfcb15fbccce4d2b31e97.mp3?vuutv=Oe0X2FemVXUg9mwL1OaCAitpNjc8b6C9NlDPx8ON/QcyjfLEjXAiAYmBqWMXIWtWkccCSnqFoIz7ejOUajpCn59zKLne0bqd0NBpzl19TDU='
  },
  {
    id: 13,
    songName: '谁 (Live版)',
    singer: '廖俊涛',
    avatar: 'https://p3.music.126.net/7HzttIveECGYRhAjKCCdfg==/109951163315608239.jpg?param=800y800',
    musicUrl: 'https://p3.music.126.net/20260613013425/604c993dc88376e7c59db9b7981666fb/ymusic/4baa/0465/b2f2/8007e8d1f1d6aad4105d9841b52e065b.mp3?vuutv=p+hzprkzkyE0SgDbYbVySYJ0lNGjE3fDLbYrND5uH0STEAbZehst/Y0ybDRT+OI0NpLtvXoIvB0W/hksTPuTErLDOD29dwt13gvDHuCRoqY='
  },
  {
    id: 14,
    songName: '绿色',
    singer: '陈雪凝',
    avatar: 'https://p3.music.126.net/R4ZP3AJ9xV0vvw8LX7AbMA==/109951163860425334.jpg?param=800y800',
    musicUrl: 'https://m802.music.126.net/20260613013448/ccb6c761aad0e3ae8006ce5eb530b297/jd-musicrep-ts/0a66/19fa/2d0f/4dec4becc7d23fa6e12302f3795be938.mp3?vuutv=0uRvvgpjuMngF+4PM2QRRGvAe9Gb3n80yiRfbfjsSHvKGwNakRZ0foV5TvS2XdxggwQPabcBoRmyIdglhxkVIKJhfLPjdBF2Zx1Y0dxivWE='
  },
{
    id: 15,
    songName: '晴天',
    singer: '周杰伦',
    avatar: 'https://imge.kugou.com/mvhdpic/400/20200620/20200620174316264397.jpg',
    musicUrl: 'https://fsmvpc.tx.kugou.com/202606121835/a2be70bc445d66de9373cc35100217c9/v2/9c2ee96c98e7da251af731875d9e2cb4/KGTX/CLTX002/9c2ee96c98e7da251af731875d9e2cb4.mp4'
  },
  {
    id: 16,
    songName: '测试歌曲二',
    singer: '某某歌手',
    avatar: 'https://via.placeholder.com/150',
    musicUrl: 'https://www.w3school.com.cn/i/horse.mp3'
  }
];
