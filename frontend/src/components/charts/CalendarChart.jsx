import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import Typography from '@material-ui/core/es/Typography/Typography';
import { ResponsiveCalendar } from '@nivo/calendar';
import ChartWrapper from './ChartWrapper';


class CalendarChart extends PureComponent {

    tooltip = ({ date, value }) => {
        const { currency } = this.props;
        const formattedDate = DateTime.fromJSDate(date).setLocale('local').toFormat('dd MMMM, cccc');
        return (
            <Typography variant='caption' className='calendar-chart-tooltip'>
                <div className='date'>{formattedDate}</div>
                <div className='value'>{`${value.toFixed(2)} ${currency}`}</div>
            </Typography>
        );
    };

    renderCalendarChart = (from, to, data, colors) => {
        return (
            <ResponsiveCalendar
                data={data}
                from={from}
                to={to}
                emptyColor='#eeeeee'
                colors={colors}
                margin={{
                    top: 30,
                    right: 30,
                    bottom: 60,
                    left: 30,
                }}
                yearSpacing={40}
                monthBorderWidth={2}
                monthBorderColor='#000000'
                monthLegendOffset={10}
                monthLegend={(year, month) => DateTime.local(year, month + 1).setLocale('local').toFormat('LLL')}
                dayBorderWidth={2}
                dayBorderColor='#ffffff'
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'row',
                        translateY: 36,
                        itemCount: 4,
                        itemWidth: 34,
                        itemHeight: 36,
                        itemDirection: 'top-to-bottom',
                    },
                ]}
                tooltip={this.tooltip}
            />
        );
    };

    render() {
        const { dataStructure, currency } = this.props;

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

                    {this.renderCalendarChart(from, to, incomeData, [
                        '#98f48a',
                        '#71f463',
                        '#5bf451',
                        '#12f419',
                    ])}

                </ChartWrapper>

                <ChartWrapper
                    title='Expense'
                    fullWidth={true}
                >

                    {this.renderCalendarChart(from, to, expenseData, [
                        '#f40c11',
                        '#f43a31',
                        '#f46d63',
                        '#f4987a',
                    ])}

                </ChartWrapper>

            </div>
        );
    }
}

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
