using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CSW306.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddImagePublicIdToItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "IsSoldOut",
                table: "Items",
                type: "boolean",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<string>(
                name: "ImagePublicId",
                table: "Items",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImagePublicId",
                table: "Items");

            migrationBuilder.AlterColumn<int>(
                name: "IsSoldOut",
                table: "Items",
                type: "integer",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "boolean");
        }
    }
}
