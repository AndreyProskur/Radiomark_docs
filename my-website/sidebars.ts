import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Обзор',
      link: { type: 'doc', id: 'overview/index' },
      items: ['overview/concept'],
    },
    {
      type: 'category',
      label: 'Требования',
      link: { type: 'doc', id: 'requirements/index' },
      items: ['requirements/functional', 'requirements/non-functional'],
    },
    {
      type: 'category',
      label: 'Модели и диаграммы',
      link: { type: 'doc', id: 'design/index' },
      items: [
        'design/uml-use-case',
        'design/uml-sequence',
        'design/bpmn-process',
        'design/dmn-validation',
        'design/data-model',
      ],
    },
    {
      type: 'category',
      label: 'Архитектура',
      link: { type: 'doc', id: 'architecture/index' },
      items: [
        'architecture/storage-technologies',
        'architecture/async-interaction',
      ],
    },
    {
      type: 'category',
      label: 'Интерфейсы и API',
      link: { type: 'doc', id: 'interfaces/index' },
      items: [
        'interfaces/wireframes',
        'interfaces/api',
        'interfaces/error-codes',
      ],
    },
    {
      type: 'category',
      label: 'Платформа',
      link: { type: 'doc', id: 'platform/index' },
      items: ['platform/platform-strategy'],
    },
  ],
};

export default sidebars;
