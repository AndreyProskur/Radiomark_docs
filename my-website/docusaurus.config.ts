import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// PlantUML
const remarkSimplePlantuml = require('@akebifiky/remark-simple-plantuml');

const config: Config = {
  title: 'Radiomark Docs',
  tagline: 'Документация платформы Radiomark',
  favicon: 'img/favicon.ico',

  url: 'https://AndreyProskur.github.io',
  baseUrl: '/Radiomark_docs/',

  organizationName: 'AndreyProskur',
  projectName: 'Radiomark_docs',

  onBrokenLinks: 'warn',
  trailingSlash: false,

  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },

  presets: [
    [
      'classic',
      {
        blog: false,
        docs: {
          sidebarPath: './sidebars.ts',
          remarkPlugins: [remarkSimplePlantuml],
          editUrl:
            'https://github.com/AndreyProskur/Radiomark_docs/edit/main/my-website/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],

    // ✅ Redoc подключаем ПРАВИЛЬНО
    [
      'redocusaurus',
      {
        specs: [
          {
            id: 'radiomark-api',
            spec: 'docs/api/radiomark-api-updated.yaml', // ← твой путь
          },
        ],
        theme: {
          primaryColor: '#1890ff',
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Radiomark',
      logo: {
        alt: 'Radiomark Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Документация',
        },
        {
          href: 'https://github.com/AndreyProskur/Radiomark_docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },

    footer: {
      style: 'dark',
      copyright: `© ${new Date().getFullYear()} Radiomark`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
