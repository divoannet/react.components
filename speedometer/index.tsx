import * as React from 'react';
let style = require<any>('./style.css');

type Props = {
  value: number;
  radius?: number;
  strokeWidth?: number;
  color?: any;
}

class Speedometer extends React.Component<Props, any> {

  constructor(props) {
    super(props);
  }

  public render():JSX.Element {
    const radius = this.props.radius ? this.props.radius : 130;
    const strokeWidth = this.props.strokeWidth ? this.props.strokeWidth : 26;
    const color = this.props.color ? this.props.color : '#ff5944';

    const s = strokeWidth / 2;
    const r = radius - s;
    const width = radius * 2;
    const height = radius + 4;
    const viewBox = `0 0 ${width} ${height}`;
    const traceDashArray = r * Math.PI * 2;
    const traceDashOffset = traceDashArray / 2;
    const dashArray = r * Math.PI * 2;
    const dashOffset = dashArray - dashArray * this.props.value / 200;
    const angle = ((this.props.value / 100) * 360 - 180) / 2;
    return <svg
      className={style.speedometer}
      width={width}
      height={height}
      viewBox={viewBox}
    >
      <circle
        className={style.timerFg}
        cx={radius}
        cy={radius}
        r={r}
        strokeWidth={`${strokeWidth}px`}
        transform={`rotate(180 ${radius} ${radius})`}
        style={{
            strokeDasharray: traceDashArray,
            strokeDashoffset: traceDashOffset,
            stroke: '#e6e6e6',
            fill: 'none'
      }}/>
      <circle
        className={style.timerFg}
        cx={radius}
        cy={radius}
        r={r}
        strokeWidth={`${strokeWidth}px`}
        transform={`rotate(180 ${radius} ${radius})`}
        style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
            stroke: color,
            fill: 'none'
      }}/>
      <text
        className={style.scale}
        x={strokeWidth + 4}
        y={'100%'}
        dy='0'
        textAnchor='start'
      >
        0%
      </text>
      <text
        className={style.scale}
        x={'50%'}
        y={strokeWidth}
        dy={'14px'}
        textAnchor='middle'
      >
        50%
      </text>
      <text
        className={style.scale}
        x={radius * 2 - (strokeWidth + 4)}
        y={'100%'}
        dy='0'
        textAnchor='end'
      >
        100%
      </text>
      <polygon
        className={style.arrow}
        points="0,64 4,0 8,64"
        fill="#363636"
        transform={`translate(${radius - 4}, ${s}) rotate(${angle} 4 ${radius - s})`}
      />
      <text
        className={style.percentage}
        x={radius}
        y={'100%'}
        dy='0'
        textAnchor='middle'>
        { this.props.value + '%' }
      </text>
    </svg>;
  }
}

export default Speedometer;