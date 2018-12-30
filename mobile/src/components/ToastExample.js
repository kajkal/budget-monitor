import React, { Component } from 'react';
import { Container, Header, Content, Button, Text } from 'native-base';
import alertService from '../services/alertService';


export default class ToastExample extends Component {


    render() {
        return (
            <Container>
                <Content padder>
                    <Button onPress={()=> alertService.success('Login successfuly')}>
                        <Text>Toast</Text>
                    </Button>
                    <Button onPress={()=> alertService.warning('Unexpected error')}>
                        <Text>Toast</Text>
                    </Button>
                    <Button onPress={()=> alertService.error('Bad credencial')}>
                        <Text>Toast</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}