import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import { ResponsiveBar } from '@nivo/bar';
import ChartWrapper from './ChartWrapper';


const BarChart = ({ dataStructure, currency, groupMode }) => {

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
                        'top': 20,
                        'right': 130,
                        'bottom': 55,
                        'left': 90,
                    }}
                    padding={0.3}
                    groupMode={groupMode ? 'grouped' : 'stacked'}
                    colors='nivo'
                    colorBy='id'
                    borderColor='inherit:darker(1.6)'
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        'tickSize': 5,
                        'tickPadding': 5,
                        'tickRotation': 0,
                        'legend': timePeriod,
                        'legendPosition': 'middle',
                        'legendOffset': 36,
                    }}
                    axisLeft={{
                        'tickSize': 5,
                        'tickPadding': 5,
                        'tickRotation': 0,
                        'legend': currency,
                        'legendPosition': 'middle',
                        'legendOffset': -70,
                        'format': x => x.toFixed(2),
                    }}
                    labelSkipWidth={12}
                    labelSkipHeight={12}
                    labelTextColor='inherit:darker(1.6)'
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                    legends={[
                        {
                            'dataFrom': 'keys',
                            'anchor': 'bottom-right',
                            'direction': 'column',
                            'justify': false,
                            'translateX': 120,
                            'translateY': 0,
                            'itemsSpacing': 2,
                            'itemWidth': 100,
                            'itemHeight': 20,
                            'itemDirection': 'left-to-right',
                            'itemOpacity': 0.85,
                            'symbolSize': 20,
                            'effects': [
                                {
                                    'on': 'hover',
                                    'style': {
                                        'itemOpacity': 1,
                                    },
                                },
                            ],
                        },
                    ]}
                    tooltipFormat='.2f'
                />

            </ChartWrapper>
        </div>
    );
};

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
