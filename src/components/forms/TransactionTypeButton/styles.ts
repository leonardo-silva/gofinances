import styled, { css } from "styled-components/native";
import { Feather } from '@expo/vector-icons';
import { RFValue } from "react-native-responsive-fontsize";
import { RectButton } from "react-native-gesture-handler";
import { View } from "react-native";

interface IconProps {
    type: 'up' | 'down';
}

interface ContainerProps extends IconProps {
    isActive: boolean;
}

export const Container = styled.View<ContainerProps>`
    ${({ isActive, type }) => isActive && type === 'up' && css`
        background-color: ${({ theme }) => theme.colors.success_light};
    `}
    ${({ isActive, type }) => isActive && type === 'down' && css`
        background-color: ${({ theme }) => theme.colors.attention_light};
    `}

    /* The line above sets up three border properties:
        border-width, border-style, and border-color
    border: 1.5px solid ${({ theme }) => theme.colors.text};
    */

    border-color: ${({ theme }) => theme.colors.text};  
    border-radius: 5px;
    border-width: ${({ isActive }) => isActive ? 0 : 1.5}px;  
    border-style: solid;

    width: 48%;
    /** Leaving width of 48% in order to leave 2px between the buttons */
`;

export const Button = styled(RectButton)`
    align-items: center;
    flex-direction: row;
    justify-content: center;

    padding: 16px 29px;
`;

export const Icon = styled(Feather)<IconProps>`
    color: ${({ theme, type }) => type === 'up' 
        ? theme.colors.success : theme.colors.attention };
    font-size: ${RFValue(24)}px;
    margin-right: 12px;
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
`;
