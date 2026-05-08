namespace backend.Models;

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = "";

    public List<Favorite> Favorites { get; set; } = new();
    public List<CookHistory> CookHistories { get; set; } = new();
    public List<MealPlan> MealPlans { get; set; } = new();
}