export const BREED_EMOJI: Record<string, string> = {
  '말티즈': '🐶',
  '푸들': '🐩',
  '시츄': '🐾',
  '포메라니안': '🦊',
  '골든리트리버': '🦮',
  '치와와': '🐕',
  '비숑': '🐑',
};

export const getBreedEmoji = (breed: string): string => {
  return BREED_EMOJI[breed] ?? '🐶';
};