export function randomColorHex() {
  return "#" + ((1<<24)*Math.random() | 0).toString(16);
}

export function stringToColour (str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

export function stringToColourV2 (str) {
  var hash = 0;
  for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (let i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      value = (value % 150) + 50;
      colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}