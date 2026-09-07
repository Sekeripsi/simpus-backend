var express = require('express');
var router = express.Router();
var prisma = require('../lib/prisma');
var { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', async function (req, res, next) {
  try {
    var page = parseInt(req.query.page) || 1;
    var pageSize = parseInt(req.query.pageSize) || 10;
    var skip = (page - 1) * pageSize;

    var where = {};
    if (req.query.nik) where.nik = { contains: req.query.nik };
    if (req.query.nama) where.nama = { contains: req.query.nama };
    if (req.query.jenisKelamin) where.jenisKelamin = req.query.jenisKelamin;
    if (req.query.noJkn) where.noJkn = { contains: req.query.noJkn };
    if (req.query.alamatDomisili) where.alamatDomisili = { contains: req.query.alamatDomisili };
    if (req.query.noKk) where.noKk = { contains: req.query.noKk };
    if (req.query.tanggalLahir) where.tanggalLahir = new Date(req.query.tanggalLahir);
    if (req.query.noTlp) where.noTlp = { contains: req.query.noTlp };
    if (req.query.alamatKtp) where.alamatKtp = { contains: req.query.alamatKtp };

    var [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where: where,
        skip: skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.patient.count({ where: where }),
    ]);

    res.json({
      success: true,
      data: patients,
      pagination: {
        page: page,
        pageSize: pageSize,
        total: total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    var patient = await prisma.patient.findUnique({
      where: { id: req.params.id },
    });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json({ success: true, data: patient });
  } catch (err) {
    next(err);
  }
});

router.post('/', async function (req, res, next) {
  try {
    var errors = {};
    if (!req.body.nik) errors.nik = ['NIK is required'];
    if (!req.body.nama || req.body.nama.length < 2) errors.nama = ['Nama must be at least 2 characters'];
    if (!req.body.noKk) errors.noKk = ['No KK is required'];
    if (!req.body.noJkn) errors.noJkn = ['No JKN is required'];
    if (!req.body.noJamkesos) errors.noJamkesos = ['No Jamkesos is required'];
    if (!req.body.jenisKelamin || !['L', 'P'].includes(req.body.jenisKelamin)) {
      errors.jenisKelamin = ['Jenis Kelamin must be L or P'];
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Data pasien tidak valid',
        fieldErrors: errors,
      });
    }

    var result = await prisma.$transaction(async function (tx) {
      var patient = await tx.patient.create({ data: req.body });

      var pendaftaran = await tx.pendaftaran.create({
        data: {
          noAntrian: 'AUTO',
          unitLayanan: '',
          jenisLayanan: '',
          noRegis: '',
          poliklinik: 'UMUM',
          kehadiran: 'HADIR',
          pembayaran: 'MANDIRI',
        },
      });

      var defaults = { data: {} };
      var kajianAwal = await tx.kajianAwal.create(defaults);
      var anamnesis = await tx.anamnesis.create(defaults);
      var pemeriksaan = await tx.pemeriksaan.create(defaults);
      var diagnosis = await tx.diagnosis.create(defaults);
      var tindakan = await tx.tindakan.create(defaults);
      var pengobatan = await tx.pengobatan.create(defaults);
      var pulangRujuk = await tx.pulangRujuk.create(defaults);
      var asuhan = await tx.asuhan.create(defaults);
      var lab = await tx.lab.create(defaults);

      await tx.rekamMedis.create({
        data: {
          pasienId: patient.id,
          pendaftaranId: pendaftaran.id,
          kajianAwalId: kajianAwal.id,
          anamnesisId: anamnesis.id,
          pemeriksaanId: pemeriksaan.id,
          diagnosisId: diagnosis.id,
          tindakanId: tindakan.id,
          pengobatanId: pengobatan.id,
          pulangRujukId: pulangRujuk.id,
          asuhanId: asuhan.id,
          labId: lab.id,
        },
      });

      return patient;
    });

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ success: false, error: 'Duplicate NIK/No JKN/No Telp/Email' });
    }
    next(err);
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    var existing = await prisma.patient.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Patient not found' });

    var patient = await prisma.patient.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, data: patient });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Patient not found' });
    if (err.code === 'P2002') return res.status(409).json({ success: false, error: 'Duplicate unique field' });
    next(err);
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    var existing = await prisma.patient.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Patient not found' });

    await prisma.patient.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Patient not found' });
    next(err);
  }
});

module.exports = router;
