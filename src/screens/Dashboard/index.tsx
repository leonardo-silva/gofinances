import React from "react";

import { HighlightCard } from "../../components/HighlightCard";

import { 
    Container, 
    Header,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    UserWrapper,
    HighlightCards
 } from "./styles";

export function Dashboard() {
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

                    <Icon name="power"/>

                </UserWrapper>    
            </Header>

            <HighlightCards> 
                <HighlightCard />
                <HighlightCard />
            </HighlightCards>
        </Container>
    )
}
