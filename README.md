# BiteXP

BiteXP is a gamified recipe app where users complete cooking quests, earn XP, unlock badges, and track their cooking progress. It integrates with Spoonacular API for fetching recipes and offers a fun, interactive experience for learning new recipes.

## Features

- User authentication: Signup and Signin.
- View all recipes with details like ingredients, steps, difficulty, and XP reward.
- Complete recipes to earn XP.
- Unlock badges as you gain XP.
- XP progress bar and badge unlock animations.
- Featured recipes on the home page.
- External API integration with Spoonacular for recipes.
- Gamified quests for cooking challenges.

## Tech Stack

- **Frontend:** React, React Router, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas)
- **API Integration:** Spoonacular
- **Authentication:** JWT or Context-based

## Getting Started

1. Clone the repository:  
```bash
git clone https://github.com/Yashrai54/BiteXP.git
cd BiteXP
```
2. Install dependencies:
   ```bash
   npm install
   ```
3.Create a .env file in the backend with:
```env
MONGO_URI=your_mongodb_uri
SPOONACULAR_KEY=your_spoonacular_api_key
JWT_SECRET=your_jwt_secret
```

4. Run the backend:
   ```bash
   node index.js
   ```
5. Run the frontend:
   ```bash
   npm run dev
   ```

## Project Structure
``` css
BiteXP/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── App.jsx
└── README.md
```

## Future Enhancements

- Add social sharing for completed recipes.
- Add leaderboards for XP and badges.
- Improve recipe difficulty scoring and XP rewards.
- Add notifications for newly added recipes or quests.
