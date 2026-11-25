-- Enable GiST support for equality operators
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Category: age restrictions
ALTER TABLE "categories"
ADD CONSTRAINT "categories_age_range_check"
CHECK (
    "min_age" >= 0
    AND (
        "max_age" IS NULL
        OR "max_age" >= "min_age"
    )
);

-- Payment: valid month
ALTER TABLE "payments"
ADD CONSTRAINT "payments_period_month_check"
CHECK ("period_month" BETWEEN 1 AND 12);

-- Payment: positive amount
ALTER TABLE "payments"
ADD CONSTRAINT "payments_amount_check"
CHECK ("amount" > 0);

-- Schedule: valid time range
ALTER TABLE "schedules"
ADD CONSTRAINT "schedules_valid_time_range_check"
CHECK ("end_time" > "start_time");

-- Schedule: prevent overlapping schedules for the same sport and day
ALTER TABLE "schedules"
ADD CONSTRAINT "schedules_no_overlapping_same_sport_day"
EXCLUDE USING gist (
    "sport_id" WITH =,
    "day" WITH =,
    (
        int4range(
            EXTRACT(EPOCH FROM "start_time")::integer,
            EXTRACT(EPOCH FROM "end_time")::integer,
            '[)'
        )
    ) WITH &&
);
