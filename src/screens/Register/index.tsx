import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from 'react-native';

import { Button } from '../../components/forms/Button';
import { CategorySelectButton } from '../../components/forms/CategorySelectButton';

import { InputForm } from '../../components/forms/InputForm';
import { TransactionTypeButton } from '../../components/forms/TransactionTypeButton';
import { CategorySelect } from '../CategorySelect';
import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes
} from './styles';

// interface FormData {
//     name: string;
//     amount: string;
// }

export type FormData = {
    [x: string]: any;
} 

export function Register() {
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria'
    });

    const {
        control,
        handleSubmit
    } = useForm();

    /** the creation of a method called handle... is a common pattern.
     * Someone might set the property directly on the onPress event, but I use
     * the pattern with handle....
      */
    function handleTransactionType(type: 'up' | 'down') {
        setTransactionType(type);
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModalOpen(false);
    }

    function handleOpenSelectCategoryModal() {
        setCategoryModalOpen(true);
    }

    function handleRegister(form: FormData) {
        const data = {
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key
        }

        console.log(data);
    }

    return (
        <Container>
            <Header>
                <Title>Cadastro</Title>
            </Header>

            <Form>
                <Fields>
                    <InputForm 
                        control={control} 
                        name="name"
                        placeholder='Nome'
                    />
                    <InputForm
                        control={control} 
                        name="amount"
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

                    <CategorySelectButton 
                        title={category.name}
                        onPress={handleOpenSelectCategoryModal}
                    />
                </Fields>

                <Button 
                    onPress={handleSubmit(handleRegister)}
                    title='Enviar'
                />
            </Form>

            <Modal visible={categoryModalOpen}>
                <CategorySelect 
                    category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseSelectCategoryModal}
                />
            </Modal>

        </Container>

    );
}