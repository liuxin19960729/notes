'use strict';
const fs = require("fs");
const { url } = require("inspector");
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
    analyse(event, path) {
      // 分析代码
      event.replay && event.replay();
      Editor.log(`analyse path:${path}`)
      startAnalyse(path).then(arr => arr.forEach(str => Editor.log(`complete:${str}`))).catch(Editor.error)
    },
    del(event) {
      // 删除无用的资源
      event.replay && event.replay();
      startDel().then(() => Editor.log("del complete")).catch(Editor.error);
    }
  },
};

/**无用资源删除 */
async function startDel() {
  const path = `${__dirname}/del.json`;
  const content = await readFile(path);
  const obj = JSON.parse(content);
  Editor.assetdb.delete(obj, function (err, results) {
    if (!!err) return Editor.error(err);
    results.forEach((result) => Editor.log(`del: uuid:${uuid}  srcPath:${result.srcPath} destPath:${result.destPath}`));
  })
}

async function startAnalyse(pattern) {
  let assetTypes = ['texture'];
  const pngInfos = await queryAssets(pattern, assetTypes).then(v => v.map(({ url, path }) => {
    // type sprite-frame
    const reaults = Editor.assetdb.subAssetInfos(url);
    const result = reaults.find(result => result.type == "sprite-frame");
    if (!result) return undefined;
    return { ...result, rpath: path, rurl: url }
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
  await Promise.all(prefabInfos.map(value => analysePrefabDep(value, statisticsMap, pngInfoMap)))
  await analyseCodeDep(statisticsMap, pngInfoMap);
  let str = "";
  const delArr = [];
  str += "========================无引用信息=====================================\n";
  let i = 1;
  pngInfoMap.forEach((value, uuid) => {
    const arr = statisticsMap.get(uuid);
    if (arr && arr.length > 0) return;
    str += `idx:${i++} uuid:${uuid}   path:${value.rpath}  \n`
    delArr.push(value.rurl)
  })
  str += "\n";
  str += "\n";
  str += "\n";
  str += "========================全部统计信息=====================================\n";
  statisticsMap.forEach((value, uuid) => {
    const pngInfo = pngInfoMap.get(uuid);
    str += `png uuid:${pngInfo.uuid} path:${pngInfo.rpath} dep count:${value.length}`
    str += "\n";
    value.forEach((prefabInfo, idx) => {
      const depType = prefabInfo.depType;
      if (depType == "codeSet") {
        // 代码动态设置
        str += `***** idx:${idx + 1} depType:${prefabInfo.depType}`
      } else {
        str += `***** idx:${idx + 1} prefab: uuid${prefabInfo.uuid} path:${prefabInfo.path} depType:${prefabInfo.depType}`
      }
      str += "\n";
    })
    str += "\n";
  })
  const wpath = `${__dirname}/statistics.txt`
  const wdpath = `${__dirname}/del.json`
  fs.writeFileSync(wpath, str, "utf-8");
  fs.writeFileSync(wdpath, JSON.stringify(delArr), "utf-8")
  return [wdpath, wpath];
}

async function analysePrefabDep(value, map, pngInfoMap) {
  const path = value.path;
  // assets\9004\model\dice2.fbx\dice2.prefab
  if (path.includes(`assets\\9004\\model\\dice2.fbx\\dice2.prefab`)) return;
  const content = await readFile(path)
  const obj = JSON.parse(content);
  const uuids = Array.from(map.keys());
  //prefab 依赖
  uuids.forEach(uuid => {
    if (!content.includes(uuid)) return;
    const arr = map.get(uuid);
    arr.push({ ...value, depType: "prefab_dep" });
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
      arr.push({ ...value, depType: "i18nCompt" });
    })
  })

}


// 代码动态设置
async function analyseCodeDep(map, pngInfoMap) {
  const values = Array.from(pngInfoMap.values());
  const codeSetArr = ['dl_bt_2', 'dl_bt_4', 'dl_bt_3', 'dl_bt_6', 'dl_bt_5']
  codeSetArr.forEach(pngName => {
    const fArr = values.filter(value => {
      const splitss = value.path.split("\\");
      const filename = splitss[splitss.length - 1];
      return filename === pngName;
    })
    fArr.forEach(({ uuid }) => {
      const arr = map.get(uuid);
      arr.push({ depType: "codeSet" });
    })
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

function readFile(path) {
  return new Promise((resovle, reject) => {
    fs.readFile(path, { "encoding": "utf-8" }, (err, data) => {
      if (!!err) return reject(err);
      resovle(data);
    })
  })

}