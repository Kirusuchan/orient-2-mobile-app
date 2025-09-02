export const questionMap: Record<
  string,
  { en: () => Promise<any>; tl: () => Promise<any> }
> = {
  beliefs: {
    en: () => import('@/data/assessment/beliefs.multiple.json'),
    tl: () => import('@/data/assessment/beliefs.tl.multiple.json'),
  },
  festivals: {
    en: () => import('@/data/assessment/festivals.multiple.json'),
    tl: () => import('@/data/assessment/festivals.tl.multiple.json'),
  },
  religion: {
    en: () => import('@/data/assessment/religion.multiple.json'),
    tl: () => import('@/data/assessment/religion.tl.multiple.json'),
  },
  grammar: {
    en: () => import('@/data/assessment/grammar.matching.json'),
    tl: () => import('@/data/assessment/grammar.tl.matching.json'),
  },
  vocabulary: {
    en: () => import('@/data/assessment/vocabulary.matching.json'),
    tl: () => import('@/data/assessment/vocabulary.tl.matching.json'),
  },
  alphabets: {
    en: () => import('@/data/assessment/alphabets.matching.json'),
    tl: () => import('@/data/assessment/alphabets.matching.json'), // ✅ same file for both
  },
};
