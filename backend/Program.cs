using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var jwtKey = builder.Configuration["Jwt:Key"]!;
var jwtIssuer = builder.Configuration["Jwt:Issuer"]!;
var jwtAudience = builder.Configuration["Jwt:Audience"]!;

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    DbSeeder.Seed(db);
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors(policy =>
    policy.WithOrigins("http://localhost:5173")
          .AllowAnyHeader()
          .AllowAnyMethod()
);

app.UseAuthentication();
app.UseAuthorization();


int? GetUserId(HttpContext http)
{
    var userIdClaim = http.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrWhiteSpace(userIdClaim)) return null;

    return int.TryParse(userIdClaim, out var userId) ? userId : null;
}

string CreateToken(User user, string key, string issuer, string audience)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Name),
        new Claim(ClaimTypes.Email, user.Email)
    };

    var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
    var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

    var token = new System.IdentityModel.Tokens.Jwt.JwtSecurityToken(
        issuer: issuer,
        audience: audience,
        claims: claims,
        expires: DateTime.UtcNow.AddDays(7),
        signingCredentials: creds
    );

    return new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler().WriteToken(token);
}


app.MapGet("/", () =>
    Results.Ok("Backend is running ✅ Try /swagger")
);

app.MapPost("/api/auth/register", async (AppDbContext db, RegisterRequest req) =>
{
    var name = req.Name?.Trim() ?? "";
    var email = req.Email?.Trim().ToLower() ?? "";
    var password = req.Password ?? "";

    if (string.IsNullOrWhiteSpace(name) ||
        string.IsNullOrWhiteSpace(email) ||
        string.IsNullOrWhiteSpace(password))
    {
        return Results.BadRequest(new { message = "Name, email, and password are required." });
    }

    if (password.Length < 6)
    {
        return Results.BadRequest(new { message = "Password must be at least 6 characters." });
    }

    var exists = await db.Users.AnyAsync(u => u.Email == email);
    if (exists)
    {
        return Results.BadRequest(new { message = "Email already exists." });
    }

    var user = new User
    {
        Name = name,
        Email = email,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
    };

    db.Users.Add(user);
    await db.SaveChangesAsync();

    var token = CreateToken(user, jwtKey, jwtIssuer, jwtAudience);

    return Results.Ok(new AuthResponse(token, user.Name, user.Email));
});

app.MapPost("/api/auth/login", async (AppDbContext db, LoginRequest req) =>
{
    var email = req.Email?.Trim().ToLower() ?? "";
    var password = req.Password ?? "";

    if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
    {
        return Results.BadRequest(new { message = "Email and password are required." });
    }

    var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);
    if (user is null)
    {
        return Results.BadRequest(new { message = "Invalid email or password." });
    }

    var valid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
    if (!valid)
    {
        return Results.BadRequest(new { message = "Invalid email or password." });
    }

    var token = CreateToken(user, jwtKey, jwtIssuer, jwtAudience);

    return Results.Ok(new AuthResponse(token, user.Name, user.Email));
});

app.MapGet("/api/auth/me", async (HttpContext http, AppDbContext db) =>
{
    var userId = GetUserId(http);
    if (userId is null) return Results.Unauthorized();

    var user = await db.Users
        .Where(u => u.Id == userId.Value)
        .Select(u => new
        {
            id = u.Id,
            name = u.Name,
            email = u.Email
        })
        .FirstOrDefaultAsync();

    return user is null ? Results.NotFound() : Results.Ok(user);
}).RequireAuthorization();

app.MapGet("/api/ingredients", async (AppDbContext db, [FromQuery] string? search) =>
{
    var query = db.Ingredients.AsQueryable();

    if (!string.IsNullOrWhiteSpace(search))
    {
        var s = search.Trim().ToLower();
        query = query.Where(i => i.Name.ToLower().Contains(s));
    }

    var result = await query
        .OrderBy(i => i.Name)
        .Select(i => new
        {
            id = i.Id,
            name = i.Name
        })
        .ToListAsync();

    return Results.Ok(result);
});

app.MapGet("/api/recipes", async (AppDbContext db) =>
{
    var result = await db.Recipes
        .OrderBy(r => r.Title)
        .Select(r => new
        {
            id = r.Id,
            title = r.Title,
            minutes = r.Minutes
        })
        .ToListAsync();

    return Results.Ok(result);
});

app.MapGet("/api/recipes/{id:int}", async (AppDbContext db, int id) =>
{
    var recipe = await db.Recipes
        .Include(r => r.RecipeIngredients)
            .ThenInclude(ri => ri.Ingredient)
        .FirstOrDefaultAsync(r => r.Id == id);

    if (recipe is null)
        return Results.NotFound();

    var details = new
    {
        id = recipe.Id,
        title = recipe.Title,
        minutes = recipe.Minutes,
        ingredients = recipe.RecipeIngredients
            .Select(ri => ri.Ingredient.Name)
            .OrderBy(name => name)
            .ToArray(),
        instructions = recipe.Instructions
    };

    return Results.Ok(details);
});


app.MapPost("/api/history/{recipeId:int}", async (HttpContext http, AppDbContext db, int recipeId) =>
{
    var userId = GetUserId(http);
    if (userId is null) return Results.Unauthorized();

    var recipeExists = await db.Recipes.AnyAsync(r => r.Id == recipeId);
    if (!recipeExists) return Results.NotFound(new { message = "Recipe not found." });

    db.CookHistories.Add(new CookHistory
    {
        UserId = userId.Value,
        RecipeId = recipeId,
        CookedAt = DateTime.UtcNow
    });

    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Recipe marked as cooked" });
}).RequireAuthorization();

app.MapGet("/api/history", async (HttpContext http, AppDbContext db) =>
{
    var userId = GetUserId(http);
    if (userId is null) return Results.Unauthorized();

    var result = await db.CookHistories
        .Where(h => h.UserId == userId.Value)
        .Include(h => h.Recipe)
        .OrderByDescending(h => h.CookedAt)
        .Select(h => new
        {
            id = h.Id,
            recipeId = h.RecipeId,
            title = h.Recipe.Title,
            cookedAt = h.CookedAt
        })
        .ToListAsync();

    return Results.Ok(result);
}).RequireAuthorization();

app.MapDelete("/api/history/{id:int}", async (HttpContext http, AppDbContext db, int id) =>
{
    var userId = GetUserId(http);
    if (userId is null) return Results.Unauthorized();

    var entry = await db.CookHistories
        .FirstOrDefaultAsync(h => h.Id == id && h.UserId == userId.Value);

    if (entry is null)
        return Results.NotFound();

    db.CookHistories.Remove(entry);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "History entry removed" });
}).RequireAuthorization();

app.MapPost("/api/suggestions", async (HttpContext http, AppDbContext db, SuggestRequest req) =>
{
    var userId = GetUserId(http);
    if (userId is null) return Results.Unauthorized();

    var selected = req.IngredientIds?.Distinct().ToHashSet() ?? new HashSet<int>();

    if (selected.Count == 0)
    {
        return Results.Ok(new List<object>());
    }

    var cutoff = DateTime.UtcNow.AddDays(-req.AvoidLastDays);

    var cookedRecently = await db.CookHistories
        .Where(h => h.UserId == userId.Value && h.CookedAt >= cutoff)
        .Select(h => h.RecipeId)
        .ToListAsync();

    var cookedRecentlySet = cookedRecently.ToHashSet();

    var recipes = await db.Recipes
        .Include(r => r.RecipeIngredients)
            .ThenInclude(ri => ri.Ingredient)
        .ToListAsync();

    var ranked = recipes
        .Where(r => !cookedRecentlySet.Contains(r.Id))
        .Select(r =>
        {
            var ingredientIds = r.RecipeIngredients.Select(ri => ri.IngredientId).ToArray();
            var total = ingredientIds.Length;
            var match = ingredientIds.Count(id => selected.Contains(id));
            var missingIds = ingredientIds.Where(id => !selected.Contains(id)).ToArray();
            var percent = total == 0 ? 0 : (int)Math.Round((double)match / total * 100);

            var missingNames = r.RecipeIngredients
                .Where(ri => missingIds.Contains(ri.IngredientId))
                .Select(ri => ri.Ingredient.Name)
                .ToArray();

            return new
            {
                id = r.Id,
                title = r.Title,
                minutes = r.Minutes,
                match,
                total,
                matchPercent = percent,
                missingCount = missingIds.Length,
                missingIngredients = missingNames
            };
        })
        .Where(x => x.match > 0 && x.missingCount <= req.AllowMissing)
        .OrderByDescending(x => x.matchPercent)
        .ThenBy(x => x.missingCount)
        .ThenBy(x => x.minutes)
        .ToList();

    return Results.Ok(ranked);
}).RequireAuthorization();

app.MapPost("/api/favorites/{recipeId:int}", async (HttpContext http, AppDbContext db, int recipeId) =>
{
    var userId = GetUserId(http);
    if (userId is null) return Results.Unauthorized();

    var recipeExists = await db.Recipes.AnyAsync(r => r.Id == recipeId);
    if (!recipeExists) return Results.NotFound(new { message = "Recipe not found." });

    var exists = await db.Favorites.AnyAsync(f => f.UserId == userId.Value && f.RecipeId == recipeId);
    if (!exists)
    {
        db.Favorites.Add(new Favorite
        {
            UserId = userId.Value,
            RecipeId = recipeId
        });

        await db.SaveChangesAsync();
    }

    return Results.Ok(new { message = "Added to favorites" });
}).RequireAuthorization();

app.MapDelete("/api/favorites/{recipeId:int}", async (HttpContext http, AppDbContext db, int recipeId) =>
{
    var userId = GetUserId(http);
    if (userId is null) return Results.Unauthorized();

    var favorite = await db.Favorites
        .FirstOrDefaultAsync(f => f.UserId == userId.Value && f.RecipeId == recipeId);

    if (favorite is not null)
    {
        db.Favorites.Remove(favorite);
        await db.SaveChangesAsync();
    }

    return Results.Ok(new { message = "Removed from favorites" });
}).RequireAuthorization();

app.MapGet("/api/favorites", async (HttpContext http, AppDbContext db) =>
{
    var userId = GetUserId(http);
    if (userId is null) return Results.Unauthorized();

    var list = await db.Favorites
        .Where(f => f.UserId == userId.Value)
        .Include(f => f.Recipe)
        .Select(f => new
        {
            id = f.Recipe.Id,
            title = f.Recipe.Title,
            minutes = f.Recipe.Minutes
        })
        .OrderBy(x => x.title)
        .ToListAsync();

    return Results.Ok(list);
}).RequireAuthorization();

app.MapGet("/api/planner", async (HttpContext http, AppDbContext db) =>
{
    var userId = GetUserId(http);
    if (userId is null) return Results.Unauthorized();

    var planner = await db.MealPlans
        .Where(p => p.UserId == userId.Value)
        .OrderBy(p => p.Id)
        .Select(p => new
        {
            day = p.Day,
            breakfast = p.Breakfast,
            lunch = p.Lunch,
            dinner = p.Dinner
        })
        .ToListAsync();

    return Results.Ok(planner);
}).RequireAuthorization();

app.MapPut("/api/planner", async (HttpContext http, AppDbContext db, [FromBody] List<MealPlanDayDto> updatedPlan) =>
{
    var userId = GetUserId(http);
    if (userId is null) return Results.Unauthorized();

    if (updatedPlan is null || updatedPlan.Count != 7)
        return Results.BadRequest(new { message = "Planner must contain 7 days." });

    var existing = await db.MealPlans
        .Where(p => p.UserId == userId.Value)
        .ToListAsync();

    if (!existing.Any())
    {
        foreach (var item in updatedPlan)
        {
            db.MealPlans.Add(new MealPlan
            {
                UserId = userId.Value,
                Day = item.Day,
                Breakfast = item.Breakfast ?? "",
                Lunch = item.Lunch ?? "",
                Dinner = item.Dinner ?? ""
            });
        }
    }
    else
    {
        foreach (var row in updatedPlan)
        {
            var existingDay = existing.FirstOrDefault(x => x.Day == row.Day);
            if (existingDay is not null)
            {
                existingDay.Breakfast = row.Breakfast ?? "";
                existingDay.Lunch = row.Lunch ?? "";
                existingDay.Dinner = row.Dinner ?? "";
            }
        }
    }

    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Planner saved successfully" });
}).RequireAuthorization();

app.Run();

public record SuggestRequest(int[] IngredientIds, int AllowMissing = 2, int AvoidLastDays = 7);
public record MealPlanDayDto(string Day, string Breakfast, string Lunch, string Dinner);
public record RegisterRequest(string Name, string Email, string Password);
public record LoginRequest(string Email, string Password);
public record AuthResponse(string Token, string Name, string Email);