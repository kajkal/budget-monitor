import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Alert, StyleSheet } from 'react-native';
import { Button, Fab, Icon } from 'native-base';
import authService from '../../services/authService';
import { neutralColor, primaryColor } from '../../config/theme';


class UserOptionsMenu extends PureComponent {
    state = {
        isActive: false,
    };

    handleToggleMenu = () => {
        this.setState(state => ({ isActive: !state.isActive}));
    };

    handleLogout = async () => {
        const { navigation } = this.props;
        await authService.logout();
        navigation.replace('Login');
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
                    name='person'
                    type='MaterialIcons'
                    style={styles.icon}
                />

                <Button
                    style={styles.fabOption}
                    onPress={() => Alert.alert(
                        'Are you sure you want to log out?',
                        'Confirm and log out',
                        [
                            {text: 'Cancel', onPress: null, style: 'cancel'},
                            {text: 'OK', onPress: this.handleLogout},
                        ],
                        { cancelable: false }
                    )}
                >
                    <Icon
                        name='power-settings-new'
                        type='MaterialIcons'
                        style={{ ...styles.icon, color: neutralColor }}
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

UserOptionsMenu.propTypes = {
    positionNumber: PropTypes.number.isRequired,
    navigation: PropTypes.shape({
        replace: PropTypes.func.isRequired,
    }).isRequired,
};

export default UserOptionsMenu;
