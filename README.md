# SportNest

A full-stack sports facility booking platform built with the MERN stack.

## Live URL
[SportNest](https://assignment-09-frontend.vercel.app/)

## Purpose
SportNest allows users to discover and book sports facilities such as football turfs, badminton courts, tennis courts, and swimming lanes. Facility owners can list and manage their own venues, while users can browse, filter, and book available time slots.

## Features
- Browse all sports facilities with search by name and filter by sport type
- Book facilities by selecting available time slots
- View and cancel bookings from your profile
- Add, update, and delete your own facilities
- JWT authentication with httpOnly cookies
- Google OAuth login
- Protected private routes (middleware + server-side)
- Responsive design for mobile, tablet, and desktop

## NPM Packages Used

### Client
- `next` — React framework with app router
- `react`, `react-dom` — UI library
- `zod` — Schema validation
- `tailwindcss` — Utility-first CSS

### Server
- `express` — Web framework
- `mongodb` — MongoDB driver
- `jsonwebtoken` — JWT signing and verification
- `bcrypt` — Password hashing
- `cookie-parser` — Cookie parsing middleware
- `cors` — Cross-origin resource sharing
- `passport`, `passport-google-oauth20` — Google OAuth
- `dotenv` — Environment variable management

## Database Architecture

### facilities
| Field | Type |
|-------|------|
| name | String |
| facility_type | String |
| image | String |
| location | String |
| price_per_hour | Number |
| capacity | Number |
| available_slots | Array |
| description | String |
| ownerId | String |
| booking_count | Number |

### bookings
| Field | Type |
|-------|------|
| facility_id | String |
| facility_name | String |
| booking_date | String |
| time_slots | Array |
| hours | Number |
| total_price | Number |
| status | String |
| ownerId | String |

### users
| Field | Type |
|-------|------|
| name | String |
| email | String |
| password | String (hashed) |
| profileUrl | String |
| createdAt | Number |
