import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { VictoryPie } from 'victory-native';

import { HistoryCard } from '../../components/HistoryCard';

import { ChartContainer, Container, Content, Header, Title } from './styles';
import { categories } from '../../utils/categories';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';

export interface TransactionData {
    type: 'up' | 'down';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryTotalData {
    key: string;
    name: string;
    total: number;
    formattedTotal: string;
    color: string;
    percentage: string;
}

export function Resume() {
    const [totalByCategories, setTotalByCategories] = useState<CategoryTotalData[]>([]);

    const theme = useTheme();

    async function loadData() {
        const dataKey = '@gofinances:transactions';
        const storageData = await AsyncStorage.getItem(dataKey);
        const formattedStorageData = storageData ? JSON.parse(storageData) : [];

        const currencyFormat = {
            style: 'currency',
            currency: 'BRL'
        }

        const expenses = formattedStorageData
        .filter((expense: TransactionData) => expense.type === 'down'); 

        const expensesTotal = expenses
        .reduce((accumulator: number, expense: TransactionData) => {
            return accumulator + Number(expense.amount);
        }, 0);

        const totalByCategory: CategoryTotalData[] = [];

        categories.forEach(category => {
            let categorySum = 0;

            expenses.forEach((expense: TransactionData) => {
                if (expense.category === category.key) {
                    categorySum += Number(expense.amount);
                }
            });

            if (categorySum > 0) {
                const formattedTotal = categorySum.toLocaleString('pt-BR', currencyFormat);
                
                const percentage = `${(categorySum / expensesTotal * 100).toFixed(0)}%`;

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total: categorySum,
                    formattedTotal,
                    percentage
                });
            }    
        });

        setTotalByCategories(totalByCategory);
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <Container>
            <Header>
                <Title>Resumo por Categoria</Title>
            </Header>

            <Content>
                <ChartContainer>
                    <VictoryPie
                        data={totalByCategories}
                        colorScale={totalByCategories.map(category => category.color)}
                        style={{
                            labels: {
                                fontSize: RFValue(18),
                                fontWeight: 'bold',
                                fill: theme.colors.shape
                            }
                        }}
                        labelRadius={50}
                        x="percentage"
                        y="total"
                    />
                </ChartContainer>

                {
                    totalByCategories.map(item => (
                        <HistoryCard 
                            key={item.key}
                            title={item.name}
                            amount={item.formattedTotal}
                            color={item.color} />
                    ))
                }
            </Content>
        </Container>
    );
}