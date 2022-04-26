export default (...classes: (string | [string, boolean] | undefined)[]) => classes
  .map((c) => {
    if (Array.isArray(c) && c.length === 2) {
      return c[1] ? c[0] : false;
    }
    return c;
  })
  .filter((c) => !!c)
  .join(' ');
