import fs from 'fs';
import path from 'path';
import { Alias } from 'vite';

interface Options {
  dirname: string,
  exts: string[],
  alias: Alias | Alias[]
}

// 文件前缀补全
// 返回文件绝对地址
export const resolve = (url: string, options: Options) => {
  let { dirname,  exts, alias } = options;
  let currentUrl: string = '';
  let aliasArray: Alias[] = [{ find: './', replacement: dirname }];

  if (alias instanceof Array) {
    aliasArray = alias;
  } else if (alias) {
    aliasArray = [alias]
  }

  aliasArray.forEach((item: Alias) => {
    if (item.find instanceof RegExp || url.startsWith(item.find)) {
      currentUrl = path.resolve(item.replacement, url.replace(item.find, './'));
    }
  })
  
  // 已经存在，直接返回
  if(fs.existsSync(currentUrl)) {
    return currentUrl;
  }

  let ext;

  // 寻找[url].css, [url].scss等是否存在
  if (exts instanceof Array) {
    ext = exts.find((ext) => fs.existsSync(currentUrl + `.${ext}`));
  }

  return ext ? currentUrl + `.${ext}` : undefined;
}