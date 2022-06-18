import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import { SignInSocialButton } from '../../components/SignInSocialButton';
import { useAuth } from '../../hooks/auth';

import { 
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    FooterWrapper,
} from './styles';

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false);
    const { signInWithGoogle, signInWithApple } = useAuth();

    const theme = useTheme();
    
    async function handleSignInWithGoogle() {
        try {
            setIsLoading(true);
            await signInWithGoogle();
        } catch (error) {
            Alert.alert("Nao foi possível fazer o login!");
            console.log(error);
            setIsLoading(false);

    /* The setIsLoading(false); inside the 'finally' causes the performance warning "Can't perform a React state on an unmounted component."
    because the state isLoading may no longer exist after the async call to signInWithGoogle(); returns.
            */            
        // } finally {
        //     setIsLoading(false);

        }
    }

    async function handleSignInWithApple() {
        try {
            setIsLoading(true);
            await signInWithApple();
        } catch (error) {
            Alert.alert("Nao foi possível fazer o login na Apple!");
            console.log(error);
            setIsLoading(false);
        // } finally {
        }
    }

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg 
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />
                    <Title>
                        Controle suas {'\n'}
                        finanças de forma
                        muito simples
                    </Title>
                </TitleWrapper>

                <SignInTitle>
                    Faça seu login com {'\n'}
                    uma das contas abaixo
                </SignInTitle>

            </Header>

            <Footer>
                <FooterWrapper>
                    <SignInSocialButton 
                        title='Entrar com Google'
                        svg={GoogleSvg}
                        onPress={handleSignInWithGoogle}
                    />
                    { Platform.OS === 'ios' &&
                        <SignInSocialButton 
                            title='Entrar com Apple'
                            svg={AppleSvg}
                            onPress={handleSignInWithApple}
                        />
                    }
                </FooterWrapper>

                { isLoading && 
                    <ActivityIndicator 
                        color={theme.colors.shape} 
                        style={{ marginTop: 18 }}
                    /> 
                }
            </Footer>
        </Container>
    )
}