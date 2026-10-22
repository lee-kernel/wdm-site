import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const base = process.env.DOCS_BASE || '/docs';

export default defineConfig({
  site: process.env.SITE_URL,
  base,
  outDir: '../dist/docs',
  emptyOutDir: false,
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'WDM 文档',
      description: 'WDM 智能工作助手的使用指南与功能说明。',
      logo: {
        src: './src/assets/logo.png',
        alt: 'WDM',
      },
      components: { Hero: './src/components/DocsHero.astro' },
      favicon: '/favicon.png',
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/lee-kernel/wdm-site',
        },
      ],
      head: [
        { tag: 'script', attrs: { src: `${base.replace(/\/$/, '')}/screenshots.js`, defer: true } },
        {
          tag: 'script',
          content:
            "try { if (localStorage.getItem('wdm-docs-theme-initialized') !== '1') { if (!localStorage.getItem('starlight-theme')) localStorage.setItem('starlight-theme', 'dark'); localStorage.setItem('wdm-docs-theme-initialized', '1'); } } catch {}",
        },
      ],
      sidebar: [
        {
          label: '开始使用',
          items: [
            { label: '文档首页', slug: 'index' },
            { label: '快速开始', slug: 'getting-started' },
            { label: '功能总览', slug: 'overview' },
          ],
        },
        {
          label: '使用指南',
          items: [
            'guides/reports',
            'guides/prompts',
            'guides/scripts',
            'guides/pitfalls',
            'guides/sharing',
            'guides/tags',
            'guides/automation',
            'guides/notifications',
            'guides/account-security',
            'guides/backup',
          ],
        },
        {
          label: '使用须知',
          items: [
            'reference/ai-and-script-safety',
            'reference/faq',
          ],
        },
        {
          label: '相关入口',
          items: [
            { label: '返回宣传站', link: '../' },
            {
              label: '进入工作台',
              link: 'https://www.aiwdm.cn',
              attrs: { target: '_blank', rel: 'noopener noreferrer' },
            },
          ],
        },
      ],
      customCss: ['./src/styles/custom.css'],
      lastUpdated: true,
      disable404Route: true,
    }),
  ],
});
