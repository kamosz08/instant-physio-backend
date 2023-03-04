import { db } from '../db'
import { Specialization } from '../types/db'

const getAll = () => db<Specialization>('specialization')

// const get = async (id) => {
//   const recipes = await getAll();
//   return recipes.find((recipe) => recipe.id === parseInt(id));
// };

const save = async (specialization: Omit<Specialization, 'id'>) => {
  await db<Specialization>('specialization').insert(specialization)
}

// const update = async (id, updated) => {
//   const recipes = await getAll();

//   updated.id = parseInt(id);

//   const updatedRecipes = recipes.map((recipe) => {
//     return recipe.id === parseInt(id) ? updated : recipe;
//   });

//   await fs.writeFile(recipesFilePath, JSON.stringify(updatedRecipes));

//   return updated;
// };

// const remove = async (id) => {
//   const recipes = await getAll();
//   const newRecipes = recipes
//     .map((recipe) => {
//       return recipe.id === parseInt(id) ? null : recipe;
//     })
//     .filter((recipe) => recipe !== null);

//   await fs.writeFile(recipesFilePath, JSON.stringify(newRecipes));
// };

export const specializationsService = {
  getAll,
  // get,
  save,
  // update,
  // remove,
}
