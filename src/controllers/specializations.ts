import { validate } from 'class-validator'
import { RequestHandler } from 'express'
import { specializationsService } from '../services/specializations'
import { Specialization } from '../types/db'
import { SpecializationCreateAPI } from '../types/models/specialization'
import { ErrorWithStatus } from '../middlewares/errorHandler'
import { getFilePath } from '../factories/createStorage'

const getAll: RequestHandler = async (req, res, next) => {
  try {
    res.json({ data: await specializationsService.getAll() })
  } catch (error) {
    next(error)
  }
}

const getSpecializationDetails: RequestHandler = async (req, res, next) => {
  try {
    if (!req.params.specializationSlug) {
      throw new ErrorWithStatus('Missing specialization slug', 400)
    }

    res.json({
      data: await specializationsService.findBySlug({
        slug: req.params.specializationSlug,
      }),
    })
  } catch (error) {
    next(error)
  }
}

const save: RequestHandler = async (req, res, next) => {
  try {
    const mainPhoto = req.files['mainPhoto'][0]
    const benefitsPhoto = req.files['benefitsPhoto'][0]

    const { name, description, slug, benefits } = req.body as Omit<
      Specialization,
      'id'
    >

    let mainPhotoUrl = null
    if (mainPhoto) {
      mainPhotoUrl =
        mainPhoto.destination || getFilePath(mainPhoto.originalname)
    }
    let benefitsPhotoUrl = null
    if (benefitsPhoto) {
      benefitsPhotoUrl =
        benefitsPhoto.destination || getFilePath(benefitsPhoto.originalname)
    }
    const newSpecialization = new SpecializationCreateAPI()
    newSpecialization.name = name
    newSpecialization.description = description
    newSpecialization.slug = slug
    newSpecialization.benefits = benefits
    newSpecialization.benefitsPhoto = benefitsPhotoUrl
    newSpecialization.mainPhoto = mainPhotoUrl

    const errors = await validate(newSpecialization)
    if (errors.length) {
      res.status(400)
      res.send({ errors })
    }

    res
      .status(201)
      .json({ data: await specializationsService.save(newSpecialization) })
  } catch (error) {
    next(error)
  }
}

export const specializationsController = {
  getAll,
  save,
  getSpecializationDetails,
}
