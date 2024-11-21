/**
 * NEXA colour definitions
 *
 * The blues are the main branding colours for nexa and are to be used throughout
 * the interface for headings and buttons. The nexa Orange colour is to be used for
 * messages and highlighted sections through the app as an accent colour.
 *
 * The three grey tones for nexa are to be used for the background of the app and in tables.
 * Text should be in either white or the darkest grey, based on which will be more readable.
 * Where possible, alternating light and ultra-light grey colours should be used for table rows.
 *
 * These colours are to be used for status alerts and progress bars in the nexa app.
 * The green indicates Go ahead/In Progress, yellow indicates Issue/Go ahead with comment,
 * red indicates cant go ahead and cyan indicates complete.
 *
 * @namespace NexaColours
 * @memberof module:constants
 */
const NexaColours = {

  // Key Colours
  // The blues are the main branding colours for nexa and are to be used throughout
  // the interface for headings and buttons.
  // The nexa Orange colour is to be used for messages and highlighted sections
  // through the app as an accent colour.
  Blue: '#003D7E',
  BlueAccent: '#0057A3',
  Cyan: '#00ABE5',
  CyanAccent: '#82CFEF',
  Orange: '#E35C12',
  OrangeAccent: '#F7BFA1',
  Green: '#7AB41D',
  GreenAccent: '#D5F1A7',
  Yellow: '#F9BA00',
  YellowAccent: '#FFE699',
  Red: '#E43433',
  RedAccent: '#F3A5A5',

  // Grey Tones
  // The three grey tones for nexa are to be used for the background of the app and in tables.
  // Text should be in either white or the darkest grey, based on which will be more readable.
  // Where possible, alternating light and ultra-light grey colours should be used for table rows
  GreyDarkest: '#222222',
  GreyDark: '#444444',
  Grey: '#82939C',
  GreyAccent: '#A2ACB1',
  GreyLight: '#D0D6D9', // Table row background (odd)
  GreyUltraLight: '#ECECED', // Table row background (even)

  // Alert Colours
  // These colours are to be used for status alerts and progress bars in the nexa app.
  AlertGreen: '#7AB41D', // Go Ahead / In Progress
  AlertYellow: '#F9BA00', // Issue / Go Ahead with comment
  AlertOrange: '#E35C12', // ??
  AlertRed: '#E43433', // Unable to go ahead
  AlertCyan: '#00ABE5', // Complete

  Black: '#000000',
  White: '#FFFFFF',

  toolTip: '#FFFFB3'
};

export default NexaColours;
