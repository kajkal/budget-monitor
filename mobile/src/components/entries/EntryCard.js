import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'native-base';
import { DateTime } from 'luxon';
import { positiveColor } from '../../config/theme';
import { getCategoryByIdCategory } from '../../services/entities-services/categoryService';
import { categoryShape, entryShape } from '../../config/propTypesCommon';
import EntryDeleteButton from './EntryDeleteButton';
import EntryEditButton from './EntryEditButton';


class EntryCard extends PureComponent {

    formatValue = (value, mainPrice) => {
        const { currency } = this.props;

        const valueStyle = { fontSize: 16 };
        if (value > 0) valueStyle.color = positiveColor;
        if (mainPrice) valueStyle.fontSize = 18;

        return (
            <View style={styles.flexRow}>
                <Text style={valueStyle}>{(value / 100).toFixed(2)}</Text>
                <Text style={styles.currency}>{currency}</Text>
            </View>
        );
    };

    formatCategory = idCategory => {
        const category = getCategoryByIdCategory(idCategory);
        return <Text style={styles.category}>{category && category.name}</Text>;
    };

    renderDates = (dateOfAddition, dateOfLastModification) => {
        const additionDate = DateTime.fromMillis(dateOfAddition).toLocaleString(DateTime.DATETIME_MED);
        const modificationDate = (dateOfAddition !== dateOfLastModification) ?
            DateTime.fromMillis(dateOfLastModification).toLocaleString(DateTime.DATETIME_MED) : null;

        return (
            <View>
                <Text style={styles.details}>Added: {additionDate}</Text>
                {modificationDate && <Text style={styles.details}>Modified: {modificationDate}</Text>}
            </View>
        );
    };

    renderSubEntryArea = subEntries => {
        return (
            <View style={styles.subEntriesArea}>
                {
                    subEntries.map(subEntry => (
                        <View key={subEntry.idSubEntry} style={styles.flexRow}>
                            <View style={{ width: 80 }}>
                                {this.formatValue(subEntry.value)}
                            </View>
                            {this.formatCategory(subEntry.idCategory)}
                            <Text style={{ marginLeft: 8 }}>{subEntry.description}</Text>
                        </View>
                    ))
                }
            </View>
        );
    };

    render() {
        const { entry, rootCategory, currency, onEntriesChange, navigation } = this.props;
        const { idCategory, description, value, date, dateOfAddition, dateOfLastModification, subEntries } = entry;
        const time = date.toLocaleString(DateTime.DATETIME_MED);

        return (
            <Card>
                <View style={styles.cardContent}>

                    <View style={styles.flexRow}>

                        <View style={{ flexGrow: 1 }}>
                            <Text>{time}</Text>
                            {this.formatCategory(idCategory)}
                        </View>

                        <View style={{ paddingVertical: 8 }}>
                            {this.formatValue(value, currency, true)}
                        </View>

                    </View>

                    <View>
                        <Text>{description}</Text>
                    </View>


                    {this.renderSubEntryArea(subEntries)}

                    {this.renderDates(dateOfAddition, dateOfLastModification)}

                </View>


                <View style={styles.flexRow}>

                    <View style={{ flexGrow: 1 }} />

                    <EntryDeleteButton
                        entry={entry}
                        onEntriesChange={onEntriesChange}
                    />

                    <EntryEditButton
                        entry={entry}
                        rootCategory={rootCategory}
                        currency={currency}
                        navigation={navigation}
                    />

                </View>

            </Card>
        );
    }
}

const styles = StyleSheet.create({
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
        // alignItems: "center"
    },
    cardContent: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    subEntriesArea: {
        paddingHorizontal: 8,
        paddingVertical: 16,
    },
    currency: {
        fontSize: 10,
        marginTop: 0,
        marginHorizontal: 6
    },
    category: {
        fontStyle: 'italic',
    },
    details: {
        fontSize: 12,
    }
});

EntryCard.propTypes = {
    entry: entryShape.isRequired,
    rootCategory: categoryShape.isRequired,
    currency: PropTypes.string.isRequired,
    onEntriesChange: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }).isRequired,
};

export default EntryCard;
