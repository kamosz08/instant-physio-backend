import { Knex } from 'knex'
import { Specialization } from '../../src/types/db'

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('specialization').del()

  // Inserts seed entries
  const specializations: Specialization[] = [
    {
      id: 1,
      name: 'Strength',
      description:
        'Strength training (also known as resistance training) is a type of exercise that causes your muscles to contract against an outside resistance. The outside resistance can be from your body weight, weight machines, medicine balls, resistance bands or dumbbells',
      slug: 'strength',
      benefits:
        'Strong muscles;Boosts mood;Weight control;Decrease risk of injury;Mental wellbeing;Good way to achieve desired physique',
      mainPhoto: 'uploads/main-strength-2.png',
      benefitsPhoto: 'uploads/main-strength.png',
    },
    {
      id: 2,
      name: 'Yoga',
      description:
        'Yoga is a practice that connects the body, breath, and mind. It uses physical postures, breathing exercises, and meditation to improve overall health. Yoga was developed as a spiritual practice thousands of years ago. Today, most Westerners who do yoga do it for exercise or to reduce stress.',
      slug: 'yoga',
      benefits:
        'Improves flexibility;Reduce stress and anxiety;Relaxes you, to help you sleep better',
      mainPhoto: 'uploads/main-yoga.png',
      benefitsPhoto: 'uploads/main-yoga-2.png',
    },
    {
      id: 3,
      name: 'Mobility & Stretching',
      description:
        'Flexibility and stretching involve lengthening your muscles, while mobility takes it one step further. Mobility training optimizes movement and performance by increasing the range of motion within your joints and surrounding muscles. When you’re more mobile, you can train harder, recover faster, and perform better.',
      slug: 'mobility-stretching',
      benefits:
        'Improved athletic performance;Greater range of motion;Joint health/movement without pain or stiffness;Balance and stability',
      mainPhoto: 'uploads/main-stretch.png',
      benefitsPhoto: 'uploads/main-stretch-2.png',
    },
  ]
  await knex('specialization').insert(specializations)
}
