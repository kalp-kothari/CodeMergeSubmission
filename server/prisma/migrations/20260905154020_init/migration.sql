-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'REJECTED', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rounds" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "submission_open" TIMESTAMP(3) NOT NULL,
    "submission_deadline" TIMESTAMP(3) NOT NULL,
    "allowed_file_types" TEXT[],
    "max_file_size" INTEGER NOT NULL,
    "domains" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "team_name" TEXT NOT NULL,
    "is_eligible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "sequence_number" INTEGER NOT NULL,
    "round_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "leader_email" TEXT NOT NULL,
    "leader_contact" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "problem_statement" TEXT NOT NULL,
    "solution_summary" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "storage_path" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "rounds_event_id_slug_key" ON "rounds"("event_id", "slug");

-- CreateIndex
CREATE INDEX "teams_event_id_idx" ON "teams"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "teams_event_id_team_name_key" ON "teams"("event_id", "team_name");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_submission_id_key" ON "submissions"("submission_id");

-- CreateIndex
CREATE INDEX "submissions_round_id_idx" ON "submissions"("round_id");

-- CreateIndex
CREATE INDEX "submissions_submission_id_idx" ON "submissions"("submission_id");

-- CreateIndex
CREATE INDEX "submissions_leader_email_idx" ON "submissions"("leader_email");

-- CreateIndex
CREATE INDEX "submissions_status_idx" ON "submissions"("status");

-- CreateIndex
CREATE INDEX "submissions_domain_idx" ON "submissions"("domain");

-- CreateIndex
CREATE INDEX "submissions_submitted_at_idx" ON "submissions"("submitted_at");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_team_id_round_id_key" ON "submissions"("team_id", "round_id");

-- AddForeignKey
ALTER TABLE "rounds" ADD CONSTRAINT "rounds_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "rounds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
