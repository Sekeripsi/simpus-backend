var express = require('express');
var router = express.Router();
var prisma = require('../lib/prisma');
var { authenticate } = require('../middleware/auth');
var postVisitRouter = require('./postVisit');

router.use(authenticate);

router.post('/', async function (req, res, next) {
  try {
    var { pasienId, pendaftaran, kajianAwal, anamnesis, pemeriksaan, diagnosis, tindakan, pengobatan, pulangRujuk, asuhan, lab, catatanDokter } = req.body;

    var errors = {};
    if (!pasienId) errors.pasienId = ['Pasien ID is required'];
    if (!pendaftaran || !pendaftaran.noAntrian) {
      errors.noAntrian = ['No Antrian is required'];
    }
    if (pendaftaran && pendaftaran.poliklinik && !['LANSIA', 'INFEKSIUS_A', 'INFEKSIUS_B', 'INFEKSIUS_C', 'NON_INFEKSIUS_A', 'NON_INFEKSIUS_B', 'NON_INFEKSIUS_C', 'UGD', 'GIGI', 'KIA', 'UMUM'].includes(pendaftaran.poliklinik)) {
      errors.poliklinik = ['Invalid poliklinik value'];
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Data rekam medis tidak valid',
        fieldErrors: errors,
      });
    }

    var item = await prisma.$transaction(async function (tx) {
      var createdPendaftaran = await tx.pendaftaran.create({
        data: {
          tglKunjungan: pendaftaran.tglKunjungan ? new Date(pendaftaran.tglKunjungan) : new Date(),
          noAntrian: pendaftaran.noAntrian,
          unitLayanan: pendaftaran.unitLayanan || '',
          jenisLayanan: pendaftaran.jenisLayanan || '',
          noRegis: pendaftaran.noRegis || '',
          poliklinik: pendaftaran.poliklinik,
          kehadiran: pendaftaran.kehadiran,
          targetStatus: pendaftaran.targetStatus || 'TIDAK',
          pembayaran: pendaftaran.pembayaran,
          catatan: pendaftaran.catatan || null,
        },
      });

      var defaults = { data: {} };
      var createdKajianAwal = kajianAwal ? await tx.kajianAwal.create({ data: kajianAwal }) : await tx.kajianAwal.create(defaults);
      var createdAnamnesis = anamnesis ? await tx.anamnesis.create({ data: anamnesis }) : await tx.anamnesis.create(defaults);
      var createdPemeriksaan = pemeriksaan ? await tx.pemeriksaan.create({ data: pemeriksaan }) : await tx.pemeriksaan.create(defaults);
      var createdDiagnosis = diagnosis ? await tx.diagnosis.create({ data: diagnosis }) : await tx.diagnosis.create(defaults);
      var createdTindakan = tindakan ? await tx.tindakan.create({ data: tindakan }) : await tx.tindakan.create(defaults);
      var createdPengobatan = pengobatan ? await tx.pengobatan.create({ data: pengobatan }) : await tx.pengobatan.create(defaults);
      var createdPulangRujuk = pulangRujuk ? await tx.pulangRujuk.create({ data: pulangRujuk }) : await tx.pulangRujuk.create(defaults);
      var createdAsuhan = asuhan ? await tx.asuhan.create({ data: asuhan }) : await tx.asuhan.create(defaults);
      var createdLab = lab ? await tx.lab.create({ data: lab }) : await tx.lab.create(defaults);
      var createdCatatanDokter = catatanDokter
        ? await tx.catatanDokter.create({
            data: Object.assign({}, catatanDokter, {
              dokterId: req.user ? req.user.id : null,
              namaDokter: req.user ? req.user.name : null,
            }),
          })
        : null;

      return tx.rekamMedis.create({
        data: {
          pasienId: pasienId,
          pendaftaranId: createdPendaftaran.id,
          kajianAwalId: createdKajianAwal.id,
          anamnesisId: createdAnamnesis.id,
          pemeriksaanId: createdPemeriksaan.id,
          diagnosisId: createdDiagnosis.id,
          tindakanId: createdTindakan.id,
          pengobatanId: createdPengobatan.id,
          pulangRujukId: createdPulangRujuk.id,
          asuhanId: createdAsuhan.id,
          labId: createdLab.id,
          catatanDokterId: createdCatatanDokter ? createdCatatanDokter.id : null,
        },
        include: {
          pasien: true,
          pendaftaran: true,
          kajianAwal: true,
          anamnesis: true,
          pemeriksaan: true,
          diagnosis: true,
          tindakan: true,
          pengobatan: true,
          pulangRujuk: true,
          asuhan: true,
          lab: true,
          catatanDokter: true,
        },
      });
    }, { timeout: 15000 });

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    if (err.code === 'P2003') return res.status(400).json({ success: false, error: 'Invalid foreign key reference' });
    next(err);
  }
});

router.get('/search', async function (req, res, next) {
  try {
    var page = parseInt(req.query.page) || 1;
    var pageSize = Math.min(parseInt(req.query.pageSize) || 10, 100);
    var skip = (page - 1) * pageSize;

    var where = {};

    if (req.query.name) {
      where.pasien = { nama: { contains: req.query.name } };
    }
    if (req.query.nik) {
      where.pasien = { ...(where.pasien || {}), nik: { contains: req.query.nik } };
    }
    if (req.query.layanan) {
      var layananMap = {
        lansia: 'LANSIA',
        infeksius_a: 'INFEKSIUS_A',
        infeksius_b: 'INFEKSIUS_B',
        infeksius_c: 'INFEKSIUS_C',
        non_infeksius_a: 'NON_INFEKSIUS_A',
        non_infeksius_b: 'NON_INFEKSIUS_B',
        non_infeksius_c: 'NON_INFEKSIUS_C',
        ugd: 'UGD',
        gigi: 'GIGI',
        kia: 'KIA',
        umum: 'UMUM',
      };
      var clinic = layananMap[req.query.layanan];
      if (clinic) {
        where.pendaftaran = { poliklinik: clinic };
      }
    }
    if (req.query.tanggalRegistrasi) {
      var date = new Date(req.query.tanggalRegistrasi + 'T00:00:00.000Z');
      var nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      where.createdAt = { gte: date, lt: nextDay };
    }
    if (req.query.periodeStart && req.query.periodeEnd) {
      where.createdAt = {
        gte: new Date(req.query.periodeStart + 'T00:00:00.000Z'),
        lte: new Date(req.query.periodeEnd + 'T23:59:59.999Z'),
      };
    }

    var [items, total] = await Promise.all([
      prisma.rekamMedis.findMany({
        where: where,
        skip: skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          pasien: true,
          pendaftaran: true,
        },
      }),
      prisma.rekamMedis.count({ where: where }),
    ]);

    var totalPages = Math.ceil(total / pageSize);

    res.json({
      data: items.map(function (item) {
        return {
          id: item.id,
          status: item.status,
          tanggalKunjungan: item.pendaftaran ? item.pendaftaran.tglKunjungan : null,
          nomorAntrian: item.pendaftaran ? item.pendaftaran.noAntrian : null,
          kehadiran: item.pendaftaran ? item.pendaftaran.kehadiran : null,
          nik: item.pasien ? item.pasien.nik : null,
          namaPasien: item.pasien ? item.pasien.nama : null,
          kelamin: item.pasien ? item.pasien.jenisKelamin : null,
          umur: item.pasien ? item.pasien.umur : null,
          targetHtDm: item.pendaftaran ? item.pendaftaran.targetStatus : null,
          pembayaran: item.pendaftaran ? item.pendaftaran.pembayaran : null,
        };
      }),
      pagination: {
        totalResults: total,
        currentPage: page,
        pageSize: pageSize,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/', async function (req, res, next) {
  try {
    var items = await prisma.rekamMedis.findMany({
      include: {
        pasien: true,
        pendaftaran: true,
        kajianAwal: true,
        anamnesis: true,
        pemeriksaan: true,
        diagnosis: true,
        tindakan: true,
        pengobatan: true,
        pulangRujuk: true,
        asuhan: true,
        lab: true,
        catatanDokter: true,
      },
    });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    var item = await prisma.rekamMedis.findUnique({
      where: { id: req.params.id },
      include: {
        pasien: true,
        pendaftaran: true,
        kajianAwal: true,
        anamnesis: true,
        pemeriksaan: true,
        diagnosis: true,
        tindakan: true,
        pengobatan: true,
        pulangRujuk: true,
        asuhan: true,
        lab: true,
        catatanDokter: true,
      },
    });
    if (!item) return res.status(404).json({ error: 'Rekam Medis not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async function (req, res, next) {
  try {
    var relationKeys = ['kajianAwal', 'anamnesis', 'pemeriksaan', 'diagnosis', 'tindakan', 'pengobatan', 'pulangRujuk', 'asuhan', 'lab', 'pendaftaran'];
    var optionalRelationKeys = ['catatanDokter'];
    var data = {};
    for (var key in req.body) {
      if (relationKeys.includes(key)) {
        data[key] = { update: req.body[key] };
      } else if (optionalRelationKeys.includes(key)) {
        data[key] = {
          upsert: {
            update: req.body[key],
            create: Object.assign({}, req.body[key], {
              dokterId: req.user ? req.user.id : null,
              namaDokter: req.user ? req.user.name : null,
            }),
          },
        };
      } else {
        data[key] = req.body[key];
      }
    }

    var item = await prisma.rekamMedis.update({
      where: { id: req.params.id },
      data: data,
      include: {
        pasien: true,
        pendaftaran: true,
        kajianAwal: true,
        anamnesis: true,
        pemeriksaan: true,
        diagnosis: true,
        tindakan: true,
        pengobatan: true,
        pulangRujuk: true,
        asuhan: true,
        lab: true,
        catatanDokter: true,
      },
    });
    res.json({ success: true, data: item });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Rekam Medis not found' });
    if (err.code === 'P2003') return res.status(400).json({ success: false, error: 'Invalid foreign key reference' });
    next(err);
  }
});

router.delete('/:id', async function (req, res, next) {
  try {
    await prisma.rekamMedis.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Rekam Medis not found' });
    next(err);
  }
});

router.post('/:id/selesai', async function (req, res, next) {
  try {
    var rekamMedis = await prisma.rekamMedis.findUnique({
      where: { id: req.params.id },
    });

    if (!rekamMedis) {
      return res.status(404).json({ success: false, error: 'Rekam Medis not found' });
    }

    var item = await prisma.rekamMedis.update({
      where: { id: req.params.id },
      data: {
        status: 'SELESAI',
        completedAt: new Date(),
      },
      include: {
        pasien: true,
        pendaftaran: true,
        pulangRujuk: true,
      },
    });

    var result = await postVisitRouter.generatePostVisitToken(item.id, item.pasienId);

    res.json({ success: true, data: item, postVisitToken: result.token });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Rekam Medis not found' });
    next(err);
  }
});

module.exports = router;
