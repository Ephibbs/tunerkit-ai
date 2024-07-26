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
        title: 'Setup',
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
        title: 'Text Completion Input',
        slug: '/docs/components/auto-complete',
      },
      {
        title: 'Text to Speech',
        slug: '/docs/components/text-to-speech',
      },
      {
        title: 'AI Detector', // PII Detector, NER, etc. also example as an alert toast Intelligent Error Handling Module: Detects user mistakes in real-time (like form entries or command inputs) and suggests corrections before the user completes the task, reducing frustration and support requests.
        slug: '/docs/components/ai-detector',
      },
      {
        title: 'AI Translator',
        slug: '/docs/components/ai-translator',
      },
      {
        title: 'Smart Forms',
        slug: '/docs/components/smart-forms',
      },
      // {
      //   title: 'Voice Command Interface',
      //   slug: '/docs/components/voice-commands',
      // },
      // {
      //   title: 'Generative Articles',
      //   slug: '/docs/components/voice-commands',
      // },
      // {
      //   title: 'RAG Uploader w/ 3rd party integrations (Coming soon)',
      //   slug: '/docs/components/voice-commands',
      // },
      // {
      //   title: 'Interactive Image Generator',
      //   slug: '/docs/components/voice-commands',
      // },
      // {
      //   title: 'Real-Time Style Transfer',
      //   slug: '/docs/components/voice-commands',
      // },
      // {
      //   title: 'Voice to Text',
      //   slug: '/docs/components/voice-commands',
      // },
      // {
      //   title: 'Image Decision Maker',
      //   slug: '/docs/components/voice-commands',
      // },
      // {
      //   title: 'Always on AI voice assistant',
      //   slug: '/docs/components/voice-commands',
      // },
    ],
  },
];