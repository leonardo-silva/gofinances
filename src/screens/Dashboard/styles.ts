import styled from "styled-components/native";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
    width: 100%;
    height: ${RFPercentage(40)}px;
    background-color: ${({ theme }) => theme.colors.primary};
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

export const UserInfo = styled.View`
    flex-direction: row;
    align-items: center;
    // Instructor put properties below in a UserWrapper (parent of UserInfo);
    width: 100%;
        // the padding below has the effect of padding-horizontal only, up-down (vertical) is zero;
    padding: 0 24px;
`;

export const Photo = styled.Image`
    width: ${RFValue(48)}px;
    height: ${RFValue(48)}px;
    border-radius: 10px;
`;

export const User = styled.View`
    margin-left: ${RFValue(18)}px;
`;

export const UserGreeting = styled.Text`
    color: ${({ theme }) => theme.colors.shape};
    font-size: ${RFValue(18)}px;
    line-height: ${RFValue(24)}px;
    font-family: ${({ theme }) => theme.fonts.regular};
`;

export const UserName = styled.Text`
    color: ${({ theme }) => theme.colors.shape};
    font-size: ${RFValue(18)}px;
    line-height: ${RFValue(24)}px;
    font-family: ${({ theme }) => theme.fonts.bold};
`;
