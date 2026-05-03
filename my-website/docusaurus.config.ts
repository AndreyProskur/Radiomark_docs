import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// --- PlantUML ---
const remarkSimplePlantuml = require('@akebifiky/remark-simple-plantuml');

const plantumlPlugin = () => ({
  name: 'plantuml-plugin',
  configureMarkdown(md: any) {
    md.remarkPlugins = md.remarkPlugins || [];
    md.remarkPlugins.push(remarkSimplePlantuml);
    return md;
  },
});

// --- Redoc (обернут, чтобы не падал) ---
const redocPlugin = () => ({
  name: 'redoc-plugin-wrapper',
  plugins: [
    [
      'redocusaurus',
      {
        specs: [
          {
            id: 'radiomark-api',
            spec: 'docs/api/openapi.yaml',
            route: '/api/',
          },
        ],
      },
    ],
  ],
});

const config: Config = {
  title: 'Radiomark Docs',
  tagline: 'Документация платформы Radiomark',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://AndreyProskur.github.io',
  baseUrl: '/Radiomark_docs/',
  organizationName: 'AndreyProskur',
  projectName: 'Radiomark_docs',

  onBrokenLinks: 'warn',
  trailingSlash: false,
  deploymentBranch: 'gh-pages',

  // исправление deprecated
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

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
          editUrl:
            'https://github.com/AndreyProskur/Radiomark_docs/edit/main/my-website/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    plantumlPlugin,
    redocPlugin,
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',

    colorMode: {
      respectPrefersColorScheme: true,
    },

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
      links: [
        {
          title: 'Документация',
          items: [
            {
              label: 'Введение',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Проект',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/AndreyProskur/Radiomark_docs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Radiomark`,
    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
