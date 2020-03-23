export let allColor = [
  [250, 248, 79],
  [250, 231, 71],
  [251, 209, 60],
  [251, 192, 52],
  [252, 171, 43],
  [252, 162, 38],
  [253, 139, 28],
  [253, 129, 23],
  [253, 101, 9],
  [253, 85, 2],
  [255, 0, 0]
]

export function getColor (value) {
  let index = Math.floor(value / 3)
  index = index <= 10 ? index : 10
  return allColor[index]
}
