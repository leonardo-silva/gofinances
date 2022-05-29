import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { VictoryPie } from 'victory-native';

import { HistoryCard } from '../../components/HistoryCard';

import { 
    ChartContainer, 
    Container, 
    Content, 
    Header, 
    Title,
    MonthSelect,
    MonthSelectButton,
    Month,
    MonthSelectIcon,
    LoadContainer,
} from './styles';

import { categories } from '../../utils/categories';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

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
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalByCategories, setTotalByCategories] = useState<CategoryTotalData[]>([]);

    const theme = useTheme();

    function handleDateChange(action: 'next' | 'prev') {
        if (action === 'next') {
            setSelectedDate(addMonths(selectedDate,1));
        } else {
            setSelectedDate(subMonths(selectedDate,1));
        }
    }

    async function loadData() {
        setIsLoading(true);

        const dataKey = '@gofinances:transactions';
        const storageData = await AsyncStorage.getItem(dataKey);
        const formattedStorageData = storageData ? JSON.parse(storageData) : [];

        const currencyFormat = {
            style: 'currency',
            currency: 'BRL'
        }

        const expenses = formattedStorageData
        .filter((expense: TransactionData) => 
            expense.type === 'down' &&
            new Date(expense.date).getMonth() === selectedDate.getMonth() &&
            new Date(expense.date).getFullYear() === selectedDate.getFullYear()
        ); 

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

        setIsLoading(false);
    }

    useFocusEffect(useCallback(() => {
        loadData();
    }, [selectedDate]));

    return (
        <Container>
            <Header>
                <Title>Despesas por Categoria</Title>
            </Header>

            {   isLoading 
                ? <LoadContainer>
                    <ActivityIndicator
                        color={theme.colors.primary}
                        size="large"
                    />
                </LoadContainer> 
                :
                <Content
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ 
                        paddingHorizontal: 24,
                        paddingBottom: useBottomTabBarHeight() 
                    }}
                >
                    <MonthSelect>
                        <MonthSelectButton onPress={() => handleDateChange('prev')} >
                            <MonthSelectIcon name='chevron-left' />
                        </MonthSelectButton>

                        <Month>
                            {format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}
                        </Month>

                        <MonthSelectButton onPress={() => handleDateChange('next')} >
                            <MonthSelectIcon name='chevron-right' />
                        </MonthSelectButton>
                    </MonthSelect>

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
                            labelRadius={70}
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
            }    
        </Container>
    );
}