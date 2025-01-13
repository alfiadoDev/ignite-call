import { Button, Heading, MultiStep, Text } from '@ignite-ui/react'
import { RegisterContainer, RegisterHeader } from '../styles'
import { ArrowRight } from 'phosphor-react'
import { ConnectBox, ConnectItem } from './styles'

export default function Register() {
  // async function handleRegister() { }

  return (
    <RegisterContainer>
      <RegisterHeader>
        <Heading as="strong">Conecte sua agenda!</Heading>
        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </RegisterHeader>

      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>
          <Button variant="secondary" size="sm">
            Conectar <ArrowRight />
          </Button>
        </ConnectItem>

        <Button type="submit">
          Proximo passo <ArrowRight />
        </Button>
      </ConnectBox>
    </RegisterContainer>
  )
}
