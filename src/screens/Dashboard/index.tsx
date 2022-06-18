import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";

import { 
    Container, 
    Header,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    LogoutButton,
    UserWrapper,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LoadContainer
 } from "./styles";
import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components";

import { useAuth } from '../../hooks/auth';

export interface DataListProps extends TransactionCardProps {
    id: string
} 

interface HighlightProps {
    amount: string;
    lastTransaction: string;
}

interface HighlightData {
    entries: HighlightProps;
    expenses: HighlightProps;
    total: HighlightProps;
}

export function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [transactionData, setTransactionData] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    const theme = useTheme();

    const { signOut, user } = useAuth();

    function getLastTransactionFormattedDate(
        collection: DataListProps[], 
        type: string
    ) {
        const lastTransactionDate = Math.max
        .apply(Math, collection
        .filter(transaction => transaction.type === type)
        .map(transaction => new Date(transaction.date).getTime()));
        
        const date = new Date(lastTransactionDate);
        return `${date.getDate()} de ${date.toLocaleString('pt-BR', { month: 'long'})}`;
        // return Intl
        // .DateTimeFormat('pt-BR', {
        //     day: '2-digit',
        //     month: '2-digit',
        //     year: '2-digit'
        // }).format(new Date(lastTransactionDate));
    }

    async function loadTransactions() {
        const dataKey = `@gofinances:transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        const currencyFormat = {
            style: 'currency',
            currency: 'BRL'
        }

        let entriesTotal = 0;
        let expensesTotal = 0;

        const formattedTransactions: DataListProps[] = transactions
        .map((item: DataListProps) => {

            const numberAmount = Number(item.amount);

            if (item.type === 'up') {
                entriesTotal += numberAmount;
            } else {
                expensesTotal += numberAmount;
            }

            const amount = numberAmount.toLocaleString('pt-BR', currencyFormat);

            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(item.date));

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date,
            }
        });

        const lastTransactionEntryFormattedDate = (getLastTransactionFormattedDate(transactions, 'up'));
        const lastTransactionExpenseFormattedDate = (getLastTransactionFormattedDate(transactions, 'down'));

        const total = entriesTotal - expensesTotal;

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', currencyFormat),
                lastTransaction:`Última entrada dia ${lastTransactionEntryFormattedDate}`
            },
            expenses: {
                amount: expensesTotal.toLocaleString('pt-BR', currencyFormat),
                lastTransaction: `Última saída dia ${lastTransactionExpenseFormattedDate}`
            },
            total: {
                amount: total.toLocaleString('pt-BR', currencyFormat),
                lastTransaction: `1 a ${lastTransactionExpenseFormattedDate}`
            },
        });
        setTransactionData(formattedTransactions);

        setIsLoading(false);
    }

    // useEffect(() => {
    //     console.log('useEffect');
    //     loadTransactions();
    // }, []);

    useFocusEffect(useCallback(() => {
        loadTransactions();
    }, []));

    return (
        <Container>
        {   isLoading 
            ? <LoadContainer>
                <ActivityIndicator
                    color={theme.colors.primary}
                    size="large"
                />
              </LoadContainer> 
            :
            <>
                <Header>
                    <UserWrapper>
                        <UserInfo>
                            <Photo source={{ uri: user.photo }}/>
                            <User>
                                <UserGreeting>Hi, </UserGreeting>
                                <UserName>{user.name.substring(0,19)}</UserName>
                            </User>
                        </UserInfo>

                        <LogoutButton onPress={signOut}>
                            <Icon name="power"/>
                        </LogoutButton>

                    </UserWrapper>    
                </Header>

                <HighlightCards> 
                    <HighlightCard 
                        type="up"
                        title="Entradas"
                        amount={highlightData.entries.amount}
                        lastTransaction={highlightData.entries.lastTransaction}
                    />
                    <HighlightCard 
                        type="down"
                        title="Saídas"
                        amount={highlightData.expenses.amount}
                        lastTransaction={highlightData.expenses.lastTransaction}
                    />
                    <HighlightCard
                        type="total" 
                        title="Total"
                        amount={highlightData.total.amount}
                        lastTransaction={highlightData.total.lastTransaction}
                    />
                </HighlightCards>

                <Transactions>
                    <Title>Listagem</Title>
                    
                    <TransactionList 
                        data={transactionData}
                        keyExtractor={item => item.id}
                        renderItem={( { item }) => <TransactionCard data={item} /> }
                    />
                </Transactions>
            </>        }    
        </Container>
    )
}
