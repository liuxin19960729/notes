const {ccclass, property} = cc._decorator;

@ccclass
export default class IsoUtils {

    /**
     * 将网格坐标转换为屏幕(节点)坐标
     * @param gridPos 网格坐标 (x, y)
     * @param tileWidth 瓦片宽度
     * @param tileHeight 瓦片高度
     * @returns 屏幕坐标
     */
    static gridToScreen(gridPos: cc.Vec2, tileWidth: number, tileHeight: number): cc.Vec2 {
        // 标准等轴测公式
        // x = (gridX - gridY) * w * 0.5
        // y = - (gridX + gridY) * h * 0.5  <-- 负号是因为网格 Y 增加通常意味着向下，而 Cocos Y 轴向上
        
        let x = (gridPos.x - gridPos.y) * tileWidth * 0.5;
        let y = -(gridPos.x + gridPos.y) * tileHeight * 0.5;
        return new cc.Vec2(x, y);
    }

    /**
     * 将屏幕(节点)坐标转换为网格坐标
     * @param screenPos 屏幕坐标
     * @param tileWidth 瓦片宽度
     * @param tileHeight 瓦片高度
     * @returns 网格坐标 (floored to int)
     */
    static screenToGrid(screenPos: cc.Vec2, tileWidth: number, tileHeight: number): cc.Vec2 {
        // 反向公式推导
        // x_s = (gx - gy) * w/2  => gx - gy = x_s / (w/2)
        // y_s = -(gx + gy) * h/2 => gx + gy = -y_s / (h/2)
        
        // Let A = x_s / (w/2), B = -y_s / (h/2)
        // 2*gx = A + B => gx = (A + B) / 2
        // 2*gy = B - A => gy = (B - A) / 2

        let halfW = tileWidth * 0.5;
        let halfH = tileHeight * 0.5;

        let A = screenPos.x / halfW;
        let B = -screenPos.y / halfH; // 注意这里的负号对应上面的 y 轴翻转

        let gx = Math.round((A + B) * 0.5);
        let gy = Math.round((B - A) * 0.5);

        return new cc.Vec2(gx, gy);
    }
}
