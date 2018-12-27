import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import Typography from '@material-ui/core/es/Typography/Typography';
import { ResponsiveLine } from '@nivo/line';
import ChartWrapper from './ChartWrapper';


class LineChart extends PureComponent {

    tooltip = ({ id, data }) => {
        const { currency } = this.props;
        const formattedDate = DateTime.fromJSDate(id).setLocale('local').toFormat('dd MMMM yyyy');
        return (
            <Typography variant='caption' className='line-chart-tooltip'>
                <div className='date'>{formattedDate}</div>
                <div className='data-summary'>
                    {
                        data.map(({ data: { y: value }, serie: { id: category } }, index) => (
                            <React.Fragment key={index}>
                                <div className='value'>{`${value.toFixed(2)} ${currency}`}</div>
                                <div className='category'>{category}</div>
                            </React.Fragment>
                        ))
                    }
                </div>
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

                    <ResponsiveLine
                        data={dataStructure}
                        margin={{
                            top: 50,
                            right: 110,
                            bottom: 50,
                            left: 90,
                        }}
                        xScale={{
                            type: 'time',
                            format: '%Y-%m-%d',
                            precision: 'day',
                        }}
                        yScale={{
                            type: 'linear',
                            stacked: false,
                            min: 'auto',
                            max: 'auto',
                        }}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            orient: 'bottom',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'day',
                            legendOffset: 36,
                            legendPosition: 'middle',
                            format: d => DateTime.fromJSDate(d).setLocale('local').toFormat('dd MMM'),
                        }}
                        axisLeft={{
                            orient: 'left',
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: currency,
                            legendOffset: -70,
                            legendPosition: 'middle',
                            format: x => x.toFixed(2),
                        }}
                        dotSize={10}
                        dotColor='inherit:darker(0.3)'
                        dotBorderWidth={2}
                        dotBorderColor='#ffffff'
                        curve='monotoneX'
                        enableDotLabel={true}
                        dotLabel='y'
                        dotLabelYOffset={-12}
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
                        legends={[
                            {
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false,
                                translateX: 100,
                                translateY: 0,
                                itemsSpacing: 0,
                                itemDirection: 'left-to-right',
                                itemWidth: 80,
                                itemHeight: 20,
                                itemOpacity: 0.75,
                                symbolSize: 12,
                                symbolShape: 'circle',
                                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemBackground: 'rgba(0, 0, 0, .03)',
                                            itemOpacity: 1,
                                        },
                                    },
                                ],
                            },
                        ]}
                        tooltip={this.tooltip}
                    />

                </ChartWrapper>
            </div>
        );
    }
}

LineChart.propTypes = {
    dataStructure: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired, // category name
            data: PropTypes.arrayOf(
                PropTypes.shape({
                    x: PropTypes.string.isRequired, // day
                    y: PropTypes.number.isRequired, // value for day
                }),
            ).isRequired,
        }),
    ),
    currency: PropTypes.string,
};

export default LineChart;
