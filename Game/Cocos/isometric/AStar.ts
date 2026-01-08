export class AStarNode {
    x: number;
    y: number;
    g: number = 0; // Cost from start
    h: number = 0; // Heuristic (estimated cost to end)
    f: number = 0; // Total cost (g + h)
    parent: AStarNode = null;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export default class AStar {
    
    // 0 = walkable, 1 = obstacle
    private _gridData: number[][];
    private _width: number;
    private _height: number;
    
    // 是否允许斜向移动
    public allowDiagonal: boolean = false;

    constructor(gridData: number[][], width: number, height: number) {
        this._gridData = gridData;
        this._width = width;
        this._height = height;
    }

    /**
     * 异步分帧寻路
     * @param startX 起点X
     * @param startY 起点Y
     * @param endX 终点X
     * @param endY 终点Y
     * @param timeBudgetMs 每帧最大计算时间(ms)，默认 5ms
     */
    public async findPathAsync(startX: number, startY: number, endX: number, endY: number, timeBudgetMs: number = 5): Promise<{x: number, y: number}[]> {
        if (!this.isValid(startX, startY) || !this.isValid(endX, endY)) {
            return [];
        }
        
        if (this.isWall(endX, endY)) {
            return [];
        }

        let openList: AStarNode[] = [];
        let closedList: Set<string> = new Set();

        let startNode = new AStarNode(startX, startY);
        openList.push(startNode);

        let startTime = Date.now();

        while (openList.length > 0) {
            // 检查时间预算
            if (Date.now() - startTime > timeBudgetMs) {
                // 暂停一下，等待下一帧（或下一个微任务，这里用 setTimeout 0 模拟让出主线程）
                await new Promise(resolve => setTimeout(resolve, 0));
                startTime = Date.now();
            }

            // 1. 找到 F 值最小的节点 (这里可以用优先队列优化，目前用数组遍历)
            let currentNode = openList[0];
            let currentIndex = 0;
            for (let i = 1; i < openList.length; i++) {
                if (openList[i].f < currentNode.f) {
                    currentNode = openList[i];
                    currentIndex = i;
                }
            }

            // 2. 移出 OpenList，加入 ClosedList
            openList.splice(currentIndex, 1);
            closedList.add(`${currentNode.x},${currentNode.y}`);

            // 3. 检查是否到达终点
            if (currentNode.x === endX && currentNode.y === endY) {
                return this.reconstructPath(currentNode);
            }

            // 4. 处理邻居
            let neighbors = this.getNeighbors(currentNode);
            for (let neighbor of neighbors) {
                if (closedList.has(`${neighbor.x},${neighbor.y}`)) {
                    continue;
                }

                let moveCost = (neighbor.x !== currentNode.x && neighbor.y !== currentNode.y) ? 14 : 10;
                let newG = currentNode.g + moveCost;

                let existingNode = openList.find(n => n.x === neighbor.x && n.y === neighbor.y);
                
                if (!existingNode || newG < existingNode.g) {
                    if (!existingNode) {
                        existingNode = neighbor;
                        openList.push(existingNode);
                    }
                    
                    existingNode.g = newG;
                    existingNode.h = this.heuristic(existingNode.x, existingNode.y, endX, endY);
                    existingNode.f = existingNode.g + existingNode.h;
                    existingNode.parent = currentNode;
                }
            }
        }

        return [];
    }

    public findPath(startX: number, startY: number, endX: number, endY: number): {x: number, y: number}[] {
        // 保留同步方法，如果需要
        // 实际上可以用 findPathAsync 但不传 await ... 不过 Promise 无法同步返回
        // 所以这里保留原有的同步逻辑副本，或者直接删掉，看需求。
        // 为了兼容，这里保留同步代码，内容与 async 版本几乎一致，只是没有 await
        
        if (!this.isValid(startX, startY) || !this.isValid(endX, endY)) return [];
        if (this.isWall(endX, endY)) return [];

        let openList: AStarNode[] = [];
        let closedList: Set<string> = new Set();

        let startNode = new AStarNode(startX, startY);
        openList.push(startNode);

        while (openList.length > 0) {
            let currentNode = openList[0];
            let currentIndex = 0;
            for (let i = 1; i < openList.length; i++) {
                if (openList[i].f < currentNode.f) {
                    currentNode = openList[i];
                    currentIndex = i;
                }
            }

            openList.splice(currentIndex, 1);
            closedList.add(`${currentNode.x},${currentNode.y}`);

            if (currentNode.x === endX && currentNode.y === endY) {
                return this.reconstructPath(currentNode);
            }

            let neighbors = this.getNeighbors(currentNode);
            for (let neighbor of neighbors) {
                if (closedList.has(`${neighbor.x},${neighbor.y}`)) continue;

                let moveCost = (neighbor.x !== currentNode.x && neighbor.y !== currentNode.y) ? 14 : 10;
                let newG = currentNode.g + moveCost;

                let existingNode = openList.find(n => n.x === neighbor.x && n.y === neighbor.y);
                if (!existingNode || newG < existingNode.g) {
                    if (!existingNode) {
                        existingNode = neighbor;
                        openList.push(existingNode);
                    }
                    existingNode.g = newG;
                    existingNode.h = this.heuristic(existingNode.x, existingNode.y, endX, endY);
                    existingNode.f = existingNode.g + existingNode.h;
                    existingNode.parent = currentNode;
                }
            }
        }
        return [];
    }

    private getNeighbors(node: AStarNode): AStarNode[] {
        let neighbors: AStarNode[] = [];
        let dirs = [
            {x: 0, y: -1}, {x: 0, y: 1},
            {x: -1, y: 0}, {x: 1, y: 0}
        ];

        if (this.allowDiagonal) {
            dirs.push({x: -1, y: -1}, {x: 1, y: -1}, {x: -1, y: 1}, {x: 1, y: 1});
        }

        for (let dir of dirs) {
            let nx = node.x + dir.x;
            let ny = node.y + dir.y;

            if (this.isValid(nx, ny) && !this.isWall(nx, ny)) {
                neighbors.push(new AStarNode(nx, ny));
            }
        }
        return neighbors;
    }

    private isValid(x: number, y: number): boolean {
        return x >= 0 && x < this._width && y >= 0 && y < this._height;
    }

    private isWall(x: number, y: number): boolean {
        return this._gridData[y][x] === 1;
    }

    private heuristic(x1: number, y1: number, x2: number, y2: number): number {
        return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) * 10;
    }

    private reconstructPath(node: AStarNode): {x: number, y: number}[] {
        let path = [];
        let curr = node;
        while (curr) {
            path.push({x: curr.x, y: curr.y});
            curr = curr.parent;
        }
        return path.reverse();
    }
}
