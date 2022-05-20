import React, { useEffect, useState } from "react";
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
    TransactionList
 } from "./styles";
import { RefreshControl } from "react-native";

export interface DataListProps extends TransactionCardProps {
    id: string
} 

export function Dashboard() {
    const [transactionData, setTransactionData] = useState<DataListProps[]>([]);
    // const transactionData: DataListProps[] = [
    //     {
    //         id: "1",
    //         type: "positive",
    //         title: "Desenvolvimento de site",
    //         amount:"R$ 12.000,00",
    //         category: {
    //             name: "Vendas",
    //             icon: "dollar-sign"    
    //         },
    //         date: "13/04/2021"
    //     },
    // ];

    async function loadTransactions() {
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        const formattedTransactions: DataListProps[] = transactions
        .map((item: DataListProps) => {
            const amount = Number(item.amount).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

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

        setTransactionData(formattedTransactions);
    }

    useEffect(() => {
        loadTransactions();
    }, []);

    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{ uri: 'https://github.com/leonardo-silva.png'}}/>
                        <User>
                            <UserGreeting>Hi, </UserGreeting>
                            <UserName>Leonardo</UserName>
                        </User>
                    </UserInfo>

                    <LogoutButton>
                        <Icon name="power"/>
                    </LogoutButton>

                </UserWrapper>    
            </Header>

            <HighlightCards> 
                <HighlightCard 
                    type="up"
                    title="Entradas"
                    amount="R$ 17.400,00"
                    lastTransaction="Última entrada dia 13 de abril"
                />
                <HighlightCard 
                    type="down"
                    title="Saídas"
                    amount="R$ 1.259,00"
                    lastTransaction="Última saída dia 03 de abril"
                />
                <HighlightCard
                    type="total" 
                    title="Total"
                    amount="R$ 16.141,00"
                    lastTransaction="01 a 16 de abril"
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
        </Container>
    )
}
