const { Vector2D } = require('@georgedoescode/vector2d');

function findFurthestGridCell(previousCellChoice, cells) {
  const optionsSortedByDist = [...cells].sort(
    (a, b) =>
      Vector2D.dist(
        new Vector2D(
          previousCellChoice.x + previousCellChoice.width / 2,
          previousCellChoice.y + previousCellChoice.height / 2
        ),
        new Vector2D(a.x + a.width / 2, a.y + a.height / 2)
      ) -
      Vector2D.dist(
        new Vector2D(
          previousCellChoice.x + previousCellChoice.width / 2,
          previousCellChoice.y + previousCellChoice.height / 2
        ),
        new Vector2D(b.x + b.width / 2, b.y + b.height / 2)
      )
  );

  return optionsSortedByDist[optionsSortedByDist.length - 1];
}

module.exports = findFurthestGridCell;
