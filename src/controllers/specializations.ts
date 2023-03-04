import { RequestHandler } from 'express'
import { specializationsService } from '../services/specializations'
import { Specialization } from '../types/db'

// const recipeExists = async (req, res, next) => {
//   const recipe = await service.get(req.params.id);

//   if (recipe === undefined) {
//     const err = new Error("Recipe not found");
//     err.statusCode = 404;
//     next(err);
//   } else {
//     res.locals.recipe = recipe;
//     next();
//   }
// };

const getAll: RequestHandler = async (req, res, next) => {
  try {
    res.json({ data: await specializationsService.getAll() })
  } catch (error) {
    next(error)
  }
}

// const get = async (req, res, next) => {
//   try {
//     res.json({ data: res.locals.recipe });
//   } catch (error) {
//     next(error);
//   }
// };

const save: RequestHandler = async (req, res, next) => {
  try {
    const { name, description } = req.body as Omit<Specialization, 'id'>

    const newSpecialization = {
      name,
      description,
    }

    res
      .status(201)
      .json({ data: await specializationsService.save(newSpecialization) })
  } catch (error) {
    next(error)
  }
}

// const update = async (req, res, next) => {
//   try {
//     const {
//       name,
//       healthLabels,
//       cookTimeMinutes,
//       prepTimeMinutes,
//       ingredients,
//     } = req.body;

//     const updated = await service.update(req.params.id, {
//       name,
//       healthLabels: [...healthLabels],
//       cookTimeMinutes,
//       prepTimeMinutes,
//       ingredients: [...ingredients],
//     });

//     res.json({ data: updated });
//   } catch (error) {
//     next(error);
//   }
// };

// const remove = async (req, res, next) => {
//   try {
//     await service.remove(req.params.id);
//     res.sendStatus(204);
//   } catch (error) {
//     next(error);
//   }
// };

export const specializationsController = {
  getAll,
  // get: [recipeExists, get],
  save,
  // update: [recipeExists, update],
  // remove: [recipeExists, remove],
}
