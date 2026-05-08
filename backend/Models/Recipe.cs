namespace backend.Models;

public class Recipe
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public int Minutes { get; set; }
    public string Instructions { get; set; } = "";
    public bool IsPublic { get; set; } = true;

    public int? CreatedByUserId { get; set; }
    public User? CreatedByUser { get; set; }

    public List<RecipeIngredient> RecipeIngredients { get; set; } = new();
    public List<Favorite> Favorites { get; set; } = new();
    public List<CookHistory> CookHistories { get; set; } = new();
}