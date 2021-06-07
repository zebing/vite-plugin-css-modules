export const checkId = (id: string): boolean => {

  // 检查文件后缀
  if (!/(\.js|\.jsx|\.vue)$/i.test(id)) {
    return false;
  }

  // 检查是否是 node_modules 文件
  if (/node_modules/gi.test(id)) {
    return false;
  }

  return true;
}