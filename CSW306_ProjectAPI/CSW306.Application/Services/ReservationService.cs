using CSW306.Application.DTO.Upload;
using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IServices;
using CSW306.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CSW306.Application.Services
{
    public class ReservationService : IReservationService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ReservationService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Reservation>> GetAllReservationsAsync()
        {
            return await _unitOfWork.Reservations.GetAllAsync();
        }

        public async Task<Reservation?> GetReservationByIdAsync(int id)
        {
            return await _unitOfWork.Reservations.GetByIdAsync(id);
        }

        public async Task<(Reservation? Reservation, string? ErrorMessage)> CreateReservationAsync(ReservationCreateDTO dto)
        {
            if (dto == null || dto.TableId <= 0)
            {
                return (null, "reservation id not found");
            }

            var table = await _unitOfWork.Tables.GetByIdAsync(dto.TableId);
            if (table == null)
            {
                return (null, "table dont exist");
            }

            if (dto.NumberOfPeople > table.Capacity)
            {
                return (null, $"table capacity exceeded ({table.Capacity})");
            }

            bool exists = await _unitOfWork.Reservations.IsTableReservedAsync(dto.TableId, dto.Date, dto.Time);
            if (exists)
            {
                return (null, "table is already reserved");
            }

            DateTime now = DateTime.Now;
            DateTime reservationDateTime = dto.Date.Date + dto.Time.TimeOfDay;
            if (reservationDateTime <= now)
            {
                return (null, "reservation must be in future");
            }

            var reservation = new Reservation
            {
                ReservationId = dto.ReservationId,
                TableId = dto.TableId,
                NumberOfPeople = dto.NumberOfPeople,
                Note = dto.Note,
                Time = dto.Time,
                Date = dto.Date,
                CustomerName = dto.CustomerName
            };

            await _unitOfWork.Reservations.AddAsync(reservation);
            await _unitOfWork.SaveChangesAsync();

            return (reservation, null);
        }

        public async Task<(Reservation? Reservation, string? ErrorMessage)> UpdateReservationAsync(int id, ReservationCreateDTO dto)
        {
            if (dto == null)
            {
                return (null, "reservation data is invalid");
            }

            var existingReservation = await _unitOfWork.Reservations.GetByIdAsync(id);
            if (existingReservation == null)
            {
                return (null, "reservation id not found");
            }

            var table = await _unitOfWork.Tables.GetByIdAsync(dto.TableId);
            if (table == null)
            {
                return (null, "table dont exist");
            }

            if (dto.NumberOfPeople > table.Capacity)
            {
                return (null, $"table capacity exceeded ({table.Capacity})");
            }

            bool exists = await _unitOfWork.Reservations.IsTableReservedAsync(dto.TableId, dto.Date, dto.Time, id);
            if (exists)
            {
                return (null, "table is already reserved");
            }

            DateTime now = DateTime.Now;
            DateTime reservationDateTime = dto.Date.Date + dto.Time.TimeOfDay;
            if (reservationDateTime <= now)
            {
                return (null, "reservation must be in future");
            }

            existingReservation.TableId = dto.TableId;
            existingReservation.NumberOfPeople = dto.NumberOfPeople;
            existingReservation.Note = dto.Note;
            existingReservation.Time = dto.Time;
            existingReservation.Date = dto.Date;
            existingReservation.CustomerName = dto.CustomerName;

            await _unitOfWork.Reservations.UpdateAsync(existingReservation);
            await _unitOfWork.SaveChangesAsync();

            return (existingReservation, null);
        }

        public async Task<bool> DeleteReservationAsync(int id)
        {
            var reservation = await _unitOfWork.Reservations.GetByIdAsync(id);
            if (reservation == null)
            {
                return false;
            }

            await _unitOfWork.Reservations.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}
