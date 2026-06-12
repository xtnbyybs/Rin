'use client';

import React, { useEffect, useRef, useState } from 'react';
import { myPlaylist } from './playlist'; // 引入你刚才建的歌单文件

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0); // 当前播放的歌曲序号，默认第一首(0)
  const [isPlaying, setIsPlaying] = useState(false);

  // 获取当前正在播放的歌曲信息
  const currentSong = myPlaylist[currentIndex];

  // 当 currentIndex 改变时（即切歌时），自动播放新歌
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.log('切歌时自动播放被浏览器拦截:', err);
        setIsPlaying(false);
      });
    }
  }, [currentIndex]);

  // 播放/暂停 控制
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => console.log('请先与页面互动后再播放'));
      }
    }
  };

  // 下一首
  const playNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === myPlaylist.length - 1 ? 0 : prevIndex + 1
    );
  };

  // 上一首
  const playPrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? myPlaylist.length - 1 : prevIndex - 1
    );
  };

  // 播放列表为空时不渲染
  if (!currentSong) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px', // 改为 left: 20px，固定在左下角
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        borderRadius: '16px',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 9999,
        width: '260px', // 给播放器一个固定宽度
      }}
    >
      {/* 隐藏的原生音频标签，监听 onEnded 事件实现自动下一首 */}
      <audio 
        ref={audioRef} 
        src={currentSong.musicUrl} 
        onEnded={playNext} 
      />

      {/* 封面图（播放时旋转） */}
      <div style={{ position: 'relative', width: '46px', height: '46px', flexShrink: 0 }}>
        <img
          src={currentSong.avatar}
          alt="cover"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
            animation: isPlaying ? 'spin 6s linear infinite' : 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        />
      </div>

      <style>
        {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
      </style>

      {/* 歌曲信息与控制区 */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
        
        {/* 歌名与歌手 */}
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '6px' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#222', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentSong.songName}
          </span>
          <span style={{ fontSize: '11px', color: '#777', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentSong.singer}
          </span>
        </div>

        {/* 控制按钮区 (上一首, 播放/暂停, 下一首) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={playPrev} style={btnStyle}>
            {/* 上一首 SVG 图标 */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
          </button>
          
          <button onClick={togglePlay} style={{...btnStyle, transform: 'scale(1.2)'}}>
            {/* 播放/暂停 SVG 图标 */}
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          
          <button onClick={playNext} style={btnStyle}>
             {/* 下一首 SVG 图标 */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
          </button>
        </div>

      </div>
    </div>
  );
};

// 按钮的通用样式提取，保持代码整洁
const btnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#444',
  transition: 'color 0.2s ease',
};
