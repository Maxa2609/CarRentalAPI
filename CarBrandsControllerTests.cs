using CarRentalAPI.Controllers;
using CarRentalAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace CarRentalAPI.Tests
{
    public class CarBrandsControllerTests
    {
        private DbContextOptions<RentalContext> GetInMemoryOptions()
        {
            return new DbContextOptionsBuilder<RentalContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
        }

        [Fact]
        public async Task GetCarBrands_ReturnsAllItems()
        {
            var options = GetInMemoryOptions();
            using (var context = new RentalContext(options))
            {
                context.CarBrands.Add(new CarBrand { Id = 1, Name = "BMW" });
                context.CarBrands.Add(new CarBrand { Id = 2, Name = "Audi" });
                context.SaveChanges();
            }

            using (var context = new RentalContext(options))
            {
                var controller = new CarBrandsController(context);
                var result = await controller.GetCarBrands();

                // Assert (Перевірка)
                var actionResult = Assert.IsType<ActionResult<IEnumerable<CarBrand>>>(result);
                var returnValue = Assert.IsType<List<CarBrand>>(actionResult.Value);
                Assert.Equal(2, returnValue.Count);
            }
        }

        [Fact]
        public async Task GetCarBrand_ReturnsNotFound_WhenIdIsInvalid()
        {
            var options = GetInMemoryOptions();
            using (var context = new RentalContext(options))
            {
                var controller = new CarBrandsController(context);

                var result = await controller.GetCarBrand(999);

                Assert.IsType<NotFoundResult>(result.Result);
            }
        }

        [Fact]
        public async Task PostCarBrand_AddsItemAndReturnsCreated()
        {
            var options = GetInMemoryOptions();
            var newBrand = new CarBrand { Id = 3, Name = "Toyota" };

            using (var context = new RentalContext(options))
            {
                var controller = new CarBrandsController(context);

                var result = await controller.PostCarBrand(newBrand);

                var actionResult = Assert.IsType<ActionResult<CarBrand>>(result);
                var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
                var returnValue = Assert.IsType<CarBrand>(createdAtActionResult.Value);

                Assert.Equal("Toyota", returnValue.Name);
            }

            using (var context = new RentalContext(options))
            {
                var itemsInDb = await context.CarBrands.CountAsync();
                Assert.Equal(1, itemsInDb);
            }
        }

        [Fact]
        public async Task DeleteCarBrand_RemovesItem_WhenValidId()
        {
            var options = GetInMemoryOptions();
            using (var context = new RentalContext(options))
            {
                context.CarBrands.Add(new CarBrand { Id = 1, Name = "Mazda" });
                context.SaveChanges();
            }

            using (var context = new RentalContext(options))
            {
                var controller = new CarBrandsController(context);

                var result = await controller.DeleteCarBrand(1);

                Assert.IsType<NoContentResult>(result);
            }

            using (var context = new RentalContext(options))
            {
                var itemsInDb = await context.CarBrands.CountAsync();
                Assert.Equal(0, itemsInDb);
            }
        }
    }
}