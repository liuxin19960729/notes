namespace Editor {
    interface IIpc {
        sendToMain(cmd: string, ...args);
        sendToPanel(title: string, cmd: string, ...args)
    }
    const Ipc: IIpc;
    interface IPanel {
        open(name: string);
        extend(data: any);
    }
    const Panel: IPanel;

    interface AssetInfo {
        uuid: string;
        path: string;
        url: string;
        type: string;
        isSubAsset: string;
    }

    interface IAssetdb {
        queryAssets(pattern: string, assetTypes: string | Array<string>, cb: (err, results) => void);
        import(rawfiles: Array<string>, url: string, cb: (err, results) => void);
        urlToUuid(url: string);
        uuidToUrl(uuid: string);
        assetInfo(url): AssetInfo;
        assetInfoByUuid(uuid): AssetInfo
        assetInfoByPath(fspath): AssetInfo;
        /**子资源 */
        subAssetInfos(url): Array<AssetInfo>
        /**子资源 */
        subAssetInfosByUuid(uuid): Array<AssetInfo>
        /**子资源 */
        subAssetInfosByPath(fspath): Array<AssetInfo>
        /**删除资源 */
        delete(arr: Array<string>, cb: (err, results) => void);
    }
    const assetdb: IAssetdb;

    /**日志打印 */
    function log(string);
    /**错误日志 */
    function error(string);

    interface IDialog {
        openFile(data: any);
    }
    const Dialog: IDialog;

    interface IProject {
        /**项目路径 */
        path: string;
    }

    const Project: IProject;
}