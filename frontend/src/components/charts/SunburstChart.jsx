import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import { ResponsiveSunburst } from '@nivo/sunburst';
import ChartWrapper from './ChartWrapper';


const SunburstChart = ({ dataStructure, currency }) => {
    if (!dataStructure || !currency) return <LinearProgress style={{ width: '100%' }} />;

    const { incomeTree, expenseTree } = dataStructure;
    if (incomeTree.totalValue === 0 && expenseTree.totalValue === 0) return <h1 style={{ marginTop: '64px' }}>No data to display</h1>;

    return (
        <div className='chart-area'>

            <ChartWrapper
                title='Income categories'
                caption={`Total value: ${incomeTree.totalValue.toFixed(2)} ${currency}`}
            >

                <ResponsiveSunburst
                    data={incomeTree}
                    margin={{
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                    }}
                    identity='name'
                    value='value'
                    cornerRadius={2}
                    borderWidth={2}
                    borderColor='white'
                    colors='nivo'
                    colorBy='value'
                    childColor='inherit:darker(1.1)'
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                    isInteractive={true}
                />

            </ChartWrapper>

            <ChartWrapper
                title='Expense categories'
                caption={`Total value: ${expenseTree.totalValue.toFixed(2)} ${currency}`}
            >

                <ResponsiveSunburst
                    data={expenseTree}
                    margin={{
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                    }}
                    identity='name'
                    value='value'
                    cornerRadius={2}
                    borderWidth={1}
                    borderColor='white'
                    colors='nivo'
                    colorBy='value'
                    childColor='inherit:darker(1.1)'
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                    isInteractive={true}
                />

            </ChartWrapper>

        </div>
    );
};

SunburstChart.propTypes = {
    dataStructure: PropTypes.shape({
        incomeTree: PropTypes.object.isRequired,
        expenseTree: PropTypes.object.isRequired,
    }),
    currency: PropTypes.string,
};

export default SunburstChart;
