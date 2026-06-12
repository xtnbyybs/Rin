import { useContext, useEffect, useRef, useState } from 'react';
import Popup from 'reactjs-popup';
import { useLocation } from 'wouter';
import { ClientConfigContext } from '../state/config';
import { Helmet } from "react-helmet";
import { siteName } from '../utils/constants';
import { useTranslation } from "react-i18next";
import { buildLoginPath, HIDDEN_LOGIN_REDIRECT } from "../utils/auth-redirect";

type ThemeMode = 'light' | 'dark' | 'system';

// 建站日期，改成你自己的
const siteStart = new Date('2026-06-12');

function getRunTimeStr(start: Date) {
  const now = new Date();
  let ms = now.getTime() - start.getTime();
  if (ms < 0) ms = 0;

  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;

  return `${d}天 ${h}时 ${m}分 ${sec}秒`;
}

function Footer() {
    const { t } = useTranslation();
    const [, setLocation] = useLocation();
    const [modeState, setModeState] = useState<ThemeMode>('system');
    const [runTime, setRunTime] = useState(() => getRunTimeStr(siteStart));

    // 每秒更新运行时间
    useEffect(() => {
        const timer = setInterval(() => {
            setRunTime(getRunTimeStr(siteStart));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const config = useContext(ClientConfigContext);
    const footerHtml = config.get<string>('footer');
    const footerHtmlRef = useRef<HTMLDivElement | null>(null);
    const mountedScriptNodesRef = useRef<HTMLScriptElement[]>([]);
    const loginEnabled = config.getBoolean('login.enabled');
    const [doubleClickTimes, setDoubleClickTimes] = useState(0);

    useEffect(() => {
        const mode = localStorage.getItem('theme') as ThemeMode || 'system';
        setModeState(mode);
        setMode(mode);
    }, []);

    useEffect(() => {
        const container = footerHtmlRef.current;
        if (!container) return;

        mountedScriptNodesRef.current.forEach((script) => script.remove());
        mountedScriptNodesRef.current = [];
        container.replaceChildren();

        if (!footerHtml) return;

        const template = document.createElement('template');
        template.innerHTML = footerHtml;

        const scripts = Array.from(template.content.querySelectorAll('script'));
        scripts.forEach((script) => script.remove());

        container.appendChild(template.content.cloneNode(true));

        scripts.forEach((script) => {
            const nextScript = document.createElement('script');
            Array.from(script.attributes).forEach((attribute) => {
                nextScript.setAttribute(attribute.name, attribute.value);
            });
            nextScript.textContent = script.textContent;
            container.appendChild(nextScript);
            mountedScriptNodesRef.current.push(nextScript);
        });

        return () => {
            mountedScriptNodesRef.current.forEach((script) => script.remove());
            mountedScriptNodesRef.current = [];
        };
    }, [footerHtml]);

    const setMode = (mode: ThemeMode) => {
        setModeState(mode);
        localStorage.setItem('theme', mode);

        if (mode !== 'system' || (!('theme' in localStorage) && window.matchMedia(`(prefers-color-scheme: ${mode})`).matches)) {
            document.documentElement.setAttribute('data-color-mode', mode);
        } else {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            document.documentElement.setAttribute('data-color-mode', mediaQuery.matches ? 'dark' : 'light');
        }
        window.dispatchEvent(new Event("colorSchemeChange"));
    };

    return (
        <footer>
            <Helmet>
                <link rel="alternate" type="application/rss+xml" title={siteName} href="/rss.xml" />
                <link rel="alternate" type="application/atom+xml" title={siteName} href="/atom.xml" />
                <link rel="alternate" type="application/json" title={siteName} href="/rss.json" />
            </Helmet>
            <div className="flex flex-col mb-8 space-y-2 justify-center items-center t-primary ani-show">
                <div ref={footerHtmlRef} />

                {/* 第一行：版权 + RSS */}
                <p className='text-sm text-neutral-500 font-normal link-line'>
                    <span onDoubleClick={() => {
                        if (doubleClickTimes >= 2) {
                            setDoubleClickTimes(0);
                            if (!loginEnabled) {
                                setLocation(buildLoginPath(HIDDEN_LOGIN_REDIRECT));
                            }
                        } else {
                            setDoubleClickTimes(doubleClickTimes + 1);
                        }
                    }}>
                        © {new Date().getFullYear()} Powered by <a className='hover:underline' href="https://915161.xyz" target="_blank">Rin / 汤</a>
                    </span>
                    {config.getBoolean('rss') && (
                        <>
                            <Spliter />
                            <Popup
                                trigger={
                                    <button className="hover:underline" type="button">
                                        RSS
                                    </button>
                                }
                                position="top center"
                                arrow={false}
                                closeOnDocumentClick
                            >
                                <div className="border-card">
                                    <p className='font-bold t-primary'>
                                        {t('footer.rss')}
                                    </p>
                                    <p>
                                        <a href='/rss.xml'>RSS</a>
                                        <Spliter />
                                        <a href='/atom.xml'>Atom</a>
                                        <Spliter />
                                        <a href='/rss.json'>JSON</a>
                                    </p>
                                </div>
                            </Popup>
                        </>
                    )}
                </p>

                {/* 第二行：运行时间 */}
                <p className='text-sm text-neutral-500 font-normal'>
                    本站已运行：{runTime}
                </p>

                {/* 第三行：你要的服务图标行 */}
                <p className='text-sm text-neutral-500 font-normal flex items-center justify-center flex-wrap gap-x-2'>
                    <span className="inline-flex items-center gap-1">
                        Protected by
                        <img 
                            src="https://www.cloudflare.com/img/logo-cloudflare.svg" 
                            alt="Cloudflare" 
                            className="h-4 inline-block align-middle" 
                        />
                    </span>
                    <span className="px-1">|</span>
                    <span className="inline-flex items-center gap-1">
                        Storage by
                        <img 
                            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
                            alt="GitHub" 
                            className="h-4 inline-block align-middle" 
                        />
                    </span>
                    <span className="px-1">|</span>
                    <span className="inline-flex items-center gap-1">
                        Analytics by
                        <img 
                            src="https://assets.vercel.com/image/upload/v1607554387/repositories/logos/vercel-logotype-light.svg" 
                            alt="Vercel" 
                            className="h-4 inline-block align-middle" 
                        />
                    </span>
                </p>

                <div className="w-fit-content inline-flex rounded-full border border-zinc-200 p-[3px] dark:border-zinc-700">
                    <ThemeButton mode='light' current={modeState} label="Toggle light mode" icon="ri-sun-line" onClick={setMode} />
                    <ThemeButton mode='system' current={modeState} label="Toggle system mode" icon="ri-computer-line" onClick={setMode} />
                    <ThemeButton mode='dark' current={modeState} label="Toggle dark mode" icon="ri-moon-line" onClick={setMode} />
                </div>
            </div>
        </footer>
    );
}

function Spliter() {
    return <span className='px-1'>|</span>;
}

function ThemeButton({
    current,
    mode,
    label,
    icon,
    onClick
}: {
    current: ThemeMode;
    label: string;
    mode: ThemeMode;
    icon: string;
    onClick: (mode: ThemeMode) => void;
}) {
    return (
        <button
            aria-label={label}
            type="button"
            onClick={() => onClick(mode)}
            className={`rounded-inherit inline-flex h-[32px] w-[32px] items-center justify-center border-0 t-primary ${
                current === mode ? "bg-w rounded-full shadow-xl shadow-light" : ""
            }`}
        >
            <i className={icon} />
        </button>
    );
}

export default Footer;
