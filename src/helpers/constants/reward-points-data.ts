export const rewardPointsData = {
  intro: [
    {
      title: '1. What is reward points?',
      content: `Rewards points are offered to all types of users based on variety of events that the user perform across the website.
                These points are to be accumulated by users which actually offers exclusive access incoming days to the users.`,
    },
    {
      title: '2. What benefits are offered to users?',
      content:
        'Users are offered early access to assets before they are released to public for sale. Discount in asset token sale.',
    },
    {
      title: '3. How are points calculated?',
      content:
        'When a user signups, purchases asset tokens responding to survey questions. Each user signup gets 500 pts.',
    },
  ],
  pointsTable: {
    headers: ['Money spent per user', 'Points', 'Total points', 'Cumulative'],
    rows: [
      ['$100', '500', '500', '0'],
      ['$200', '1000', '1500', '500 + 1000'],
      ['$300', '1500', '3000', '1500 + 1500'],
    ],
  },
  levelUp: {
    title: '4. Level Up with Rewards Points',
    levels: [
      {
        title: '10,000 rewards points',
        description: 'Early access to upcoming assets.',
      },
      {
        title: '15,000 reward points',
        description: 'Early access to upcoming assets + other access to exclusive resources.',
      },
    ],
  },
};
