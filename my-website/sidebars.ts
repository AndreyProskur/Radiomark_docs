import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Обзор',
      items: ['overview/concept'],
    },
    {
      type: 'category',
      label: 'Требования',
      items: ['requirements/functional', 'requirements/non-functional'],
    },
    {
      type: 'category',
      label: 'Интерфейсы',
      items: ['interfaces/wireframes', 'interfaces/api'],
    },
    {
      type: 'category',
      label: 'Архитектура',
      items: [
        'architecture/bpmn-processes',
        'architecture/uml-diagrams',
        'architecture/dmn-validation',
        'architecture/async-interaction',
        'architecture/storage-technologies',
        'architecture/data-model',
      ],
    },
    {
      type: 'category',
      label: 'Платформа',
      items: ['platform/platform-strategy'],
    },
    {
      type: 'category',
      label: 'Безопасность',
      items: ['security/security'],
    },
    {
      type: 'category',
      label: 'Эксплуатация',
      items: ['operations/monitoring'],
    },
    {
      type: 'category',
      label: 'Разработка',
      items: ['development/checklist'],
    },
  ],
};

export default sidebars;
