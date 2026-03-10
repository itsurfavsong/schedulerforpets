export const formatTime = (time: string) => {
  const [hourStr, minute] = time.slice(0, 5).split(':');
  const hour = parseInt(hourStr, 10);
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${period} ${displayHour}:${minute}`;
};