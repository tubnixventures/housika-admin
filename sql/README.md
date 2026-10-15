# Housika Admin Backend — Database Schema Migrations

This directory contains DDL schemas for admin-owned D1 databases:
- `banners`: Public & in-app promotional / maintenance broadcasts
- `contact_messages`: Inbound support & commercial lead messages
- `vouchers`: Platform discounts and coupon engine
- `permission_catalog`: Granular platform staff permission definitions
- `staff_permission_assignments`: Additive RBAC grants to platform staff
- `privilege_change_log`: Append-only audit trail of permission changes
- `admin_audit_events`: Tamper-evident admin action event log
- `client_audit_events`: Security event sink for client session events
