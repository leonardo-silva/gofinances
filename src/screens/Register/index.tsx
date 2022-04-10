import React from 'react';

import { Input } from '../../components/forms/Input';
import { 
    Container,
    Header,
    Title,
    Form
} from './styles';

export function Register() {
    return (
        <Container>
            <Header>
                <Title>Cadastro</Title>
            </Header>

            <Form>
                <Input 
                    placeholder='Nome'
                />
                <Input 
                    placeholder='Preço'
                />
            </Form>

        </Container>

    );
}