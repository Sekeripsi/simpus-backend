# API Endpoints

## POST /api/auth/login

Authenticate user and receive a JWT token.

**Request Body:**

```json
{
  "username": "admin",
  "password": "admin123456"
}
```

| Field    | Type   | Required | Description                    |
| -------- | ------ | -------- | ------------------------------ |
| username | string | Yes      | 3-20 chars, alphanumeric + `_` |
| password | string | Yes      | 8-100 chars                    |

**Response `200`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "uuid", "username": "admin", "name": "Admin", "role": "ADMIN" }
}
```

**Response `400`:** `{ "message": "Username and password are required" }`

**Notes:** Proxies to `BACKEND_URL/auth/login`. No auth required.

---

## GET /api/patients

List/search patient records.

**Query Parameters:** `page` (1), `pageSize` (10), `nik`, `nama`, `jenisKelamin`, `noJkn`, `alamatDomisili`, `noKk`, `tanggalLahir`, `noTlp`, `alamatKtp` (all optional).

**Response `200`:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nik": "3201012345678901",
      "nama": "John Doe",
      "jenisKelamin": "L",
      "tempatLahir": "Jakarta",
      "tanggalLahir": "1990-01-15T00:00:00.000Z",
      "umur": 36,
      "agama": "ISLAM",
      "statusKawin": "KAWIN",
      "alamatTinggal": "Jl. Merdeka No.1",
      "alamatKtp": "Jl. Merdeka No.1",
      "alamatDomisili": "Jl. Merdeka No.1",
      "provinsi": "DKI Jakarta",
      "kabupaten": "Jakarta Pusat",
      "kecamatan": "Gambir",
      "kelurahanDesa": "Gambir",
      "rtRw": "001/002",
      "noTlp": "08123456789",
      "pemilikNoTlp": "John Doe",
      "email": "john@example.com",
      "layananDifabel": "TIDAK",
      "pendidikan": "SMA",
      "pekerjaan": "Karyawan",
      "golDarah": "O",
      "rhesus": "POSITIF",
      "namaIbuKandung": "Jane Doe",
      "createdAt": "2026-07-01T00:00:00.000Z",
      "updatedAt": "2026-07-01T00:00:00.000Z"
    }
  ],
  "pagination": { "page": 1, "pageSize": 10, "total": 42, "totalPages": 5 }
}
```

**Notes:** Requires `auth-token` cookie. Proxies to `BACKEND_URL/patients`.

---

## POST /api/patients

Create a new patient record.

**Request Body:**

| Field           | Type   | Required | Constraints                       |
| --------------- | ------ | -------- | --------------------------------- |
| nik             | string | Yes      | Max 32 chars                      |
| noKk            | string | Yes      | Max 32 chars                      |
| noJkn           | string | Yes      | Max 50 chars                      |
| catatanJkn      | string | No       | Max 191 chars, default `""`       |
| noJamkesos      | string | Yes      | Max 50 chars                      |
| catatanJamkesos | string | No       | Max 191 chars, default `""`       |
| nama            | string | Yes      | 2-100 chars                       |
| jenisKelamin    | string | Yes      | `"L"` or `"P"`                    |
| tempatLahir     | string | No       | Max 100 chars                     |
| tanggalLahir    | string | No       | ISO 8601 datetime or date string  |
| umur            | number | No       | Integer >= 0                      |
| agama           | enum   | No       | `ISLAM`, `KRISTEN`, `KATOLIK`, `HINDU`, `BUDDHA`, `KONGHUCU` |
| statusKawin     | enum   | No       | `BELUM_KAWIN`, `KAWIN`, `CERAI_HIDUP`, `CERAI_MATI` |
| alamatTinggal   | string | No       | Max 191 chars                     |
| alamatKtp       | string | No       | Max 191 chars                     |
| alamatDomisili  | string | No       | Max 191 chars                     |
| provinsi        | string | No       | Max 150 chars                     |
| kabupaten       | string | No       | Max 150 chars                     |
| kecamatan       | string | No       | Max 150 chars                     |
| kelurahanDesa   | string | No       | Max 150 chars                     |
| rtRw            | string | No       | Max 50 chars                      |
| noTlp           | string | No       | Max 20 chars                      |
| pemilikNoTlp    | string | No       | Max 150 chars                     |
| email           | string | No       | Valid email format                |
| layananDifabel  | enum   | No       | `"YA"` or `"TIDAK"`              |
| pendidikan      | string | No       | Max 100 chars                     |
| pekerjaan       | string | No       | Max 100 chars                     |
| golDarah        | enum   | No       | `"A"`, `"B"`, `"AB"`, `"O"`      |
| rhesus          | enum   | No       | `"POSITIF"` or `"NEGATIF"`        |
| namaIbuKandung  | string | No       | Max 150 chars                     |

**Response `201`:** `{ "success": true, "data": { "id": "uuid", ... } }`

**Response `400`:**

```json
{
  "success": false,
  "error": "Data pasien tidak valid",
  "fieldErrors": { "nik": ["NIK is required"], "nama": ["Nama must be at least 2 characters"] }
}
```

**Notes:** Requires `auth-token` cookie. Proxies to `BACKEND_URL/patients`. Validated with `createPatientSchema`.

---

## GET /api/patients/{id}

Get a single patient record.

**Path Parameters:** `id` (string, required) — Patient UUID.

**Response `200`:** `{ "success": true, "data": { ... } }`

**Response `404`:** `{ "error": "Patient not found" }`

**Notes:** Requires `auth-token` cookie. Proxies to `BACKEND_URL/patients/{id}`.

---

## PUT /api/patients/{id}

Update an existing patient record. All fields optional.

**Path Parameters:** `id` (string, required) — Patient UUID.

**Request Body:** Same fields as POST /api/patients, all optional.

**Response `200`:** `{ "success": true, "data": { "id": "uuid", ... } }`

**Response `400`:** `{ "success": false, "error": "Data pasien tidak valid", "fieldErrors": { ... } }`

**Response `404`:** `{ "error": "Patient not found" }`

**Notes:** Requires `auth-token` cookie. Proxies to `BACKEND_URL/patients/{id}`. Validated with `updatePatientSchema`.

---

## DELETE /api/patients/{id}

Delete a patient record.

**Path Parameters:** `id` (string, required) — Patient UUID.

**Response `200`:** `{ "success": true }`

**Response `404`:** `{ "error": "Patient not found" }`

**Notes:** Requires `auth-token` cookie. Proxies to `BACKEND_URL/patients/{id}` with DELETE method. No request body.

---

## POST /api/rekam-medis

Create a medical record (register a patient visit).

**Request Body:**

```json
{
  "pasienId": "uuid",
  "pendaftaran": {
    "tglKunjungan": "2026-07-01T08:00:00.000Z",
    "noAntrian": "A-001",
    "unitLayanan": "Poliklinik",
    "jenisLayanan": "Rawat Jalan",
    "noRegis": "REG-001",
    "poliklinik": "UMUM",
    "kehadiran": "HADIR",
    "targetStatus": "TIDAK",
    "pembayaran": "BPJS",
    "catatan": "Catatan tambahan"
  },
  "kajianAwal": { "alergi": "-", "riwayatPenyakitDahulu": "-", "riwayatPenyakitKeluarga": "-" },
  "anamnesis": { "keluhan": "Demam" },
  "pemeriksaan": { "keadaan": "Sadar", "kesadaran": "KOMPOS_MENTIS", "respirasi": 20, "suhu": 36.5, "nadi": 80, "sistol": 120, "diastol": 80 },
  "diagnosis": { "diagnosis": "ISPA", "kodeIcd": "J06.9" },
  "tindakan": { "tindakan": "Konsultasi" },
  "pengobatan": { "pengobatan": {} },
  "pulangRujuk": { "statusPulang": "MEMBAIK", "kie": "Istirahat cukup", "plan": "Kontrol 1 minggu" },
  "asuhan": { "diagnosaData": "-", "diagnosa": "-", "intervensi": "-", "implementasi": "-", "evaluasi": "-" },
  "lab": { "permintaanPemeriksaan": "-" },
  "catatanDokter": { "catatan": "Pantau tensi, kontrol 1 minggu" }
}
```

| Field                      | Type   | Required | Description                            |
| -------------------------- | ------ | -------- | -------------------------------------- |
| pasienId                   | string | Yes      | Patient UUID                           |
| pendaftaran                | object | Yes      | Registration details (see below)       |
| kajianAwal                 | object | No       | Initial assessment                     |
| anamnesis                  | object | No       | Anamnesis                              |
| pemeriksaan                | object | No       | Physical examination                   |
| diagnosis                  | object | No       | Diagnosis + ICD code                   |
| tindakan                   | object | No       | Medical action                         |
| pengobatan                 | object | No       | Medication (JSON field)                |
| pulangRujuk                | object | No       | Discharge/referral                     |
| asuhan                     | object | No       | Nursing care                           |
| lab                        | object | No       | Lab requests                           |
| catatanDokter              | object | No       | Doctor note for the visit              |

**Pendaftaran fields:**

| Field        | Type   | Required | Constraints                                      |
| ------------ | ------ | -------- | ------------------------------------------------ |
| tglKunjungan | string | No       | ISO 8601 datetime                                |
| noAntrian    | string | Yes      | 1-20 chars                                       |
| unitLayanan  | string | No       | Max 100 chars, default `""`                      |
| jenisLayanan | string | No       | Max 100 chars, default `""`                      |
| noRegis      | string | No       | Max 50 chars, default `""`                       |
| poliklinik   | enum   | Yes      | `LANSIA`, `INFEKSIUS_A/B/C`, `NON_INFEKSIUS_A/B/C`, `UGD`, `GIGI`, `KIA`, `UMUM` |
| kehadiran    | enum   | Yes      | `HADIR`, `TIDAK_HADIR`, `PEMBATALAN`             |
| targetStatus | enum   | No       | `TIDAK` (default), `HT`, `DM`, `HT_DM`           |
| pembayaran   | enum   | Yes      | `BPJS`, `MANDIRI`, `ASURANSI`                    |
| catatan      | string | No       | Max 500 chars                                    |

**Response `201`:** `{ "success": true, "data": { "id": "uuid", ... } }`

**Response `400`:** `{ "success": false, "error": "Data rekam medis tidak valid", "fieldErrors": { ... } }`

**Notes:** Requires `auth-token` cookie. Proxies to `BACKEND_URL/rekam-medis`. Validated with `createMedicalRecordSchema`.

---

## GET /api/rekam-medis/search

Search medical records with filters and pagination.

**Query Parameters:**

| Parameter         | Type   | Required | Description                                  |
| ----------------- | ------ | -------- | -------------------------------------------- |
| name              | string | No       | Filter by patient name (max 100 chars)       |
| nik               | string | No       | Filter by NIK (max 32 chars)                 |
| layanan           | string | No       | Filter by clinic (lowercase: `lansia`, `infeksius_a`, `umum`, etc.) |
| tanggalRegistrasi | string | No       | Filter by exact date: `YYYY-MM-DD`           |
| periodeStart      | string | No       | Period start: `YYYY-MM-DD`                   |
| periodeEnd        | string | No       | Period end: `YYYY-MM-DD`                     |
| page              | number | No       | Default: 1, min: 1                           |
| pageSize          | number | No       | Default: 10, max: 100                        |

**Rules:** `periodeStart` and `periodeEnd` must be provided together; start must be before end.

**Response `200`:**

```json
{
  "data": [
    {
      "id": "uuid",
      "tanggalKunjungan": "23 Mar 2026",
      "nomorAntrian": "A-001",
      "kehadiran": "HADIR",
      "nik": "3201012345678901",
      "namaPasien": "John Doe",
      "kelamin": "L",
      "umur": 36,
      "targetHtDm": "TIDAK",
      "pembayaran": "BPJS"
    }
  ],
  "pagination": {
    "totalResults": 42,
    "currentPage": 1,
    "pageSize": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Response `502`:** `{ "error": "Backend service unavailable" }`

**Notes:** Requires `auth-token` cookie. Proxies to `BACKEND_URL/rekam-medis/search`.

## POST /chat

Chatbot proxy for the post-visit assistant. Verifies the post-visit token, then forwards the conversation plus the patient context to the FastAPI chatbot service (`FASTAPI_URL`/`FASTAPI_PORT`, path `/chat`). The chatbot answers are grounded in the medical record tied to the token.

**Request Body:**

| Field    | Type   | Required | Description                                                        |
| -------- | ------ | -------- | ------------------------------------------------------------------ |
| messages | array  | Yes      | Chat history, `{ role, content }` or AI SDK `{ role, parts }` form |
| token    | string | Yes      | Post-visit JWT (the one embedded in the `/chat/{token}` page URL)  |

**Rules:** Token must be a valid `post_visit` JWT whose `PostVisit` row is active and unexpired — same rules as `GET /post-visit/verify/:token`.

**Response:** Streams the assistant reply from FastAPI (`text/plain`) or returns its JSON payload.

**Errors:**

- `400` — `messages array is required`
- `401` — no token provided, invalid/expired token, deactivated token
- `502` — FastAPI service unreachable

**Notes:** No staff JWT involved; the post-visit token is the only credential. The decoded `pasienId`/`rekamMedisId` are forwarded as `patient_id`/`rekam_medis_id` so the chatbot resolves the exact record.
