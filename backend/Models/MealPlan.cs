namespace backend.Models;

public class MealPlan
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public string Day { get; set; } = "";
    public string Breakfast { get; set; } = "";
    public string Lunch { get; set; } = "";
    public string Dinner { get; set; } = "";
}