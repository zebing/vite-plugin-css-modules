import fs from 'fs';
import path from 'path';

export const resolve = (url, options = {}) => {
  const { dirname,  exts = [], alias = [] } = options;
  let currentUrl;

  // 文件前缀补全
  alias.push({ find: './', replacement: dirname });

  alias.forEach((item) => {
    if (url.startsWith(item.find)) {
      currentUrl = path.resolve(item.replacement, url.replace(item.find, './'));
    }
  })
  
  if(fs.existsSync(currentUrl)) {
    return currentUrl;
  }

  const ext = exts.find((ext) => fs.existsSync(currentUrl + `.${ext}`));

  return ext ? currentUrl + `.${ext}` : undefined;
}