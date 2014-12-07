var Ascii = {
  style: "<style type='text/css'>* {margin: 0;padding: 0;} .ascii {font-size: 12px;font-family: simsun;}</style>",
  // 按照不同的终端输出
  types: {
    cli: {
      br: '\n',
      blank: ' '
    },
    html: {
      br: '</br>',
      blank: '&nbsp;'
    }
  },
  colors: {
	  console: {
		  black: '\033[30m',
		  red: '\033[31m',
		  green: '\033[32m',
		  brown: '\033[33m',
		  blue: '\033[34m',
		  magenta: '\033[35m',
		  cyan: '\033[36m',
		  gray: '\033[37m',
		  darkGray: '\033[90m',
		  lightRed: '\033[91m',
		  lightGreen: '\033[92m',
		  lightBrown: '\033[93m',
		  lightBlue: '\033[94m',
		  lightMagenta: '\033[95m',
		  lightCyan: '\033[96m',
		  white: '\033[97m',
		  default: '\033[0m'
	  },
	  rgb: {
		  black: [0, 0, 0],
		  red: [170, 0, 0],
		  green: [0, 170, 0],
		  brown: [170, 85, 0],
		  blue: [0, 0, 170],
		  magenta: [170, 0, 170],
		  cyan: [0, 170, 170],
		  gray: [170, 170, 170],
		  darkGray: [85, 85, 85],
		  lightRed: [255, 85, 85],
		  lightGreen: [85, 255, 85],
		  lightBrown: [255, 255, 85],
		  lightBlue: [85, 85, 255],
		  lightMagenta: [255, 85, 255],
		  lightCyan: [85, 255, 255],
		  white: [255, 255, 255]
	  },
	  html: {}
  },
  // 根据灰度生成相应字符
  toText: function(type, g, color) {
    var self = this;
    if (g <= 30) {
      return color + '#' + self.colors.console.default;
    } else if (g > 30 && g <= 60) {
      return color + '&' + self.colors.console.default;
    } else if (g > 60 && g <= 120) {
      return color + '$' + self.colors.console.default;
    } else if (g > 120 && g <= 150) {
      return color + '*' + self.colors.console.default;
    } else if (g > 150 && g <= 180) {
      return color + 'o' + self.colors.console.default;
    } else if (g > 180 && g <= 210) {
      return color + '!' + self.colors.console.default;
    } else if (g > 210 && g <= 240) {
      return color + ';' + self.colors.console.default;
    } else {
      return self.types[type].blank;
    }
  },
  getColor: function (r, g, b) {
    var self = this,
        closestDist = null,
        colorKey = null,
        currentDist = null,
		rgbTest = null;

  	for (var key in self.colors.rgb) {
		rgbTest = self.colors.rgb[key];
		currentDist = self.getDistance(rgbTest, [r,g,b]);
		if (currentDist === 0) {
			colorKey = key;
			break;
		} else if (closestDist === null || currentDist < closestDist) {
			closestDist = currentDist;
			colorKey = key;
		}
	}

    return self.colors.console[colorKey];
  },
  getDistance: function (p1, p2) {
    return Math.sqrt(
        Math.pow(p2[0] - p1[0], 2) +
        Math.pow(p2[1] - p1[1], 2) +
        Math.pow(p2[2] - p1[2], 2)
    );
  },
  // 根据rgb值计算灰度
  getGray: function(r, g, b) {
    return 0.299 * r + 0.578 * g + 0.114 * b;
  },
  // 初始化
  init: function(type, ctx, pic) {
    var self = this,
      data = ctx.getImageData(0, 0, pic.width, pic.height),
      text = '';
    for (h = 0; h < data.height; h += 12) {
      var p = '';
      for (w = 0; w < data.width; w += 6) {
        var index = (w + data.width * h) * 4;
        var r = data.data[index + 0];
        var g = data.data[index + 1];
        var b = data.data[index + 2];
        var gray = self.getGray(r, g, b);
        var color = self.getColor(r ,g ,g);
        p += self.toText(type, gray, color);
      }
      p += self.types[type].br;
      text += p;
    }
    return (type === 'html') ? self.style + "<div class='ascii'>" + text + '</div>' : text;
  }
}

module.exports = Ascii;

