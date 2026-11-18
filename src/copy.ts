export interface SceneCopyItem {
  headline: string;
  subhead: string;
}

/**
 * Editable text layers for all five 4-second scenes.
 * Wording is preserved verbatim so typography remains clean, exact, and editable.
 */
export const SCENE_COPY = {
  scene1: {
    headline: 'It starts with your idea.',
    subhead: 'Send an enquiry. We’ll talk for five minutes.',
  },
  scene2: {
    headline: 'Let’s agree on what to build.',
    subhead: 'Teams discovery call + service agreement',
  },
  scene3: {
    headline: 'See the plan take shape.',
    subhead: 'Market research, sitemap and draft copy',
  },
  scene4: {
    headline: 'Watch your website come together.',
    subhead: 'Design, build, domain and hosting',
  },
  scene5: {
    headline: 'Ready to go live.',
    subhead: 'Two rounds of revisions within 14 days.',
  },
  launchBadge: 'Live',
} as const satisfies Record<string, SceneCopyItem | string>;
