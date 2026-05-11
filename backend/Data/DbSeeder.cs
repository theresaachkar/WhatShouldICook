using backend.Models;

namespace backend.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        db.Database.EnsureCreated();

        if (!db.Users.Any())
        {
            db.Users.Add(new User
            {
                Name = "Tessa",
                Email = "tessa@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("demo123")
            });
            db.SaveChanges();
        }

        if (!db.Ingredients.Any())
        {
            var ingredients = new List<Ingredient>
            {
                new() { Name = "Onion" },
                new() { Name = "Garlic" },
                new() { Name = "Tomato" },
                new() { Name = "Potato" },
                new() { Name = "Cucumber" },
                new() { Name = "Lettuce" },
                new() { Name = "Eggplant" },
                new() { Name = "Zucchini" },
                new() { Name = "Green Pepper" },
                new() { Name = "Parsley" },
                new() { Name = "Mint" },
                new() { Name = "Carrot" },
                new() { Name = "Spinach" },
                new() { Name = "Mushroom" },
                new() { Name = "Corn" },

                new() { Name = "Chicken" },
                new() { Name = "Ground Beef" },
                new() { Name = "Beef" },
                new() { Name = "Eggs" },
                new() { Name = "Tuna" },
                new() { Name = "Fish" },
                new() { Name = "Shrimp" },
                new() { Name = "Chickpeas" },
                new() { Name = "Lentils" },

                new() { Name = "Labneh" },
                new() { Name = "Akkawi Cheese" },
                new() { Name = "Halloumi Cheese" },
                new() { Name = "Yogurt" },
                new() { Name = "Mozzarella" },
                new() { Name = "Parmesan" },
                new() { Name = "Cheddar" },
                new() { Name = "Milk" },
                new() { Name = "Butter" },

                new() { Name = "Rice" },
                new() { Name = "Pasta" },
                new() { Name = "Bulgur" },
                new() { Name = "Pita Bread" },
                new() { Name = "Bread" },
                new() { Name = "Flour" },

                new() { Name = "Olive Oil" },
                new() { Name = "Salt" },
                new() { Name = "Black Pepper" },
                new() { Name = "Vinegar" },
                new() { Name = "Lemon" },
                new() { Name = "Tomato Paste" },
                new() { Name = "Seven Spices" },
                new() { Name = "Cumin" },
                new() { Name = "Paprika" },
                new() { Name = "Sugar" },
                new() { Name = "Tahini" },
                new() { Name = "Mayonnaise" },
                new() { Name = "Ketchup" },
                new() { Name = "Mustard" },
                new() { Name = "Soy Sauce" },
                new() { Name = "Ginger" },
                new() { Name = "Honey" },

                new() { Name = "Avocado" },
                new() { Name = "Banana" },
                new() { Name = "Apple" },
                new() { Name = "Strawberry" }
            };

            db.Ingredients.AddRange(ingredients);
            db.SaveChanges();
        }

        if (!db.Recipes.Any())
        {
            var recipes = new List<Recipe>
            {
                new() { Title = "Mujaddara", Minutes = 45, Instructions = "Cook lentils and rice, then top with fried onions and serve warm.", IsPublic = true },
                new() { Title = "Riz 3a Djej", Minutes = 50, Instructions = "Cook chicken, prepare spiced rice, then serve together.", IsPublic = true },
                new() { Title = "Chicken Shawarma Plate", Minutes = 35, Instructions = "Marinate chicken with yogurt, lemon, and garlic. Cook and serve with bread.", IsPublic = true },
                new() { Title = "Kafta with Potatoes", Minutes = 40, Instructions = "Season ground beef with onion, parsley, and spices, then bake with potatoes.", IsPublic = true },
                new() { Title = "Lentil Soup", Minutes = 30, Instructions = "Boil lentils with onion, carrot, and cumin until soft and flavorful.", IsPublic = true },
                new() { Title = "Batata Harra", Minutes = 25, Instructions = "Cook potatoes with garlic, paprika, olive oil, and parsley.", IsPublic = true },
                new() { Title = "Tuna Sandwich", Minutes = 10, Instructions = "Mix tuna and fill bread or pita for a quick sandwich.", IsPublic = true },
                new() { Title = "Cheese Omelette", Minutes = 10, Instructions = "Beat eggs, add cheese, and cook until fluffy.", IsPublic = true },
                new() { Title = "Labneh with Olive Oil", Minutes = 5, Instructions = "Serve labneh topped with olive oil and enjoy with bread.", IsPublic = true },
                new() { Title = "Akkawi Cheese Sandwich", Minutes = 5, Instructions = "Fill bread with akkawi cheese and serve.", IsPublic = true },
                new() { Title = "Tabbouleh", Minutes = 20, Instructions = "Chop parsley, tomato, and onion. Mix with bulgur, lemon, olive oil, and salt.", IsPublic = true },
                new() { Title = "Hummus", Minutes = 10, Instructions = "Blend chickpeas with tahini, garlic, lemon, olive oil, and salt until smooth.", IsPublic = true },
                new() { Title = "Falafel", Minutes = 30, Instructions = "Blend chickpeas with parsley, onion, garlic, and spices. Shape and fry until crisp.", IsPublic = true },
                new() { Title = "Fattoush", Minutes = 15, Instructions = "Mix lettuce, tomato, cucumber, parsley, mint, and toasted pita with lemon and olive oil.", IsPublic = true },
                new() { Title = "Halloumi Salad", Minutes = 15, Instructions = "Grill halloumi and serve it over lettuce, tomato, cucumber, and olive oil.", IsPublic = true },

                new() { Title = "Margherita Pizza", Minutes = 25, Instructions = "Prepare dough, spread tomato sauce, add mozzarella, and bake until golden.", IsPublic = true },
                new() { Title = "Spaghetti Bolognese", Minutes = 40, Instructions = "Cook ground beef with onion, garlic, tomato, and tomato paste. Serve over pasta.", IsPublic = true },
                new() { Title = "Chicken Stir Fry", Minutes = 20, Instructions = "Cook chicken with vegetables, garlic, ginger, and soy sauce.", IsPublic = true },
                new() { Title = "Grilled Cheese Sandwich", Minutes = 10, Instructions = "Fill bread with cheese and grill with butter until melted and golden.", IsPublic = true },
                new() { Title = "Pancakes", Minutes = 15, Instructions = "Mix flour, milk, eggs, sugar, and butter. Cook small rounds on a pan.", IsPublic = true },
                new() { Title = "Caesar Salad", Minutes = 15, Instructions = "Mix lettuce, chicken, parmesan, and a simple creamy dressing.", IsPublic = true },
                new() { Title = "Burger", Minutes = 20, Instructions = "Cook beef patty and assemble with bread, lettuce, tomato, and sauces.", IsPublic = true },
                new() { Title = "Shrimp Pasta", Minutes = 25, Instructions = "Cook shrimp with garlic and butter, then toss with pasta.", IsPublic = true },
                new() { Title = "Vegetable Omelette", Minutes = 12, Instructions = "Cook eggs with onion, tomato, green pepper, and cheese if desired.", IsPublic = true },
                new() { Title = "Chicken Rice Bowl", Minutes = 30, Instructions = "Serve cooked chicken over rice with vegetables and sauce.", IsPublic = true }
            };

            db.Recipes.AddRange(recipes);
            db.SaveChanges();
        }

        if (!db.RecipeIngredients.Any())
        {
            Ingredient FindIngredient(string name) => db.Ingredients.First(i => i.Name == name);
            Recipe FindRecipe(string title) => db.Recipes.First(r => r.Title == title);

            var recipeIngredients = new List<RecipeIngredient>
            {
                new() { RecipeId = FindRecipe("Mujaddara").Id, IngredientId = FindIngredient("Lentils").Id },
                new() { RecipeId = FindRecipe("Mujaddara").Id, IngredientId = FindIngredient("Rice").Id },
                new() { RecipeId = FindRecipe("Mujaddara").Id, IngredientId = FindIngredient("Onion").Id },
                new() { RecipeId = FindRecipe("Mujaddara").Id, IngredientId = FindIngredient("Olive Oil").Id },
                new() { RecipeId = FindRecipe("Mujaddara").Id, IngredientId = FindIngredient("Salt").Id },
                new() { RecipeId = FindRecipe("Mujaddara").Id, IngredientId = FindIngredient("Cumin").Id },

                new() { RecipeId = FindRecipe("Riz 3a Djej").Id, IngredientId = FindIngredient("Chicken").Id },
                new() { RecipeId = FindRecipe("Riz 3a Djej").Id, IngredientId = FindIngredient("Rice").Id },
                new() { RecipeId = FindRecipe("Riz 3a Djej").Id, IngredientId = FindIngredient("Onion").Id },
                new() { RecipeId = FindRecipe("Riz 3a Djej").Id, IngredientId = FindIngredient("Seven Spices").Id },
                new() { RecipeId = FindRecipe("Riz 3a Djej").Id, IngredientId = FindIngredient("Salt").Id },
                new() { RecipeId = FindRecipe("Riz 3a Djej").Id, IngredientId = FindIngredient("Olive Oil").Id },


                new() { RecipeId = FindRecipe("Chicken Shawarma Plate").Id, IngredientId = FindIngredient("Chicken").Id },
                new() { RecipeId = FindRecipe("Chicken Shawarma Plate").Id, IngredientId = FindIngredient("Garlic").Id },
                new() { RecipeId = FindRecipe("Chicken Shawarma Plate").Id, IngredientId = FindIngredient("Yogurt").Id },
                new() { RecipeId = FindRecipe("Chicken Shawarma Plate").Id, IngredientId = FindIngredient("Lemon").Id },
                new() { RecipeId = FindRecipe("Chicken Shawarma Plate").Id, IngredientId = FindIngredient("Olive Oil").Id },
                new() { RecipeId = FindRecipe("Chicken Shawarma Plate").Id, IngredientId = FindIngredient("Salt").Id },
                new() { RecipeId = FindRecipe("Chicken Shawarma Plate").Id, IngredientId = FindIngredient("Pita Bread").Id },

                new() { RecipeId = FindRecipe("Kafta with Potatoes").Id, IngredientId = FindIngredient("Ground Beef").Id },
                new() { RecipeId = FindRecipe("Kafta with Potatoes").Id, IngredientId = FindIngredient("Onion").Id },
                new() { RecipeId = FindRecipe("Kafta with Potatoes").Id, IngredientId = FindIngredient("Parsley").Id },
                new() { RecipeId = FindRecipe("Kafta with Potatoes").Id, IngredientId = FindIngredient("Potato").Id },
                new() { RecipeId = FindRecipe("Kafta with Potatoes").Id, IngredientId = FindIngredient("Salt").Id },
                new() { RecipeId = FindRecipe("Kafta with Potatoes").Id, IngredientId = FindIngredient("Seven Spices").Id },

                new() { RecipeId = FindRecipe("Lentil Soup").Id, IngredientId = FindIngredient("Lentils").Id },
                new() { RecipeId = FindRecipe("Lentil Soup").Id, IngredientId = FindIngredient("Onion").Id },
                new() { RecipeId = FindRecipe("Lentil Soup").Id, IngredientId = FindIngredient("Carrot").Id },
                new() { RecipeId = FindRecipe("Lentil Soup").Id, IngredientId = FindIngredient("Cumin").Id },
                new() { RecipeId = FindRecipe("Lentil Soup").Id, IngredientId = FindIngredient("Salt").Id },

                new() { RecipeId = FindRecipe("Batata Harra").Id, IngredientId = FindIngredient("Potato").Id },
                new() { RecipeId = FindRecipe("Batata Harra").Id, IngredientId = FindIngredient("Garlic").Id },
                new() { RecipeId = FindRecipe("Batata Harra").Id, IngredientId = FindIngredient("Parsley").Id },
                new() { RecipeId = FindRecipe("Batata Harra").Id, IngredientId = FindIngredient("Olive Oil").Id },
                new() { RecipeId = FindRecipe("Batata Harra").Id, IngredientId = FindIngredient("Paprika").Id },

                new() { RecipeId = FindRecipe("Tuna Sandwich").Id, IngredientId = FindIngredient("Tuna").Id },
                new() { RecipeId = FindRecipe("Tuna Sandwich").Id, IngredientId = FindIngredient("Bread").Id },
                new() { RecipeId = FindRecipe("Tuna Sandwich").Id, IngredientId = FindIngredient("Mayonnaise").Id },

                new() { RecipeId = FindRecipe("Cheese Omelette").Id, IngredientId = FindIngredient("Eggs").Id },
                new() { RecipeId = FindRecipe("Cheese Omelette").Id, IngredientId = FindIngredient("Akkawi Cheese").Id },
                new() { RecipeId = FindRecipe("Cheese Omelette").Id, IngredientId = FindIngredient("Butter").Id },

                new() { RecipeId = FindRecipe("Labneh with Olive Oil").Id, IngredientId = FindIngredient("Labneh").Id },
                new() { RecipeId = FindRecipe("Labneh with Olive Oil").Id, IngredientId = FindIngredient("Olive Oil").Id },
                new() { RecipeId = FindRecipe("Labneh with Olive Oil").Id, IngredientId = FindIngredient("Bread").Id },

                new() { RecipeId = FindRecipe("Akkawi Cheese Sandwich").Id, IngredientId = FindIngredient("Akkawi Cheese").Id },
                new() { RecipeId = FindRecipe("Akkawi Cheese Sandwich").Id, IngredientId = FindIngredient("Bread").Id },

                new() { RecipeId = FindRecipe("Tabbouleh").Id, IngredientId = FindIngredient("Parsley").Id },
                new() { RecipeId = FindRecipe("Tabbouleh").Id, IngredientId = FindIngredient("Tomato").Id },
                new() { RecipeId = FindRecipe("Tabbouleh").Id, IngredientId = FindIngredient("Onion").Id },
                new() { RecipeId = FindRecipe("Tabbouleh").Id, IngredientId = FindIngredient("Bulgur").Id },
                new() { RecipeId = FindRecipe("Tabbouleh").Id, IngredientId = FindIngredient("Lemon").Id },
                new() { RecipeId = FindRecipe("Tabbouleh").Id, IngredientId = FindIngredient("Olive Oil").Id },
                new() { RecipeId = FindRecipe("Tabbouleh").Id, IngredientId = FindIngredient("Mint").Id },
                new() { RecipeId = FindRecipe("Tabbouleh").Id, IngredientId = FindIngredient("Salt").Id },

                new() { RecipeId = FindRecipe("Hummus").Id, IngredientId = FindIngredient("Chickpeas").Id },
                new() { RecipeId = FindRecipe("Hummus").Id, IngredientId = FindIngredient("Tahini").Id },
                new() { RecipeId = FindRecipe("Hummus").Id, IngredientId = FindIngredient("Garlic").Id },
                new() { RecipeId = FindRecipe("Hummus").Id, IngredientId = FindIngredient("Lemon").Id },
                new() { RecipeId = FindRecipe("Hummus").Id, IngredientId = FindIngredient("Olive Oil").Id },
                new() { RecipeId = FindRecipe("Hummus").Id, IngredientId = FindIngredient("Salt").Id },

                new() { RecipeId = FindRecipe("Falafel").Id, IngredientId = FindIngredient("Chickpeas").Id },
                new() { RecipeId = FindRecipe("Falafel").Id, IngredientId = FindIngredient("Parsley").Id },
                new() { RecipeId = FindRecipe("Falafel").Id, IngredientId = FindIngredient("Onion").Id },
                new() { RecipeId = FindRecipe("Falafel").Id, IngredientId = FindIngredient("Garlic").Id },
                new() { RecipeId = FindRecipe("Falafel").Id, IngredientId = FindIngredient("Cumin").Id },
                new() { RecipeId = FindRecipe("Falafel").Id, IngredientId = FindIngredient("Salt").Id },

                new() { RecipeId = FindRecipe("Fattoush").Id, IngredientId = FindIngredient("Lettuce").Id },
                new() { RecipeId = FindRecipe("Fattoush").Id, IngredientId = FindIngredient("Tomato").Id },
                new() { RecipeId = FindRecipe("Fattoush").Id, IngredientId = FindIngredient("Cucumber").Id },
                new() { RecipeId = FindRecipe("Fattoush").Id, IngredientId = FindIngredient("Parsley").Id },
                new() { RecipeId = FindRecipe("Fattoush").Id, IngredientId = FindIngredient("Mint").Id },
                new() { RecipeId = FindRecipe("Fattoush").Id, IngredientId = FindIngredient("Pita Bread").Id },
                new() { RecipeId = FindRecipe("Fattoush").Id, IngredientId = FindIngredient("Lemon").Id },
                new() { RecipeId = FindRecipe("Fattoush").Id, IngredientId = FindIngredient("Olive Oil").Id },
                new() { RecipeId = FindRecipe("Fattoush").Id, IngredientId = FindIngredient("Salt").Id },

                new() { RecipeId = FindRecipe("Halloumi Salad").Id, IngredientId = FindIngredient("Halloumi Cheese").Id },
                new() { RecipeId = FindRecipe("Halloumi Salad").Id, IngredientId = FindIngredient("Lettuce").Id },
                new() { RecipeId = FindRecipe("Halloumi Salad").Id, IngredientId = FindIngredient("Tomato").Id },
                new() { RecipeId = FindRecipe("Halloumi Salad").Id, IngredientId = FindIngredient("Cucumber").Id },
                new() { RecipeId = FindRecipe("Halloumi Salad").Id, IngredientId = FindIngredient("Olive Oil").Id },
                new() { RecipeId = FindRecipe("Halloumi Salad").Id, IngredientId = FindIngredient("Lemon").Id },

                new() { RecipeId = FindRecipe("Margherita Pizza").Id, IngredientId = FindIngredient("Flour").Id },
                new() { RecipeId = FindRecipe("Margherita Pizza").Id, IngredientId = FindIngredient("Tomato").Id },
                new() { RecipeId = FindRecipe("Margherita Pizza").Id, IngredientId = FindIngredient("Tomato Paste").Id },
                new() { RecipeId = FindRecipe("Margherita Pizza").Id, IngredientId = FindIngredient("Mozzarella").Id },
                new() { RecipeId = FindRecipe("Margherita Pizza").Id, IngredientId = FindIngredient("Olive Oil").Id },
                new() { RecipeId = FindRecipe("Margherita Pizza").Id, IngredientId = FindIngredient("Salt").Id },

                new() { RecipeId = FindRecipe("Spaghetti Bolognese").Id, IngredientId = FindIngredient("Pasta").Id },
                new() { RecipeId = FindRecipe("Spaghetti Bolognese").Id, IngredientId = FindIngredient("Ground Beef").Id },
                new() { RecipeId = FindRecipe("Spaghetti Bolognese").Id, IngredientId = FindIngredient("Onion").Id },
                new() { RecipeId = FindRecipe("Spaghetti Bolognese").Id, IngredientId = FindIngredient("Garlic").Id },
                new() { RecipeId = FindRecipe("Spaghetti Bolognese").Id, IngredientId = FindIngredient("Tomato").Id },
                new() { RecipeId = FindRecipe("Spaghetti Bolognese").Id, IngredientId = FindIngredient("Tomato Paste").Id },
                new() { RecipeId = FindRecipe("Spaghetti Bolognese").Id, IngredientId = FindIngredient("Olive Oil").Id },
                new() { RecipeId = FindRecipe("Spaghetti Bolognese").Id, IngredientId = FindIngredient("Salt").Id },

                new() { RecipeId = FindRecipe("Chicken Stir Fry").Id, IngredientId = FindIngredient("Chicken").Id },
                new() { RecipeId = FindRecipe("Chicken Stir Fry").Id, IngredientId = FindIngredient("Onion").Id },
                new() { RecipeId = FindRecipe("Chicken Stir Fry").Id, IngredientId = FindIngredient("Green Pepper").Id },
                new() { RecipeId = FindRecipe("Chicken Stir Fry").Id, IngredientId = FindIngredient("Carrot").Id },
                new() { RecipeId = FindRecipe("Chicken Stir Fry").Id, IngredientId = FindIngredient("Garlic").Id },
                new() { RecipeId = FindRecipe("Chicken Stir Fry").Id, IngredientId = FindIngredient("Ginger").Id },
                new() { RecipeId = FindRecipe("Chicken Stir Fry").Id, IngredientId = FindIngredient("Soy Sauce").Id },

                new() { RecipeId = FindRecipe("Grilled Cheese Sandwich").Id, IngredientId = FindIngredient("Bread").Id },
                new() { RecipeId = FindRecipe("Grilled Cheese Sandwich").Id, IngredientId = FindIngredient("Cheddar").Id },
                new() { RecipeId = FindRecipe("Grilled Cheese Sandwich").Id, IngredientId = FindIngredient("Butter").Id },

                new() { RecipeId = FindRecipe("Pancakes").Id, IngredientId = FindIngredient("Flour").Id },
                new() { RecipeId = FindRecipe("Pancakes").Id, IngredientId = FindIngredient("Milk").Id },
                new() { RecipeId = FindRecipe("Pancakes").Id, IngredientId = FindIngredient("Eggs").Id },
                new() { RecipeId = FindRecipe("Pancakes").Id, IngredientId = FindIngredient("Sugar").Id },
                new() { RecipeId = FindRecipe("Pancakes").Id, IngredientId = FindIngredient("Butter").Id },

                new() { RecipeId = FindRecipe("Caesar Salad").Id, IngredientId = FindIngredient("Lettuce").Id },
                new() { RecipeId = FindRecipe("Caesar Salad").Id, IngredientId = FindIngredient("Chicken").Id },
                new() { RecipeId = FindRecipe("Caesar Salad").Id, IngredientId = FindIngredient("Parmesan").Id },
                new() { RecipeId = FindRecipe("Caesar Salad").Id, IngredientId = FindIngredient("Mayonnaise").Id },
                new() { RecipeId = FindRecipe("Caesar Salad").Id, IngredientId = FindIngredient("Lemon").Id },

                new() { RecipeId = FindRecipe("Burger").Id, IngredientId = FindIngredient("Beef").Id },
                new() { RecipeId = FindRecipe("Burger").Id, IngredientId = FindIngredient("Bread").Id },
                new() { RecipeId = FindRecipe("Burger").Id, IngredientId = FindIngredient("Lettuce").Id },
                new() { RecipeId = FindRecipe("Burger").Id, IngredientId = FindIngredient("Tomato").Id },
                new() { RecipeId = FindRecipe("Burger").Id, IngredientId = FindIngredient("Cheddar").Id },
                new() { RecipeId = FindRecipe("Burger").Id, IngredientId = FindIngredient("Ketchup").Id },
                new() { RecipeId = FindRecipe("Burger").Id, IngredientId = FindIngredient("Mustard").Id },

                new() { RecipeId = FindRecipe("Shrimp Pasta").Id, IngredientId = FindIngredient("Shrimp").Id },
                new() { RecipeId = FindRecipe("Shrimp Pasta").Id, IngredientId = FindIngredient("Pasta").Id },
                new() { RecipeId = FindRecipe("Shrimp Pasta").Id, IngredientId = FindIngredient("Garlic").Id },
                new() { RecipeId = FindRecipe("Shrimp Pasta").Id, IngredientId = FindIngredient("Butter").Id },
                new() { RecipeId = FindRecipe("Shrimp Pasta").Id, IngredientId = FindIngredient("Lemon").Id },

                new() { RecipeId = FindRecipe("Vegetable Omelette").Id, IngredientId = FindIngredient("Eggs").Id },
                new() { RecipeId = FindRecipe("Vegetable Omelette").Id, IngredientId = FindIngredient("Onion").Id },
                new() { RecipeId = FindRecipe("Vegetable Omelette").Id, IngredientId = FindIngredient("Tomato").Id },
                new() { RecipeId = FindRecipe("Vegetable Omelette").Id, IngredientId = FindIngredient("Green Pepper").Id },
                new() { RecipeId = FindRecipe("Vegetable Omelette").Id, IngredientId = FindIngredient("Butter").Id },

                new() { RecipeId = FindRecipe("Chicken Rice Bowl").Id, IngredientId = FindIngredient("Chicken").Id },
                new() { RecipeId = FindRecipe("Chicken Rice Bowl").Id, IngredientId = FindIngredient("Rice").Id },
                new() { RecipeId = FindRecipe("Chicken Rice Bowl").Id, IngredientId = FindIngredient("Carrot").Id },
                new() { RecipeId = FindRecipe("Chicken Rice Bowl").Id, IngredientId = FindIngredient("Corn").Id },
                new() { RecipeId = FindRecipe("Chicken Rice Bowl").Id, IngredientId = FindIngredient("Soy Sauce").Id }
            };

            db.RecipeIngredients.AddRange(recipeIngredients);
            db.SaveChanges();
        }

        if (!db.MealPlans.Any())
        {
            var userId = db.Users.First().Id;

            var plans = new List<MealPlan>
            {
                new() { UserId = userId, Day = "Monday", Breakfast = "", Lunch = "", Dinner = "" },
                new() { UserId = userId, Day = "Tuesday", Breakfast = "", Lunch = "", Dinner = "" },
                new() { UserId = userId, Day = "Wednesday", Breakfast = "", Lunch = "", Dinner = "" },
                new() { UserId = userId, Day = "Thursday", Breakfast = "", Lunch = "", Dinner = "" },
                new() { UserId = userId, Day = "Friday", Breakfast = "", Lunch = "", Dinner = "" },
                new() { UserId = userId, Day = "Saturday", Breakfast = "", Lunch = "", Dinner = "" },
                new() { UserId = userId, Day = "Sunday", Breakfast = "", Lunch = "", Dinner = "" }
            };

            db.MealPlans.AddRange(plans);
            db.SaveChanges();
        }
    }
}