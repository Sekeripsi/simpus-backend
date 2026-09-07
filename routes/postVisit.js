var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var prisma = require('../lib/prisma');
var { JWT_SECRET } = require('../middleware/auth');

router.generatePostVisitToken = async function (rekamMedisId, pasienId, expiresInDays = 7, isExpired = false) {
  var tokenPayload = {
    type: 'post_visit',
    rekamMedisId: rekamMedisId,
    pasienId: pasienId,
  };

  var expiresIn = isExpired ? '1s' : (expiresInDays > 0 ? `${expiresInDays}d` : '7d');
  var token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: expiresIn });
  var expiresAt = isExpired
    ? new Date(Date.now() - 24 * 60 * 60 * 1000) // yesterday (expired)
    : new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

  var postVisit = await prisma.postVisit.upsert({
    where: { rekamMedisId: rekamMedisId },
    update: { token: token, expiresAt: expiresAt, isActive: true },
    create: { rekamMedisId: rekamMedisId, token: token, expiresAt: expiresAt },
  });

  return { token: token, expiresAt: expiresAt, postVisit: postVisit };
};

// GET /post-visit - List all post-visit tokens
router.get('/', async function (req, res, next) {
  try {
    var tokens = await prisma.postVisit.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        rekamMedis: {
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
          },
        },
      },
    });

    res.json({ success: true, data: tokens });
  } catch (err) {
    next(err);
  }
});

// GET /post-visit/available-records - List recent medical records available for token generation
router.get('/available-records', async function (req, res, next) {
  try {
    var records = await prisma.rekamMedis.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        pasien: true,
        pendaftaran: true,
        diagnosis: true,
        anamnesis: true,
        pengobatan: true,
        postVisit: true,
      },
    });

    res.json({ success: true, data: records });
  } catch (err) {
    next(err);
  }
});

// POST /post-visit/generate - Generate or regenerate token for existing rekamMedisId
router.post('/generate', async function (req, res, next) {
  try {
    var { rekamMedisId, expiresInDays, isExpired } = req.body;

    if (!rekamMedisId) {
      return res.status(400).json({ success: false, error: 'rekamMedisId is required' });
    }

    var rekamMedis = await prisma.rekamMedis.findUnique({
      where: { id: rekamMedisId },
    });

    if (!rekamMedis) {
      return res.status(404).json({ success: false, error: 'Rekam Medis not found' });
    }

    var days = expiresInDays ? Number(expiresInDays) : 7;
    var result = await router.generatePostVisitToken(rekamMedis.id, rekamMedis.pasienId, days, !!isExpired);
    res.json({
      success: true,
      data: {
        rekamMedisId: rekamMedis.id,
        token: result.token,
        expiresAt: result.expiresAt,
        postVisit: result.postVisit,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /post-visit/create-test - Developer testing feature: create mock patient + medical record + token
router.post('/create-test', async function (req, res, next) {
  try {
    var {
      patientName,
      nik,
      noTlp,
      jenisKelamin,
      poliklinik,
      keluhan,
      diagnosis,
      kodeIcd,
      sistol,
      diastol,
      suhu,
      nadi,
      respirasi,
      pengobatan,
      tindakan,
      kie,
      plan,
      expiresInDays,
      isExpired,
    } = req.body;

    var timestamp = Date.now();
    var finalNik = nik && nik.trim() ? nik.trim() : `TEST${timestamp.toString().slice(-10)}`;
    var finalName = patientName && patientName.trim() ? patientName.trim() : `Pasien Uji Coba (${timestamp.toString().slice(-4)})`;
    var finalGender = jenisKelamin === 'P' ? 'P' : 'L';
    var finalPoliklinik = poliklinik || 'UMUM';

    // Find or create Patient
    var patient = await prisma.patient.findFirst({
      where: {
        OR: [
          { nik: finalNik },
          { nama: finalName },
        ],
      },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          nik: finalNik,
          noKk: `KK-${timestamp.toString().slice(-8)}`,
          noJkn: `JKN-${timestamp.toString().slice(-8)}`,
          catatanJkn: 'JKN Aktif (Uji Coba)',
          noJamkesos: `JAM-${timestamp.toString().slice(-8)}`,
          catatanJamkesos: '-',
          nama: finalName,
          jenisKelamin: finalGender,
          tempatLahir: 'Jakarta',
          tanggalLahir: new Date('1995-05-15'),
          umur: 30,
          agama: 'ISLAM',
          statusKawin: 'BELUM_KAWIN',
          alamatTinggal: 'Jl. Merdeka No. 123',
          noTlp: noTlp && noTlp.trim() ? noTlp.trim() : `08${Math.floor(100000000 + Math.random() * 900000000)}`,
        },
      });
    }

    // Create medical record with relations
    var rekamMedis = await prisma.$transaction(async function (tx) {
      var pendaftaran = await tx.pendaftaran.create({
        data: {
          tglKunjungan: new Date(),
          noAntrian: `A-${Math.floor(10 + Math.random() * 90)}`,
          unitLayanan: 'Poli Rawat Jalan',
          jenisLayanan: 'Pemeriksaan Dokter',
          noRegis: `REG-${timestamp.toString().slice(-6)}`,
          poliklinik: finalPoliklinik,
          kehadiran: 'HADIR',
          targetStatus: 'TIDAK',
          pembayaran: 'BPJS',
          catatan: 'Dibuat melalui Developer Testing Panel',
        },
      });

      var kajianAwal = await tx.kajianAwal.create({
        data: {
          alergi: 'Tidak ada riwayat alergi obat',
          riwayatPenyakitDahulu: 'Tidak ada riwayat kronis',
          riwayatPenyakitKeluarga: 'Tidak ada',
        },
      });

      var anamnesis = await tx.anamnesis.create({
        data: {
          keluhan: keluhan || 'Demam sejak 2 hari, batuk kering, dan sakit tenggorokan.',
        },
      });

      var pemeriksaan = await tx.pemeriksaan.create({
        data: {
          keadaan: 'Baik',
          kesadaran: 'KOMPOS_MENTIS',
          sistol: sistol ? Number(sistol) : 120,
          diastol: diastol ? Number(diastol) : 80,
          suhu: suhu ? Number(suhu) : 37.5,
          nadi: nadi ? Number(nadi) : 82,
          respirasi: respirasi ? Number(respirasi) : 20,
        },
      });

      var diag = await tx.diagnosis.create({
        data: {
          diagnosis: diagnosis || 'ISPA (Infeksi Saluran Pernapasan Akut)',
          kodeIcd: kodeIcd || 'J06.9',
        },
      });

      var tind = await tx.tindakan.create({
        data: {
          tindakan: tindakan || 'Konseling, edukasi kesehatan, dan pemberian resep obat.',
        },
      });

      var defaultPengobatan = [
        { namaObat: 'Paracetamol 500mg', dosis: '3x1 tablet sesudah makan', jumlah: '10 tablet', aturanPakai: 'Bila demam' },
        { namaObat: 'Amoxicillin 500mg', dosis: '3x1 tablet sesudah makan', jumlah: '15 tablet', aturanPakai: 'Habiskan' },
        { namaObat: 'Vitamin C 500mg', dosis: '1x1 tablet sesudah makan', jumlah: '10 tablet', aturanPakai: 'Pagi hari' },
      ];

      var obatPayload = pengobatan ? (typeof pengobatan === 'string' ? JSON.parse(pengobatan) : pengobatan) : defaultPengobatan;

      var peng = await tx.pengobatan.create({
        data: {
          pengobatan: obatPayload,
        },
      });

      var pul = await tx.pulangRujuk.create({
        data: {
          tglPulang: new Date(),
          statusPulang: 'MEMBAIK',
          kie: kie || 'Minum obat teratur, istirahat cukup 7-8 jam/hari, banyak minum air hangat.',
          plan: plan || 'Kontrol ulang setelah 3 hari jika keluhan demam atau batuk tidak membaik.',
        },
      });

      var asu = await tx.asuhan.create({
        data: {
          diagnosaData: 'Hipertermia berhubungan dengan proses infeksi',
          diagnosa: 'Hipertermia',
          intervensi: 'Pantau tanda vital dan beri edukasi kompres hangat',
          implementasi: 'Melakukan edukasi hidrasi dan kepatuhan obat',
          evaluasi: 'Pasien memahami anjuran dokter',
        },
      });

      var lb = await tx.lab.create({
        data: {
          permintaanPemeriksaan: 'Pemeriksaan Darah Rutin (Normal)',
        },
      });

      return tx.rekamMedis.create({
        data: {
          pasienId: patient.id,
          pendaftaranId: pendaftaran.id,
          kajianAwalId: kajianAwal.id,
          anamnesisId: anamnesis.id,
          pemeriksaanId: pemeriksaan.id,
          diagnosisId: diag.id,
          tindakanId: tind.id,
          pengobatanId: peng.id,
          pulangRujukId: pul.id,
          asuhanId: asu.id,
          labId: lb.id,
          status: 'SELESAI',
          completedAt: new Date(),
        },
        include: {
          pasien: true,
          pendaftaran: true,
          diagnosis: true,
          anamnesis: true,
          pemeriksaan: true,
          pengobatan: true,
          pulangRujuk: true,
        },
      });
    });

    var days = expiresInDays ? Number(expiresInDays) : 7;
    var result = await router.generatePostVisitToken(rekamMedis.id, patient.id, days, !!isExpired);

    res.status(201).json({
      success: true,
      message: 'Test record and token generated successfully',
      data: {
        token: result.token,
        expiresAt: result.expiresAt,
        postVisit: result.postVisit,
        rekamMedis: rekamMedis,
      },
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /post-visit/toggle/:id - Toggle isActive status of a token
router.patch('/toggle/:id', async function (req, res, next) {
  try {
    var { id } = req.params;
    var postVisit = await prisma.postVisit.findUnique({
      where: { id: id },
    });

    if (!postVisit) {
      return res.status(404).json({ success: false, error: 'PostVisit token not found' });
    }

    var updated = await prisma.postVisit.update({
      where: { id: id },
      data: { isActive: !postVisit.isActive },
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /post-visit/:id - Delete a post-visit token
router.delete('/:id', async function (req, res, next) {
  try {
    var { id } = req.params;
    await prisma.postVisit.delete({
      where: { id: id },
    });

    res.json({ success: true, message: 'Token deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /post-visit/verify/:token - Verify token & load medical record
router.get('/verify/:token', async function (req, res, next) {
  try {
    var decoded;
    try {
      decoded = jwt.verify(req.params.token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }

    if (decoded.type !== 'post_visit') {
      return res.status(401).json({ success: false, error: 'Invalid token type' });
    }

    var postVisit = await prisma.postVisit.findUnique({
      where: { token: req.params.token },
    });

    if (!postVisit || !postVisit.isActive) {
      return res.status(401).json({ success: false, error: 'Token has been deactivated' });
    }

    if (new Date() > postVisit.expiresAt) {
      return res.status(401).json({ success: false, error: 'Token has expired' });
    }

    var rekamMedis = await prisma.rekamMedis.findUnique({
      where: { id: postVisit.rekamMedisId },
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
      },
    });

    if (!rekamMedis) {
      return res.status(404).json({ success: false, error: 'Rekam Medis not found' });
    }

    res.json({ success: true, data: rekamMedis });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
