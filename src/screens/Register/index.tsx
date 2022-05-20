import React, { useState } from 'react';
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native';

import { useForm } from 'react-hook-form';
import {
    useNavigation,
    NavigationProp,
    ParamListBase,
} from "@react-navigation/native";

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

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

export type FormData = {
    [x: string]: any;
} 

const schema = Yup.object().shape({
    name: Yup
    .string()
    .required('Nome é obrigatório'),
    amount: Yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
    .required('O valor é obrigatório'),
});

export function Register() {
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria'
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    const dataKey = '@gofinances:transactions';

    const { navigate }: NavigationProp<ParamListBase> = useNavigation();

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

    function resetFields() {
        reset();  // from hook-form, for form fields
        setTransactionType('');
        setCategory({
            key: 'category',
            name: 'Categoria'
        });
        setCategoryModalOpen(false);
    }

    async function handleRegister(form: FormData) {
        if (! transactionType)
            return Alert.alert('Selecione o tipo da transação');

        if (category.key === 'category')    
            return Alert.alert('Selecione a categoria');
    
        const data = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }

        //console.log(data);
        try {
            const currentData = await AsyncStorage.getItem(dataKey);
            const formattedData = currentData ? JSON.parse(currentData) : [];
            const newData = [
                ...formattedData,
                data
            ];

            await AsyncStorage.setItem(dataKey, JSON.stringify(newData));
            
            resetFields();
            
            navigate('Listagem');

        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possível salvar os dados!');
        }
    }
    
    // useEffect (() => {
    //     // async function load() {
    //     //     const transactions = await AsyncStorage.getItem(dataKey);
    //     //     console.log(transactions);
    //     //     if (transactions)
    //     //         console.log(JSON.parse(transactions));
    //     // }

    //     // load();

    //     // If necessary to clear, remove itens, do this:
    //     async function removeAll() {
    //         await AsyncStorage.removeItem(dataKey);
    //     }
    //     removeAll();
    // }, []);
 
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>

                <Form>
                    <Fields>
                        <InputForm 
                            control={control} 
                            error={errors.name && errors.name.message}
                            name="name"
                            placeholder='Nome'
                            autoCapitalize='sentences'
                            autoCorrect={false}
                        />
                        <InputForm
                            control={control} 
                            error={errors.amount && errors.amount.message}
                            keyboardType='numeric'
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
        </TouchableWithoutFeedback>
    );
}

