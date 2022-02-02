export const idGenerator = () => {
  const chars = "qwertyuioplkjhgfdsazxcvbnm";

  let code = "";

  for (let i = 0; i < 4; i++) {
    const random = Math.floor(Math.random() * chars.length);
    code += chars[random];
  }

  return code;
};
