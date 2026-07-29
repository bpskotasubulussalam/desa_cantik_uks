/* =====================================================================
   SHEET-LOADER.JS
   Mengambil data dari Google Sheet publik (CSV per-tab, via endpoint
   gviz Google — tidak butuh API key) dan mengubahnya menjadi objek
   DATA dengan skema yang sama seperti default-data.js.

   Nama tab di Google Sheet HARUS persis seperti di TAB[] di bawah ini.
   ===================================================================== */
(function(){

  const TAB = {
    kpi: 'KPI',
    tren: 'Tren',
    komposisi: 'Komposisi',
    nasabahRT: 'Nasabah_RT',
    valuasi: 'Valuasi',
    difusiRW: 'Difusi_RW',
    dampak: 'Dampak',
    swot: 'SWOT',
    rekomendasi: 'Rekomendasi',
    roadmap: 'Roadmap'
  };

  const PALETTE = ['#B5502E','#2F9C8F','#C89B2C','#7C8B87','#9C7A1E','#3C4642','#D8CFAF','#8A9A96','#6E8B84','#A17F1F'];

  function fmtID(n, decimals){
    const num = Number(n) || 0;
    return num.toLocaleString('id-ID', {minimumFractionDigits:decimals, maximumFractionDigits:decimals});
  }
  function toNum(v){
    if(v === undefined || v === null || v === '') return 0;
    const n = parseFloat(String(v).replace(/\./g,'').replace(',', '.')); // toleran thd format Indonesia juga
    const n2 = parseFloat(v);
    // gviz CSV biasanya sudah numerik standar (titik desimal, tanpa pemisah ribuan) -> pakai n2 kalau valid
    return isNaN(n2) ? (isNaN(n) ? 0 : n) : n2;
  }
  function yesNo(v){ return /^(ya|y|true|yes|1)$/i.test(String(v||'').trim()); }

  // ---- parser CSV yang menangani tanda kutip & koma/baris-baru di dalam sel ----
  function parseCSV(text){
    const rows = [];
    let row = [], field = '', inQuotes = false;
    for(let i=0; i<text.length; i++){
      const c = text[i], next = text[i+1];
      if(inQuotes){
        if(c === '"' && next === '"'){ field += '"'; i++; }
        else if(c === '"'){ inQuotes = false; }
        else { field += c; }
      } else {
        if(c === '"'){ inQuotes = true; }
        else if(c === ','){ row.push(field); field=''; }
        else if(c === '\r'){ /* skip */ }
        else if(c === '\n'){ row.push(field); rows.push(row); row=[]; field=''; }
        else { field += c; }
      }
    }
    if(field.length || row.length){ row.push(field); rows.push(row); }
    return rows.filter(r => r.some(cell => String(cell).trim() !== ''));
  }

  function rowsToObjects(rows){
    if(!rows.length) return [];
    const headers = rows[0].map(h => String(h).trim());
    return rows.slice(1).map(r => {
      const obj = {};
      headers.forEach((h,i)=> obj[h] = (r[i] !== undefined ? String(r[i]).trim() : ''));
      return obj;
    });
  }

  async function fetchTab(sheetId, tabName){
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`;
    const res = await fetch(url, {cache:'no-store'});
    if(!res.ok) throw new Error(`Gagal mengambil tab "${tabName}" (HTTP ${res.status}). Pastikan nama tab benar & Sheet sudah di-share "Anyone with the link".`);
    const text = await res.text();
    if(/^<!DOCTYPE html/i.test(text.trim())){
      throw new Error(`Tab "${tabName}" tidak ditemukan atau Sheet belum publik.`);
    }
    return rowsToObjects(parseCSV(text));
  }

  async function loadDataFromSheet(sheetId){
    const [kpiRows, trenRows, komposisiRows, rtRows, valRows, rwRows, dampakRows, swotRows, rekomRows, roadmapRows] =
      await Promise.all([
        fetchTab(sheetId, TAB.kpi),
        fetchTab(sheetId, TAB.tren),
        fetchTab(sheetId, TAB.komposisi),
        fetchTab(sheetId, TAB.nasabahRT),
        fetchTab(sheetId, TAB.valuasi),
        fetchTab(sheetId, TAB.difusiRW),
        fetchTab(sheetId, TAB.dampak),
        fetchTab(sheetId, TAB.swot),
        fetchTab(sheetId, TAB.rekomendasi),
        fetchTab(sheetId, TAB.roadmap),
      ]);

    // ---- KPI (key/value) ----
    const kv = {};
    kpiRows.forEach(r => { kv[(r.Key||r.key||'').trim()] = r.Value !== undefined ? r.Value : r.value; });
    const get = (k, d) => (kv[k] !== undefined && kv[k] !== '') ? kv[k] : d;

    const DATA = {
      hero: { multiplier: toNum(get('hero_multiplier', 0)) },
      kpi: {
        volumeTon: toNum(get('kpi_volumeTon', 0)),
        volumeLbl: get('kpi_volumeLbl', ''),
        nasabah: toNum(get('kpi_nasabah', 0)),
        nasabahLbl: get('kpi_nasabahLbl', ''),
        insentifJuta: toNum(get('kpi_insentifJuta', 0)),
        insentifLbl: get('kpi_insentifLbl', ''),
        replikasiRW: toNum(get('kpi_replikasiRW', 0)),
        replikasiLbl: get('kpi_replikasiLbl', '')
      }
    };

    // ---- Tren (Tahun | Bulan | Nilai_kg) — statistik dihitung otomatis ----
    const years = {};
    trenRows.forEach(r => {
      const th = String(r.Tahun||'').trim();
      if(!th) return;
      if(!years[th]) years[th] = {labels:[], vals:[]};
      years[th].labels.push(r.Bulan||'');
      years[th].vals.push(toNum(r.Nilai_kg));
    });
    const yearStats = { all: {total:'—', avg:'—'} };
    let grandTotal = 0;
    Object.keys(years).forEach(y => {
      const vals = years[y].vals;
      const sum = vals.reduce((a,b)=>a+b,0);
      grandTotal += sum;
      yearStats[y] = {
        total: fmtID(sum,1) + ' kg',
        avg: vals.length ? fmtID(sum/vals.length,1) + ' kg/bln' : '—'
      };
    });
    yearStats.all = { total: fmtID(grandTotal,1) + ' kg (kumulatif)', avg: '—' };
    DATA.trend = { years, yearStats };

    // ---- Komposisi / Pareto ----
    DATA.pareto = {
      labels: komposisiRows.map(r => r.Kategori || ''),
      vals: komposisiRows.map(r => toNum(r.Volume_kg)),
      colors: komposisiRows.map((r,i) => (r.Warna && r.Warna.trim()) || PALETTE[i % PALETTE.length])
    };

    // ---- Nasabah per RT ----
    DATA.rt = {
      labels: rtRows.map(r => r.RT || ''),
      vals: rtRows.map(r => toNum(r.Jumlah))
    };

    // ---- Valuasi ----
    const valRowsClean = valRows.map(r => {
      const isTotal = yesNo(r.IsTotal);
      const volNum = toNum(r.Volume_kg);
      const tarifNum = toNum(r.Tarif_per_kg);
      const nilaiNum = toNum(r.Nilai_Rp);
      return {
        komoditas: r.Komoditas || '',
        volume: fmtID(volNum, 1),
        tarif: isTotal ? '—' : ('Rp' + fmtID(tarifNum, 0)),
        nilai: (isTotal ? '≈Rp' : 'Rp') + fmtID(nilaiNum, 0),
        isTotal,
        _nilaiNum: nilaiNum
      };
    });
    DATA.valuasi = {
      rows: valRowsClean,
      donut: {
        labels: valRowsClean.filter(r=>!r.isTotal).map(r=>r.komoditas),
        data: valRowsClean.filter(r=>!r.isTotal).map(r=>r._nilaiNum)
      }
    };

    // ---- Difusi RW (persentase dihitung otomatis relatif ke RW asal) ----
    const asalRow = rwRows.find(r => yesNo(r.IsAsal));
    const asalVal = asalRow ? toNum(asalRow.Volume_kg) : 0;
    const asalName = asalRow ? (asalRow.Nama_RW||'') : '';
    DATA.rwGrid = rwRows.map(r => {
      const isOrigin = yesNo(r.IsAsal);
      const vol = toNum(r.Volume_kg);
      const pctNum = isOrigin ? 100 : (asalVal ? Math.round(vol/asalVal*100) : 0);
      return {
        name: r.Nama_RW || '',
        val: fmtID(vol, 0),
        pctLabel: isOrigin ? '100% basis' : `≈${pctNum}% dari ${asalName}`,
        pctNum,
        isOrigin
      };
    });

    // ---- Kartu dampak ----
    DATA.impact = dampakRows.map(r => ({ icon: r.Icon||'', title: r.Judul||'', desc: r.Deskripsi||'' }));

    // ---- SWOT ----
    const swot = { s:[], w:[], o:[], t:[] };
    swotRows.forEach(r => {
      const k = String(r.Kategori||'').trim().toLowerCase().charAt(0);
      if(swot[k]) swot[k].push(r.Poin||'');
    });
    DATA.swot = swot;
    DATA.swotAcc = {
      tantangan: get('swot_tantangan', ''),
      rekomendasi: rekomRows.map(r => r.Teks || '').filter(t=>t)
    };

    // ---- Roadmap ----
    DATA.roadmap = roadmapRows.map(r => ({ when: r.Kapan||'', title: r.Judul||'', desc: r.Deskripsi||'' }));

    return DATA;
  }

  window.loadDataFromSheet = loadDataFromSheet;
})();
