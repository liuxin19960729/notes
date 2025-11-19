namespace Editor {
    interface IIpc {
        sendToMain(cmd: string);
        sendToPanel(title: string, cmd: string)
    }
    const Ipc: IIpc;
    interface IPanel {
        open(name: string);
    }
    const Panel: IPanel;
    interface IAssetdb {
        queryAssets(pattern: string, assetTypes: string | Array<string>, cb: (err, results) => void);
    }

    const assetdb: IAssetdb;

    /**日志打印 */
    function log(string);
    /**错误日志 */
    function error(string);
}