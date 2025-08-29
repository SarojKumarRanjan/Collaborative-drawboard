
export const CANVAS_SIZE = {
    width: 4000,
    height:2000
}


export const DEFAULT_MOVE:Move = {
    circle:{
        cX:0,
        cY:0,
        radiusX:0,
        radiusY:0
    },
    rect:{
        width:0,
        height:0,
    },
    img:{
        base64:""
    },
    timestamp: 0,
    id: "",
    options:{
        lineWidth: 2,
        lineColor: '#171717',
        fillColor: '#858484',
        shape: 'line',
        mode: 'draw',
        selection: null
    },
    path: []

};

export const DEFAULT_EASE = [0.6,0.01,-0.05,0.99]


export const COLORS = {
    red: '#ff0000',
    green: '#00ff00',
    blue: '#0000ff',
    yellow: '#ffff00',
    black: '#000000',
    white: '#ffffff',
    gray: '#808080',
    orange: '#ffa500',
    purple: '#800080',
    pink: '#ffc0cb',
    brown: '#a52a2a',
    cyan: '#00ffff',
    magenta: '#ff00ff',
    lime: '#00ff00',
    teal: '#008080',
    navy: '#000080',
    maroon: '#800000',
    olive: '#808000',
    silver: '#c0c0c0',
    gold: '#ffd700',
    coral: '#ff7f50',
    turquoise: '#40e0d0',
    indigo: '#4b0082',
    violet: '#ee82ee',
    salmon: '#fa8072',
    khaki: '#f0e68c',
    lavender: '#e6e6fa',
    peach: '#ffdab9',
    mint: '#98ff98',
    skyblue: '#87ceeb',
    plum: '#dda0dd',
    chocolate: '#d2691e',
    sienna: '#a0522d',
    lightgray: '#d3d3d3',
    darkgray: '#a9a9a9',
    lightblue: '#add8e6',
    lightgreen: '#90ee90',
    lightpink: '#ffb6c1',
    lightyellow: '#ffffe0',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightseagreen: '#20b2aa',
    lightsalmon: '#ffa07a',
    lightsteelblue: '#b0c4de',
    lightturquoise: '#afeeee',
    lightviolet: '#d8bfd8',
    lightolive: '#fafad2',
    lightmaroon: '#f4a460',
    lightnavy: '#b0c4de',
    lightteal: '#b2dfdb',   
    lightindigo: '#b0c4de',
    lightmagenta: '#ff77ff',
    lightlime: '#ccffcc',
    lightgold: '#ffec8b',
    lightbrown: '#deb887',
    lightorange: '#ffa07a',
    lightpurple: '#e6e6fa',
    lightred: '#ffcccb',
    lightbluegray: '#b0c4de',
    lightpinkish: '#ffb6c1',
    lightpeach: '#ffdab9',
    lightmint: '#f5fffa',
    lightskyblue: '#87cefa',
    lightplum: '#dda0dd',
    lightchocolate: '#d2691e',
    lightsienna: '#a0522d',
    lightgrayblue: '#b0c4de',
    lightgraygreen: '#d3d3d3',
    lightgraypink: '#d3d3d3',
    lightgrayyellow: '#d3d3d3',
    lightgraycoral: '#d3d3d3',
    lightgraycyan: '#d3d3d3',
    lightgraygold: '#d3d3d3',
    lightgrayteal: '#d3d3d3',
    lightgraynavy: '#d3d3d3',
    lightgraymaroon: '#d3d3d3',
    lightgrayolive: '#d3d3d3',
    lightgraysilver: '#d3d3d3',
    lightgraygoldenrod: '#d3d3d3',
    lightgraypeach: '#d3d3d3',
    lightgraymint: '#d3d3d3',
    lightgrayskyblue: '#d3d3d3',
    lightgrayplum: '#d3d3d3',
    lightgraychocolate: '#d3d3d3',
    lightgraysienna: '#d3d3d3',
    lightgrayindigo: '#d3d3d3',
    lightgrayviolet: '#d3d3d3',
    lightgraybrown: '#d3d3d3',
    lightgrayorange: '#d3d3d3',

}

export const COLORS_ARRAY = [...Object.values(COLORS)];