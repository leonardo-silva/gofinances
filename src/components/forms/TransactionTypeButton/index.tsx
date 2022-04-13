import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import { Container, Icon, Title } from './styles';

interface Props extends TouchableOpacityProps {
    isActive: boolean;
    title: string;
    type: 'up' | 'down';
}

export function TransactionTypeButton({ 
    title, 
    type, 
    isActive, 
    ...rest
}: Props) {
    const icons = {
        up: 'arrow-up-circle',
        down: 'arrow-down-circle'
    }

    return (
        <Container 
            isActive={isActive}
            type={type}
            {...rest} 
        >
            <Icon 
                name={icons[type]}
                type={type}
            />
            <Title>{title}</Title>
        </Container>
    );
}