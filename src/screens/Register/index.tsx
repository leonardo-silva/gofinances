import React, { useState } from 'react';
import { Button } from '../../components/forms/Button';

import { Input } from '../../components/forms/Input';
import { TransactionTypeButton } from '../../components/forms/TransactionTypeButton';
import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes
} from './styles';

export function Register() {
    const [transactionType, setTransactionType] = useState('');

    /** the creation of a method called handle... is a common pattern.
     * Someone might set the property directly on the onPress event, but I use
     * the pattern with handle....
      */
    function handleTransactionType(type: 'up' | 'down') {
        setTransactionType(type);
    }

    return (
        <Container>
            <Header>
                <Title>Cadastro</Title>
            </Header>

            <Form>
                <Fields>
                    <Input 
                        placeholder='Nome'
                    />
                    <Input 
                        placeholder='Preço'
                    />

                    <TransactionTypes>
                        <TransactionTypeButton 
                            title='income'
                            type='up'
                            onPress={() => handleTransactionType('up')}
                            isActive={transactionType === 'up'}
                        />
                        <TransactionTypeButton 
                            title='expense'
                            type='down'
                            onPress={() => handleTransactionType('down')}
                            isActive={transactionType === 'down'}
                        />
                    </TransactionTypes>
                </Fields>

                <Button title='Enviar'/>
            </Form>

        </Container>

    );
}