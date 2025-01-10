import { Button, TextInput } from '@ignite-ui/react'
import { Form } from './style'
import { ArrowRight } from 'phosphor-react'

export function ClaimUsernameForm() {
  return (
    <Form as="form">
      <TextInput prefix="ignite.com/" size="sm" placeholder="Seu usuario" />
      <Button size="sm" type="submit">
        Reservar
        <ArrowRight />
      </Button>
    </Form>
  )
}
