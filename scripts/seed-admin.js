var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var prisma = require('../lib/prisma');

var DEFAULT_USERNAME = 'admin';
var DEFAULT_NAME = 'Administrator';
var DEFAULT_ROLE = 'ADMIN';
var BCRYPT_ROUNDS = 10;
var VALID_ROLES = ['ADMIN', 'DOCTOR', 'STAFF'];

function readOptions() {
  var args = process.argv.slice(2);
  return {
    force: args.includes('--force'),
    username: process.env.ADMIN_USERNAME || args[0] || DEFAULT_USERNAME,
    name: process.env.ADMIN_NAME || args[1] || DEFAULT_NAME,
    role: process.env.ADMIN_ROLE || DEFAULT_ROLE,
    password: process.env.ADMIN_PASSWORD || '',
  };
}

async function main() {
  var options = readOptions();
  if (!VALID_ROLES.includes(options.role)) {
    console.log('Role "' + options.role + '" tidak valid. Pilih salah satu: ' + VALID_ROLES.join(', '));
    process.exitCode = 1;
    return;
  }

  var generated = !options.password;
  var password = generated ? crypto.randomBytes(12).toString('base64url') : options.password;
  var hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

  var existing = await prisma.user.findUnique({ where: { username: options.username } });

  if (existing && !options.force) {
    console.log('User "' + existing.username + '" sudah ada (role: ' + existing.role + ').');
    console.log('Lewati. Gunakan --force untuk reset password dan role.');
    return;
  }

  var user = await prisma.user.upsert({
    where: { username: options.username },
    update: { password: hashedPassword, name: options.name, role: options.role },
    create: {
      username: options.username,
      password: hashedPassword,
      name: options.name,
      role: options.role,
    },
  });

  console.log('Akun ' + user.role + ' siap: ' + user.username);
  console.log('Nama: ' + user.name);
  if (generated) {
    console.log('Password (dibuat otomatis, simpan sekarang): ' + password);
  } else {
    console.log('Password: diambil dari ADMIN_PASSWORD.');
  }
}

main()
  .catch(function (err) {
    console.error('Gagal membuat akun:', err);
    process.exitCode = 1;
  })
  .finally(function () {
    prisma.$disconnect();
  });
