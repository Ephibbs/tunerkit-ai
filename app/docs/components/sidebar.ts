export type SidebarItem = {
  title: string;
  slug?: string;
  children: Array<{
    title: string;
    slug: string;
    status?: string;
  }>;
};

export const SIDEBAR: Array<SidebarItem> = [
  {
    title: 'Getting Started',
    children: [
      {
        title: 'Introduction',
        slug: '/docs',
      },
      {
        title: 'Installation',
        slug: '/docs/installation',
      },
    ],
  },
  {
    title: 'Components',
    children: [
      {
        title: 'Chat',
        slug: '/docs/components/chat',
      },
      {
        title: 'Chat Bubble',
        slug: '/docs/components/chat-bubble',
      },
    ],
  },
];