from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("notes", "0004_category_color"),
    ]

    operations = [
        migrations.AlterField(
            model_name="category",
            name="name",
            field=models.CharField(max_length=255),
        ),
        migrations.AddConstraint(
            model_name="category",
            constraint=models.UniqueConstraint(fields=("user", "name"), name="unique_category_name_per_user"),
        ),
    ]
