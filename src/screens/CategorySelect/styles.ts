import styled from "styled-components/native";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import theme from "../../global/styles/theme";

interface CategoryProps {
    isActive: boolean;
}

export const Container = styled(GestureHandlerRootView)`
    background-color: ${({ theme }) => theme.colors.background};
    flex: 1;
`;

export const Header = styled.View`
    align-items: center;
    background-color: ${({ theme }) => theme.colors.primary};

    height: ${RFValue(113)}px;

    justify-content: flex-end;
    padding-bottom: 19px;
    width: 100%;
`;

export const Title = styled.Text`
    color: ${({ theme }) => theme.colors.shape};
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(18)}px;
`;

export const Category = styled.TouchableOpacity<CategoryProps>`
    align-items: center;
    background-color: ${({ theme, isActive }) => 
        isActive ? theme.colors.secondary_light : theme.colors.background
    };
    flex-direction: row;
    padding: ${RFValue(15)}px;
    width: 100%;
`;

export const Icon = styled(Feather)`
    font-size: ${RFValue(20)}px;
    margin-right: 16px;
`;

export const Name = styled.Text`
    font-family: ${({ theme }) => theme.fonts.regular};
    font-size: ${RFValue(14)}px;
`;

export const Separator = styled.View`
    height: 1px;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.text};
`;

export const Footer = styled.View`
    padding: 24px;
    width: 100%;
`;


