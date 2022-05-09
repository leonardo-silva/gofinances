import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import { Container, Button, Icon, Title } from './styles';

interface Props extends RectButtonProps {
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
        >
            <Button
                {...rest} 
            >
                <Icon 
                    name={icons[type]}
                    type={type}
                />
                <Title>{title}</Title>
            </Button>
        </Container>
    );
}