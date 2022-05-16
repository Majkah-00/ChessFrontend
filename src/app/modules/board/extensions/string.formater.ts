interface String {
  format(...args: string[]): string;
}
// eslint-disable-next-line
String.prototype.format = function (...args: string[]): string {
  const lol = () => {
    this.replace(/{(\d+)}/g, (match, paramNumber) =>
      typeof args[paramNumber] !== 'undefined' ? args[paramNumber] : match
    );
  };

  return this.replace(/{(\d+)}/g, (match, paramNumber) =>
    typeof args[paramNumber] !== 'undefined' ? args[paramNumber] : match
  );
};
