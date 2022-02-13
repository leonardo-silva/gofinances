import React from "react";

import { 
    Container, 
    Header,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName
 } from "./styles";

export function Dashboard() {
    return (
        <Container>
            <Header>
                <UserInfo>
                    <Photo source={{ uri: 'https://github.com/leonardo-silva.png'}}/>
                    <User>
                        <UserGreeting>Hi, </UserGreeting>
                        <UserName>Leonardo</UserName>
                    </User>
                </UserInfo>
                
            </Header>
        </Container>
    )
}
