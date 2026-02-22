from django.db import migrations, models


def assign_category_colors(apps, schema_editor):
    Category = apps.get_model("notes", "Category")

    palette = ["#f4a26a", "#7ab7b3", "#f7d98a", "#b6c58a", "#d88a6a", "#f0c27b", "#b3a3d6"]
    for idx, cat in enumerate(Category.objects.order_by("id")):
        cat.color = palette[idx % len(palette)]
        cat.save(update_fields=["color"])


class Migration(migrations.Migration):

    dependencies = [
        ("notes", "0003_category_user_note_user"),
    ]

    operations = [
        migrations.AddField(
            model_name="category",
            name="color",
            field=models.CharField(default="#f4a26a", max_length=7),
        ),
        migrations.RunPython(assign_category_colors, migrations.RunPython.noop),
    ]
