import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.TextInput`
    background-color: ${({ theme }) => theme.colors.shape};
    font-family: ${({ theme }) => theme.fonts.regular};
    color: ${({ theme }) => theme.colors.title};
    
    font-size: ${RFValue(14)}px;
    border-radius: 5px;

    padding: 18px 16px;
    margin-bottom: 8px;
`;