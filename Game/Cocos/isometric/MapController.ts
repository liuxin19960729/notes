import IsoUtils from "./IsoUtils";
import AStar from "./AStar";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapController extends cc.Component {

    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Node)
    mapRoot: cc.Node = null; // 所有地块的父节点

    @property
    tileWidth: number = 64;

    @property
    tileHeight: number = 32;

    @property
    mapWidth: number = 10;

    @property
    mapHeight: number = 10;

    @property({ tooltip: "Display debug coordinates on map" })
    debugCoordinates: boolean = false;

    private _astar: AStar = null;
    private _gridData: number[][] = [];
    private _isMoving: boolean = false;
    private _isFindingPath: boolean = false;

    // 用于绘制地图的 Graphics 组件
    private _graphics: cc.Graphics = null;

    // 存储 label 节点，方便清理
    private _debugLabels: cc.Node[] = [];

    onLoad() {
        this.initMap();
        this.drawMap(); // 绘制地图
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    initMap() {
        // 1. 初始化简单的网格数据 (0 = 可走, 1 = 障碍)
        this._gridData = [];
        for (let y = 0; y < this.mapHeight; y++) {
            let row = [];
            for (let x = 0; x < this.mapWidth; x++) {
                // 简单的边缘墙壁 + 随机障碍
                if (x === 0 || x === this.mapWidth - 1 || y === 0 || y === this.mapHeight - 1) {
                    row.push(1);
                } else if (Math.random() < 0.1) { // 10% 概率生成随机障碍
                    row.push(1);
                } else {
                    row.push(0);
                }
            }
            this._gridData.push(row);
        }

        // 确保出生点 (1, 1) 是空的
        if (this._gridData[1][1] === 1) this._gridData[1][1] = 0;

        // 2. 初始化 A*
        this._astar = new AStar(this._gridData, this.mapWidth, this.mapHeight);

        // 3. 初始化 Graphics
        if (!this.mapRoot.getComponent(cc.Graphics)) {
            this._graphics = this.mapRoot.addComponent(cc.Graphics);
        } else {
            this._graphics = this.mapRoot.getComponent(cc.Graphics);
        }

        // 4. 初始化玩家位置
        if (this.player) {
            let startPos = IsoUtils.gridToScreen(new cc.Vec2(1, 1), this.tileWidth, this.tileHeight);
            this.player.setPosition(startPos);
            // 简单的玩家外观 (如果玩家节点是空的)
            if (!this.player.getComponent(cc.Sprite)) {
                let g = this.player.addComponent(cc.Graphics);
                g.fillColor = cc.Color.YELLOW;
                g.circle(0, 0, 10);
                g.fill();
            }
        }
    }

    drawMap() {
        if (!this._graphics) return;
        this._graphics.clear();

        // 清理旧的 labels
        if (this._debugLabels.length > 0) {
            this._debugLabels.forEach(label => label.destroy());
            this._debugLabels = [];
        }

        for (let y = 0; y < 1; y++) {
            cc.log(JSON.stringify(this._gridData[y]))
            for (let x = 0; x < this.mapWidth; x++) {
                let type = this._gridData[y][x];
                let centerPos = IsoUtils.gridToScreen(new cc.Vec2(x, y), this.tileWidth, this.tileHeight);

                // 绘制菱形
                // 菱形的四个顶点相对于中心的偏移
                // Top: (0, h/2), Right: (w/2, 0), Bottom: (0, -h/2), Left: (-w/2, 0)
                let w2 = this.tileWidth / 2;
                let h2 = this.tileHeight / 2;

                this._graphics.moveTo(centerPos.x, centerPos.y + h2);
                this._graphics.lineTo(centerPos.x + w2, centerPos.y);
                this._graphics.lineTo(centerPos.x, centerPos.y - h2);
                this._graphics.lineTo(centerPos.x - w2, centerPos.y);
                this._graphics.close();

                if (type === 1) {
                    this._graphics.fillColor = cc.Color.RED; // 障碍物
                    this._graphics.fill();
                } else {
                    this._graphics.strokeColor = cc.Color.GREEN; // 地面边框
                    this._graphics.stroke();
                }

                // 绘制坐标 Label
                if (this.debugCoordinates) {
                    let labelNode = new cc.Node();
                    let label = labelNode.addComponent(cc.Label);
                    label.string = `${x},${y}`;
                    label.fontSize = 10;
                    label.lineHeight = 12;
                    labelNode.color = cc.Color.WHITE;
                    labelNode.position = new cc.Vec3(centerPos.x, centerPos.y, 0);
                    labelNode.parent = this.mapRoot;
                    this._debugLabels.push(labelNode);
                }
            }
        }


    }

    drawPath(path: { x: number, y: number }[]) {
        // 在地图上绘制路径线
        if (!this._graphics) return;
        // 重绘地图以清除旧路径 (或者使用另一个 Graphics 组件专门画路径)
        this.drawMap();

        this._graphics.strokeColor = cc.Color.YELLOW;
        this._graphics.lineWidth = 3;

        for (let i = 0; i < path.length; i++) {
            let pos = IsoUtils.gridToScreen(new cc.Vec2(path[i].x, path[i].y), this.tileWidth, this.tileHeight);
            if (i === 0) {
                this._graphics.moveTo(pos.x, pos.y);
            } else {
                this._graphics.lineTo(pos.x, pos.y);
            }
        }
        this._graphics.stroke();
    }

    async onTouchEnd(event: cc.Event.EventTouch) {
        if (this._isMoving || this._isFindingPath) return;

        let touchLoc = event.getLocation();
        let nodePos = this.mapRoot.convertToNodeSpaceAR(touchLoc);
        let targetGrid = IsoUtils.screenToGrid(nodePos, this.tileWidth, this.tileHeight);

        cc.log(`Click Screen: ${nodePos}, Grid: ${targetGrid}`);

        if (targetGrid.x < 0 || targetGrid.x >= this.mapWidth ||
            targetGrid.y < 0 || targetGrid.y >= this.mapHeight) {
            return;
        }

        let playerPos = this.player.position;
        let startGrid = IsoUtils.screenToGrid(playerPos, this.tileWidth, this.tileHeight);

        this._isFindingPath = true;
        let path = await this._astar.findPathAsync(startGrid.x, startGrid.y, targetGrid.x, targetGrid.y, 5);
        this._isFindingPath = false;

        if (path.length > 0) {
            this.drawPath(path); // 绘制路径
            this.movePlayer(path);
        } else {
            cc.log("No path found");
        }
    }

    movePlayer(path: { x: number, y: number }[]) {
        this._isMoving = true;

        let actions = [];
        for (let i = 1; i < path.length; i++) {
            let nodePos = IsoUtils.gridToScreen(new cc.Vec2(path[i].x, path[i].y), this.tileWidth, this.tileHeight);
            actions.push(cc.moveTo(0.3, nodePos));
        }

        actions.push(cc.callFunc(() => {
            this._isMoving = false;
        }));

        this.player.runAction(cc.sequence(actions));
    }
}
