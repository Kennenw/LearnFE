function findSafeWay(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    let result = [];
    function dfs(r, c, path) {
        if (r < 0 || r >= rows || c >= cols || grid[r][c] === 1 || grid[r][c] === 2) return;

        path.push([r, c]);

        if (c === cols - 1)
            result.push([...path]);
        else {
            grid[r][c] = 2;
            dfs(r, c + 1, path);
            dfs(r + 1, c, path);
            dfs(r - 1, c, path);
            grid[r][c] = 0;
        }
    }
    for (let i = 0; i < rows; i++) {
        if (grid[i][0] === 0) {
            dfs(i, 0, []);
        }
    }
    return result;
}

const grid = [
    [0, 1, 1],
    [0, 1, 1],
    [0, 1, 1],
    [0, 1, 1],
    [0, 0, 0]
];

console.log(findSafeWay(grid));


