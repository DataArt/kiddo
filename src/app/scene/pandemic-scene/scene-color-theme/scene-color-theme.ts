export interface ColorTheme {
  name: string;
  properties: {};
}

export const greenTheme: ColorTheme = {
  name: 'green',
  properties: {
    '--scene-road': '#fff5d1',
    '--scene-background': '#90b95a',
  }
};

export const purpleTheme: ColorTheme = {
  name: 'purple',
  properties: {
    '--scene-road': '#bdb5e4',
    '--scene-background': '#6E6BA7',
  }
};
