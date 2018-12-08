import React, { Component } from 'react';
import { blue } from '@material-ui/core/colors';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import auth from './services/authService';
import AlertServiceComponent from './services/alertService';
import AlertDemo from './components/_develop/AlertDemo';
import Navbar from './components/navigation/Navbar';

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: blue,
        secondary: blue,
    },
});

class App extends Component {
    state = {
        user: null,
    };

    componentDidMount() {
        // const user = auth.getCurrentUser();
        // this.setState({ user });
    }

    render() {
        const { user } = this.state;
        console.log('user: ', user);

        return (
            <MuiThemeProvider theme={theme}>
                <AlertServiceComponent />
                <Navbar user={user} />

                <header>
                    <h1>Roboto</h1>
                    <p>Ten tekst jest tylko do sprawdzenia czy czcionka działa poprawnie.</p>
                </header>

                <main>

                    <AlertDemo />
                    {/*<SimpleCategoryListDemo/>*/}
                </main>

            </MuiThemeProvider>
        );
    }
}

export default App;
