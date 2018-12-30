import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, Fab, Icon } from 'native-base';
import { StyleSheet } from 'react-native';
import { negativeColor, positiveColor, primaryColor } from '../../config/theme';
import { categoryShape } from '../../config/propTypesCommon';


class NewEntryOptions extends PureComponent {
    state = {
        isActive: false,
    };

    handleToggleMenu = () => {
        this.setState(state => ({ isActive: !state.isActive}));
    };

    handleOpenNewEntryForm = type => () => {
        const { navigation, currency, rootCategory } = this.props;
        navigation.navigate('EntryForm', {
            type: type,
            currency: currency,
            rootCategory: JSON.stringify(rootCategory),
        });
    };

    render() {
        const { isActive } = this.state;
        const { positionNumber } = this.props;
        const right = 10 + (positionNumber * 80);

        return (
            <Fab
                active={isActive}
                direction="up"
                containerStyle={{
                    position: 'absolute',
                    bottom: 10,
                    right: right,
                }}
                style={styles.mainFab}
                onPress={this.handleToggleMenu}
            >

                <Icon
                    name='add'
                    type='MaterialIcons'
                    style={styles.icon}
                />

                <Button
                    style={styles.fabOption}
                    onPress={this.handleOpenNewEntryForm('expense')}
                >
                    <Icon
                        name='trending-down'
                        type='MaterialIcons'
                        style={{ ...styles.icon, color: negativeColor }}
                    />
                </Button>

                <Button
                    style={styles.fabOption}
                    onPress={this.handleOpenNewEntryForm('income')}
                >
                    <Icon
                        name='trending-up'
                        type='MaterialIcons'
                        style={{ ...styles.icon, color: positiveColor }}
                    />
                </Button>

            </Fab>
        );
    }
}

const styles = StyleSheet.create({
    mainFab: {
        backgroundColor: primaryColor,
    },
    fabOption: {
        backgroundColor: '#fff'
    },
    icon: {
        fontSize: 30,
    }
});

NewEntryOptions.propTypes = {
    positionNumber: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    rootCategory: categoryShape.isRequired,
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }).isRequired,
};

export default NewEntryOptions;
