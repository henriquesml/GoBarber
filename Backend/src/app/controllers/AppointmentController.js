import * as Yup from 'yup'
import { startOfHour, parseISO, isBefore } from 'date-fns'
import Appointment from '../models/Appointment'
import User from '../models/User'

class AppointmentController {
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

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date
    })

    return res.json(appointment)
  }
}

export default new AppointmentController()
