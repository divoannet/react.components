import * as React from 'react';
let style = require<any>('./style.css');
import * as _ from 'lodash';

type Props = {
  data: Array<DataItem>;
  radius?: number;
  strokeWidth?: number;
}

interface DataItem {
  label: string;
  value: number;
  color: string;
}

class Chart extends React.Component<Props, any> {

  constructor(props) {
    super(props);
    this.state = {
      hoveredItem: props.data.length
    };
    this.mouseLeaveSegment = this.mouseLeaveSegment.bind(this);
  }

  public componentDidMount():void {
    this.setState({
      hoveredItem: this.props.data.length
    });
  }

  public mouseOverSegment(index:number):void {
    this.setState({
      hoveredItem: index
    });
  }

  public mouseLeaveSegment():void {
    this.setState({
      hoveredItem: this.props.data.length
    });
  }

  public render():JSX.Element {
    const {data} = this.props;
    const total = _.sumBy(data, item => item.value);

    const outerRadius = this.props.radius || 100;
    const strokeWidth = this.props.strokeWidth || 20;
    const innerRadius = outerRadius - strokeWidth;
    const trackRadius = outerRadius - strokeWidth / 2;

    const gap = 6;
    const hoverOuterRadius = outerRadius + gap;

    const width = hoverOuterRadius * 2;
    const height = hoverOuterRadius * 2;
    const viewBox = `0 0 ${width} ${height}`;

    const cX = hoverOuterRadius;
    const cY = hoverOuterRadius;

    let startAngle = -Math.PI / 2;

    return <svg
      className={style.chart}
      width={width}
      height={height}
      viewBox={viewBox}
    >
      <circle
        className={style.chartTrack}
        cx={cX}
        cy={cY}
        r={trackRadius}
        strokeWidth={`${strokeWidth}px`}
        style={{
            stroke: '#e6e6e6',
            fill: 'none'
      }}/>
      { data.map((item, index) => {
        switch (item.value) {
          case 0:
            return;
          case total:
            return (<circle
              className={style.chartTrack}
              cx={cX}
              cy={cY}
              r={trackRadius}
              strokeWidth={`${strokeWidth}px`}
              style={{
                stroke: item.color,
                fill: 'none'
            }}/>);
          default:
            const radius = this.state.hoveredItem === index ? hoverOuterRadius : outerRadius;
            const segmentAngle = (item.value / total) * Math.PI * 2;
            const endAngle = startAngle + segmentAngle;
            const startX = cX + Math.cos(startAngle) * radius;
            const startY = cY + Math.sin(startAngle) * radius;
            const endX = cX + Math.cos(endAngle) * radius;
            const endY = cY + Math.sin(endAngle) * radius;
            const inStartX = cX + Math.cos(startAngle) * innerRadius;
            const inStartY = cY + Math.sin(startAngle) * innerRadius;
            const inEndX = cX + Math.cos(endAngle) * innerRadius;
            const inEndY = cY + Math.sin(endAngle) * innerRadius;
            const arcFlag = item.value > (total / 2) ? 1 : 0;
            startAngle += segmentAngle;

            return (
            <path
              key={index}
              className={style.chartSegment}
              fill={item.color}
              d={`M ${startX} ${startY}
                A ${radius} ${radius} 0 ${arcFlag} 1 ${endX} ${endY}
                L ${inEndX} ${inEndY}
                A ${innerRadius} ${innerRadius} 0 ${arcFlag} 0 ${inStartX} ${inStartY}
                Z`}
              onMouseOver={() => {this.mouseOverSegment(index)}}
              onMouseLeave={this.mouseLeaveSegment}
            />
              )
          }
        }) }
      <text
        className={style.value}
        x={'50%'}
        y={'50%'}
        dy='16px'
        textAnchor='middle'>
        { total }
      </text>
    </svg>;
  }
}

export default Chart;