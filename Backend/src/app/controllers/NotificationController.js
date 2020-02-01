import NotificationSchema from '../schemas/NotificationSchema'
import User from '../models/User'

class NotificationController {
  async index(req, res) {

    const isProvider = await User.findOne({
      where: {id: req.userId, provider: true}
    })

    if (!isProvider){
      return res.status(401).json({ error: "Somente prestadores de serviço podem visualizar notificações." })
    }

    const notifcations = await NotificationSchema.find({
      user: req.userId,
    })
    .sort({ createdAt: 'desc' })
    .limit(20)

    return res.json(notifcations)
  }
}

export default new NotificationController()
