import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { Form, FormError, RegisterContainer, RegisterHeader } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { api } from '@/lib/axios'
import { isAxiosError } from 'axios'

const registerFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'No minimo 3 letras' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'O Usuario so pode ter letras e hifens',
    })
    .transform((value) => value.toLowerCase()),
  name: z.string().min(3, { message: 'No minimo 3 letras' }),
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })

  const router = useRouter()

  useEffect(() => {
    if (router.query.username)
      setValue('username', String(router.query.username))
  }, [router.query.username, setValue])

  async function handleRegister(data: RegisterFormData) {
    try {
      await api.post('/users', {
        name: data.name,
        username: data.username,
      })

      await router.push('/register/connect-calendar')
    } catch (error) {
      if (isAxiosError(error) && error.response?.data.message) {
        return alert(error.response.data.message)
      }

      console.log(error)
    }
  }

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

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Nome de usuario</Text>
          <TextInput
            {...register('username')}
            prefix="ignite.com/"
            placeholder="Seu usuario"
          />
          {errors.username && (
            <FormError size="sm">{errors.username.message}</FormError>
          )}
        </label>
        <label>
          <Text size="sm">Nome completo</Text>
          <TextInput {...register('name')} placeholder="Nome completo" />
          {errors.name && (
            <FormError size="sm">{errors.name.message}</FormError>
          )}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Proximo passo <ArrowRight />
        </Button>
      </Form>
    </RegisterContainer>
  )
}
