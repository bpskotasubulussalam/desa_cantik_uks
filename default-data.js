/* =====================================================================
   DEFAULT-DATA.JS
   Data awal / fallback untuk dashboard Bank Sampah IREKA.
   File ini dipakai index.html HANYA jika Firebase belum dikonfigurasi
   atau sedang offline. Setelah halaman input.html dipakai untuk
   menyimpan data ke Firestore, dashboard akan memakai data dari
   Firestore (bukan dari file ini lagi).

   Struktur objek ini JUGA menjadi acuan skema untuk input.html —
   kalau menambah field baru, tambahkan juga di kedua tempat.
   ===================================================================== */
window.DEFAULT_DATA = {
  hero: {
    multiplier: 10.15
  },
  kpi: {
    volumeTon: 16.8,
    volumeLbl: 'Sampah anorganik diselamatkan sejak Jun 2024',
    nasabah: 51,
    nasabahLbl: 'Tersebar di 13 RT lingkungan RW 03',
    insentifJuta: 37.5,
    insentifLbl: 'Estimasi dari 5 kategori komoditas utama',
    replikasiRW: 4,
    replikasiLbl: 'RW 01, 02, 03, 04 menjalankan model yang sama'
  },

  trend: {
    years: {
      '2024': {
        labels: ['Jun24','Jul24','Ags24','Sep24','Okt24','Nov24','Des24'],
        vals: [22,45,65,80,110,140,161.7]
      },
      '2025': {
        labels: ['Jan25','Feb25','Mar25','Apr25','Mei25','Jun25','Jul25','Ags25','Sep25','Okt25','Nov25','Des25'],
        vals: [850,660,300,939,900,780,980,1385.5,1180,230,1462.1,1186.55]
      },
      '2026': {
        labels: ['Jan26','Feb26','Mar26','Apr26','Mei26'],
        vals: [850,790,1300,1590,854.2]
      }
    },
    yearStats: {
      all:   {total:'16.861 kg (kumulatif)', avg:'—'},
      '2024':{total:'623,7 kg', avg:'89,1 kg/bln'},
      '2025':{total:'10.853,15 kg', avg:'904,4 kg/bln'},
      '2026':{total:'5.384,2 kg (Jan–Mei)', avg:'1.076,8 kg/bln'}
    }
  },

  pareto: {
    labels: ['Kardus/Karton','Plastik PET','Ember/Plastik','Beling/Kaca','Kaleng','Botol Mineral','Duplex','Buku/Kertas','Lainnya'],
    vals:   [7376.1,5444.9,3774.8,1341.2,660.1,554.1,519.2,481.9,750],
    colors: ['#B5502E','#2F9C8F','#C89B2C','#7C8B87','#9C7A1E','#3C4642','#D8CFAF','#8A9A96','#D8CFAF']
  },

  rt: {
    labels: ['RT.017','RT.016','RT.014','RT.013','RT.002','RT.008','RT.009','RT.011','RT.019','RT.010','RT.012','RT.023','RT.006'],
    vals:   [10,7,6,6,6,5,3,2,2,1,1,1,1]
  },

  valuasi: {
    rows: [
      {komoditas:'Plastik PET Bersih',        volume:'5.444,9',  tarif:'Rp4.000', nilai:'Rp21.779.600', isTotal:false},
      {komoditas:'Kardus/Karton',              volume:'7.376,1',  tarif:'Rp1.500', nilai:'Rp11.064.150', isTotal:false},
      {komoditas:'Ember/Plastik Campuran',     volume:'3.774,8',  tarif:'Rp1.000', nilai:'Rp3.774.800',  isTotal:false},
      {komoditas:'Kertas HVS/Putihan',         volume:'331,0',    tarif:'Rp2.000', nilai:'Rp662.000',    isTotal:false},
      {komoditas:'Duplex/Karton Tipis',        volume:'519,2',    tarif:'Rp500',   nilai:'Rp259.600',    isTotal:false},
      {komoditas:'Estimasi Total (5 kategori)',volume:'17.446,0', tarif:'—',       nilai:'≈Rp37.540.150',isTotal:true}
    ],
    donut: {
      labels: ['Plastik PET','Kardus/Karton','Ember/Plastik','Kertas HVS','Duplex'],
      data:   [21779600,11064150,3774800,662000,259600]
    }
  },

  rwGrid: [
    {name:'RW 03 · Asal', val:'10.322', pctLabel:'100% basis',        pctNum:100, isOrigin:true},
    {name:'RW 01',        val:'5.322',  pctLabel:'≈52% dari RW 03',   pctNum:52,  isOrigin:false},
    {name:'RW 02',        val:'2.679',  pctLabel:'≈26% dari RW 03',   pctNum:26,  isOrigin:false},
    {name:'RW 04',        val:'380',    pctLabel:'≈4% dari RW 03',    pctNum:4,   isOrigin:false}
  ],

  impact: [
    {icon:'♻️', title:'Reduksi ke TPST Bantargebang', desc:'Potensi reduksi hingga 12 ton sampah anorganik/tahun dari satu RW — mengurangi tekanan pada solusi hilir kota.'},
    {icon:'🤝', title:'Kohesi sosial rutin', desc:'Penimbangan dua kali sebulan menjadi ruang temu antarwarga RT berbeda, sekaligus edukasi lingkungan berkelanjutan.'},
    {icon:'💧', title:'Pencegahan pencemaran air', desc:'Fasilitasi logistik UPK Badan Air DLH sekaligus mencegah sampah anorganik mencemari saluran dan badan air perkotaan.'}
  ],

  swot: {
    s: ['Legalitas formal SK Lurah','Struktur kepengurusan jelas','Insentif berjenjang terbukti efektif','Dukungan logistik DLH'],
    w: ['Partisipasi masih sukarela','Digitalisasi belum menyeluruh','Kapasitas simpan terbatas','Bergantung harga pengepul'],
    o: ['Tren difusi ke 3 RW lain','Potensi kemitraan CSR off-taker','Volume setoran eksisting naik','Potensi replikasi antar-kelurahan'],
    t: ['Fluktuasi harga pasar daur ulang','Risiko stagnasi tanpa edukasi rutin','Kualitas material menurun saat cuaca buruk']
  },

  swotAcc: {
    tantangan: 'Partisipasi warga di RT 06, 10, 12, dan 23 masih sangat terbatas karena belum ada aturan RW yang mengikat. Kesenjangan edukasi berkala, insentif yang masih dipandang sekunder, fluktuasi harga pengepul, dan keterbatasan gudang penyimpanan (khususnya kardus & plastik PET) menjadi hambatan yang perlu diantisipasi bersama.',
    rekomendasi: [
      'Kesepakatan RW yang mewajibkan pemilahan, dikombinasikan insentif potongan iuran kebersihan.',
      'Adopsi penuh aplikasi e-Bank Sampah untuk transparansi saldo real-time.',
      'Kemitraan CSR sebagai off-taker tetap untuk 4 kategori dominan Pareto.',
      'Gudang penyimpanan sementara yang representatif untuk kardus & plastik.',
      'Replikasi terstruktur ke RT 06, 10, 12, 21, 22, 23 sebelum fokus ke RW 04.',
      'Publikasi data valuasi ekonomi secara berkala sebagai materi sosialisasi.'
    ]
  },

  roadmap: [
    {when:'Jangka Pendek · 0–6 bulan', title:'Digitalisasi & sosialisasi intensif', desc:'Fokus pada pencatatan digital penuh dan sosialisasi ke RT berpartisipasi rendah. Target: seluruh 13 RT di RW 03 memiliki minimal 5 nasabah aktif.'},
    {when:'Jangka Menengah · 6–18 bulan', title:'Kemitraan off-taker & gudang', desc:'Membangun kemitraan CSR dan menyediakan ruang penyimpanan sementara. Target: harga beli 4 kategori dominan stabil minimal 12 bulan berturut-turut.'},
    {when:'Jangka Panjang · 18–36 bulan', title:'Replikasi antar-kelurahan', desc:'Replikasi terstruktur ke kelurahan lain di Kecamatan Matraman dan Jakarta Timur. Target: model teradopsi di minimal 2 kelurahan baru dengan pendampingan resmi.'}
  ]
};
