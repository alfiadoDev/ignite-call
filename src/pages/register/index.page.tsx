import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { Form, RegisterContainer, RegisterHeader } from './styles'
import { ArrowRight } from 'phosphor-react'

export default function Register() {
  return (
    <RegisterContainer>
      <RegisterHeader>
        <Heading as="strong">Bem-vindo ao Ignite Call!</Heading>
        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah, você pode
          editar essas informações depois.
        </Text>

        <MultiStep size={4} currentStep={1} />
      </RegisterHeader>

      <Form as="form">
        <label>
          <Text size="sm">Nome de usuario</Text>
          <TextInput prefix="ignite.com/" placeholder="Seu usuario" />
        </label>
        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput placeholder="Nome completo" />
        </label>

        <Button type="submit">
          Proximo passo <ArrowRight />
        </Button>
      </Form>
    </RegisterContainer>
  )
}
