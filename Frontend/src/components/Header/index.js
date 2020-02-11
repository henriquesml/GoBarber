import React from 'react';
import { Link } from 'react-router-dom'

import Logo from '~/assets/headerLogo.svg'
import { Container, Content, Profile } from './styles';

export default function Header() {
  return (
    <Container>
      <Content>
        <nav>
          <img src={Logo} alt="GoBarber"/>
          <Link to="/dashboard">DASHBOARD</Link>
        </nav>

        <aside>
          <Profile>
            <div>
              <strong>Henrique Schmeller</strong>
              <Link to="/profile">Meu perfil</Link>
            </div>
            <img src="https://api.adorable.io/avatars/50/abott@adorable.png" alt="Henrique Schmeller"/>
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
