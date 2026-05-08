# This project was developped by *Theresa Al Achkar* as the project of I3332.

---

# What Should I Cook?

A full-stack smart meal planning and recipe suggestion web application built with React, ASP.NET Core, Entity Framework Core, and SQLite.

The platform helps users decide what to cook based on ingredients they already have while also providing meal planning, favorites, cooking history, and smart recipe suggestions.

---

# Features

## Authentication
- User registration and login
- JWT authentication
- Password hashing using BCrypt
- Protected API endpoints

---

## Ingredient Selection
- Search and select ingredients
- Ingredient persistence using localStorage
- Interactive ingredient chips

---

## Smart Recipe Suggestions
- Suggest recipes based on selected ingredients
- Match percentage calculation
- Missing ingredient detection
- Avoid recently cooked meals
- Recipe ranking system

---

## Favorites
- Save recipes to favorites
- Remove favorites
- Favorites preview on dashboard

---

## Cooking History
- Mark recipes as cooked
- Track cooking activity
- Delete history entries
- Dashboard analytics

---

## Weekly Planner
- Plan meals from Monday to Sunday
- Breakfast, lunch, and dinner support
- Save and clear planner
- Recipe autocomplete support

---

## Dashboard
- Ingredient statistics
- Favorites count
- Weekly cooking activity
- Popular recipes
- Smart cooking tips

---

# Technologies Used

## Frontend
- React
- Vite
- Material UI (MUI)
- React Router
- Axios
- Context API

## Backend
- ASP.NET Core Minimal API
- Entity Framework Core
- SQLite
- JWT Authentication
- BCrypt

---

# Database

The application uses SQLite with Entity Framework Core.

Main entities:
- Users
- Recipes
- Ingredients
- RecipeIngredients
- Favorites
- CookHistories
- MealPlans

---

# How To Run

## Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:5173

---

## Backend

```bash
cd backend
dotnet run
```

Backend runs on: http://localhost:5285

---

# Demo Account

Email: tessa@test.com
Password: demo123

---

# Project Goal

The goal of this project is to simplify meal decision-making and reduce food waste by helping users discover recipes using ingredients they already own.
