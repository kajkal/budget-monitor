import React from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import { ResponsiveCalendar } from '@nivo/calendar';
import ChartWrapper from './ChartWrapper';


const CalendarChart = ({ dataStructure, currency }) => {

    if (!dataStructure || !currency) return <LinearProgress style={{ width: '100%' }} />;

    const { from, to, incomeData, expenseData } = dataStructure;
    if (incomeData.length === 0 && expenseData.length === 0)
        return <h1 style={{ marginTop: '64px' }}>No data to display</h1>;

    const rowsCount = to.match(/(\d{4})/)[0] - from.match(/(\d{4})/)[0];
    const options = { maxHeight: `${(260 + rowsCount * 160) * 2}px` };
    return (
        <div className='chart-area' style={options}>

            <ChartWrapper
                title='Income'
                fullWidth={true}
            >

                <ResponsiveCalendar
                    data={incomeData}
                    from={from}
                    to={to}
                    emptyColor='#eeeeee'
                    colors={[
                        '#98f48a',
                        '#71f463',
                        '#5bf451',
                        '#12f419',
                    ]}
                    margin={{
                        'top': 30,
                        'right': 30,
                        'bottom': 60,
                        'left': 30,
                    }}
                    // direction='vertical'
                    yearSpacing={40}
                    monthBorderColor='#ffffff'
                    monthLegendOffset={10}
                    monthLegend={(year, month) => DateTime.local(year, month + 1).setLocale('local').toFormat('LLL')}
                    dayBorderWidth={2}
                    dayBorderColor='#ffffff'
                    legends={[
                        {
                            'anchor': 'bottom-right',
                            'direction': 'row',
                            'translateY': 36,
                            'itemCount': 4,
                            'itemWidth': 34,
                            'itemHeight': 36,
                            'itemDirection': 'top-to-bottom',
                        },
                    ]}
                />

            </ChartWrapper>

            <ChartWrapper
                title='Expense'
                fullWidth={true}
            >

                <ResponsiveCalendar
                    data={expenseData}
                    from={from}
                    to={to}
                    emptyColor='#eeeeee'
                    colors={[
                        '#f4987a',
                        '#f46d63',
                        '#f43a31',
                        '#f40c11',
                    ]}
                    margin={{
                        'top': 30,
                        'right': 30,
                        'bottom': 60,
                        'left': 30,
                    }}
                    // direction='vertical'
                    yearSpacing={40}
                    monthBorderColor='#ffffff'
                    monthLegendOffset={10}
                    monthLegend={(year, month) => DateTime.local(year, month + 1).setLocale('local').toFormat('LLL')}
                    dayBorderWidth={2}
                    dayBorderColor='#ffffff'
                    legends={[
                        {
                            'anchor': 'bottom-right',
                            'direction': 'row',
                            'translateY': 36,
                            'itemCount': 4,
                            'itemWidth': 34,
                            'itemHeight': 36,
                            'itemDirection': 'top-to-bottom',
                        },
                    ]}
                />

            </ChartWrapper>

        </div>
    );
};


CalendarChart.propTypes = {
    dataStructure: PropTypes.shape({
        from: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
        incomeData: PropTypes.arrayOf(PropTypes.shape({
            day: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
        })).isRequired,
        expenseData: PropTypes.arrayOf(PropTypes.shape({
            day: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
        })).isRequired,
    }),
    currency: PropTypes.string,
};

export default CalendarChart;
