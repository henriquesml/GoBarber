import * as Yup from 'yup'
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns'
import pt from 'date-fns/locale/pt'
import Appointment from '../models/Appointment'
import User from '../models/User'
import File from '../models/File'
import NotificationSchema from '../schemas/NotificationSchema'

import Mail from '../../lib/Mail'

class AppointmentController {

  async index(req, res) {

    const { page = 1 } = req.query

    const appointment = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            }
          ]
        }
      ]
    })

    return res.json(appointment)
  }

  async store(req, res) {

    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required()
    })

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Dados informados são inválidos." })
    }

    const { provider_id, date } = req.body

    const isProvider = await User.findOne({
      where: {id: provider_id, provider: true}
    })

    if (!isProvider){
      return res.status(401).json({ error: "Você só pode agendar horários com provedores de serviço." })
    }

    const hourStart = startOfHour(parseISO(date))

    if (isBefore(hourStart, new Date())){
      return res.status(400).json({ error: "Data informada é inválida." })
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      }
    })

    if (checkAvailability){
      return res.status(400).json({ error: "Data informada está indisponível." })
    }

    if (provider_id == req.userId){
      return res.status(400).json({ error: "Não é possível criar um agendamento consigo mesmo." })
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date
    })

    // Cria a Notificação para o provedor
   const user = await User.findByPk(req.userId)
   const formattedDate = format(
     hourStart,
     "'dia' dd 'de' MMMM', às' H:mm'h'",
     { locale: pt }
     )

    await NotificationSchema.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user: provider_id
    })

    return res.json(appointment)
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email']
        }
      ]
    })

    if (appointment.user_id != req.userId) {
      return res.status(401).json({ error: "Não é possível excluir um agendamento de outro usuário." })
    }

    const dateWithSub = subHours(appointment.date, 2)

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({ error: "Só é possível cancelar agendamentos com mais de 2 horas de antecedência." })
    }

    appointment.canceled_at = new Date()

    await appointment.save()

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      text: 'Agendamento cancelado :('
    })

    return res.json(appointment)
  }
}

export default new AppointmentController()
