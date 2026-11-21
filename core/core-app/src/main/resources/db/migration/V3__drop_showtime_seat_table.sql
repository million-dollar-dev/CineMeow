-- Migration: Drop showtime_seat table
-- Feature: CM-000005 (Remove ShowtimeSeat & Unify Dynamic Seat Inventory in Booking Service)

DROP TABLE IF EXISTS showtime_seat CASCADE;
