import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@ignite-ui/react'
import { RegisterContainer, RegisterHeader } from '../styles'
import {
  FormError,
  IntervalBox,
  IntervalContainer,
  IntervalDay,
  IntervalInput,
  IntervalItem,
} from './styles'
import { ArrowRight } from 'phosphor-react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { getWeekDays } from '@/utils/get-week-day'
import { zodResolver } from '@hookform/resolvers/zod'
import { convertTimeStringToMinutes } from '@/utils/convert-time-string-to-minutes'
import { api } from '@/lib/axios'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'Voce precisa selecionar pelo menos um dia da semana',
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekDay: interval.weekDay,
          startTimeInMinutes: convertTimeStringToMinutes(interval.startTime),
          endTimeInMinutes: convertTimeStringToMinutes(interval.endTime),
        }
      })
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,
        )
      },
      {
        message:
          'O horario de terminio deve ser pelo menos uma hora distante de inicio',
      },
    ),
})

type TimeIntervalsFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsFormOutput = z.output<typeof timeIntervalsFormSchema>

export default function TimeIntervals() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TimeIntervalsFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekDay: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekDay: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekDay: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
  })

  const weekDays = getWeekDays()

  const { fields } = useFieldArray({
    name: 'intervals',
    control,
  })

  const intervals = watch('intervals')

  const router = useRouter()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleSetTimeIntervals(data: any) {
    const { intervals } = data as TimeIntervalsFormOutput

    await api.post('/users/time-intervals', { intervals })

    await router.push('/register/update-profile')
  }

  return (
    <>
      <NextSeo title="Selecione sua disponibilidade | Ignite Call" noindex />

      <RegisterContainer>
        <RegisterHeader>
          <Heading as="strong">Quase lá</Heading>
          <Text>
            Defina o intervalo de horários que você está disponível em cada dia
            da semana.
          </Text>

          <MultiStep size={4} currentStep={3} />
        </RegisterHeader>

        <IntervalBox as="form" onSubmit={handleSubmit(handleSetTimeIntervals)}>
          <IntervalContainer>
            {fields.map((field, index) => (
              <IntervalItem key={field.id}>
                <IntervalDay>
                  <Controller
                    control={control}
                    name={`intervals.${index}.enabled`}
                    render={({ field }) => (
                      <Checkbox
                        onCheckedChange={(checked) => {
                          field.onChange(checked === true)
                        }}
                        checked={field.value}
                      />
                    )}
                  />
                  <Text>{weekDays[field.weekDay]}</Text>
                </IntervalDay>
                <IntervalInput>
                  <TextInput
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    crossOrigin={undefined}
                    {...register(`intervals.${index}.startTime`)}
                    size="sm"
                    type="time"
                    step={60}
                    disabled={intervals[index].enabled === false}
                  />
                  <TextInput
                    crossOrigin={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    {...register(`intervals.${index}.endTime`)}
                    size="sm"
                    type="time"
                    step={60}
                    disabled={intervals[index].enabled === false}
                  />
                </IntervalInput>
              </IntervalItem>
            ))}
          </IntervalContainer>

          {errors.intervals?.root && (
            <FormError size="sm">{errors.intervals.root.message}</FormError>
          )}

          <Button type="submit" disabled={isSubmitting}>
            Proximo passo <ArrowRight />
          </Button>
        </IntervalBox>
      </RegisterContainer>
    </>
  )
}
