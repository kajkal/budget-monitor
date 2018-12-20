import { PureComponent } from 'react';
import auth from '../services/authService';

class Logout extends PureComponent {
    componentDidMount() {
        auth.logout();
        window.location = '/';
    }

    render() {
        return null;
    }
}

export default Logout;
