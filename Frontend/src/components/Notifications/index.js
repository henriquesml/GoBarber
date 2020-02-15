import React from 'react';

import { MdNotifications } from 'react-icons/md'

import { Container, Badge, NotificationList, Scroll, Notification } from './styles';

export default function Notifications() {
  return (
    <Container>
      <Badge hasUnread={false}>
        <MdNotifications color='#7159c1' size={20} />
      </Badge>

      <NotificationList>
        <Scroll>
          <Notification unread >
            <p>Vocẽ possui um novo agendamento para amanhã</p>
            <time>há 1 minuto</time>
            <button type='button' >Marcar como lida</button>
          </Notification>
        
          <Notification>
            <p>Novo agendamento para amanhã</p>
            <time>há 1 minuto</time>
            <button type='button' >Marcar como lida</button>
          </Notification>

          <Notification>
            <p>Novo agendamento para amanhã</p>
            <time>há 1 minuto</time>
            <button type='button' >Marcar como lida</button>
          </Notification>
          
        </Scroll>
      </NotificationList>
    </Container>
  );
}
