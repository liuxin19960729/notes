'use strict';
const fs = require("fs");
module.exports = {
  load() {

  },

  unload() {

  },

  // register your ipc messages here
  messages: {
    'search'() {
      searchFunc();
    },
  },

};

async function searchFunc() {
  try {
    let pattern = "db://assets/project/i18n/i18n_en/lobby/**\/*";
    let assetTypes = ['texture'];
    const pngInfos = await queryAssets(pattern, assetTypes).then(v => v.map(value => {
      const path = `${value.path}.meta`;
      const content = fs.readFileSync(path, 'utf8');
      const obj = JSON.parse(content);
      const subMetas = obj["subMetas"]
      const key = Object.keys(subMetas)[0];
      const uuid = subMetas[key]["uuid"];
      const _value = { ...value }
      _value[`uuid`] = uuid;
      return _value;
    }))
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
    await Promise.all(prefabInfos.map(value => readPrefab(value, statisticsMap, pngInfoMap)))
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
    Editor.log(`complete ${wpath}`)
  } catch (error) {
    Editor.error(error);
  }
}

function readPrefab(value, map, pngInfoMap) {
  return new Promise(resovle => {
    try {
      const path = value.path;
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
          return filename === `${url}.jpg` || filename === `${url}.png`
        })
        fArr.forEach(({ uuid }) => {
          const arr = map.get(uuid);
          arr.push({ ...value, isI18nCmpt: true });
        })
      })
    } catch (error) {
      Editor.error(error);
    } finally {
      resovle(void 0)
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
