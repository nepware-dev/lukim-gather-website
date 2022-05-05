export const formatDate = (date: string | Date | number) => {
  const d = new Date(date);
  const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d);
  const mo = new Intl.DateTimeFormat('en', {month: 'short'}).format(d);
  const da = new Intl.DateTimeFormat('en', {day: 'numeric'}).format(d);
  return `${mo} ${da}, ${ye}`;
};
