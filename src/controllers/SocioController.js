const Socio = require('./../models/Socio')
const Clube = require('./../models/Clube')

module.exports = {
    async index(req, res) {
        const { socio_id } = req.params

        if (!socio_id) {
            const socios = await Socio.findAll({
                include: { association: 'clubes' },
                order: ['name']
            });

            return res.json(socios)
        }

        const socio = await Socio.findByPk(socio_id, {
            include: { association: 'clubes' }
        })

        return res.json(socio.clubes)
    },

    async store(req, res) {
        const { name, clube_id } = req.body

        const clube = await Clube.findByPk(clube_id)


        if (!clube) {
            return res.status(400).json({ error: 'Clube não encontrado' })
        }

        const [socio] = await Socio.findOrCreate({
            where: { name }
        })

        await clube.addSocios(socio)

        return res.json(socio)
    },

    async delete(req, res) {
        const { clube_id } = req.params
        const { id } = req.body

        const clube = await Clube.findByPk(clube_id)

        if (!clube) {
            return res.status(400).json({ error: 'Clube não encontrado' })
        }

        const socio = await Socio.findOne({
            where: { id }
        })

        await clube.removeSocio(socio)

        return res.json()
    }
} 