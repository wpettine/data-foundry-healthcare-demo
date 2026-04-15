import type { SchemaAnnotation } from '../../types/system';
import { mulberry32 } from '../../utils/prng';
import { SYSTEM_IDS } from './_constants';

// ---------------------------------------------------------------------------
// 6 Hero Schema Annotations — curated mappings for demo highlight moments
// ---------------------------------------------------------------------------
export const HERO_FIELDS: SchemaAnnotation[] = [
  {
    id: 'sf-adj-type',
    systemId: SYSTEM_IDS.EPIC,
    sourceTable: 'charge_transactions',
    sourceField: 'adj_type',
    dataType: 'VARCHAR(20)',
    sampleValues: ['contractual', 'write_off', 'bad_debt'],
    mappedConceptId: 'ADJUSTMENT_TYPE',
    mappedConceptLabel: 'Adjustment Classification',
    confidence: 97.2,
    confidenceLevel: 'high',
    status: 'auto-accepted',
  },
  {
    id: 'sf-encounter-dt',
    systemId: SYSTEM_IDS.ATHENA,
    sourceTable: 'encounters',
    sourceField: 'enc_datetime',
    dataType: 'TIMESTAMP',
    sampleValues: ['2026-03-15T14:30:00Z'],
    mappedConceptId: 'ENCOUNTER_DATE',
    mappedConceptLabel: 'Encounter Date/Time',
    confidence: 99.1,
    confidenceLevel: 'high',
    status: 'auto-accepted',
  },
  {
    id: 'sf-dx-code',
    systemId: SYSTEM_IDS.MODMED,
    sourceTable: 'diagnoses',
    sourceField: 'icd10_code',
    dataType: 'VARCHAR(10)',
    sampleValues: ['M17.11', 'M16.11', 'M17.9'],
    mappedConceptId: 'PRIMARY_DIAGNOSIS',
    mappedConceptLabel: 'Primary Diagnosis Code',
    confidence: 95.8,
    confidenceLevel: 'high',
    status: 'auto-accepted',
  },
  {
    id: 'sf-lefs-score',
    systemId: SYSTEM_IDS.WEBPT,
    sourceTable: 'outcome_measures',
    sourceField: 'lefs_total',
    dataType: 'INTEGER',
    sampleValues: ['28', '45', '62'],
    mappedConceptId: 'FUNCTIONAL_SCORE',
    mappedConceptLabel: 'LEFS Functional Score',
    confidence: 72.4,
    confidenceLevel: 'medium',
    status: 'pending-review',
    alternatives: [
      { conceptId: 'CUSTOM_SCORE', conceptLabel: 'Custom Outcome Measure', confidence: 68.1 },
    ],
  },
  {
    id: 'sf-ndc-code',
    systemId: SYSTEM_IDS.PHARMACY,
    sourceTable: 'dispensing',
    sourceField: 'ndc_code',
    dataType: 'VARCHAR(12)',
    sampleValues: ['00904-7800-61'],
    mappedConceptId: 'MEDICATION_NDC',
    mappedConceptLabel: 'National Drug Code',
    confidence: 98.4,
    confidenceLevel: 'high',
    status: 'auto-accepted',
  },
  {
    id: 'sf-kl-grade',
    systemId: SYSTEM_IDS.RADIOLOGY,
    sourceTable: 'findings',
    sourceField: 'severity_grade',
    dataType: 'VARCHAR(5)',
    sampleValues: ['KL-3', 'KL-2', 'KL-4'],
    mappedConceptId: 'IMAGING_SEVERITY',
    mappedConceptLabel: 'Kellgren-Lawrence Grade',
    confidence: 54.3,
    confidenceLevel: 'low',
    status: 'manual',
    alternatives: [
      { conceptId: 'CUSTOM_GRADE', conceptLabel: 'Custom Severity Scale', confidence: 48.2 },
      { conceptId: 'OARSI_GRADE', conceptLabel: 'OARSI Grading', confidence: 42.7 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Field pools by system category
// ---------------------------------------------------------------------------
type FieldDef = { table: string; field: string; dataType: string };
type ConceptDef = { conceptId: string; conceptLabel: string };

const EHR_FIELD_POOL: FieldDef[] = [
  { table: 'patients', field: 'first_name', dataType: 'VARCHAR(50)' },
  { table: 'patients', field: 'last_name', dataType: 'VARCHAR(50)' },
  { table: 'patients', field: 'date_of_birth', dataType: 'DATE' },
  { table: 'patients', field: 'gender', dataType: 'VARCHAR(10)' },
  { table: 'patients', field: 'ssn_last4', dataType: 'VARCHAR(4)' },
  { table: 'patients', field: 'address_line1', dataType: 'VARCHAR(100)' },
  { table: 'patients', field: 'city', dataType: 'VARCHAR(50)' },
  { table: 'patients', field: 'state', dataType: 'VARCHAR(2)' },
  { table: 'patients', field: 'zip_code', dataType: 'VARCHAR(10)' },
  { table: 'patients', field: 'phone_primary', dataType: 'VARCHAR(15)' },
  { table: 'patients', field: 'email', dataType: 'VARCHAR(100)' },
  { table: 'patients', field: 'insurance_id', dataType: 'VARCHAR(30)' },
  { table: 'patients', field: 'payer_code', dataType: 'VARCHAR(20)' },
  { table: 'patients', field: 'mrn', dataType: 'VARCHAR(20)' },
  { table: 'patients', field: 'preferred_language', dataType: 'VARCHAR(20)' },
  { table: 'encounters', field: 'encounter_id', dataType: 'VARCHAR(20)' },
  { table: 'encounters', field: 'encounter_type', dataType: 'VARCHAR(30)' },
  { table: 'encounters', field: 'visit_date', dataType: 'DATE' },
  { table: 'encounters', field: 'provider_id', dataType: 'VARCHAR(20)' },
  { table: 'encounters', field: 'provider_name', dataType: 'VARCHAR(100)' },
  { table: 'encounters', field: 'facility_code', dataType: 'VARCHAR(10)' },
  { table: 'encounters', field: 'department_id', dataType: 'INTEGER' },
  { table: 'encounters', field: 'chief_complaint', dataType: 'TEXT' },
  { table: 'encounters', field: 'discharge_disposition', dataType: 'VARCHAR(20)' },
  { table: 'encounters', field: 'admission_source', dataType: 'VARCHAR(20)' },
  { table: 'orders', field: 'order_id', dataType: 'VARCHAR(20)' },
  { table: 'orders', field: 'order_type', dataType: 'VARCHAR(30)' },
  { table: 'orders', field: 'order_status', dataType: 'VARCHAR(20)' },
  { table: 'orders', field: 'ordering_provider', dataType: 'VARCHAR(100)' },
  { table: 'orders', field: 'order_date', dataType: 'TIMESTAMP' },
  { table: 'orders', field: 'priority', dataType: 'VARCHAR(10)' },
  { table: 'orders', field: 'cpt_code', dataType: 'VARCHAR(10)' },
  { table: 'vitals', field: 'bp_systolic', dataType: 'INTEGER' },
  { table: 'vitals', field: 'bp_diastolic', dataType: 'INTEGER' },
  { table: 'vitals', field: 'heart_rate', dataType: 'INTEGER' },
  { table: 'vitals', field: 'temperature', dataType: 'DECIMAL(5,2)' },
  { table: 'vitals', field: 'weight_kg', dataType: 'DECIMAL(6,2)' },
  { table: 'vitals', field: 'height_cm', dataType: 'DECIMAL(5,1)' },
  { table: 'vitals', field: 'bmi', dataType: 'DECIMAL(5,2)' },
  { table: 'vitals', field: 'pain_score', dataType: 'INTEGER' },
  { table: 'vitals', field: 'o2_saturation', dataType: 'DECIMAL(5,2)' },
  { table: 'vitals', field: 'respiratory_rate', dataType: 'INTEGER' },
  { table: 'labs', field: 'lab_result_id', dataType: 'VARCHAR(20)' },
  { table: 'labs', field: 'test_code', dataType: 'VARCHAR(20)' },
  { table: 'labs', field: 'test_name', dataType: 'VARCHAR(100)' },
  { table: 'labs', field: 'result_value', dataType: 'VARCHAR(50)' },
  { table: 'labs', field: 'result_unit', dataType: 'VARCHAR(20)' },
  { table: 'labs', field: 'reference_range', dataType: 'VARCHAR(30)' },
  { table: 'labs', field: 'abnormal_flag', dataType: 'VARCHAR(5)' },
  { table: 'labs', field: 'collection_date', dataType: 'TIMESTAMP' },
  { table: 'procedures', field: 'procedure_id', dataType: 'VARCHAR(20)' },
  { table: 'procedures', field: 'procedure_code', dataType: 'VARCHAR(10)' },
  { table: 'procedures', field: 'procedure_desc', dataType: 'VARCHAR(200)' },
  { table: 'procedures', field: 'procedure_date', dataType: 'DATE' },
  { table: 'procedures', field: 'surgeon_id', dataType: 'VARCHAR(20)' },
  { table: 'procedures', field: 'anesthesia_type', dataType: 'VARCHAR(30)' },
  { table: 'procedures', field: 'laterality', dataType: 'VARCHAR(10)' },
  { table: 'procedures', field: 'implant_lot_number', dataType: 'VARCHAR(30)' },
  { table: 'procedures', field: 'operative_time_min', dataType: 'INTEGER' },
  { table: 'procedures', field: 'complication_flag', dataType: 'BOOLEAN' },
  { table: 'diagnoses', field: 'diagnosis_id', dataType: 'VARCHAR(20)' },
  { table: 'diagnoses', field: 'icd10_code', dataType: 'VARCHAR(10)' },
  { table: 'diagnoses', field: 'diagnosis_desc', dataType: 'VARCHAR(200)' },
  { table: 'diagnoses', field: 'diagnosis_type', dataType: 'VARCHAR(20)' },
  { table: 'diagnoses', field: 'onset_date', dataType: 'DATE' },
  { table: 'diagnoses', field: 'resolved_date', dataType: 'DATE' },
  { table: 'charge_transactions', field: 'charge_id', dataType: 'VARCHAR(20)' },
  { table: 'charge_transactions', field: 'charge_amount', dataType: 'DECIMAL(10,2)' },
  { table: 'charge_transactions', field: 'payment_amount', dataType: 'DECIMAL(10,2)' },
  { table: 'charge_transactions', field: 'adjustment_amount', dataType: 'DECIMAL(10,2)' },
  { table: 'charge_transactions', field: 'balance_due', dataType: 'DECIMAL(10,2)' },
  { table: 'charge_transactions', field: 'service_date', dataType: 'DATE' },
  { table: 'charge_transactions', field: 'posting_date', dataType: 'DATE' },
  { table: 'charge_transactions', field: 'payer_name', dataType: 'VARCHAR(100)' },
  { table: 'charge_transactions', field: 'claim_number', dataType: 'VARCHAR(20)' },
  { table: 'charge_transactions', field: 'denial_code', dataType: 'VARCHAR(10)' },
  { table: 'charge_transactions', field: 'modifier_1', dataType: 'VARCHAR(5)' },
  { table: 'charge_transactions', field: 'modifier_2', dataType: 'VARCHAR(5)' },
  { table: 'charge_transactions', field: 'place_of_service', dataType: 'VARCHAR(5)' },
  { table: 'referrals', field: 'referral_id', dataType: 'VARCHAR(20)' },
  { table: 'referrals', field: 'referring_provider', dataType: 'VARCHAR(100)' },
  { table: 'referrals', field: 'referral_date', dataType: 'DATE' },
  { table: 'referrals', field: 'auth_number', dataType: 'VARCHAR(30)' },
  { table: 'referrals', field: 'referral_status', dataType: 'VARCHAR(20)' },
  { table: 'appointments', field: 'appointment_id', dataType: 'VARCHAR(20)' },
  { table: 'appointments', field: 'scheduled_date', dataType: 'TIMESTAMP' },
  { table: 'appointments', field: 'appointment_type', dataType: 'VARCHAR(30)' },
  { table: 'appointments', field: 'duration_min', dataType: 'INTEGER' },
  { table: 'appointments', field: 'no_show_flag', dataType: 'BOOLEAN' },
  { table: 'appointments', field: 'cancellation_reason', dataType: 'VARCHAR(50)' },
  { table: 'insurance_verification', field: 'verification_id', dataType: 'VARCHAR(20)' },
  { table: 'insurance_verification', field: 'eligibility_status', dataType: 'VARCHAR(20)' },
  { table: 'insurance_verification', field: 'copay_amount', dataType: 'DECIMAL(8,2)' },
  { table: 'insurance_verification', field: 'deductible_remaining', dataType: 'DECIMAL(10,2)' },
  { table: 'insurance_verification', field: 'plan_type', dataType: 'VARCHAR(20)' },
  { table: 'insurance_verification', field: 'group_number', dataType: 'VARCHAR(20)' },
];

const EHR_CONCEPT_POOL: ConceptDef[] = [
  { conceptId: 'PATIENT_FIRST_NAME', conceptLabel: 'Patient First Name' },
  { conceptId: 'PATIENT_LAST_NAME', conceptLabel: 'Patient Last Name' },
  { conceptId: 'DATE_OF_BIRTH', conceptLabel: 'Date of Birth' },
  { conceptId: 'PATIENT_GENDER', conceptLabel: 'Patient Gender' },
  { conceptId: 'SSN_PARTIAL', conceptLabel: 'SSN Last 4 Digits' },
  { conceptId: 'ADDRESS_LINE', conceptLabel: 'Street Address' },
  { conceptId: 'PATIENT_CITY', conceptLabel: 'City' },
  { conceptId: 'PATIENT_STATE', conceptLabel: 'State Code' },
  { conceptId: 'POSTAL_CODE', conceptLabel: 'ZIP/Postal Code' },
  { conceptId: 'PHONE_PRIMARY', conceptLabel: 'Primary Phone Number' },
  { conceptId: 'EMAIL_ADDRESS', conceptLabel: 'Email Address' },
  { conceptId: 'INSURANCE_MEMBER_ID', conceptLabel: 'Insurance Member ID' },
  { conceptId: 'PAYER_CODE', conceptLabel: 'Payer Identifier' },
  { conceptId: 'MEDICAL_RECORD_NUM', conceptLabel: 'Medical Record Number' },
  { conceptId: 'PREFERRED_LANGUAGE', conceptLabel: 'Preferred Language' },
  { conceptId: 'ENCOUNTER_ID', conceptLabel: 'Encounter Identifier' },
  { conceptId: 'ENCOUNTER_TYPE', conceptLabel: 'Encounter Type' },
  { conceptId: 'VISIT_DATE', conceptLabel: 'Visit Date' },
  { conceptId: 'PROVIDER_ID', conceptLabel: 'Provider Identifier' },
  { conceptId: 'PROVIDER_NAME', conceptLabel: 'Provider Full Name' },
  { conceptId: 'FACILITY_CODE', conceptLabel: 'Facility Code' },
  { conceptId: 'DEPARTMENT_ID', conceptLabel: 'Department Identifier' },
  { conceptId: 'CHIEF_COMPLAINT', conceptLabel: 'Chief Complaint' },
  { conceptId: 'DISCHARGE_DISPOSITION', conceptLabel: 'Discharge Disposition' },
  { conceptId: 'ADMISSION_SOURCE', conceptLabel: 'Admission Source' },
  { conceptId: 'ORDER_ID', conceptLabel: 'Order Identifier' },
  { conceptId: 'ORDER_TYPE', conceptLabel: 'Order Type' },
  { conceptId: 'ORDER_STATUS', conceptLabel: 'Order Status' },
  { conceptId: 'ORDERING_PROVIDER', conceptLabel: 'Ordering Provider' },
  { conceptId: 'ORDER_DATETIME', conceptLabel: 'Order Date/Time' },
  { conceptId: 'ORDER_PRIORITY', conceptLabel: 'Order Priority' },
  { conceptId: 'CPT_CODE', conceptLabel: 'CPT Procedure Code' },
  { conceptId: 'BP_SYSTOLIC', conceptLabel: 'Systolic Blood Pressure' },
  { conceptId: 'BP_DIASTOLIC', conceptLabel: 'Diastolic Blood Pressure' },
  { conceptId: 'HEART_RATE', conceptLabel: 'Heart Rate' },
  { conceptId: 'BODY_TEMPERATURE', conceptLabel: 'Body Temperature' },
  { conceptId: 'WEIGHT', conceptLabel: 'Patient Weight' },
  { conceptId: 'HEIGHT', conceptLabel: 'Patient Height' },
  { conceptId: 'BMI', conceptLabel: 'Body Mass Index' },
  { conceptId: 'PAIN_SCORE', conceptLabel: 'Pain Score (VAS)' },
  { conceptId: 'O2_SATURATION', conceptLabel: 'Oxygen Saturation' },
  { conceptId: 'RESPIRATORY_RATE', conceptLabel: 'Respiratory Rate' },
  { conceptId: 'LAB_RESULT_ID', conceptLabel: 'Lab Result Identifier' },
  { conceptId: 'LAB_TEST_CODE', conceptLabel: 'Lab Test Code' },
  { conceptId: 'LAB_TEST_NAME', conceptLabel: 'Lab Test Name' },
  { conceptId: 'LAB_RESULT_VALUE', conceptLabel: 'Lab Result Value' },
  { conceptId: 'LAB_RESULT_UNIT', conceptLabel: 'Lab Result Unit' },
  { conceptId: 'LAB_REFERENCE_RANGE', conceptLabel: 'Lab Reference Range' },
  { conceptId: 'ABNORMAL_FLAG', conceptLabel: 'Abnormal Result Flag' },
  { conceptId: 'SPECIMEN_COLLECTION_DT', conceptLabel: 'Specimen Collection Date' },
  { conceptId: 'PROCEDURE_ID', conceptLabel: 'Procedure Identifier' },
  { conceptId: 'PROCEDURE_CODE', conceptLabel: 'Procedure Code' },
  { conceptId: 'PROCEDURE_DESCRIPTION', conceptLabel: 'Procedure Description' },
  { conceptId: 'PROCEDURE_DATE', conceptLabel: 'Procedure Date' },
  { conceptId: 'SURGEON_ID', conceptLabel: 'Surgeon Identifier' },
  { conceptId: 'ANESTHESIA_TYPE', conceptLabel: 'Anesthesia Type' },
  { conceptId: 'LATERALITY', conceptLabel: 'Laterality' },
  { conceptId: 'IMPLANT_LOT', conceptLabel: 'Implant Lot Number' },
  { conceptId: 'OPERATIVE_TIME', conceptLabel: 'Operative Time (minutes)' },
  { conceptId: 'COMPLICATION_FLAG', conceptLabel: 'Complication Flag' },
  { conceptId: 'DIAGNOSIS_ID', conceptLabel: 'Diagnosis Identifier' },
  { conceptId: 'ICD10_CODE', conceptLabel: 'ICD-10 Diagnosis Code' },
  { conceptId: 'DIAGNOSIS_DESC', conceptLabel: 'Diagnosis Description' },
  { conceptId: 'DIAGNOSIS_TYPE', conceptLabel: 'Diagnosis Type (Admitting/Principal/etc)' },
  { conceptId: 'ONSET_DATE', conceptLabel: 'Condition Onset Date' },
  { conceptId: 'RESOLVED_DATE', conceptLabel: 'Condition Resolved Date' },
  { conceptId: 'CHARGE_ID', conceptLabel: 'Charge Transaction ID' },
  { conceptId: 'CHARGE_AMOUNT', conceptLabel: 'Charge Amount' },
  { conceptId: 'PAYMENT_AMOUNT', conceptLabel: 'Payment Amount' },
  { conceptId: 'ADJUSTMENT_AMOUNT', conceptLabel: 'Adjustment Amount' },
  { conceptId: 'BALANCE_DUE', conceptLabel: 'Balance Due' },
  { conceptId: 'SERVICE_DATE', conceptLabel: 'Date of Service' },
  { conceptId: 'POSTING_DATE', conceptLabel: 'Posting Date' },
  { conceptId: 'PAYER_NAME', conceptLabel: 'Payer Name' },
  { conceptId: 'CLAIM_NUMBER', conceptLabel: 'Claim Number' },
  { conceptId: 'DENIAL_CODE', conceptLabel: 'Denial Reason Code' },
  { conceptId: 'MODIFIER_1', conceptLabel: 'CPT Modifier 1' },
  { conceptId: 'MODIFIER_2', conceptLabel: 'CPT Modifier 2' },
  { conceptId: 'PLACE_OF_SERVICE', conceptLabel: 'Place of Service Code' },
  { conceptId: 'REFERRAL_ID', conceptLabel: 'Referral Identifier' },
  { conceptId: 'REFERRING_PROVIDER', conceptLabel: 'Referring Provider' },
  { conceptId: 'REFERRAL_DATE', conceptLabel: 'Referral Date' },
  { conceptId: 'AUTH_NUMBER', conceptLabel: 'Authorization Number' },
  { conceptId: 'REFERRAL_STATUS', conceptLabel: 'Referral Status' },
  { conceptId: 'APPOINTMENT_ID', conceptLabel: 'Appointment Identifier' },
  { conceptId: 'SCHEDULED_DATETIME', conceptLabel: 'Scheduled Date/Time' },
  { conceptId: 'APPOINTMENT_TYPE', conceptLabel: 'Appointment Type' },
  { conceptId: 'APPOINTMENT_DURATION', conceptLabel: 'Appointment Duration' },
  { conceptId: 'NO_SHOW_FLAG', conceptLabel: 'No Show Flag' },
  { conceptId: 'CANCEL_REASON', conceptLabel: 'Cancellation Reason' },
  { conceptId: 'VERIFICATION_ID', conceptLabel: 'Verification Identifier' },
  { conceptId: 'ELIGIBILITY_STATUS', conceptLabel: 'Eligibility Status' },
  { conceptId: 'COPAY_AMOUNT', conceptLabel: 'Copay Amount' },
  { conceptId: 'DEDUCTIBLE_REMAINING', conceptLabel: 'Deductible Remaining' },
  { conceptId: 'PLAN_TYPE', conceptLabel: 'Insurance Plan Type' },
  { conceptId: 'GROUP_NUMBER', conceptLabel: 'Insurance Group Number' },
];

const PT_FIELD_POOL: FieldDef[] = [
  { table: 'sessions', field: 'session_id', dataType: 'VARCHAR(20)' },
  { table: 'sessions', field: 'session_date', dataType: 'DATE' },
  { table: 'sessions', field: 'therapist_id', dataType: 'VARCHAR(20)' },
  { table: 'sessions', field: 'therapist_name', dataType: 'VARCHAR(100)' },
  { table: 'sessions', field: 'session_type', dataType: 'VARCHAR(30)' },
  { table: 'sessions', field: 'duration_min', dataType: 'INTEGER' },
  { table: 'sessions', field: 'cpt_code', dataType: 'VARCHAR(10)' },
  { table: 'sessions', field: 'units_billed', dataType: 'INTEGER' },
  { table: 'sessions', field: 'visit_number', dataType: 'INTEGER' },
  { table: 'sessions', field: 'subjective_notes', dataType: 'TEXT' },
  { table: 'sessions', field: 'objective_findings', dataType: 'TEXT' },
  { table: 'sessions', field: 'assessment', dataType: 'TEXT' },
  { table: 'sessions', field: 'plan_notes', dataType: 'TEXT' },
  { table: 'outcome_measures', field: 'measure_id', dataType: 'VARCHAR(20)' },
  { table: 'outcome_measures', field: 'measure_type', dataType: 'VARCHAR(30)' },
  { table: 'outcome_measures', field: 'measure_date', dataType: 'DATE' },
  { table: 'outcome_measures', field: 'total_score', dataType: 'INTEGER' },
  { table: 'outcome_measures', field: 'max_score', dataType: 'INTEGER' },
  { table: 'outcome_measures', field: 'percentile', dataType: 'DECIMAL(5,2)' },
  { table: 'outcome_measures', field: 'clinically_significant', dataType: 'BOOLEAN' },
  { table: 'treatment_plans', field: 'plan_id', dataType: 'VARCHAR(20)' },
  { table: 'treatment_plans', field: 'plan_start_date', dataType: 'DATE' },
  { table: 'treatment_plans', field: 'plan_end_date', dataType: 'DATE' },
  { table: 'treatment_plans', field: 'total_visits_auth', dataType: 'INTEGER' },
  { table: 'treatment_plans', field: 'visits_used', dataType: 'INTEGER' },
  { table: 'treatment_plans', field: 'frequency_per_week', dataType: 'INTEGER' },
  { table: 'treatment_plans', field: 'primary_goal', dataType: 'TEXT' },
  { table: 'treatment_plans', field: 'goal_status', dataType: 'VARCHAR(20)' },
  { table: 'treatment_plans', field: 'discharge_criteria', dataType: 'TEXT' },
  { table: 'exercise_logs', field: 'exercise_id', dataType: 'VARCHAR(20)' },
  { table: 'exercise_logs', field: 'exercise_name', dataType: 'VARCHAR(100)' },
  { table: 'exercise_logs', field: 'sets', dataType: 'INTEGER' },
  { table: 'exercise_logs', field: 'reps', dataType: 'INTEGER' },
  { table: 'exercise_logs', field: 'resistance', dataType: 'VARCHAR(20)' },
  { table: 'exercise_logs', field: 'rom_degrees', dataType: 'DECIMAL(5,1)' },
  { table: 'exercise_logs', field: 'patient_tolerance', dataType: 'VARCHAR(20)' },
  { table: 'exercise_logs', field: 'home_program_flag', dataType: 'BOOLEAN' },
  { table: 'exercise_logs', field: 'compliance_pct', dataType: 'DECIMAL(5,2)' },
];

const PT_CONCEPT_POOL: ConceptDef[] = [
  { conceptId: 'SESSION_ID', conceptLabel: 'Therapy Session Identifier' },
  { conceptId: 'SESSION_DATE', conceptLabel: 'Session Date' },
  { conceptId: 'THERAPIST_ID', conceptLabel: 'Therapist Identifier' },
  { conceptId: 'THERAPIST_NAME', conceptLabel: 'Therapist Name' },
  { conceptId: 'SESSION_TYPE', conceptLabel: 'Session Type' },
  { conceptId: 'SESSION_DURATION', conceptLabel: 'Session Duration (min)' },
  { conceptId: 'PT_CPT_CODE', conceptLabel: 'PT CPT Code' },
  { conceptId: 'UNITS_BILLED', conceptLabel: 'Units Billed' },
  { conceptId: 'VISIT_NUMBER', conceptLabel: 'Visit Sequence Number' },
  { conceptId: 'SUBJECTIVE_NOTES', conceptLabel: 'Subjective Notes (SOAP)' },
  { conceptId: 'OBJECTIVE_FINDINGS', conceptLabel: 'Objective Findings (SOAP)' },
  { conceptId: 'ASSESSMENT_NOTES', conceptLabel: 'Assessment (SOAP)' },
  { conceptId: 'PLAN_NOTES', conceptLabel: 'Plan Notes (SOAP)' },
  { conceptId: 'OUTCOME_MEASURE_ID', conceptLabel: 'Outcome Measure Identifier' },
  { conceptId: 'OUTCOME_MEASURE_TYPE', conceptLabel: 'Outcome Measure Type' },
  { conceptId: 'OUTCOME_MEASURE_DATE', conceptLabel: 'Outcome Measure Date' },
  { conceptId: 'OUTCOME_TOTAL_SCORE', conceptLabel: 'Outcome Total Score' },
  { conceptId: 'OUTCOME_MAX_SCORE', conceptLabel: 'Outcome Max Score' },
  { conceptId: 'OUTCOME_PERCENTILE', conceptLabel: 'Outcome Percentile' },
  { conceptId: 'CLINICALLY_SIGNIFICANT', conceptLabel: 'Clinically Significant Change' },
  { conceptId: 'TREATMENT_PLAN_ID', conceptLabel: 'Treatment Plan Identifier' },
  { conceptId: 'PLAN_START_DATE', conceptLabel: 'Plan Start Date' },
  { conceptId: 'PLAN_END_DATE', conceptLabel: 'Plan End Date' },
  { conceptId: 'VISITS_AUTHORIZED', conceptLabel: 'Total Visits Authorized' },
  { conceptId: 'VISITS_USED', conceptLabel: 'Visits Used' },
  { conceptId: 'FREQUENCY_PER_WEEK', conceptLabel: 'Visit Frequency (per week)' },
  { conceptId: 'PRIMARY_GOAL', conceptLabel: 'Primary Treatment Goal' },
  { conceptId: 'GOAL_STATUS', conceptLabel: 'Goal Status' },
  { conceptId: 'DISCHARGE_CRITERIA', conceptLabel: 'Discharge Criteria' },
  { conceptId: 'EXERCISE_ID', conceptLabel: 'Exercise Identifier' },
  { conceptId: 'EXERCISE_NAME', conceptLabel: 'Exercise Name' },
  { conceptId: 'EXERCISE_SETS', conceptLabel: 'Exercise Sets' },
  { conceptId: 'EXERCISE_REPS', conceptLabel: 'Exercise Reps' },
  { conceptId: 'EXERCISE_RESISTANCE', conceptLabel: 'Exercise Resistance' },
  { conceptId: 'ROM_DEGREES', conceptLabel: 'Range of Motion (degrees)' },
  { conceptId: 'PATIENT_TOLERANCE', conceptLabel: 'Patient Tolerance' },
  { conceptId: 'HOME_PROGRAM_FLAG', conceptLabel: 'Home Exercise Program Flag' },
  { conceptId: 'COMPLIANCE_PCT', conceptLabel: 'Home Program Compliance %' },
];

const PHARMACY_FIELD_POOL: FieldDef[] = [
  { table: 'dispensing', field: 'dispense_id', dataType: 'VARCHAR(20)' },
  { table: 'dispensing', field: 'dispense_date', dataType: 'TIMESTAMP' },
  { table: 'dispensing', field: 'drug_name', dataType: 'VARCHAR(100)' },
  { table: 'dispensing', field: 'generic_name', dataType: 'VARCHAR(100)' },
  { table: 'dispensing', field: 'dosage_form', dataType: 'VARCHAR(30)' },
  { table: 'dispensing', field: 'strength', dataType: 'VARCHAR(30)' },
  { table: 'dispensing', field: 'quantity', dataType: 'DECIMAL(8,2)' },
  { table: 'dispensing', field: 'days_supply', dataType: 'INTEGER' },
  { table: 'dispensing', field: 'refill_number', dataType: 'INTEGER' },
  { table: 'dispensing', field: 'pharmacist_id', dataType: 'VARCHAR(20)' },
  { table: 'dispensing', field: 'lot_number', dataType: 'VARCHAR(20)' },
  { table: 'dispensing', field: 'expiration_date', dataType: 'DATE' },
  { table: 'prescriptions', field: 'rx_number', dataType: 'VARCHAR(20)' },
  { table: 'prescriptions', field: 'prescribed_date', dataType: 'DATE' },
  { table: 'prescriptions', field: 'prescriber_npi', dataType: 'VARCHAR(10)' },
  { table: 'prescriptions', field: 'prescriber_name', dataType: 'VARCHAR(100)' },
  { table: 'prescriptions', field: 'sig_directions', dataType: 'TEXT' },
  { table: 'prescriptions', field: 'refills_remaining', dataType: 'INTEGER' },
  { table: 'prescriptions', field: 'daw_code', dataType: 'VARCHAR(5)' },
  { table: 'prescriptions', field: 'rx_status', dataType: 'VARCHAR(20)' },
  { table: 'prescriptions', field: 'prior_auth_required', dataType: 'BOOLEAN' },
  { table: 'prescriptions', field: 'prior_auth_number', dataType: 'VARCHAR(30)' },
  { table: 'drug_interactions', field: 'interaction_id', dataType: 'VARCHAR(20)' },
  { table: 'drug_interactions', field: 'drug_a_ndc', dataType: 'VARCHAR(12)' },
  { table: 'drug_interactions', field: 'drug_b_ndc', dataType: 'VARCHAR(12)' },
  { table: 'drug_interactions', field: 'severity', dataType: 'VARCHAR(20)' },
  { table: 'drug_interactions', field: 'description', dataType: 'TEXT' },
  { table: 'drug_interactions', field: 'override_reason', dataType: 'VARCHAR(100)' },
];

const PHARMACY_CONCEPT_POOL: ConceptDef[] = [
  { conceptId: 'DISPENSE_ID', conceptLabel: 'Dispense Identifier' },
  { conceptId: 'DISPENSE_DATETIME', conceptLabel: 'Dispense Date/Time' },
  { conceptId: 'DRUG_BRAND_NAME', conceptLabel: 'Drug Brand Name' },
  { conceptId: 'DRUG_GENERIC_NAME', conceptLabel: 'Drug Generic Name' },
  { conceptId: 'DOSAGE_FORM', conceptLabel: 'Dosage Form' },
  { conceptId: 'DRUG_STRENGTH', conceptLabel: 'Drug Strength' },
  { conceptId: 'QUANTITY_DISPENSED', conceptLabel: 'Quantity Dispensed' },
  { conceptId: 'DAYS_SUPPLY', conceptLabel: 'Days Supply' },
  { conceptId: 'REFILL_NUMBER', conceptLabel: 'Refill Number' },
  { conceptId: 'PHARMACIST_ID', conceptLabel: 'Pharmacist Identifier' },
  { conceptId: 'DRUG_LOT_NUMBER', conceptLabel: 'Drug Lot Number' },
  { conceptId: 'DRUG_EXPIRATION', conceptLabel: 'Drug Expiration Date' },
  { conceptId: 'RX_NUMBER', conceptLabel: 'Prescription Number' },
  { conceptId: 'PRESCRIBED_DATE', conceptLabel: 'Date Prescribed' },
  { conceptId: 'PRESCRIBER_NPI', conceptLabel: 'Prescriber NPI' },
  { conceptId: 'PRESCRIBER_NAME', conceptLabel: 'Prescriber Name' },
  { conceptId: 'SIG_DIRECTIONS', conceptLabel: 'Sig Directions' },
  { conceptId: 'REFILLS_REMAINING', conceptLabel: 'Refills Remaining' },
  { conceptId: 'DAW_CODE', conceptLabel: 'Dispense As Written Code' },
  { conceptId: 'RX_STATUS', conceptLabel: 'Prescription Status' },
  { conceptId: 'PA_REQUIRED_FLAG', conceptLabel: 'Prior Auth Required' },
  { conceptId: 'PA_NUMBER', conceptLabel: 'Prior Auth Number' },
  { conceptId: 'INTERACTION_ID', conceptLabel: 'Interaction Identifier' },
  { conceptId: 'INTERACTION_DRUG_A', conceptLabel: 'Interaction Drug A (NDC)' },
  { conceptId: 'INTERACTION_DRUG_B', conceptLabel: 'Interaction Drug B (NDC)' },
  { conceptId: 'INTERACTION_SEVERITY', conceptLabel: 'Interaction Severity' },
  { conceptId: 'INTERACTION_DESC', conceptLabel: 'Interaction Description' },
  { conceptId: 'OVERRIDE_REASON', conceptLabel: 'Override Reason' },
];

const RADIOLOGY_FIELD_POOL: FieldDef[] = [
  { table: 'studies', field: 'study_id', dataType: 'VARCHAR(20)' },
  { table: 'studies', field: 'accession_number', dataType: 'VARCHAR(20)' },
  { table: 'studies', field: 'study_date', dataType: 'TIMESTAMP' },
  { table: 'studies', field: 'modality', dataType: 'VARCHAR(10)' },
  { table: 'studies', field: 'body_part', dataType: 'VARCHAR(50)' },
  { table: 'studies', field: 'laterality', dataType: 'VARCHAR(10)' },
  { table: 'studies', field: 'ordering_physician', dataType: 'VARCHAR(100)' },
  { table: 'studies', field: 'radiologist_id', dataType: 'VARCHAR(20)' },
  { table: 'studies', field: 'study_status', dataType: 'VARCHAR(20)' },
  { table: 'studies', field: 'priority', dataType: 'VARCHAR(10)' },
  { table: 'studies', field: 'clinical_indication', dataType: 'TEXT' },
  { table: 'findings', field: 'finding_id', dataType: 'VARCHAR(20)' },
  { table: 'findings', field: 'finding_type', dataType: 'VARCHAR(30)' },
  { table: 'findings', field: 'finding_text', dataType: 'TEXT' },
  { table: 'findings', field: 'anatomical_location', dataType: 'VARCHAR(50)' },
  { table: 'findings', field: 'measurement_mm', dataType: 'DECIMAL(6,2)' },
  { table: 'findings', field: 'comparison_date', dataType: 'DATE' },
  { table: 'findings', field: 'change_from_prior', dataType: 'VARCHAR(30)' },
  { table: 'images', field: 'image_id', dataType: 'VARCHAR(20)' },
  { table: 'images', field: 'series_number', dataType: 'INTEGER' },
  { table: 'images', field: 'image_number', dataType: 'INTEGER' },
  { table: 'images', field: 'slice_thickness_mm', dataType: 'DECIMAL(5,2)' },
  { table: 'images', field: 'window_center', dataType: 'INTEGER' },
  { table: 'images', field: 'window_width', dataType: 'INTEGER' },
  { table: 'images', field: 'dicom_uid', dataType: 'VARCHAR(64)' },
  { table: 'reports', field: 'report_id', dataType: 'VARCHAR(20)' },
  { table: 'reports', field: 'report_status', dataType: 'VARCHAR(20)' },
  { table: 'reports', field: 'impression', dataType: 'TEXT' },
  { table: 'reports', field: 'narrative', dataType: 'TEXT' },
  { table: 'reports', field: 'signed_by', dataType: 'VARCHAR(100)' },
  { table: 'reports', field: 'signed_date', dataType: 'TIMESTAMP' },
  { table: 'reports', field: 'addendum_text', dataType: 'TEXT' },
];

const RADIOLOGY_CONCEPT_POOL: ConceptDef[] = [
  { conceptId: 'STUDY_ID', conceptLabel: 'Study Identifier' },
  { conceptId: 'ACCESSION_NUMBER', conceptLabel: 'Accession Number' },
  { conceptId: 'STUDY_DATETIME', conceptLabel: 'Study Date/Time' },
  { conceptId: 'IMAGING_MODALITY', conceptLabel: 'Imaging Modality' },
  { conceptId: 'BODY_PART_EXAMINED', conceptLabel: 'Body Part Examined' },
  { conceptId: 'IMAGING_LATERALITY', conceptLabel: 'Imaging Laterality' },
  { conceptId: 'ORDERING_PHYSICIAN', conceptLabel: 'Ordering Physician' },
  { conceptId: 'RADIOLOGIST_ID', conceptLabel: 'Radiologist Identifier' },
  { conceptId: 'STUDY_STATUS', conceptLabel: 'Study Status' },
  { conceptId: 'STUDY_PRIORITY', conceptLabel: 'Study Priority' },
  { conceptId: 'CLINICAL_INDICATION', conceptLabel: 'Clinical Indication' },
  { conceptId: 'FINDING_ID', conceptLabel: 'Finding Identifier' },
  { conceptId: 'FINDING_TYPE', conceptLabel: 'Finding Type' },
  { conceptId: 'FINDING_TEXT', conceptLabel: 'Finding Text' },
  { conceptId: 'ANATOMICAL_LOCATION', conceptLabel: 'Anatomical Location' },
  { conceptId: 'MEASUREMENT_MM', conceptLabel: 'Measurement (mm)' },
  { conceptId: 'COMPARISON_DATE', conceptLabel: 'Comparison Study Date' },
  { conceptId: 'CHANGE_FROM_PRIOR', conceptLabel: 'Change from Prior Study' },
  { conceptId: 'IMAGE_ID', conceptLabel: 'Image Identifier' },
  { conceptId: 'SERIES_NUMBER', conceptLabel: 'Series Number' },
  { conceptId: 'IMAGE_NUMBER', conceptLabel: 'Image Number' },
  { conceptId: 'SLICE_THICKNESS', conceptLabel: 'Slice Thickness (mm)' },
  { conceptId: 'WINDOW_CENTER', conceptLabel: 'Window Center' },
  { conceptId: 'WINDOW_WIDTH', conceptLabel: 'Window Width' },
  { conceptId: 'DICOM_UID', conceptLabel: 'DICOM Unique Identifier' },
  { conceptId: 'REPORT_ID', conceptLabel: 'Report Identifier' },
  { conceptId: 'REPORT_STATUS', conceptLabel: 'Report Status' },
  { conceptId: 'IMPRESSION', conceptLabel: 'Report Impression' },
  { conceptId: 'REPORT_NARRATIVE', conceptLabel: 'Report Narrative' },
  { conceptId: 'SIGNED_BY', conceptLabel: 'Signed By' },
  { conceptId: 'SIGNED_DATE', conceptLabel: 'Report Signed Date' },
  { conceptId: 'ADDENDUM_TEXT', conceptLabel: 'Report Addendum' },
];

// ---------------------------------------------------------------------------
// Sample value generator (deterministic)
// ---------------------------------------------------------------------------
function generateSampleValues(
  rand: () => number,
  dataType: string,
  field: string,
): string[] {
  const count = Math.floor(rand() * 2) + 1; // 1–2 sample values
  const samples: string[] = [];
  for (let i = 0; i < count; i++) {
    if (dataType.startsWith('VARCHAR') || dataType === 'TEXT') {
      samples.push(`${field}_${Math.floor(rand() * 9000) + 1000}`);
    } else if (dataType === 'INTEGER') {
      samples.push(String(Math.floor(rand() * 500) + 1));
    } else if (dataType.startsWith('DECIMAL')) {
      samples.push((rand() * 1000).toFixed(2));
    } else if (dataType === 'DATE') {
      const day = Math.floor(rand() * 28) + 1;
      samples.push(`2026-03-${String(day).padStart(2, '0')}`);
    } else if (dataType === 'TIMESTAMP') {
      const day = Math.floor(rand() * 28) + 1;
      const hour = Math.floor(rand() * 24);
      samples.push(`2026-03-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:00:00Z`);
    } else if (dataType === 'BOOLEAN') {
      samples.push(rand() > 0.5 ? 'true' : 'false');
    } else {
      samples.push(`val_${Math.floor(rand() * 9000) + 1000}`);
    }
  }
  return samples;
}

// ---------------------------------------------------------------------------
// Filler field generator
// ---------------------------------------------------------------------------
function generateFillerSchemaFields(
  count: number,
  systemId: string,
  fieldPool: FieldDef[],
  conceptPool: ConceptDef[],
  confidenceRange: [number, number],
): SchemaAnnotation[] {
  const seedContext = systemId;
  const rand = mulberry32(seedContext.length * 1000 + count);
  const fields: SchemaAnnotation[] = [];

  for (let i = 0; i < count; i++) {
    const fieldDef = fieldPool[i % fieldPool.length];
    const conceptDef = conceptPool[i % conceptPool.length];
    const confidence =
      confidenceRange[0] + rand() * (confidenceRange[1] - confidenceRange[0]);
    const roundedConfidence = Math.round(confidence * 10) / 10;

    let confidenceLevel: SchemaAnnotation['confidenceLevel'];
    if (roundedConfidence >= 85) {
      confidenceLevel = 'high';
    } else if (roundedConfidence >= 60) {
      confidenceLevel = 'medium';
    } else {
      confidenceLevel = 'low';
    }

    let status: SchemaAnnotation['status'];
    if (confidenceLevel === 'high') {
      status = 'auto-accepted';
    } else if (confidenceLevel === 'medium') {
      status = 'pending-review';
    } else {
      status = 'manual';
    }

    const alternatives: SchemaAnnotation['alternatives'] =
      confidenceLevel !== 'high'
        ? [
            {
              conceptId: conceptPool[(i + 1) % conceptPool.length].conceptId,
              conceptLabel: conceptPool[(i + 1) % conceptPool.length].conceptLabel,
              confidence: Math.round((roundedConfidence - 5 - rand() * 10) * 10) / 10,
            },
          ]
        : undefined;

    fields.push({
      id: `sf-${systemId}-${i}`,
      systemId,
      sourceTable: fieldDef.table,
      sourceField: fieldDef.field,
      dataType: fieldDef.dataType,
      sampleValues: generateSampleValues(rand, fieldDef.dataType, fieldDef.field),
      mappedConceptId: conceptDef.conceptId,
      mappedConceptLabel: conceptDef.conceptLabel,
      confidence: roundedConfidence,
      confidenceLevel,
      status,
      ...(alternatives ? { alternatives } : {}),
    });
  }

  return fields;
}

// ---------------------------------------------------------------------------
// System → category mapping and field generation
// ---------------------------------------------------------------------------
type SystemCategory = 'ehr' | 'pt' | 'pharmacy' | 'radiology';

const SYSTEM_CATEGORIES: Record<string, SystemCategory> = {
  // Hero systems
  [SYSTEM_IDS.EPIC]: 'ehr',
  [SYSTEM_IDS.ATHENA]: 'ehr',
  [SYSTEM_IDS.MODMED]: 'ehr',
  [SYSTEM_IDS.ECW]: 'ehr',
  [SYSTEM_IDS.WEBPT]: 'pt',
  [SYSTEM_IDS.PHARMACY]: 'pharmacy',
  [SYSTEM_IDS.RADIOLOGY]: 'radiology',
  // Filler systems (by platform)
  'crestview-ortho': 'ehr',       // Athenahealth
  'valley-spine': 'ehr',          // Epic
  'lakeshore-sports': 'ehr',      // ModMed
  'pinecrest-rehab': 'pt',        // WebPT
  'westfield-joint': 'ehr',       // eCW
  'highland-ortho': 'ehr',        // Greenway
  'summit-hand': 'ehr',           // ModMed
  'cedar-pt': 'pt',               // WebPT
  'riverdale-ortho': 'ehr',       // NextGen
  'brookside-imaging': 'radiology', // Radiology PACS
  'eastside-foot': 'ehr',         // Athenahealth
  'granite-pain': 'ehr',          // eCW
  'blueridge-ortho': 'ehr',       // Greenway
};

const POOL_BY_CATEGORY: Record<
  SystemCategory,
  { fields: FieldDef[]; concepts: ConceptDef[]; confidenceRange: [number, number] }
> = {
  ehr: { fields: EHR_FIELD_POOL, concepts: EHR_CONCEPT_POOL, confidenceRange: [72, 99.5] },
  pt: { fields: PT_FIELD_POOL, concepts: PT_CONCEPT_POOL, confidenceRange: [65, 98] },
  pharmacy: { fields: PHARMACY_FIELD_POOL, concepts: PHARMACY_CONCEPT_POOL, confidenceRange: [78, 99.8] },
  radiology: { fields: RADIOLOGY_FIELD_POOL, concepts: RADIOLOGY_CONCEPT_POOL, confidenceRange: [55, 97] },
};

// Count of hero fields per system
const HERO_FIELD_COUNTS: Record<string, number> = {};
for (const hf of HERO_FIELDS) {
  HERO_FIELD_COUNTS[hf.systemId] = (HERO_FIELD_COUNTS[hf.systemId] ?? 0) + 1;
}

// All 20 systems with their IDs and fieldCounts (imported from systems.ts at design time)
const ALL_SYSTEMS: Array<{ id: string; fieldCount: number }> = [
  // Hero systems
  { id: SYSTEM_IDS.EPIC, fieldCount: 1247 },
  { id: SYSTEM_IDS.ATHENA, fieldCount: 892 },
  { id: SYSTEM_IDS.MODMED, fieldCount: 634 },
  { id: SYSTEM_IDS.ECW, fieldCount: 578 },
  { id: SYSTEM_IDS.WEBPT, fieldCount: 412 },
  { id: SYSTEM_IDS.PHARMACY, fieldCount: 289 },
  { id: SYSTEM_IDS.RADIOLOGY, fieldCount: 345 },
  // Filler systems
  { id: 'crestview-ortho', fieldCount: 48 },
  { id: 'valley-spine', fieldCount: 52 },
  { id: 'lakeshore-sports', fieldCount: 38 },
  { id: 'pinecrest-rehab', fieldCount: 41 },
  { id: 'westfield-joint', fieldCount: 36 },
  { id: 'highland-ortho', fieldCount: 33 },
  { id: 'summit-hand', fieldCount: 29 },
  { id: 'cedar-pt', fieldCount: 34 },
  { id: 'riverdale-ortho', fieldCount: 28 },
  { id: 'brookside-imaging', fieldCount: 25 },
  { id: 'eastside-foot', fieldCount: 30 },
  { id: 'granite-pain', fieldCount: 27 },
  { id: 'blueridge-ortho', fieldCount: 29 },
];

// ---------------------------------------------------------------------------
// Generate all filler fields for every system
// ---------------------------------------------------------------------------
const allFillerFields: SchemaAnnotation[] = [];

for (const sys of ALL_SYSTEMS) {
  const heroCount = HERO_FIELD_COUNTS[sys.id] ?? 0;
  const fillerCount = sys.fieldCount - heroCount;
  if (fillerCount <= 0) continue;

  const category = SYSTEM_CATEGORIES[sys.id];
  if (!category) {
    console.warn(`[schema-fields.ts] No category mapping for system: ${sys.id}`);
    continue;
  }

  const pool = POOL_BY_CATEGORY[category];
  allFillerFields.push(
    ...generateFillerSchemaFields(
      fillerCount,
      sys.id,
      pool.fields,
      pool.concepts,
      pool.confidenceRange,
    ),
  );
}

// ---------------------------------------------------------------------------
// Combined export
// ---------------------------------------------------------------------------
export const SCHEMA_FIELDS: SchemaAnnotation[] = [...HERO_FIELDS, ...allFillerFields];

// ---------------------------------------------------------------------------
// Build-time assertion: total must be 4847
// ---------------------------------------------------------------------------
if (SCHEMA_FIELDS.length !== 4_847) {
  console.warn(
    `[schema-fields.ts] Total schema field count mismatch: expected 4847, got ${SCHEMA_FIELDS.length}. ` +
    `Hero: ${HERO_FIELDS.length}, Filler: ${allFillerFields.length}.`,
  );
}
