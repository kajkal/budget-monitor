import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import Typography from '@material-ui/core/es/Typography/Typography';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';
import ChartWrapper from './ChartWrapper';


class HourlyChart extends PureComponent {
    state = {
        pointId: null,
    };

    handleMouseMove = point => {
        this.setState({ pointId: point.id });
    };

    handleMouseLeave = () => {
        this.setState({ pointId: null });
    };

    getSymbolSize = point => {
        const { pointId } = this.state;
        if (pointId !== null && pointId === point.id) return 16;
        return 8;
    };

    tooltip = ({ serie: { id }, date, description, value }) => {
        const { currency } = this.props;
        return (
            <Typography variant='caption' className='hourly-chart-tooltip'>
                <div className='date'>{date.toFormat('yyyy.MM.dd HH:mm')}</div>
                <div className='category'>{id}</div>
                <div className='description'>{description}</div>
                <div className='value'>{`${value.toFixed(2)} ${currency}`}</div>
            </Typography>
        );
    };


    render() {
        const { dataStructure, currency } = this.props;

        if (!dataStructure || !currency) return <LinearProgress style={{ width: '100%' }} />;
        if (dataStructure.length === 0) return <h1 style={{ marginTop: '64px' }}>No data to display</h1>;

        return (
            <div className='chart-area'>
                <ChartWrapper>

                    <ResponsiveScatterPlot
                        data={dataStructure}
                        margin={{
                            top: 20,
                            right: 140,
                            bottom: 70,
                            left: 90,
                        }}
                        xScale={{
                            type: 'time',
                            format: '%Y-%m-%d',
                            precision: 'day',
                        }}
                        yScale={{
                            type: 'time',
                            format: '%H:%M:%S',
                            precision: 'minute',
                        }}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            orient: 'bottom',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'day',
                            legendPosition: 'middle',
                            legendOffset: 46,
                            format: '%b %d',

                        }}
                        axisLeft={{
                            orient: 'left',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'time',
                            legendPosition: 'middle',
                            legendOffset: -60,
                            format: '%H:%M',
                        }}
                        colors='category10'
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
                        legends={[
                            {
                                anchor: 'bottom-right',
                                direction: 'column',
                                translateX: 130,
                                itemWidth: 100,
                                itemHeight: 12,
                                itemsSpacing: 5,
                                itemTextColor: '#999',
                                symbolSize: 12,
                                symbolShape: 'circle',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemTextColor: '#000',
                                        },
                                    },
                                ],
                            },
                        ]}
                        symbolSize={this.getSymbolSize}
                        onMouseMove={this.handleMouseMove}
                        onMouseLeave={this.handleMouseLeave}
                        tooltip={this.tooltip}
                    />

                </ChartWrapper>
            </div>
        );
    }
}

HourlyChart.propTypes = {
    dataStructure: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired, // category name
            data: PropTypes.arrayOf(
                PropTypes.shape({
                    x: PropTypes.string.isRequired, // day
                    y: PropTypes.string.isRequired, // time
                }),
            ).isRequired,
        }),
    ),
    currency: PropTypes.string,
};

export default HourlyChart;
