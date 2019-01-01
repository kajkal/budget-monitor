import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import Typography from '@material-ui/core/es/Typography/Typography';
import { ResponsiveBar } from '@nivo/bar';
import ChartWrapper from './ChartWrapper';


class BarChart extends PureComponent {

    tooltip = ({ indexValue, id: category, value }) => {
        const { currency } = this.props;
        const date = DateTime.fromISO(indexValue);
        let formattedDate;
        if (indexValue.includes('W')) {
            const from = date.toFormat('dd');
            const to = date.plus({ days: 6 }).toFormat('dd LLL yyyy');
            formattedDate = `${from} - ${to}`;
        } else {
            formattedDate = date.toFormat('LLLL yyyy');
        }
        return (
            <Typography variant='caption' className='bar-chart-tooltip'>
                <div className='time-period'>{formattedDate}</div>
                <div className='category'>{category}</div>
                <div className='value'>{`${value.toFixed(2)} ${currency}`}</div>
            </Typography>
        );
    };

    render() {
        const { dataStructure, currency, groupMode } = this.props;

        if (!dataStructure || !currency) return <LinearProgress style={{ width: '100%' }} />;

        const { timePeriod, keys, data } = dataStructure;
        if (keys.length === 0 || data.length === 0) return <h1 style={{ marginTop: '64px' }}>No data to display</h1>;

        return (
            <div className='chart-area'>
                <ChartWrapper>

                    <ResponsiveBar
                        data={data}
                        keys={keys}
                        indexBy='timePeriod'
                        margin={{
                            top: 20,
                            right: 130,
                            bottom: 55,
                            left: 90,
                        }}
                        padding={0.3}
                        groupMode={groupMode ? 'grouped' : 'stacked'}
                        colors='nivo'
                        colorBy='id'
                        borderColor='inherit:darker(1.6)'
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: timePeriod,
                            legendPosition: 'middle',
                            legendOffset: 36,
                        }}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: currency,
                            legendPosition: 'middle',
                            legendOffset: -70,
                            format: x => x.toFixed(2),
                        }}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor='inherit:darker(1.6)'
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
                        legends={[
                            {
                                dataFrom: 'keys',
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false,
                                translateX: 120,
                                translateY: 0,
                                itemsSpacing: 2,
                                itemWidth: 100,
                                itemHeight: 20,
                                itemDirection: 'left-to-right',
                                itemOpacity: 0.85,
                                symbolSize: 20,
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
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

BarChart.propTypes = {
    dataStructure: PropTypes.shape({
        timePeriod: PropTypes.string.isRequired,
        keys: PropTypes.arrayOf(PropTypes.string).isRequired,
        data: PropTypes.arrayOf(PropTypes.object).isRequired,
    }),
    currency: PropTypes.string,
    groupMode: PropTypes.bool.isRequired,
};

export default BarChart;
