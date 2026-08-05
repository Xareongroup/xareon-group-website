


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."generate_contract_number"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    next_number integer;
BEGIN
    next_number := nextval('contract_number_seq');

    RETURN 'CTR-' ||
           EXTRACT(YEAR FROM now())::text ||
           '-' ||
           LPAD(next_number::text,5,'0');
END;
$$;


ALTER FUNCTION "public"."generate_contract_number"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_estimate_number"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.estimate_number IS NULL THEN
    NEW.estimate_number :=
      'EST-' ||
      LPAD(
        nextval('estimate_number_seq')::TEXT,
        6,
        '0'
      );
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."generate_estimate_number"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_invoice_number"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    next_number INTEGER;
BEGIN
    SELECT COALESCE(
        MAX(
            RIGHT(invoice_number, 5)::INTEGER
        ),
        0
    ) + 1
    INTO next_number
    FROM invoices
    WHERE invoice_number ~ '^INV-([0-9]{5}|[0-9]{4}-[0-9]{5})$';

    RETURN
        'INV-' ||
        EXTRACT(YEAR FROM CURRENT_DATE)::TEXT ||
        '-' ||
        LPAD(next_number::TEXT, 5, '0');
END;
$_$;


ALTER FUNCTION "public"."generate_invoice_number"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."generate_job_number"() RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
declare
    next_number integer;
begin
    next_number := nextval('job_number_seq');

    return 'JOB-' ||
           extract(year from now())::text ||
           '-' ||
           lpad(next_number::text, 5, '0');
end;
$$;


ALTER FUNCTION "public"."generate_job_number"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."next_document_number"("sequence_name" "text") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
    next_value bigint;
    sequence_prefix text;
BEGIN
    UPDATE public.sequences
    SET
        current_value = current_value + 1,
        updated_at = now()
    WHERE name = sequence_name
    RETURNING
        current_value,
        prefix
    INTO
        next_value,
        sequence_prefix;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Sequence "%" does not exist.', sequence_name;
    END IF;

    RETURN sequence_prefix || '-' || lpad(next_value::text, 6, '0');
END;
$$;


ALTER FUNCTION "public"."next_document_number"("sequence_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    new.updated_at = now();
    return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_modified_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_modified_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
    new.updated_at = now();
    return new;
end;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."contract_number_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."contract_number_seq" OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."contracts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "job_id" "uuid",
    "pdf_url" "text",
    "signed" boolean DEFAULT false,
    "signed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "contract_number" "text",
    "customer_id" "uuid",
    "estimate_id" "uuid",
    "status" "text" DEFAULT 'Draft'::"text",
    "issue_date" "date" DEFAULT CURRENT_DATE,
    "terms" "text",
    "notes" "text",
    "signature_token" "uuid" DEFAULT "gen_random_uuid"(),
    "signed_by_name" "text",
    "signed_signature" "text",
    "signed_ip" "text",
    "signed_pdf_url" "text",
    "sent_at" timestamp without time zone,
    "sent_to" "text"
);


ALTER TABLE "public"."contracts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."customer_activity" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "activity_type" "text" NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."customer_activity" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."customer_documents" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "document_type" "text" NOT NULL,
    "title" "text" NOT NULL,
    "file_url" "text" NOT NULL,
    "status" "text" DEFAULT 'Draft'::"text",
    "signed_date" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "customer_documents_type_check" CHECK (("document_type" = ANY (ARRAY['Estimate'::"text", 'Signed Estimate'::"text", 'Contract'::"text", 'Signed Contract'::"text", 'Invoice'::"text", 'Payment Receipt'::"text"])))
);


ALTER TABLE "public"."customer_documents" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."customers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "email" "text",
    "phone" "text",
    "address" "text",
    "city" "text",
    "state" "text",
    "zip_code" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "customer_number" "text",
    "status" "text" DEFAULT 'Active'::"text",
    "portal_token" "text",
    "portal_created_at" timestamp with time zone
);


ALTER TABLE "public"."customers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."employees" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "email" "text",
    "phone" "text",
    "role" "text" DEFAULT 'Technician'::"text" NOT NULL,
    "status" "text" DEFAULT 'Active'::"text" NOT NULL,
    "hourly_rate" numeric(10,2),
    "hire_date" "date",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."employees" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."estimate_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "estimate_id" "uuid" NOT NULL,
    "description" "text" NOT NULL,
    "quantity" integer DEFAULT 1 NOT NULL,
    "unit_price" numeric(10,2) DEFAULT 0 NOT NULL,
    "total" numeric(10,2) DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "sort_order" integer DEFAULT 1,
    "unit" "text" DEFAULT 'Each'::"text",
    "discount" numeric(12,2) DEFAULT 0,
    "taxable" boolean DEFAULT true
);


ALTER TABLE "public"."estimate_items" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."estimate_number_seq"
    START WITH 1001
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."estimate_number_seq" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."estimates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "estimate_number" bigint NOT NULL,
    "status" "text" DEFAULT 'Draft'::"text" NOT NULL,
    "issue_date" "date" DEFAULT CURRENT_DATE NOT NULL,
    "expiration_date" "date",
    "subtotal" numeric(10,2) DEFAULT 0 NOT NULL,
    "tax" numeric(10,2) DEFAULT 0 NOT NULL,
    "total" numeric(10,2) DEFAULT 0 NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "tax_rate" numeric(5,2) DEFAULT 6.00,
    "discount" numeric(12,2) DEFAULT 0,
    "terms" "text",
    "estimate_code" "text",
    "signature_token" "uuid" DEFAULT "gen_random_uuid"(),
    "sent_at" timestamp with time zone,
    "viewed_at" timestamp with time zone,
    "signed_at" timestamp with time zone,
    "signed_by_name" "text",
    "signed_pdf_url" "text",
    "signed_signature" "text",
    "signed_ip" "text",
    "signature_data" "text",
    "signature_status" "text" DEFAULT 'Pending'::"text"
);


ALTER TABLE "public"."estimates" OWNER TO "postgres";


ALTER TABLE "public"."estimates" ALTER COLUMN "estimate_number" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."estimates_estimate_number_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."invoice_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "invoice_id" "uuid" NOT NULL,
    "description" "text",
    "quantity" integer DEFAULT 1,
    "unit" "text",
    "unit_price" numeric(10,2) DEFAULT 0,
    "discount" numeric(10,2) DEFAULT 0,
    "taxable" boolean DEFAULT true,
    "total" numeric(10,2) DEFAULT 0,
    "sort_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."invoice_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."invoice_payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "invoice_id" "uuid",
    "amount" numeric NOT NULL,
    "payment_method" "text",
    "notes" "text",
    "payment_date" timestamp without time zone DEFAULT "now"(),
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."invoice_payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."invoices" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "customer_id" "uuid",
    "invoice_number" "text",
    "subtotal" numeric(10,2) DEFAULT 0,
    "tax" numeric(10,2) DEFAULT 0,
    "total" numeric(10,2) DEFAULT 0,
    "balance_due" numeric(10,2) DEFAULT 0,
    "status" "text" DEFAULT 'Unpaid'::"text",
    "issue_date" timestamp with time zone DEFAULT "now"(),
    "paid_at" timestamp with time zone,
    "estimate_id" "uuid",
    "due_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "job_id" "uuid",
    "amount_paid" numeric DEFAULT 0,
    "payment_date" timestamp without time zone,
    "payment_method" "text",
    "payment_notes" "text"
);


ALTER TABLE "public"."invoices" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."job_number_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."job_number_seq" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."job_photos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "job_id" "uuid" NOT NULL,
    "image_url" "text" NOT NULL,
    "category" "text" DEFAULT 'before'::"text" NOT NULL,
    "caption" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "job_photos_category_check" CHECK (("category" = ANY (ARRAY['Before'::"text", 'During'::"text", 'After'::"text"])))
);


ALTER TABLE "public"."job_photos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."jobs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "customer_id" "uuid",
    "estimate_id" "uuid",
    "status" "text" DEFAULT 'Scheduled'::"text",
    "scheduled_date" "date",
    "completed_date" "date",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "job_number" "text",
    "title" "text",
    "description" "text",
    "invoice_id" "uuid",
    "priority" "text" DEFAULT 'Normal'::"text",
    "service_address" "text",
    "customer_phone" "text",
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "assigned_employee_id" "uuid",
    "start_time" time without time zone,
    "end_time" time without time zone,
    "completion_notes" "text",
    "customer_signature" "text"
);


ALTER TABLE "public"."jobs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "invoice_id" "uuid" NOT NULL,
    "amount" numeric(12,2) NOT NULL,
    "payment_method" "text" NOT NULL,
    "payment_date" "date" DEFAULT CURRENT_DATE NOT NULL,
    "reference_number" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "payments_amount_check" CHECK (("amount" > (0)::numeric))
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sequences" (
    "name" "text" NOT NULL,
    "prefix" "text" NOT NULL,
    "current_value" bigint DEFAULT 0 NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."sequences" OWNER TO "postgres";


ALTER TABLE ONLY "public"."contracts"
    ADD CONSTRAINT "contracts_contract_number_key" UNIQUE ("contract_number");



ALTER TABLE ONLY "public"."contracts"
    ADD CONSTRAINT "contracts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."customer_activity"
    ADD CONSTRAINT "customer_activity_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."customer_documents"
    ADD CONSTRAINT "customer_documents_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_customer_number_key" UNIQUE ("customer_number");



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_portal_token_key" UNIQUE ("portal_token");



ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."estimate_items"
    ADD CONSTRAINT "estimate_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."estimates"
    ADD CONSTRAINT "estimates_estimate_code_key" UNIQUE ("estimate_code");



ALTER TABLE ONLY "public"."estimates"
    ADD CONSTRAINT "estimates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invoice_items"
    ADD CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invoice_payments"
    ADD CONSTRAINT "invoice_payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invoices"
    ADD CONSTRAINT "invoices_invoice_number_key" UNIQUE ("invoice_number");



ALTER TABLE ONLY "public"."invoices"
    ADD CONSTRAINT "invoices_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."job_photos"
    ADD CONSTRAINT "job_photos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_job_number_key" UNIQUE ("job_number");



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sequences"
    ADD CONSTRAINT "sequences_pkey" PRIMARY KEY ("name");



CREATE INDEX "customer_activity_created_at_idx" ON "public"."customer_activity" USING "btree" ("created_at" DESC);



CREATE INDEX "customer_activity_customer_id_idx" ON "public"."customer_activity" USING "btree" ("customer_id");



CREATE INDEX "customers_portal_token_idx" ON "public"."customers" USING "btree" ("portal_token");



CREATE UNIQUE INDEX "estimates_signature_token_unique" ON "public"."estimates" USING "btree" ("signature_token");



CREATE INDEX "idx_job_photos_job" ON "public"."job_photos" USING "btree" ("job_id");



CREATE INDEX "idx_payments_invoice_id" ON "public"."payments" USING "btree" ("invoice_id");



CREATE OR REPLACE TRIGGER "estimate_number_trigger" BEFORE INSERT ON "public"."estimates" FOR EACH ROW EXECUTE FUNCTION "public"."generate_estimate_number"();



CREATE OR REPLACE TRIGGER "jobs_updated_at" BEFORE UPDATE ON "public"."jobs" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "trg_payments_updated_at" BEFORE UPDATE ON "public"."payments" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "update_estimates_timestamp" BEFORE UPDATE ON "public"."estimates" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



ALTER TABLE ONLY "public"."contracts"
    ADD CONSTRAINT "contracts_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."contracts"
    ADD CONSTRAINT "contracts_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "public"."estimates"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."contracts"
    ADD CONSTRAINT "contracts_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."customer_activity"
    ADD CONSTRAINT "customer_activity_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."customer_documents"
    ADD CONSTRAINT "customer_documents_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."estimate_items"
    ADD CONSTRAINT "estimate_items_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "public"."estimates"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."estimates"
    ADD CONSTRAINT "estimates_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "fk_payments_invoice" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."invoice_items"
    ADD CONSTRAINT "invoice_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."invoice_payments"
    ADD CONSTRAINT "invoice_payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."invoices"
    ADD CONSTRAINT "invoices_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."invoices"
    ADD CONSTRAINT "invoices_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "public"."estimates"("id");



ALTER TABLE ONLY "public"."invoices"
    ADD CONSTRAINT "invoices_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id");



ALTER TABLE ONLY "public"."job_photos"
    ADD CONSTRAINT "job_photos_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_assigned_employee_id_fkey" FOREIGN KEY ("assigned_employee_id") REFERENCES "public"."employees"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_estimate_id_fkey" FOREIGN KEY ("estimate_id") REFERENCES "public"."estimates"("id");



CREATE POLICY "Allow authenticated users customer documents" ON "public"."customer_documents" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users delete documents" ON "public"."customer_documents" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users insert documents" ON "public"."customer_documents" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow authenticated users to delete documents" ON "public"."customer_documents" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to insert documents" ON "public"."customer_documents" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow authenticated users to update documents" ON "public"."customer_documents" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to view documents" ON "public"."customer_documents" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users view documents" ON "public"."customer_documents" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow server access to customer activity" ON "public"."customer_activity" USING (true) WITH CHECK (true);



CREATE POLICY "Authenticated users can delete contracts" ON "public"."contracts" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can delete customers" ON "public"."customers" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can delete employees" ON "public"."employees" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can delete estimate items" ON "public"."estimate_items" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can delete estimates" ON "public"."estimates" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can delete jobs" ON "public"."jobs" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can insert contracts" ON "public"."contracts" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert customers" ON "public"."customers" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert employees" ON "public"."employees" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert estimate items" ON "public"."estimate_items" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert estimates" ON "public"."estimates" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can insert jobs" ON "public"."jobs" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated users can update contracts" ON "public"."contracts" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can update customers" ON "public"."customers" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Authenticated users can update employees" ON "public"."employees" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Authenticated users can update estimate items" ON "public"."estimate_items" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can update estimates" ON "public"."estimates" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can update jobs" ON "public"."jobs" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Authenticated users can view contracts" ON "public"."contracts" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view customers" ON "public"."customers" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view employees" ON "public"."employees" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view estimate items" ON "public"."estimate_items" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view estimates" ON "public"."estimates" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated users can view jobs" ON "public"."jobs" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."contracts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."customer_activity" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."customer_documents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."customers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."employees" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."estimate_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."estimates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."invoice_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."invoice_payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."invoices" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."job_photos" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "job_photos_delete" ON "public"."job_photos" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "job_photos_insert" ON "public"."job_photos" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "job_photos_select" ON "public"."job_photos" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "job_photos_update" ON "public"."job_photos" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



ALTER TABLE "public"."jobs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sequences" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."generate_contract_number"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_contract_number"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_contract_number"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_estimate_number"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_estimate_number"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_estimate_number"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_invoice_number"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_invoice_number"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_invoice_number"() TO "service_role";



GRANT ALL ON FUNCTION "public"."generate_job_number"() TO "anon";
GRANT ALL ON FUNCTION "public"."generate_job_number"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."generate_job_number"() TO "service_role";



GRANT ALL ON FUNCTION "public"."next_document_number"("sequence_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."next_document_number"("sequence_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."next_document_number"("sequence_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON SEQUENCE "public"."contract_number_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."contract_number_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."contract_number_seq" TO "service_role";



GRANT ALL ON TABLE "public"."contracts" TO "anon";
GRANT ALL ON TABLE "public"."contracts" TO "authenticated";
GRANT ALL ON TABLE "public"."contracts" TO "service_role";



GRANT ALL ON TABLE "public"."customer_activity" TO "anon";
GRANT ALL ON TABLE "public"."customer_activity" TO "authenticated";
GRANT ALL ON TABLE "public"."customer_activity" TO "service_role";



GRANT ALL ON TABLE "public"."customer_documents" TO "anon";
GRANT ALL ON TABLE "public"."customer_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."customer_documents" TO "service_role";



GRANT ALL ON TABLE "public"."customers" TO "anon";
GRANT ALL ON TABLE "public"."customers" TO "authenticated";
GRANT ALL ON TABLE "public"."customers" TO "service_role";



GRANT ALL ON TABLE "public"."employees" TO "anon";
GRANT ALL ON TABLE "public"."employees" TO "authenticated";
GRANT ALL ON TABLE "public"."employees" TO "service_role";



GRANT ALL ON TABLE "public"."estimate_items" TO "anon";
GRANT ALL ON TABLE "public"."estimate_items" TO "authenticated";
GRANT ALL ON TABLE "public"."estimate_items" TO "service_role";



GRANT ALL ON SEQUENCE "public"."estimate_number_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."estimate_number_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."estimate_number_seq" TO "service_role";



GRANT ALL ON TABLE "public"."estimates" TO "anon";
GRANT ALL ON TABLE "public"."estimates" TO "authenticated";
GRANT ALL ON TABLE "public"."estimates" TO "service_role";



GRANT ALL ON SEQUENCE "public"."estimates_estimate_number_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."estimates_estimate_number_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."estimates_estimate_number_seq" TO "service_role";



GRANT ALL ON TABLE "public"."invoice_items" TO "anon";
GRANT ALL ON TABLE "public"."invoice_items" TO "authenticated";
GRANT ALL ON TABLE "public"."invoice_items" TO "service_role";



GRANT ALL ON TABLE "public"."invoice_payments" TO "anon";
GRANT ALL ON TABLE "public"."invoice_payments" TO "authenticated";
GRANT ALL ON TABLE "public"."invoice_payments" TO "service_role";



GRANT ALL ON TABLE "public"."invoices" TO "anon";
GRANT ALL ON TABLE "public"."invoices" TO "authenticated";
GRANT ALL ON TABLE "public"."invoices" TO "service_role";



GRANT ALL ON SEQUENCE "public"."job_number_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."job_number_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."job_number_seq" TO "service_role";



GRANT ALL ON TABLE "public"."job_photos" TO "anon";
GRANT ALL ON TABLE "public"."job_photos" TO "authenticated";
GRANT ALL ON TABLE "public"."job_photos" TO "service_role";



GRANT ALL ON TABLE "public"."jobs" TO "anon";
GRANT ALL ON TABLE "public"."jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."jobs" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON TABLE "public"."sequences" TO "anon";
GRANT ALL ON TABLE "public"."sequences" TO "authenticated";
GRANT ALL ON TABLE "public"."sequences" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































