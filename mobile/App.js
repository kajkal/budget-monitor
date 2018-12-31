import React, { PureComponent } from 'react';
import { Root, StyleProvider } from 'native-base';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import getTheme from './src/native-base-theme/components';
import material from './src/native-base-theme/variables/material';
import LoginScreen from './src/components/LoginScreen';
import HomeScreen from './src/components/HomeScreen';
import EntryFormScreen from './src/components/EntryFormScreen';
import CategoryScreen from './src/components/CategoryScreen';


const AppNavigator = createStackNavigator({
    Login: {
        screen: LoginScreen,
    },
    Home: {
        screen: HomeScreen,
    },
    EntryForm: {
        screen: EntryFormScreen,
    },
    CategoryScreen: {
        screen: CategoryScreen,
    }
}, {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#689f38',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: '300',
        },
    },
});

const AppContainer = createAppContainer(AppNavigator);

class App extends PureComponent {
    state = {
        fontLoaded: false,
    };

    async componentDidMount() {
        await Expo.Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        });
        this.setState({ fontLoaded: true });
    }

    render() {
        if (!this.state.fontLoaded) return null;
        return (
            <Root>
                <StyleProvider style={getTheme(material)}>
                    <AppContainer />
                </StyleProvider>
            </Root>
        );
    }
}

export default App;
