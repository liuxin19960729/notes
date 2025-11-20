'use strict';
const fs = require("fs");
module.exports = {
  load() {

  },

  unload() {

  },

  // register your ipc messages here
  messages: {
    open() {
      Editor.Panel.open("i18n-texture-dep")
    },
    async analyse(event, path) {
      Editor.log(`analyse path:${path}`)
      try {
        const str = await startAnalyse(path)
        event.reply && event.reply(null, `complete:${str}`);
      } catch (error) {
        Editor.error(error)
        event.reply && event.reply(null, err?.messages);
      }
    }
  },
};
async function startAnalyse(pattern) {
  let assetTypes = ['texture'];
  const pngInfos = await queryAssets(pattern, assetTypes).then(v => v.map(({ url }) => {
    // type sprite-frame
    const reaults = Editor.assetdb.subAssetInfos(url);
    return reaults.find(result => result.type == "sprite-frame");
  })).then(vs => vs.filter(v => !!v))
  const pngInfoMap = new Map();
  const statisticsMap = new Map();
  pngInfos.forEach(info => {
    pngInfoMap.set(info.uuid, info);
    statisticsMap.set(info.uuid, [])
  })
  Editor.log(`queryAssets pattern:${pattern} assetTypes:${JSON.stringify(assetTypes)}  length:${statisticsMap.size}`)
  pattern = "db://assets/**\/*";
  assetTypes = ['prefab'];
  const prefabInfos = await queryAssets(pattern, assetTypes)
  Editor.log(`queryAssets pattern:${pattern} assetTypes:${JSON.stringify(assetTypes)}  length:${prefabInfos.length}`)
  await Promise.all(prefabInfos.map(value => analysePrefab(value, statisticsMap, pngInfoMap)))
  let str = "";
  str += "========================无引用信息=====================================\n";
  let i = 1;
  pngInfoMap.forEach((value, uuid) => {
    const arr = statisticsMap.get(uuid);
    if (arr && arr.length > 0) return;
    str += `idx:${i++} uuid:${uuid}   path:${value.path}  \n`
  })
  str += "\n";
  str += "\n";
  str += "\n";
  str += "========================全部统计信息=====================================\n";
  statisticsMap.forEach((value, uuid) => {
    const pngInfo = pngInfoMap.get(uuid);
    str += `png uuid:${pngInfo.uuid} path:${pngInfo.path} dep count:${value.length}`
    str += "\n";
    value.forEach((prefabInfo, idx) => {
      str += `***** idx:${idx + 1} prefab: uuid${prefabInfo.uuid} path:${prefabInfo.path} isI18nCmpt:${prefabInfo.isI18nCmpt}`
      str += "\n";
    })
    str += "\n";
  })
  const wpath = `${__dirname}/statistics.txt`
  fs.writeFileSync(wpath, str, "utf-8");
  return wpath;
}

function analysePrefab(value, map, pngInfoMap) {
  return new Promise((resovle, reject) => {
    try {
      const path = value.path;
      // assets\9004\model\dice2.fbx\dice2.prefab
      if (path.includes(`assets\\9004\\model\\dice2.fbx\\dice2.prefab`)) return resovle(void 0);
      const content = fs.readFileSync(path, 'utf8');
      const obj = JSON.parse(content);
      const uuids = Array.from(map.keys());
      uuids.forEach(uuid => {
        if (!content.includes(uuid)) return;
        const arr = map.get(uuid);
        arr.push({ ...value, isI18nCmpt: false });
      })

      const values = Array.from(pngInfoMap.values());
      // 4fa115np0xP5Z/I4oYnf7zO 多语言图片组件
      const i18nObjs = Object.values(obj).filter(sobj => sobj[`__type__`] == `4fa115np0xP5Z/I4oYnf7zO`);
      i18nObjs.forEach(i18nObj => {
        const url = i18nObj["url"];
        if (!url) return;

        const fArr = values.filter(value => {
          const splitss = value.path.split("\\");
          const filename = splitss[splitss.length - 1];
          return filename === url;
        })
        fArr.forEach(({ uuid }) => {
          const arr = map.get(uuid);
          arr.push({ ...value, isI18nCmpt: true });
        })
      })
      resovle(void 0)
    } catch (error) {
      reject(error)
    } finally {

    }
  })
}

function queryAssets(pattern, assetTypes) {
  return new Promise((resovle, reject) => {
    Editor.assetdb.queryAssets(pattern, assetTypes, function (err, results) {
      if (!!err) return reject(err);
      resovle(results)
    })
  })
}