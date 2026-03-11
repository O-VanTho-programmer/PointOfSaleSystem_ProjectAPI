using CSW306.Application.DTO.Upload;
using CSW306.Application.Interfaces;
using CSW306.Application.Interfaces.IServices;
using CSW306.Application.Utils;
using CSW306.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CSW306.Application.Services
{
    public class ReservationService : IReservationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IAuditLogService _auditLogService;

        public ReservationService(IUnitOfWork unitOfWork, IAuditLogService auditLogService)
        {
            _unitOfWork = unitOfWork;
            _auditLogService = auditLogService;
        }

        public async Task<TemplateApi<Reservation>> GetAllReservationsAsync()
        {
            try
            {
                var reservations = await _unitOfWork.Reservations.GetAllAsync();
                var countRecord = reservations.Count();
                return new Pagination().HandleGetAllRespond(1, countRecord, reservations, countRecord);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _auditLogService.EnqueueLog("GetAllReservationsError", "Reservation", null, null, $"Exception: {ex.Message}");
                return new TemplateApi<Reservation>(null, null, "An unexpected error occurred while fetching reservations.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<Reservation>> GetReservationByIdAsync(int id)
        {
            try
            {
                var reservation = await _unitOfWork.Reservations.GetByIdAsync(id);
                if (reservation == null)
                {
                    return new TemplateApi<Reservation>(null, null, "reservation id invalid", false, 0, 0, 0, 0);
                }
                return new Pagination().HandleGetByIdRespond(reservation);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _auditLogService.EnqueueLog("GetReservationByIdError", "Reservation", id, null, $"Exception: {ex.Message}");
                return new TemplateApi<Reservation>(null, null, "An unexpected error occurred while fetching the reservation.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<Reservation>> CreateReservationAsync(ReservationCreateDTO dto)
        {
            try
            {
                if (dto == null || dto.TableId <= 0)
                {
                    return new TemplateApi<Reservation>(null, null, "reservation id not found", false, 0, 0, 0, 0);
                }

                var table = await _unitOfWork.Tables.GetByIdAsync(dto.TableId);
                if (table == null)
                {
                    return new TemplateApi<Reservation>(null, null, "table dont exist", false, 0, 0, 0, 0);
                }

                if (dto.NumberOfPeople > table.Capacity)
                {
                    return new TemplateApi<Reservation>(null, null, $"table capacity exceeded ({table.Capacity})", false, 0, 0, 0, 0);
                }

                bool exists = await _unitOfWork.Reservations.IsTableReservedAsync(dto.TableId, dto.Date, dto.Time);
                if (exists)
                {
                    return new TemplateApi<Reservation>(null, null, "table is already reserved", false, 0, 0, 0, 0);
                }

                DateTime now = DateTime.Now;
                DateTime reservationDateTime = dto.Date.Date + dto.Time.TimeOfDay;
                if (reservationDateTime <= now)
                {
                    return new TemplateApi<Reservation>(null, null, "reservation must be in future", false, 0, 0, 0, 0);
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

                _auditLogService.EnqueueLog("CreateReservation", "Reservation", reservation.ReservationId, null, $"TableId: {dto.TableId}, Customer: {dto.CustomerName}, Date: {dto.Date}");

                return new Pagination().HandleGetByIdRespond(reservation);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _auditLogService.EnqueueLog("CreateReservationError", "Reservation", dto?.ReservationId, null, $"Exception: {ex.Message}");
                return new TemplateApi<Reservation>(null, null, "An unexpected error occurred while creating the reservation.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<Reservation>> UpdateReservationAsync(int id, ReservationCreateDTO dto)
        {
            try
            {
                if (dto == null)
                {
                    return new TemplateApi<Reservation>(null, null, "reservation data is invalid", false, 0, 0, 0, 0);
                }

                var existingReservation = await _unitOfWork.Reservations.GetByIdAsync(id);
                if (existingReservation == null)
                {
                    return new TemplateApi<Reservation>(null, null, "reservation id not found", false, 0, 0, 0, 0);
                }

                var table = await _unitOfWork.Tables.GetByIdAsync(dto.TableId);
                if (table == null)
                {
                    return new TemplateApi<Reservation>(null, null, "table dont exist", false, 0, 0, 0, 0);
                }

                if (dto.NumberOfPeople > table.Capacity)
                {
                    return new TemplateApi<Reservation>(null, null, $"table capacity exceeded ({table.Capacity})", false, 0, 0, 0, 0);
                }

                bool exists = await _unitOfWork.Reservations.IsTableReservedAsync(dto.TableId, dto.Date, dto.Time, id);
                if (exists)
                {
                    return new TemplateApi<Reservation>(null, null, "table is already reserved", false, 0, 0, 0, 0);
                }

                DateTime now = DateTime.Now;
                DateTime reservationDateTime = dto.Date.Date + dto.Time.TimeOfDay;
                if (reservationDateTime <= now)
                {
                    return new TemplateApi<Reservation>(null, null, "reservation must be in future", false, 0, 0, 0, 0);
                }

                existingReservation.TableId = dto.TableId;
                existingReservation.NumberOfPeople = dto.NumberOfPeople;
                existingReservation.Note = dto.Note;
                existingReservation.Time = dto.Time;
                existingReservation.Date = dto.Date;
                existingReservation.CustomerName = dto.CustomerName;

                await _unitOfWork.Reservations.UpdateAsync(existingReservation);
                await _unitOfWork.SaveChangesAsync();

                _auditLogService.EnqueueLog("UpdateReservation", "Reservation", existingReservation.ReservationId, null, $"TableId: {dto.TableId}, Customer: {dto.CustomerName}");

                return new Pagination().HandleGetByIdRespond(existingReservation);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _auditLogService.EnqueueLog("UpdateReservationError", "Reservation", id, null, $"Exception: {ex.Message}");
                return new TemplateApi<Reservation>(null, null, "An unexpected error occurred while updating the reservation.", false, 0, 0, 0, 0);
            }
        }

        public async Task<TemplateApi<Reservation>> DeleteReservationAsync(int id)
        {
            try
            {
                var reservation = await _unitOfWork.Reservations.GetByIdAsync(id);
                if (reservation == null)
                {
                    return new TemplateApi<Reservation>(null, null, "reservation id invalid", false, 0, 0, 0, 0);
                }

                await _unitOfWork.Reservations.DeleteAsync(id);
                await _unitOfWork.SaveChangesAsync();

                _auditLogService.EnqueueLog("DeleteReservation", "Reservation", id, null, $"Deleted Reservation {id}");

                return new TemplateApi<Reservation>(reservation, null, "Reservation deleted successfully", true, 0, 0, 0, 0);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                _auditLogService.EnqueueLog("DeleteReservationError", "Reservation", id, null, $"Exception: {ex.Message}");
                return new TemplateApi<Reservation>(null, null, "An unexpected error occurred while deleting the reservation.", false, 0, 0, 0, 0);
            }
        }
    }
}
