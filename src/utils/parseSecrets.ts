export const parseSecrets = (str: string) => {
  const color = str.match(/\*\*Favorite color\*\*: (.+)/);
  const number = str.match(/\*\*Favorite number\*\*: (.+)/);

  return {
    color: color ? color[1].trim() : '',
    number: number ? number[1].trim() : '',
  }
};
